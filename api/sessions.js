const { v4: uuidv4 } = require('uuid');

let sessions = {};

module.exports = (req, res) => {
    if (req.method === 'POST') {
        const sessionId = uuidv4();
        sessions[sessionId] = { options: [] };
        console.log(`New session created: ${sessionId}`);
        res.status(200).json({ sessionId });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};