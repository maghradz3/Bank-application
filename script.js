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
  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-02-01T10:17:24.185Z',
    '2023-02-08T14:11:59.604Z',
    '2023-02-07T17:01:17.194Z',
    '2023-02-19T23:36:17.929Z',
    '2023-02-20T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'Ka-GE', // de-DE
};

const account2 = {
  owner: 'Luka Maghradze junior',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1998,
  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-02-10T14:43:26.374Z',
    '2023-02-20T18:49:59.371Z',
    '2023-02-22T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'ka-GE',
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

//Functions
const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const DaysPassed = calcDaysPassed(new Date(), date);

  if (DaysPassed === 0) return 'Today';
  if (DaysPassed === 1) return 'Yesterday';
  if (DaysPassed <= 7) return `${DaysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice('').sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    const html = `
    <div class="movements__row">
       <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
    <div class="movements__date">${displayDate}</div>
       <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaytBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // acc.balance = balance;
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

const calcDisplaySummary = function (acc) {
  const sumarryIn = acc.movements
    .filter(el => el > 0)
    .reduce((acc, el) => acc + el, 0);

  labelSumIn.textContent = `${sumarryIn.toFixed(2)}€`;

  const sumarryOut = acc.movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el, 0);

  labelSumOut.textContent = ` ${Math.abs(sumarryOut.toFixed(2))}€`;

  const interest = acc.movements
    .filter(el => el > 0)
    .map(el => (el * acc.interestRate) / 100)
    .filter(el => el >= 1)
    .reduce((acc, el) => acc + el, 0);

  labelSumInterest.textContent = `${interest}€`;
};

// displayMovements(account1.movements);
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
  displayMovements(acc);
  //display balance
  calcDisplaytBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

//Create a timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //in each call, print the remaining time to the Ui
    labelTimer.textContent = `${min}:${sec}`;

    //when time 0 ==Log out and stop timer
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Welcome User, Please Enter Your Info
      `;
    }
    //Decrease is
    time--;
  };

  //set time to 5 minutes
  let time = 100;
  tick();
  //call timer every second
  const timer = setInterval(tick, 1000);
  return timer;
};

//Event Handlers
let currentAccount, timer;

// //Fake always logged in
// currentAccount = account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 100;

//Experimenting API

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submiting
  e.preventDefault();
  console.log(`Login`);

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display Ui and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Current Date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const min = now.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year},${hour}:${min}`;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat('ka-GE', options).format(
      now
    );
    //Clear inputfields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUi(currentAccount);
  } else {
    labelWelcome.textContent = `Sorry Username or pin is incorrect :(`;
  }
});

//Transfer money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;

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
    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());

    //UpdateUi
    updateUi(currentAccount);

    //CleanUp
    inputTransferTo.value = inputTransferAmount.value = '';

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//Request loans
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(acc => acc >= amount * 0.1)) {
    setTimeout(function () {
      //Add positive movement
      currentAccount.movements.push(amount);

      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update ui
      updateUi(currentAccount);
    }, 2500);

    clearInterval(timer);
    timer = startLogOutTimer();
  }

  //Clear input field
  inputLoanAmount.value = '';
});

//Button Close
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  //Check creditials
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    console.log(`correct delete`);

    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);
    //Dekete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }
  //Clear fields
  inputCloseUsername.value = inputClosePin.value = '';
  //Clear timer
});

//btn sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
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
