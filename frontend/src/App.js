import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [vote, setVote] = useState(null);
  const [result, setResult] = useState(null);

  const handleVote = async (candidate) => {
    await fetch('http://localhost:5000/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate }),
    });
    fetchResults();
  };

  const fetchResults = async () => {
    const res = await fetch('http://localhost:5000/results');
    const data = await res.json();
    setResult(data);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="App">
      <h1>Vote for Your Candidate</h1>
      <button onClick={() => handleVote('candidate_1')}>Candidate 1</button>
      <button onClick={() => handleVote('candidate_2')}>Candidate 2</button>
      <button onClick={() => handleVote('candidate_3')}>Candidate 3</button>

      <h2>Results</h2>
      {result && (
        <ul>
          {Object.keys(result).map((candidate) => (
            <li key={candidate}>
              {candidate}: {result[candidate]} votes
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
