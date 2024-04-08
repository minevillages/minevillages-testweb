document.addEventListener("DOMContentLoaded", function () {
  createUserButtons();
});

let socket; // 소켓 변수를 전역 범위에서 선언합니다.

async function getName() {
  const response = await fetch("http://127.0.0.1:4000/api/user/name", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
    },
  });
  result = await response.json();
  return result;
}

// 버튼을 생성하고 유저 이름을 매핑하는 함수
async function createUserButtons() {
  const userListContainer = document.getElementById("user-list-container");

  // API에서 모든 유저 정보를 받아오는 요청
  const response = await fetch("http://127.0.0.1:4000/api/user/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
    },
  });
  const users = await response.json();

  // 각 유저 정보를 기반으로 버튼을 생성하고 이벤트를 추가
  users.forEach((user) => {
    const button = document.createElement("button");
    button.textContent = user.name;
    button.addEventListener("click", async () => {
      if (!socket) {
        await joinChat(user.name);
      }
    });
    userListContainer.appendChild(button);
  });
}

async function joinChat(receiverId) {
  // 소켓이 이미 열려 있다면 이전 소켓을 닫음
  if (socket) {
    socket.onmessage = null;
    await socket.close();
  }
  const name = (await getName()).name;

  console.log(name);
  // WebSocket 연결
  socket = new WebSocket(
    `ws://127.0.0.1:7001/ws?sender=${name}&receiver=${receiverId}`
  );

  // DOM 요소 가져오기
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const messagesContainer = document.getElementById("messages-container");

  // WebSocket 메시지 수신 처리
  socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    displayMessage(message);
  };

  // 메시지 전송 이벤트 처리
  sendButton.addEventListener("click", function () {
    const messageContent = messageInput.value;
    const message = {
      sender: name, // 사용자 ID 또는 닉네임
      receiver: receiverId, // 수신자 ID 또는 닉네임
      content: messageContent,
    };
    sendMessage(message);
  });

  // 메시지 전송 함수
  function sendMessage(message) {
    socket.send(JSON.stringify(message));
    messageInput.value = ""; // 입력 필드 비우기
  }

  // 메시지 표시 함수
  function displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = `${message.sender}: ${message.content}`;
    messagesContainer.appendChild(messageElement);
  }
}
