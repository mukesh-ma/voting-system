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
