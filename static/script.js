let currentInput = "";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let historyList = [];

const result = document.getElementById("result");
const expression = document.getElementById("expression");

const buttons = document.querySelectorAll("button");

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        const value = button.innerText;

        // Number buttons
        if (!isNaN(value) || value === ".") {
            enterNumber(value);
        }

        // Operators
        else if (["+", "−", "×", "÷", "%", "^"].includes(value)) {
            chooseOperator(value);
        }

        // Equal button
        else if (value === "=") {
            calculateResult();
        }

        // Clear button
        else if (value === "C") {
            clearCalculator();
        }
    });
});


function enterNumber(value) {

    if (waitingForSecondNumber) {
        currentInput = "";
        waitingForSecondNumber = false;
    }

    // Prevent multiple decimal points
    if (value === "." && currentInput.includes(".")) {
        return;
    }

    currentInput += value;

    result.innerText = currentInput;
}


function chooseOperator(selectedOperator) {

    if (currentInput === "") {
        return;
    }

    firstNumber = Number(currentInput);
    operator = selectedOperator;

    expression.innerText =
        firstNumber + " " + operator;

    waitingForSecondNumber = true;
}


function calculateResult() {

    if (firstNumber === null || operator === null || currentInput === "") {
        return;
    }

    const secondNumber = Number(currentInput);

    let answer;

    if (operator === "+") {
        answer = firstNumber + secondNumber;
    }

    else if (operator === "−") {
        answer = firstNumber - secondNumber;
    }

    else if (operator === "×") {
        answer = firstNumber * secondNumber;
    }

    else if (operator === "÷") {

        if (secondNumber === 0) {
            result.innerText = "Cannot divide by zero";
            return;
        }

        answer = firstNumber / secondNumber;
    }

    else if (operator === "%") {

        if (secondNumber === 0) {
            result.innerText = "Cannot find remainder with zero";
            return;
        }

        answer = firstNumber % secondNumber;
    }

    else if (operator === "^") {
        answer = firstNumber ** secondNumber;
    }

    expression.innerText =
        firstNumber + " " + operator + " " + secondNumber + " =";

    result.innerText = answer;

    fetch("/save-calculation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            expression: firstNumber + " " + operator + " " + secondNumber,
            result: answer
        })
    })
    .then(response => response.text())
    .then(message => {
        console.log(message);
    })
    .catch(error => {
        console.log("Error:", error);
    });

    historyList.push(
        firstNumber + " " + operator + " " + secondNumber + " = " + answer
    );

    showHistory();

    currentInput = String(answer);
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = true;
}


function clearCalculator() {

    currentInput = "";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;

    expression.innerText = "";
    result.innerText = "0";
}

function showHistory() {

    const historyContainer = document.getElementById("history-list");

    historyContainer.innerHTML = "";

    if (historyList.length === 0) {

        const message = document.createElement("p");

        message.innerText = "No calculations yet.";

        historyContainer.appendChild(message);

        return;
    }

    historyList.forEach(function (item) {

        const historyItem = document.createElement("div");

        historyItem.className = "history-item";

        historyItem.innerText = item;

        historyContainer.appendChild(historyItem);
    });
}

function loadHistory() {

    fetch("/get-history")
        .then(response => response.json())
        .then(data => {

            historyList = [];

            data.history.forEach(function (item) {

                historyList.push(
                    item.expression + " = " + item.result
                );

            });

            showHistory();
        })
        .catch(error => {
            console.log("Error loading history:", error);
        });
}

function clearHistory() {

    fetch("/clear-history", {
        method: "DELETE"
    })
    .then(response => response.text())
    .then(message => {

        console.log(message);

        historyList = [];
        showHistory();

    })
    .catch(error => {
        console.log("Error clearing history:", error);
    });
}

loadHistory();