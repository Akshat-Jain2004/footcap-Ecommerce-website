document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    // Display the user's message
    displayMessage(userInput, "user");

    // Clear the input field
    document.getElementById("user-input").value = "";

    // Send the message to the Flask API
    fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: userInput })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        // Display the bot's response
        displayMessage(data.answer, "bot");
    })
    .catch(error => {
        console.error("Error:", error);
        displayMessage("Sorry, something went wrong. Please try again.", "bot");
    });
}

function displayMessage(message, sender) {
    const chatOutput = document.getElementById("chat-output");
    const messageElement = document.createElement("div");
    messageElement.classList.add(sender);
    messageElement.textContent = message;
    chatOutput.appendChild(messageElement);

    // Scroll to the bottom of the chat
    chatOutput.scrollTop = chatOutput.scrollHeight;
}
