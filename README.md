# Voting System

This project is a simple voting application built using a Flask backend and a React frontend. The application allows users to vote for candidates, view the results, and use Docker for local development. The project also includes basic DevOps principles such as CI/CD pipelines and containerization.

## Features

* **Backend**: Flask API to manage votes and display results.
* **Frontend**: React-based user interface to allow users to vote and view results.
* **Docker**: Dockerized backend and frontend services to enable easy deployment.
* **Docker Compose**: Configured for multi-container orchestration in local development.

## Table of Contents

1. [Installation](#installation)
2. [Project Structure](#project-structure)
3. [Backend Development](#backend-development)
4. [Frontend Development](#frontend-development)
5. [Docker Setup](#docker-setup)
6. [Running Locally](#running-locally)
7. [CI/CD Pipeline](#cicd-pipeline)

---

## Installation

### Prerequisites

Before running this project, ensure you have the following installed:

* **Docker**: To build and run the containers.
* **Docker Compose**: To easily manage multi-container applications.
* **Git**: For version control.

### Clone the Repository

```bash
git clone https://github.com/<your-username>/voting-system.git
cd voting-system
```

---

## Project Structure

```
voting-system/
  ├── backend/
  │   └── app.py
  │   └── requirements.txt
  ├── frontend/
  │   └── src/
  │   └── public/
  │   └── Dockerfile
  ├── docker-compose.yml
  ├── README.md
  └── .github/
      └── workflows/
          └── ci.yml
```

* `backend/`: Contains the Flask application that manages voting logic.
* `frontend/`: Contains the React application for user interaction.
* `docker-compose.yml`: Used to run both backend and frontend in separate containers.
* `.github/workflows/ci.yml`: GitHub Actions configuration for the CI pipeline.

---

## Backend Development

The backend of the application is a simple Flask API that allows users to vote and fetch the results.

### File: `backend/app.py`

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

votes = {'candidate_1': 0, 'candidate_2': 0, 'candidate_3': 0}

@app.route('/vote', methods=['POST'])
def vote():
    candidate = request.json.get('candidate')
    if candidate in votes:
        votes[candidate] += 1
        return jsonify({'message': 'Vote counted!'}), 200
    return jsonify({'message': 'Invalid candidate!'}), 400

@app.route('/results', methods=['GET'])
def results():
    return jsonify(votes), 200

if __name__ == '__main__':
    app.run(debug=True)
```

* The backend contains two API endpoints:

  * `/vote`: Accepts POST requests to vote for a candidate.
  * `/results`: Returns the current voting results.

---

## Frontend Development

The frontend is built with React.js and communicates with the Flask API to allow users to cast votes and view the results.

### File: `frontend/src/App.js`

```jsx
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
```

* The frontend displays three buttons for voting and shows the live vote results fetched from the backend.

---

## Docker Setup

This project uses **Docker** to containerize the backend and frontend services.

### Backend Dockerfile

The `backend/Dockerfile` is used to build the Flask application into a Docker container.

```dockerfile
# Backend Dockerfile
FROM python:3.8-slim

WORKDIR /app
COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "app.py"]
```

### Frontend Dockerfile

The `frontend/Dockerfile` is used to build the React application into a Docker container.

```dockerfile
# Frontend Dockerfile
FROM node:16

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

CMD ["npm", "start"]
```

---

## Running Locally

### Prerequisites

Ensure Docker and Docker Compose are installed.

### Step 1: Build and Run with Docker Compose

At the root of your project, run the following command:

```bash
docker-compose up --build
```

This command will:

* Build the backend and frontend Docker images.
* Start the containers and link them together.
* Expose the backend on `http://localhost:5000` and the frontend on `http://localhost:3000`.

### Step 2: Access the Application

1. Open your browser and navigate to `http://localhost:3000` to interact with the voting system.
2. You can vote for a candidate and see the updated results.

---

## CI/CD Pipeline

This project uses **GitHub Actions** for Continuous Integration (CI).

### GitHub Actions CI Workflow

The GitHub Actions configuration is located in `.github/workflows/ci.yml`. It will:

* Trigger on push to the `main` branch.
* Install Python dependencies.
* Run tests on the backend.
* Build and push Docker images to a container registry (to be added in a future step).

### Sample `ci.yml` file:

```yaml
name: Full Voting App CI Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    # Step 1: Checkout the code
    - name: Checkout repository
      uses: actions/checkout@v2

    # Step 2: Set up Python for Flask Backend
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.8'  # Or any other version compatible with your Flask app

    # Step 3: Install Backend Dependencies (Flask)
    - name: Install backend dependencies
      run: |
        cd backend
        pip install -r requirements.txt

    # Step 4: Set up Node.js for React Frontend
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'

    # Step 5: Cache Node Modules (for faster builds)
    - name: Cache Node modules
      uses: actions/cache@v4
      with:
        path: node_modules
        key: ${{ runner.os }}-node-modules-${{ hashFiles('frontend/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-node-modules-

    # Step 6: Install Frontend Dependencies (React)
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm install

    # Step 7: Run Frontend Tests (React)
    - name: Run frontend tests
      run: |
        cd frontend
        npm test -- --ci --coverage --watchAll=false

    # Step 8: Build the React app (Frontend)
    - name: Build the frontend app
      run: |
        cd frontend
        CI=false npm run build
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Contributing

Feel free to fork this repository, submit issues, and create pull requests to enhance the project.

---
