from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/add/<int:a>/<int:b>")
def add(a, b):
    return str(a + b)

@app.route("/subtract/<int:a>/<int:b>")
def subtract(a, b):
    return str(a - b)

@app.route("/multiply/<int:a>/<int:b>")
def multiply(a, b):
    return str(a * b)

@app.route("/divide/<int:a>/<int:b>")
def divide(a, b):
    if b == 0:
        return "Cannot divide by zero"
    return str(a / b)


@app.route("/remainder/<int:a>/<int:b>")
def remainder(a, b):
    if b == 0:
        return "Cannot find remainder with zero"
    return str(a % b)

@app.route("/power/<int:a>/<int:b>")
def power(a, b):
    return str(a ** b)

if __name__ == "__main__":
    app.run(debug=True)