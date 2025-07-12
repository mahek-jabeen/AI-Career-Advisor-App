from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from openai import OpenAI # Import OpenAI client

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client with API key from environment variable
# THIS LINE WAS MISSING OR MISPLACED!
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/')
def index(): # Renamed from 'home' to avoid conflict
    return jsonify(message="Welcome to the Flask Backend!")

@app.route('/test_env')
def test_env_route(): # Renamed from 'test_env' to avoid conflict
    test_var = os.getenv("TEST_VAR", "TEST_VAR not set")
    return jsonify(message=f"Environment variable TEST_VAR: {test_var}")

@app.route('/api/message')
def get_message():
    return jsonify(message="Hello from Flask to React!")

@app.route('/api/career-advice', methods=['POST'])
def get_career_advice():
    data = request.json
    skills = data.get('skills', '')
    interests = data.get('interests', '')
    education_level = data.get('educationLevel', '')

    if not skills and not interests:
        return jsonify({"error": "Please provide at least skills or interests."}), 400

    prompt = (
        f"As an AI career advisor, provide detailed and actionable career path suggestions. "
        f"Consider the following:\n"
        f"Skills: {skills}\n"
        f"Interests: {interests}\n"
        f"Education Level: {education_level}\n\n"
        f"Suggest 3-5 specific career paths, required skills for each, and brief learning resources (e.g., Coursera courses, specific certifications, project ideas). "
        f"Structure your response clearly."
    )

    try:
        chat_completion = client.chat.completions.create(
            model="gpt-3.5-turbo", # You can use other models like "gpt-4o" if you have access
            messages=[
                {"role": "system", "content": "You are a helpful and detailed AI career advisor."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500 # Adjust as needed for longer responses
        )
        advice = chat_completion.choices[0].message.content
        return jsonify({"advice": advice})

    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return jsonify({"error": "Failed to get career advice from AI. Please try again later."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)