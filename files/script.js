'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Levan Maghradze',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1997,
};

const account2 = {
  owner: 'Luka Maghradze junior',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1998,
};

const account3 = {
  owner: 'Vasil Maghradze',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 1956,
};

const account4 = {
  owner: 'Mzia Gogia',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 1962,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
       <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
       <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaytBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // acc.balance = balance;
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const sumarryIn = acc.movements
    .filter(el => el > 0)
    .reduce((acc, el) => acc + el, 0);

  labelSumIn.textContent = `${sumarryIn}€`;

  const sumarryOut = acc.movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el, 0);

  labelSumOut.textContent = ` ${Math.abs(sumarryOut)}€`;

  const interest = acc.movements
    .filter(el => el > 0)
    .map(el => (el * acc.interestRate) / 100)
    .filter(el => el >= 1)
    .reduce((acc, el) => acc + el, 0);

  labelSumInterest.textContent = `${interest}€`;
};

displayMovements(account1.movements);
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(el => el[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUi = function (acc) {
  //display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplaytBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

//Event Handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submiting
  e.preventDefault();
  console.log(`Login`);

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display Ui and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear inputfields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUi(currentAccount);
  } else {
    labelWelcome.textContent = `Sorry Username or pin is incorrect :(`;
  }
});

//Transfer money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  console.log(amount, reciverAcc);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciverAcc?.userName !== currentAccount.userName &&
    reciverAcc
  ) {
    //Doing the transfer
    console.log(`transfer valid`);
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    //UpdateUi
    updateUi(currentAccount);

    //CleanUp
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
