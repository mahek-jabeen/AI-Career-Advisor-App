from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/')
def home():
    return jsonify(message="Hello from Flask Backend!")

@app.route('/test_env')
def test_env():
    # Example of accessing an environment variable
    # We will add actual API_KEY later
    test_var = os.getenv("TEST_VAR", "TEST_VAR not set")
    return jsonify(message=f"Environment variable TEST_VAR: {test_var}")

if __name__ == '__main__':
    app.run(debug=True, port=5000)