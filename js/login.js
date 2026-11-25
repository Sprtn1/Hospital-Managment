const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginMessage = document.getElementById("login-message");

async function checkExistingLogin() {
  const storedError = window.sessionStorage.getItem("loginError");
  if (storedError) {
    loginMessage.textContent = storedError;
    loginMessage.className = "message error";
    window.sessionStorage.removeItem("loginError");
  }

  if (!window.configReady) {
    loginMessage.textContent = "Open js/config.js and enter your Supabase URL and publishable key.";
    loginMessage.className = "message error";
    loginButton.disabled = true;
    return;
  }

  const { data } = await window.dbClient.auth.getUser();
  if (data.user) {
    window.location.replace("app.html");
  }
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  loginMessage.textContent = "Signing in...";
  loginMessage.className = "message";
  loginButton.disabled = true;

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const { error } = await window.dbClient.auth.signInWithPassword({ email, password });

  if (error) {
    loginMessage.textContent = error.message;
    loginMessage.className = "message error";
    loginButton.disabled = false;
    return;
  }

  window.location.replace("app.html");
});

checkExistingLogin();
