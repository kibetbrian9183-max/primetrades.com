// ======================================
// PRIMEVEST PROFILE
// ======================================

// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

// ======================================
// ELEMENTS
// ======================================

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const balance = document.getElementById("balance");
const investment = document.getElementById("investment");
const earnings = document.getElementById("earnings");
const logoutBtn = document.getElementById("logoutBtn");

// ======================================
// LOAD USER DATA
// ======================================

function loadProfile() {

    fullName.textContent =
        currentUser.fullname || "PrimeVest User";

    email.textContent =
        currentUser.email || "No email";

    balance.textContent =
        "$" + Number(currentUser.balance || 0).toFixed(2);

    investment.textContent =
        "$" + Number(currentUser.investment || 0).toFixed(2);

    earnings.textContent =
        "$" + Number(currentUser.earnings || 0).toFixed(2);

}

loadProfile();

// ======================================
// LOGOUT
// ======================================

logoutBtn.addEventListener("click", function(e){

    e.preventDefault();

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if(!confirmLogout){
        return;
    }

    localStorage.removeItem("currentUser");

    alert("Logged out successfully.");

    window.location.href = "index.html";

});

// ======================================
// REFRESH PROFILE
// ======================================

window.addEventListener("focus", () => {

    const updatedUser = JSON.parse(
        localStorage.getItem("currentUser")
    );

    if(updatedUser){

        fullName.textContent =
            updatedUser.fullname || "PrimeVest User";

        email.textContent =
            updatedUser.email || "No email";

        balance.textContent =
            "$" + Number(updatedUser.balance || 0).toFixed(2);

        investment.textContent =
            "$" + Number(updatedUser.investment || 0).toFixed(2);

        earnings.textContent =
            "$" + Number(updatedUser.earnings || 0).toFixed(2);

    }

});
