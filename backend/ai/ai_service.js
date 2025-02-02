const { spawn } = require('child_process');
const path = require('path');

// Predict Future Spending
const predictSpending = async (req, res) => {
  try {
    const pythonProcess = spawn('python3', [path.join(__dirname, 'predict.py')]);

    let data = "";
    pythonProcess.stdout.on('data', (chunk) => (data += chunk.toString()));

    pythonProcess.on('close', () => {
      res.json({ predictedSpending: parseFloat(data.trim()) });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { predictSpending };