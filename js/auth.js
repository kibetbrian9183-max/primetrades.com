// ===============================
// PRIMEVEST AUTH
// ===============================

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.querySelector(".toggle-password");

// ===============================
// PASSWORD SHOW/HIDE
// ===============================

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        } else {
            passwordInput.type = "password";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
        }

    });

}

// ===============================
// LOGIN
// ===============================

loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === "" || password === "") {
        alert("Please enter your email and password.");
        return;
    }

    // Get saved users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find matching account
    const user = users.find(
        account =>
            account.email === email &&
            account.password === password
    );

    if (!user) {
        alert("Invalid email or password.");
        return;
    }

    // Save logged-in user
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Login successful!");

    // Redirect
    window.location.href = "dashboard.html";

});
