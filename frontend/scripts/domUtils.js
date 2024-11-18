import { showNotification } from "./notifications.js"; // Import the notification function

// Utility function to create DOM elements
export function createElement(type, className, textContent) {
    const element = document.createElement(type);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

// Utility function to create input fields
export function createInput(id, type, placeholder) {
    const input = createElement("input", "input");
    input.id = id;
    input.name = id;
    input.type = type;
    input.placeholder = placeholder;
    input.required = true;
    return input;
}

// Utility function to append multiple children to a parent element
export function appendChildren(parent, children) {
    children.forEach(child => parent.appendChild(child));
}

// Set up logout functionality, clearing local storage and redirecting
export function setupLogout() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.clear(); // Clear local storage
            showNotification("It was nice to see you! Come back soon!"); // Show logout notification
            setTimeout(() => {
                window.location.replace("/"); // Redirect to the login page after 1 second
            }, 1000); // Adjust time as needed for user to see notification
        });
    }
}

