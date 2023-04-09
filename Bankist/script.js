"use strict";

// Data
const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2021-04-01T10:17:24.185Z",
        "2022-05-08T14:11:59.604Z",
        "2023-03-27T17:01:17.194Z",
        "2023-03-28T23:36:17.929Z",
        "2023-03-30T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "de-DE",
};


const account2 = {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,


    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2023-02-05T16:33:06.386Z",
        "2023-04-10T14:43:26.374Z",
        "2023-03-28T18:49:59.371Z",
        "2023-03-30T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const account3 = {
    owner: "Steven Thomas Williams",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    currency: "USD",
    locale: "en-US",
};

const account4 = {
    owner: "Sarah Smith",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    currency: "USD",
    locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Functionality

const countdownTimer = () => {
    let time = 300;
    setInterval(() => {
        let minute = String(Math.floor(time / 60)).padStart(2, 0);
        let second = String(Math.floor(time % 60)).padStart(2, 0);

        if (time >= 0) {
            time--;
            labelTimer.textContent = `${minute}:${second}`;
            console.log(minute, second);
        }
        if (time === 0) {
            currentAccount = undefined;
            containerApp.style.opacity = 0;
            labelWelcome.textContent = "Log in to get started";
        }
    }, 1000);
}

const formatMovementsDate = (date) => {
    const calcDaysPassed = (date1, date2) => {
        return Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
    };
    const daysPassed = Math.round(calcDaysPassed(new Date(), date));

    if (daysPassed === 0) {
        return "Today";
    }
    if (daysPassed === 1) {
        return "Yesterday";
    }
    if (daysPassed <= 7) {
        return `${daysPassed} days ago`;
    }



    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const day = String(date.getDate()).padStart(2, 0);
    return `${day}/${month}/${year}`
}

const displayMovements = (acc, sort = false) => {
    containerMovements.innerHTML = ""

    // const movsClone = [...movs];

    const movements = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    movements.forEach((mov, index) => {
        const type = mov > 0 ? "deposit" : "withdrawal";

        const date = new Date(acc.movementsDates[index]);

        const displayDate = formatMovementsDate(date);


        const html = ` <div class="movements__row">
                        <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>

                        <div class="movements__value">${mov.toFixed(2)}${acc.currency}</div>
                  </div>`;
        containerMovements.insertAdjacentHTML("afterbegin", html);

    });
};

const createUserNames = () => {
    accounts.forEach((account) => {
        const user = account.owner;
        const userName = user.toLowerCase().split(" ").map((name) => name[0]).join("");

        account.userName = userName;
    });

};

const calcDisplayBalance = (account) => {
    const balance = account.movements.reduce((sum, mov) => sum + mov, 0);
    // labelBalance.textContent = `${balance.toFixed(2)}€`;
    labelBalance.textContent = new Intl.NumberFormat(account.locale, {
        style: "currency",
        currency: account.currency,
    }).format(balance);

    account.balance = balance;

};

const calcDisplaySummary = (movs) => {
    const deposit = movs.filter((mov) => mov > 0).reduce((total, deposit) => total + deposit, 0);
    labelSumIn.textContent = `${deposit.toFixed(2)}€`;

    const out = movs.filter((mov) => mov < 0).reduce((total, out) => total + out, 0);
    labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

    const interest = movs.filter((mov) => mov > 0).map((deposit) => (deposit * 1.2) / 100).reduce((total, interest) => total + interest, 0);
    labelSumInterest.textContent = `${Math.floor(interest).toFixed(2)}€`;
};

const updateUi = (acc) => {
    displayMovements(acc);
    calcDisplayBalance(acc);
    calcDisplaySummary(acc.movements);
}



createUserNames();
// Fake login
let currentAccount;
// currentAccount = account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 1;



btnLogin.addEventListener("click", function (event) {
    event.preventDefault();


    currentAccount = accounts.find((account) =>
        account.userName === inputLoginUsername.value
    );

    if (currentAccount && currentAccount.pin === +inputLoginPin.value) {

        containerApp.style.opacity = 1;
        inputLoginUsername.value = "";
        inputLoginPin.value = "";
        inputLoginPin.blur();
        labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(" ")[0]}`
        updateUi(currentAccount);

        countdownTimer();

        const today = new Date();
        // const year = (today.getFullYear());
        // const month = String(today.getMonth()).padStart(2, 0);
        // const date = String(today.getDate()).padStart(2, 0);
        // const hour = String(today.getHours()).padStart(2, 0);
        // const minute = String(today.getMinutes()).padStart(2, 0);

        // labelDate.textContent = `${date}/${month}/${year} - ${hour} : ${minute}`;
        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,
            {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
                hour: "numeric",
                minute: "numeric"
            }
        ).format(today);
    }

});

btnTransfer.addEventListener("click", function (event) {
    event.preventDefault();


    const amount = +inputTransferAmount.value;
    const receiverAcc = accounts.find((acc) => inputTransferTo.value === acc.userName);

    if (receiverAcc && amount > 0 && currentAccount.balance >= amount && currentAccount.userName !== receiverAcc.userName) {

        currentAccount.movements.push(-amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());
        if (account1.currency === "EUR" && account2.currency === "USD") {
            receiverAcc.movements.push(amount * 0.92);
        }
        updateUi(currentAccount);
        inputTransferAmount.value = "";
        inputTransferTo.value = "";
    }

});


btnClose.addEventListener("click", function (event) {
    event.preventDefault();

    const closeAcc = inputCloseUsername.value;
    const closePin = +inputClosePin.value;

    const index = accounts.findIndex((acc) => acc.userName === closeAcc);

    if (closeAcc === currentAccount.userName && closePin === currentAccount.pin) {
        accounts.splice(index, 1);
        containerApp.style.opacity = 0;
        inputCloseUsername.value = "";
        inputClosePin.value = "";
    }
});

btnLoan.addEventListener("click", function (event) {
    event.preventDefault();

    const amount = Number(inputLoanAmount.value);
    const amountValid = currentAccount.movements.some((mov) => mov >= amount * 0.1);

    if (amount > 0 && amountValid) {
        currentAccount.movements.push(amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        countdownTimer(currentAccount);
        setTimeout(() => {
            updateUi(currentAccount);
        }, 3000);
        inputLoanAmount.value = "";
    }

});


let sort = false;

btnSort.addEventListener("click", function () {
    displayMovements(currentAccount, !sort);

    sort = !sort;
});



