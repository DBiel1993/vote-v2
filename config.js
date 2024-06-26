// config.js

const config = {
    apiUrl: 'https://vote-app-livid.vercel.app/' // Replace with your actual Vercel deployment URL
};

export default config;

import config from '../config.js'; // Adjust the import path based on your project structure

document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = config.apiUrl; // Use the API URL from the config file

    const sessionIdInput = document.getElementById('sessionIdInput');
    const createSessionBtn = document.getElementById('createSessionBtn');
    const joinSessionBtn = document.getElementById('joinSessionBtn');
    const sessionIdDisplay = document.getElementById('sessionIdDisplay');
    const optionInput = document.getElementById('optionInput');
    const addOptionBtn = document.getElementById('addOptionBtn');
    const optionsList = document.getElementById('optionsList');
    const winningOption = document.getElementById('winningOption');
    const googleDirectionsBtn = document.getElementById('googleDirectionsBtn');
    const appleDirectionsBtn = document.getElementById('appleDirectionsBtn');
    const inputSection = document.querySelector('.input-section');

    let currentSessionId = null;

    createSessionBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`${apiUrl}/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            currentSessionId = data.sessionId;
            console.log(`Session created: ${currentSessionId}`);
            sessionIdDisplay.textContent = `Session ID: ${currentSessionId}`;
            inputSection.style.display = 'block';
            fetchOptions();
        } catch (error) {
            console.error('Failed to create session:', error);
            alert('Failed to create session. Please check the console for details.');
        }
    });

    joinSessionBtn.addEventListener('click', () => {
        currentSessionId = sessionIdInput.value.trim();
        if (currentSessionId === '') {
            alert('Please enter a valid session ID or create a new session.');
            return;
        }
        console.log(`Joined session: ${currentSessionId}`);
        sessionIdDisplay.textContent = `Session ID: ${currentSessionId}`;
        inputSection.style.display = 'block';
        fetchOptions();
    });

    async function fetchOptions() {
        try {
            console.log(`Fetching options for session ID: ${currentSessionId}`);
            const response = await fetch(`${apiUrl}/options?sessionId=${currentSessionId}`);
            if (!response.ok) {
                throw new Error(`Error fetching options: ${response.statusText}`);
            }
            const options = await response.json();
            renderOptions(options);
            displayWinningOption(options);
        } catch (error) {
            console.error('Failed to fetch options:', error);
            alert('Failed to fetch options. Please check the console for details.');
        }
    }

    addOptionBtn.addEventListener('click', async () => {
        const optionText = optionInput.value.trim();
        if (optionText !== '') {
            try {
                const response = await fetch(`${apiUrl}/options?sessionId=${currentSessionId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: optionText })
                });
                if (!response.ok) {
                    throw new Error(`Error adding option: ${response.statusText}`);
                }
                const newOption = await response.json();
                optionInput.value = '';
                fetchOptions();
            } catch (error) {
                console.error('Failed to add option:', error);
                alert('Failed to add option. Please check the console for details.');
            }
        }
    });

    function renderOptions(options) {
        optionsList.innerHTML = '';
        options.forEach(option => {
            const li = document.createElement('li');
            li.textContent = `${option.text} - Votes: ${option.votes}`;
            const voteBtn = document.createElement('button');
            voteBtn.textContent = 'Vote';
            voteBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch(`${apiUrl}/vote?sessionId=${currentSessionId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: option.id })
                    });
                    if (!response.ok) {
                        throw new Error(`Error voting: ${response.statusText}`);
                    }
                    fetchOptions();
                } catch (error) {
                    console.error('Failed to vote:', error);
                    alert('Failed to vote. Please check the console for details.');
                }
            });
            li.appendChild(voteBtn);
            optionsList.appendChild(li);
        });
    }

    function displayWinningOption(options) {
        if (options.length === 0) {
            winningOption.textContent = 'No options available';
        } else {
            const winningOptionObj = options.reduce((max, option) => (option.votes > max.votes ? option : max), options[0]);
            winningOption.textContent = `${winningOptionObj.text} - Votes: ${winningOptionObj.votes}`;
        }
    }

    googleDirectionsBtn.addEventListener('click', () => {
        if (optionsList.children.length === 0) {
            alert('No options available');
            return;
        }
        const winningOptionText = winningOption.textContent.split(' - Votes: ')[0];
        const query = encodeURIComponent(winningOptionText);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(url, '_blank');
    });

    appleDirectionsBtn.addEventListener('click', () => {
        if (optionsList.children.length === 0) {
            alert('No options available');
            return;
        }
        const winningOptionText = winningOption.textContent.split(' - Votes: ')[0];
        const query = encodeURIComponent(winningOptionText);
        const url = `http://maps.apple.com/?q=${query}`;
        window.open(url, '_blank');
    });
});