const { v4: uuidv4 } = require('uuid');

let sessions = {};

module.exports = (req, res) => {
    const { sessionId } = req.query;
    if (req.method === 'POST') {
        const session = sessions[sessionId];
        if (session) {
            const newOption = {
                id: uuidv4(),
                text: req.body.text,
                votes: 0
            };
            session.options.push(newOption);
            console.log(`New option added to session ${sessionId}: ${newOption.text}`);
            res.status(200).json(newOption);
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } else if (req.method === 'GET') {
        const session = sessions[sessionId];
        if (session) {
            res.status(200).json(session.options);
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};