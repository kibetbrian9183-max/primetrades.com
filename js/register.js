// ===============================
// PRIMEVEST REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");
const togglePassword = document.querySelector(".toggle-password");
const password = document.getElementById("password");

// ===============================
// SHOW/HIDE PASSWORD
// ===============================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";
        togglePassword.classList.replace("fa-eye", "fa-eye-slash");

    } else {

        password.type = "password";
        togglePassword.classList.replace("fa-eye-slash", "fa-eye");

    }

});

// ===============================
// REGISTER
// ===============================

registerForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const phone = document.getElementById("phone").value.trim();
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (pass !== confirm) {
        alert("Passwords do not match.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.some(user => user.email === email);

    if (exists) {
        alert("An account with this email already exists.");
        return;
    }

    const newUser = {

        id: Date.now(),

        fullname,

        email,

        phone,

        password: pass,

        balance: 0,

        investment: 0,

        earnings: 0,

        joined: new Date().toLocaleDateString()

    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");

    window.location.href = "index.html";

});
