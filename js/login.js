const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginMessage = document.getElementById("login-message");
const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("toggle-password");

togglePasswordButton.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  togglePasswordButton.textContent = showing ? "Show" : "Hide";
  togglePasswordButton.setAttribute("aria-label", showing ? "Show password" : "Hide password");
});

async function checkExistingLogin() {
  const storedError = window.sessionStorage.getItem("loginError");
  if (storedError) {
    loginMessage.textContent = storedError;
    loginMessage.className = "message error";
    window.sessionStorage.removeItem("loginError");
  }

  if (!window.configReady) {
    loginMessage.textContent = window.configError;
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
  let error;

  try {
    const result = await window.dbClient.auth.signInWithPassword({ email, password });
    error = result.error;
  } catch {
    error = { message: "Could not connect to Supabase. Check the project URL and your internet connection." };
  }

  if (error) {
    loginMessage.textContent = error.message.toLowerCase().includes("invalid path")
      ? "The Supabase Project URL is incorrect. Use only https://your-project-ref.supabase.co in js/config.js."
      : error.message;
    loginMessage.className = "message error";
    loginButton.disabled = false;
    return;
  }

  window.location.replace("app.html");
});

checkExistingLogin();
