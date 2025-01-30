function sendMessage() {
    let receiverId = document.getElementById("receiver_id").value;
    let message = document.getElementById("message").value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "send_message.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("receiver_id=" + receiverId + "&message=" + encodeURIComponent(message));

    document.getElementById("message").value = ""; // Clear input after sending
}

// Refresh chat every 2 seconds
setInterval(function() {
    let receiverId = document.getElementById("receiver_id").value;
    let chatBox = document.getElementById("chat-box");

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "fetch_messages.php?receiver_id=" + receiverId, true);
    xhr.onload = function() {
        chatBox.innerHTML = this.responseText;
    };
    xhr.send();
}, 2000);
