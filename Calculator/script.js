// Basic Calculator logic
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-action="delete"]');
const allClearButton = document.querySelector('[data-action="all-clear"]');
const previousText = document.getElementById('previous');
const currentText = document.getElementById('current');

let currentOperand = '';
let previousOperand = '';
let operation = undefined;

// Append number or dot
function appendNumber(num){
  if (num === '.' && currentOperand.includes('.')) return;
  currentOperand = currentOperand.toString() + num.toString();
  updateDisplay();
}

// Choose operation (+ - * /)
function chooseOperation(op){
  if (currentOperand === '') return;
  if (previousOperand !== ''){
    compute();
  }
  operation = op;
  previousOperand = currentOperand;
  currentOperand = '';
  updateDisplay();
}

// Compute result
function compute(){
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return;
  let result;
  switch(operation){
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/':
      if (curr === 0){
        currentOperand = 'Error';
        previousOperand = '';
        operation = undefined;
        updateDisplay();
        return;
      }
      result = prev / curr;
      break;
    default: return;
  }
  // limit floating precision to avoid long tails
  result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
  currentOperand = result.toString();
  previousOperand = '';
  operation = undefined;
  updateDisplay();
}

// Update the on-screen numbers
function updateDisplay(){
  currentText.innerText = formatOperand(currentOperand) || '0';
  previousText.innerText = operation && previousOperand ? `${formatOperand(previousOperand)} ${operation}` : '';
}

// Delete last digit
function deleteLast(){
  if (currentOperand === 'Error') { clearAll(); return; }
  currentOperand = currentOperand.toString().slice(0, -1);
  updateDisplay();
}

// Clear all
function clearAll(){
  currentOperand = '';
  previousOperand = '';
  operation = undefined;
  updateDisplay();
}

// Format numbers for display (adds commas)
function formatOperand(operand){
  if (operand === '' || operand == null) return '';
  if (operand === 'Error') return 'Error';
  const [intPart, decPart] = operand.split('.');
  const intDisplay = Number(intPart).toLocaleString('en-IN'); // Indian grouping
  return decPart ? `${intDisplay}.${decPart}` : intDisplay;
}

// Event listeners (button clicks)
numberButtons.forEach(btn => btn.addEventListener('click', () => appendNumber(btn.dataset.number)));
operationButtons.forEach(btn => btn.addEventListener('click', () => chooseOperation(btn.dataset.operation)));
equalsButton && equalsButton.addEventListener('click', () => compute());
deleteButton && deleteButton.addEventListener('click', () => deleteLast());
allClearButton && allClearButton.addEventListener('click', () => clearAll());

// Keyboard support
document.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    appendNumber(e.key);
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    chooseOperation(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    compute();
  } else if (e.key === 'Backspace') {
    deleteLast();
  } else if (e.key === 'Escape') {
    clearAll();
  }
});
