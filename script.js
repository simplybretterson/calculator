const hDisplayText = document.querySelector('.display-text');
const hButtonGrid = document.querySelector('#button-grid');
let hButtonList = hButtonGrid.querySelectorAll('.button');
const MAX_DISPLAY_LENGTH = 14;
const NUMERALS = '0123456789.';
const OPERATORS = '+-/x=';

let currentNum = 0;
let storedNum = 0;
let displayStr = '0';
let storedKey = '';
let justOperated = false;

hDisplayText.textContent = displayStr;

function add(x, y) { return x + y; }
function subtract(x, y) { return x - y; }
function multiply(x, y) { return x * y; }
function divide(x, y) { return x / y; }
function operate(key, x, y) {
  switch(key) {
    case '+':
    return add(x, y);
    case '-':
    return subtract(x, y);
    case 'x':
    return multiply(x, y);
    case '/':
    return divide(x, y);
  }
}

function reset() {
  currentNum = 0;
  storedNum = 0;
  displayStr = '0';
  storedKey = '';
  justOperated = false;
}

function storeCurrentNumber() {
  storedNum = currentNum;
  currentNum = 0;
  displayStr = '0';
}

function showError(message) {
  reset();
  displayStr = message;
  currentNum = NaN;
}

function buttonPress(e) {
  let key = null;

  if (e.type === 'click') {
    if (e.target !== e.currentTarget) {
      key = e.target.dataset.key;
    }
  } else if (e.type === 'keydown' || e.type === 'keyup') {
    switch (e.keyCode) {
      case 48:
      case 96:
        key = '0';
        break;
      case 49:
      case 97:
        key = '1';
        break;
      case 50:
      case 98:
        key = '2';
        break;
      case 51:
      case 99:
        key = '3';
        break;
      case 52:
      case 100:
        key = '4';
        break;
      case 53:
      case 101:
        key = '5';
        break;
      case 54:
      case 102:
        key = '6';
        break;
      case 55:
      case 103:
        key = '7';
        break;
      case 56:
      case 104:
        key = '8';
        break;
      case 57:
      case 105:
        key = '9';
        break;
      case 190:
      case 110:
        key = '.';
        break;
      case 107:
        key = '+';
        break;
      case 173:
      case 109:
        key = '-';
        break;
      case 191:
      case 111:
        key = '/';
        break;
      case 88:
      case 106:
        key = 'x';
        break;
      case 13:
      case 61:
        key = '=';
        break;
      case 8:
      case 66:
        key = 'b';
        break;
      case 67:
        key = 'c';
        break;
    }
  }

  if (key === null) {
    return;
  } else {
    hButtonList.forEach(function(item) {
      if (item.getAttribute('data-key') === key) {
        if (e.type === 'keydown') {
          item.classList.add('pressed');
        } else if (e.type === 'keyup') {
          item.classList.remove('pressed');
        }
      }
    });
  }

  //don't process the input further if it's only a keyup
  if (e.type === 'keyup') {
    return;
  }

  //if an error is being displayed, reset before processing input
  if (isNaN(currentNum)) {
    reset();
  }

  // NUMERAL INPUT
  if (NUMERALS.indexOf(key) >= 0) {
    if (justOperated) {
      storeCurrentNumber();
      justOperated = false;
    }
    if (key !== '.' || displayStr.indexOf('.') === -1) {
      displayStr = displayStr.concat(key);
      currentNum = parseFloat(displayStr);
    }
  // OPERATOR INPUT
  } else if(OPERATORS.indexOf(key) >= 0) {
    if (justOperated === false) {
      if (storedKey !== '') {
        //check for divide by 0
        if (storedKey === '/' && currentNum === 0) {
          showError(`Don't do that!`);
        } else {
          currentNum = operate(storedKey, storedNum, currentNum);
          justOperated = true;
          displayStr = '' + currentNum;
        }
      } else if (key !== '=') {
        storeCurrentNumber();
      }
    }
    key === '=' ? storedKey = '' : storedKey = key;


  // SPECIAL INPUT
  } else if(key === 'b') {
    displayStr = displayStr.slice(0, -1);
    if (displayStr === '' || displayStr === '-') {
      displayStr = '0';
    }
    currentNum = parseFloat(displayStr);
  } else if (key === 'c') {
    reset();
  }
  //check for a leading zero and trim it
  if (displayStr.charAt(0) === '0' && displayStr.length > 1) {
    displayStr = displayStr.slice(1);
  }
  //check for numbers exceeding max length
  if (displayStr.length > MAX_DISPLAY_LENGTH) {
    if (displayStr.indexOf('.') === -1 || displayStr.indexOf('.') >= MAX_DISPLAY_LENGTH) {
      showError('Overflow');
    } else if (displayStr.indexOf('.') === MAX_DISPLAY_LENGTH - 1) {
      displayStr = displayStr.slice(0, MAX_DISPLAY_LENGTH - 1);
      currentNum = parseFloat(displayStr);
    } else if (displayStr.indexOf('.') < MAX_DISPLAY_LENGTH - 1) {
      displayStr = displayStr.slice(0, MAX_DISPLAY_LENGTH);
      //check for trailing zeroes after a decimal and trim them
      while (displayStr.charAt(displayStr.length - 1) === '0') {
        displayStr = displayStr.slice(0, -1);
      }
      currentNum = parseFloat(displayStr);
    }
  }
  hDisplayText.textContent = displayStr;
  e.stopPropagation();
}

hButtonGrid.addEventListener('click', buttonPress, false);
document.addEventListener('keydown', buttonPress);
document.addEventListener('keyup', buttonPress);
