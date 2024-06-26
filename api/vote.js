let sessions = {};

module.exports = (req, res) => {
    const { sessionId } = req.query;
    if (req.method === 'POST') {
        const session = sessions[sessionId];
        if (session) {
            const { id } = req.body;
            const option = session.options.find(opt => opt.id === id);
            if (option) {
                option.votes += 1;
                console.log(`Vote added to option ${id} in session ${sessionId}`);
                res.status(200).json(option);
            } else {
                res.status(404).json({ message: 'Option not found' });
            }
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};