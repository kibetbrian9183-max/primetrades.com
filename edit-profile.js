// =========================================
// PRIMEVEST
// edit-profile.js
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    previewProfileImage();
    saveProfile();
});

// =========================================
// LOAD USER DETAILS
// =========================================

function loadProfile() {

    const user = JSON.parse(localStorage.getItem("user")) || {};

    document.getElementById("username").value = user.username || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("country").value = user.country || "Kenya";

    const avatar = document.getElementById("avatar");

    if (user.profileImage) {

        avatar.innerHTML = `<img src="${user.profileImage}" alt="Profile">`;

    } else {

        const firstLetter = user.username
            ? user.username.charAt(0).toUpperCase()
            : "P";

        avatar.textContent = firstLetter;

    }

}

// =========================================
// IMAGE PREVIEW
// =========================================

function previewProfileImage() {

    const input = document.getElementById("profileImage");

    input.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            document.getElementById("avatar").innerHTML =
                `<img src="${e.target.result}" alt="Profile">`;

        };

        reader.readAsDataURL(file);

    });

}

// =========================================
// SAVE PROFILE
// =========================================

function saveProfile() {

    const form = document.getElementById("profileForm");

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const country = document.getElementById("country").value;

        let profileImage = "";

        const img = document.querySelector("#avatar img");

        if (img) {
            profileImage = img.src;
        }

        const user = {
            username,
            email,
            phone,
            country,
            profileImage
        };

        localStorage.setItem("user", JSON.stringify(user));

        showToast("Profile updated successfully.");

        setTimeout(() => {
            window.location.href = "settings.html";
        }, 1200);

    });

}

// =========================================
// TOAST MESSAGE
// =========================================

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    Object.assign(toast.style, {
        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#3f8cff",
        color: "#fff",
        padding: "14px 22px",
        borderRadius: "12px",
        fontSize: "15px",
        zIndex: "9999",
        opacity: "0",
        transition: ".3s"
    });

    setTimeout(() => {
        toast.style.opacity = "1";
    }, 100);

    setTimeout(() => {

        toast.style.opacity = "0";

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2500);

}

// =========================================
// OPTIONAL: REMOVE PROFILE PHOTO
// =========================================

function removeProfilePhoto() {

    const user = JSON.parse(localStorage.getItem("user")) || {};

    delete user.profileImage;

    localStorage.setItem("user", JSON.stringify(user));

    const avatar = document.getElementById("avatar");

    avatar.textContent = user.username
        ? user.username.charAt(0).toUpperCase()
        : "P";

}
