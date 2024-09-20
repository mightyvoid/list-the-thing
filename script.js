

document.getElementById('startSelect').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default action
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const tab = tabs[0];
            chrome.tabs.sendMessage(tab.id, { action: 'start-selection' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                }
            });
        }
    });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'display-text') {
        document.body.innerHTML = `<pre>${message.text}</pre>`; // Display the inner text in the popup
    }
});
