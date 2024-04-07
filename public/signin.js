async function signin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const clientLanguage = "en";
  const response = await fetch("http://127.0.0.1:4000/api/user/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, clientLanguage }),
  });
  result = await response.json();
  localStorage.setItem("Authorization", result.sessionKey);
}
