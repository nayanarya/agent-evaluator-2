const userInput = document.getElementById('userInput');
const submitBtn = document.getElementById('submitBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const bestModel = document.getElementById('bestModel');
const evaluation = document.getElementById('evaluation');
const evaluator = document.getElementById('evaluator');
const gptResponse = document.getElementById('gptResponse');
const sweResponse = document.getElementById('sweResponse');
const gptBadge = document.getElementById('gptBadge');
const sweBadge = document.getElementById('sweBadge');

submitBtn.addEventListener('click', async () => {
    const input = userInput.value.trim();
    
    if (!input) {
        showError('Please enter a query before submitting.');
        return;
    }

    hideAllSections();
    loadingSection.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userInput: input })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to evaluate responses');
        }

        displayResults(data.data);
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
        loadingSection.classList.add('hidden');
        submitBtn.disabled = false;
    }
});

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        submitBtn.click();
    }
});

function displayResults(data) {
    bestModel.textContent = data.bestModel;
    evaluation.textContent = data.evaluation;
    evaluator.textContent = data.evaluatedBy;
    gptResponse.textContent = data.responses.gpt.response;
    sweResponse.textContent = data.responses.swe.response;

    gptBadge.classList.add('hidden');
    sweBadge.classList.add('hidden');

    if (data.bestModel === 'GPT-5.1-Codex') {
        gptBadge.classList.remove('hidden');
    } else if (data.bestModel === 'SWE 1.5 Fast') {
        sweBadge.classList.remove('hidden');
    }

    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(message) {
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
    setTimeout(() => {
        errorSection.classList.add('hidden');
    }, 5000);
}

function hideAllSections() {
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('Server status:', data.message);
    } catch (error) {
        console.error('Failed to connect to server:', error);
        showError('Failed to connect to server. Please ensure the server is running.');
    }
});
