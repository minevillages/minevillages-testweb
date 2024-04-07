const socket = new WebSocket("ws://127.0.0.1:7001/ws");

socket.onmessage = function (event) {
  const message = JSON.parse(event.data);
  document.getElementById("chat").innerHTML +=
    "<div>" + message.sender + " : " + message.message + "</div>";
};

async function getName() {
  const response = await fetch("http://127.0.0.1:4000/api/user/name", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
    },
  });
  result = await response.json();
  return result.name;
}

async function sendMessage() {
  try {
    const messageInput = document.getElementById("messageInput");
    const message = {
      message: messageInput.value,
      sender: await getName(),
      timestamp: new Date(),
      Read: true,
    };
    socket.send(JSON.stringify(message));
    messageInput.value = "";
  } catch (err) {
    console.log(err);
  }
}
