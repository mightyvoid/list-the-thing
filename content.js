let isSelecting = false;  // To track whether selection mode is active
let selectedElement = null;  // To store the selected element

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start-selection') {
        isSelecting = true;
        alert('Click on any element to select it, we will add the list of items in webpage');

        // Add event listeners for mouse hover and click
        document.addEventListener('mouseover', highlightElement);
        document.addEventListener('mouseout', removeHighlight);
        document.addEventListener('click', selectElement);
    }
});


// Function to highlight the element on hover
function highlightElement(event) {
    if (isSelecting) {
        event.target.classList.add('highlight-hover');
    }
}

// Function to remove the highlight on mouseout
function removeHighlight(event) {
    if (isSelecting) {
        event.target.classList.remove('highlight-hover');
    }
}

// Function to select an element on click
function selectElement(event) {

    if (isSelecting) {
        event.preventDefault();  // Prevent default behavior (e.g., links)

        // Clear previously selected element
        if (selectedElement) {
            selectedElement.classList.remove('highlight-selected');
        }

        selectedElement = event.target;  // Store the clicked element
        selectedElement.classList.add('highlight-selected');

        isSelecting = false;  // Stop selection mode
        console.log("selectedElement",selectedElement.tagName)
        // Remove event listeners after selection
        document.removeEventListener('mouseover', highlightElement);
        document.removeEventListener('mouseout', removeHighlight);
        document.removeEventListener('click', selectElement);

        // Get all elements and their inner text
        const allElements = document.querySelectorAll(selectedElement.tagName);
        const innerTextArray = Array.from(allElements).map(el => el.innerText).join('\n');

 
            // Create a new element to display the collected text
        const outputDiv = document.createElement('div');
        outputDiv.style.position = 'fixed';
        outputDiv.style.bottom = '10px';
        outputDiv.style.right = '10px';
        outputDiv.style.backgroundColor = 'white';
        outputDiv.style.border = '1px solid black';
        outputDiv.style.padding = '10px';
        outputDiv.style.zIndex = '9999';
        outputDiv.style.width = '300px'; // Set a fixed width
        outputDiv.style.maxHeight = '50vh'; // Set max height to half the viewport height
        outputDiv.style.overflowY = 'auto'; // Enable vertical scrolling
        outputDiv.style.fontSize = '12px'; // Make the text smaller
        outputDiv.innerHTML = `<h3>Here is your list of items:</h3><pre>${innerTextArray}</pre>`;
        
        // Create a close button
        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px'; // Float to the right
        closeButton.onclick = () => {
            document.body.removeChild(outputDiv);
        };
        
        // Append the button to the output div
        outputDiv.appendChild(closeButton);
        document.body.appendChild(outputDiv); // Add the div to the body
    }
}

// CSS for highlighting
const style = document.createElement('style');
style.innerHTML = `
    .highlight-hover {
        outline: 2px solid blue;
    }
    .highlight-selected {
        outline: 2px solid red;
    }
`;
document.head.appendChild(style);
