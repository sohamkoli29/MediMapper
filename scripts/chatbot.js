const chatbotIcon = document.getElementById("chatbot-btn");
const chatbotModal = document.getElementById("chatbot-modal");
const closeBtn = document.querySelector(".close-btn");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatLog = document.getElementById("chat-log");

chatbotIcon.addEventListener("click", () => chatbotModal.classList.toggle("hidden"));
closeBtn.addEventListener("click", () => chatbotModal.classList.add("hidden"));

sendBtn.addEventListener("click", async () => {
    let userMessage = chatInput.value.trim();
    if (!userMessage) return;

    displayMessage("You: " + userMessage, "bg-gray-200 text-black");
    
    // Concatenate prompt for healthcare bot behavior
    userMessage = "You are a healthcare specialist. Based on the symptoms, suggest possible diseases or provide health recommendations. Keep responses short for minor issues and concise but informative for serious cases: " + userMessage;

    const apiKey = "YOUR_GEMINI_API_KEY";  // Replace with actual API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = { contents: [{ parts: [{ text: userMessage }] }] };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        const botMessage = data.candidates[0]?.content?.parts[0]?.text || "I'm not sure how to respond.";

        displayMessage("Bot: " + botMessage, "bg-blue-500 text-white");
    } catch (error) {
        displayMessage("Bot: Error reaching chatbot API", "bg-red-500 text-white");
    }

    chatInput.value = ""; 
});

function displayMessage(message, style) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.className = `p-2 rounded-lg w-fit max-w-xs ${style}`;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

const clearChatBtn = document.getElementById("clear-chat-btn");

clearChatBtn.addEventListener("click", () => {
    chatLog.innerHTML = '';  // Clear the chat log content
});
