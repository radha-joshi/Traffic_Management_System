import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",        # agar password hai to yahan daal do
        password="Computer@12",        # agar password hai to yahan daal do
        database="smart_traffic"
    )
from flask import Flask, send_from_directory

app = Flask(__name__, static_url_path='', static_folder='../Frontend')

@app.route('/')
def serve_dashboard():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../Frontend', path)
