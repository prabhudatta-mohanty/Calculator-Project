function calculate(operation) {

    let input1 = document.getElementById("num1").value;
    let input2 = document.getElementById("num2").value;

    // Check if any input is empty
    if (input1 === "" || input2 === "") {
        document.getElementById("result").innerText =
            "Result: Please enter both numbers";
        return;
    }

    let num1 = Number(input1);
    let num2 = Number(input2);

    // Check division by zero
    if (operation === "divide" && num2 === 0) {
        document.getElementById("result").innerText =
            "Result: Cannot divide by zero";
        return;
    }

    // Check remainder by zero
    if (operation === "remainder" && num2 === 0) {
        document.getElementById("result").innerText =
            "Result: Cannot find remainder with zero";
        return;
    }

    fetch(`/${operation}/${num1}/${num2}`)
        .then(response => response.text())
        .then(result => {
            document.getElementById("result").innerText =
                "Result: " + result;
        })
        .catch(error => {
            console.log(error);
        });
}