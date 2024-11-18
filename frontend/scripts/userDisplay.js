// This file handles fetching and displaying user information in the application.

import { createElement } from "./domUtils.js";
import { fetchUserData } from "../../backend/api.js";

// Fetches user data from the backend and displays it on the screen.
export async function displayUserInfo(JWToken) {
    try {
        const userData = await fetchUserData(JWToken);
        console.log("User data fetched successfully:", userData);
        display(userData);
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Displays the user data in a designated container element.
export function display(data) {
    const userInfoContainer = document.getElementById("userInfoContainer");
    if (!userInfoContainer) {
        console.error("userInfoContainer element not found");
        return;
    }
    userInfoContainer.innerHTML = "";

    // Create a user information section with a header.
    const userInfoDiv = createElement("div", "userInfo");
    const header = createElement("h2", "userInfoHeader", "User Information");
    userInfoDiv.appendChild(header);

    // Check if the user data structure contains valid information and display it.
    if (data && data.data && data.data.user && data.data.user[0]) {
        userInfoDiv.appendChild(displayInfo(data.data.user[0]));
    } else {
        console.warn("User data is incomplete or missing.");
    }

    userInfoContainer.appendChild(userInfoDiv);
}

// Formats and displays specific user attributes in a styled div.
export function displayInfo(user) {
    const infoDiv = createElement("div", "infoDiv");
    infoDiv.appendChild(createElement("div", "userData", "Username: " + user.login));
    infoDiv.appendChild(createElement("div", "userData", "UserID: " + user.id));
    infoDiv.appendChild(createElement("div", "userData", "First name: " + user.attrs.firstName));
    infoDiv.appendChild(createElement("div", "userData", "Last name: " + user.attrs.lastName));
    infoDiv.appendChild(createElement("div", "userData", "E-mail: " + user.attrs.email));
    infoDiv.appendChild(createElement("div", "userData", "Phone number: " + user.attrs.tel));
    return infoDiv;
}
