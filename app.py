from flask import Flask, render_template, request
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )

app = Flask(__name__)

@app.route("/get-history")
def get_history():

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT expression, result, created_at
        FROM calculator_history
        ORDER BY id DESC
    """)

    history = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "history": [
            {
                "expression": row[0],
                "result": row[1],
                "created_at": row[2].strftime("%Y-%m-%d %H:%M:%S")
            }
            for row in history
        ]
    }

@app.route("/clear-history", methods=["DELETE"])
def clear_history():

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM calculator_history")

    connection.commit()

    cursor.close()
    connection.close()

    return "History cleared successfully"

@app.route("/save-calculation", methods=["POST"])
def save_calculation():

    data = request.get_json()

    expression = data["expression"]
    result = data["result"]

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO calculator_history (expression, result) VALUES (%s, %s)",
        (expression, result)
    )

    connection.commit()

    cursor.close()
    connection.close()

    return "Calculation saved successfully"

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