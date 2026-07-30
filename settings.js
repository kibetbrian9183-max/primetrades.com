// ========================================
// PRIMEVEST SETTINGS
// settings.js
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadUser();
    setupMenu();
    setupLogout();

});

// ========================================
// LOAD USER INFORMATION
// ========================================

function loadUser() {

    const user = JSON.parse(localStorage.getItem("user")) || {};

    const username = document.getElementById("username");
    const email = document.getElementById("email");

    username.textContent = user.username || "PrimeVest User";
    email.textContent = user.email || "No email";

    // Profile Avatar
    const avatar = document.querySelector(".profile-image");

    if (user.username) {
        avatar.innerHTML = user.username.charAt(0).toUpperCase();
    } else {
        avatar.innerHTML = '<i class="fa-solid fa-user"></i>';
    }

}

// ========================================
// MENU ACTIONS
// ========================================

function setupMenu() {

    const items = document.querySelectorAll(".setting-item");

    items.forEach(item => {

        item.addEventListener("click", () => {

            const option = item.querySelector("span").textContent.trim();

            switch(option){

                case "Edit Profile":
                    window.location.href = "edit-profile.html";
                    break;

                case "Change Password":
                    window.location.href = "change-password.html";
                    break;

                case "Security":
                    window.location.href = "security.html";
                    break;

                case "Notifications":
                    window.location.href = "notifications.html";
                    break;

                case "Language":
                    window.location.href = "language.html";
                    break;

                case "Help Center":
                    window.location.href = "support.html";
                    break;

                case "About PrimeVest":
                    window.location.href = "about.html";
                    break;

                default:
                    console.log(option);

            }

        });

    });

}

// ========================================
// LOGOUT
// ========================================

function setupLogout() {

    const logoutBtn = document.querySelector(".logout-btn");

    logoutBtn.addEventListener("click", () => {

        const confirmLogout = confirm("Do you want to log out?");

        if(!confirmLogout) return;

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        window.location.replace("index.html");

    });

}

// ========================================
// UPDATE PROFILE
// ========================================

function updateProfile(data){

    localStorage.setItem("user", JSON.stringify(data));

    loadUser();

}

// ========================================
// SHOW TOAST
// ========================================

function showToast(message){

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(()=>{
        toast.classList.add("show");
    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{
            toast.remove();
        },300);

    },2500);

}
