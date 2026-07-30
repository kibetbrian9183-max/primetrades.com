// ===============================
// PRIMEVEST PROFILE
// profile.js
// ===============================

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");

// ===============================
// OPEN MENU
// ===============================

function showSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
}

// ===============================
// CLOSE MENU
// ===============================

function hideSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "auto";
}

openMenu.addEventListener("click", showSidebar);
closeMenu.addEventListener("click", hideSidebar);
overlay.addEventListener("click", hideSidebar);

// ===============================
// ACTIVE MENU
// ===============================

const menuItems = document.querySelectorAll(".menu li");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        document
            .querySelectorAll(".menu li")
            .forEach(li => li.classList.remove("active"));

        item.classList.add("active");

    });

});

// ===============================
// DARK MODE
// ===============================

const darkSwitch = document.querySelector(".switch input");

darkSwitch.addEventListener("change", function () {

    if (this.checked) {

        document.body.style.background = "#121722";

        document.querySelector(".sidebar").style.background = "#1b1f2a";

        document.querySelector(".topbar").style.background = "#161c28";

    } else {

        document.body.style.background = "#f5f5f5";

        document.querySelector(".sidebar").style.background = "#ffffff";

        document.querySelector(".topbar").style.background = "#ffffff";

    }

});

// ===============================
// MENU NAVIGATION
// ===============================

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        const text = item.innerText.trim();

        switch (text) {

            case "Account Settings":
                window.location.href = "settings.html";
                break;

            case "Deposit":
                window.location.href = "deposit.html";
                break;

            case "Withdraw":
                window.location.href = "withdraw.html";
                break;

            case "History":
                window.location.href = "history.html";
                break;

            case "Refer & Earn":
                window.location.href = "referral.html";
                break;

        }

    });

});

// ===============================
// LOGOUT
// ===============================

const logout = document.querySelector(".logout");

logout.addEventListener("click", () => {

    const confirmLogout = confirm("Are you sure you want to log out?");

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "index.html";

});

// ===============================
// LOAD USER
// ===============================

const user = JSON.parse(localStorage.getItem("user"));

if (user) {

    if (user.username) {
        document.getElementById("username").textContent = user.username;
    }

    if (user.email) {
        document.getElementById("email").textContent = user.email;
    }

}

// ===============================
// CLOSE MENU WITH ESC
// ===============================

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        hideSidebar();
    }

});

// ===============================
// SWIPE TO CLOSE (Mobile)
// ===============================

let startX = 0;

sidebar.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

sidebar.addEventListener("touchmove", e => {

    const currentX = e.touches[0].clientX;

    if (startX - currentX > 80) {
        hideSidebar();
    }

});

// ===============================
// END
// ===============================
