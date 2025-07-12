import React, { useState, useEffect } from 'react';
import './App.css'; // Keep the existing CSS

function App() {
  // State for collecting user input
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [educationLevel, setEducationLevel] = useState('');

  // State for displaying AI advice and loading status
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Optional: Initial message from backend (from previous step)
  const [initialMessage, setInitialMessage] = useState('');

  // Effect to fetch the initial message (optional, can be removed later)
  useEffect(() => {
    fetch('http://localhost:5000/api/message')
      .then(response => response.json())
      .then(data => setInitialMessage(data.message))
      .catch(error => console.error('Error fetching initial message:', error));
  }, []);

  const getCareerAdvice = async () => {
    setIsLoading(true);
    setError(''); // Clear any previous errors
    setAdvice(''); // Clear previous advice

    try {
      const response = await fetch('http://localhost:5000/api/career-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills,
          interests,
          educationLevel,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAdvice(data.advice);
      } else {
        setError(data.error || 'An unknown error occurred.');
      }
    } catch (err) {
      console.error('Error getting career advice:', err);
      setError('Failed to connect to the backend or retrieve advice.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Career Advisor</h1>
        {initialMessage && <p>Backend Status: {initialMessage}</p>} {/* Display optional status */}

        <div className="input-section">
          <textarea
            placeholder="Enter your skills (e.g., Python, React, Data Analysis)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <textarea
            placeholder="Enter your interests (e.g., AI, Web Development, Healthcare)"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter your education level (e.g., Bachelor's in CS, High School Diploma)"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
          />
          <button onClick={getCareerAdvice} disabled={isLoading}>
            {isLoading ? 'Getting Advice...' : 'Get Career Advice'}
          </button>
        </div>

        {error && <p className="error-message">Error: {error}</p>}

        {advice && (
          <div className="advice-section">
            <h2>Your Career Advice:</h2>
            {/* We'll make this look nicer later with proper markdown rendering if needed */}
            <p style={{ whiteSpace: 'pre-wrap', textAlign: 'left', width: '80%', margin: '20px auto', border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9', color: '#333' }}>
              {advice}
            </p>
          </div>
        )}

        <p style={{ marginTop: '50px', fontSize: '0.8em' }}>
          Built with React and Flask by Mahek Jabeen.
        </p>
      </header>
    </div>
  );
}

export default App;