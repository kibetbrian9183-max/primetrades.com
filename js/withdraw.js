// ======================================
// PRIMEVEST WITHDRAW
// ======================================

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

// Elements
const balance = document.getElementById("balance");
const phoneInput = document.getElementById("phone");
const amountInput = document.getElementById("amount");
const withdrawBtn = document.getElementById("withdrawBtn");
const status = document.getElementById("status");
const historyList = document.getElementById("withdrawHistory");

// Always get the latest user from localStorage
function refreshCurrentUser() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        currentUser.balance = Number(user.balance || 0);
        currentUser.phone = user.phone;
        currentUser.id = user.id;
    }
}

// Update balance
function updateBalance() {
    refreshCurrentUser();
    balance.textContent = "$" + Number(currentUser.balance || 0).toFixed(2);
}

updateBalance();

// Prefill phone
if (currentUser.phone) {
    phoneInput.value = currentUser.phone;
}

// Load withdrawal history
let withdrawals = JSON.parse(localStorage.getItem("withdrawals")) || [];

function loadHistory() {

    historyList.innerHTML = "";

    const userWithdrawals = withdrawals
        .filter(item => item.userId === currentUser.id)
        .reverse();

    if (userWithdrawals.length === 0) {
        historyList.innerHTML = "<li>No withdrawals yet.</li>";
        return;
    }

    userWithdrawals.forEach(item => {

        historyList.innerHTML += `
        <li>
            $${Number(item.amount).toFixed(2)} - ${item.status}<br>
            <small>${item.date}</small>
        </li>
        `;

    });

}

loadHistory();

// Withdraw
withdrawBtn.addEventListener("click", () => {

    refreshCurrentUser();

    const phone = phoneInput.value.trim();
    const amount = Number(amountInput.value);

    if (!phone) {
        status.style.color = "#ef4444";
        status.textContent = "Enter your M-Pesa number.";
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        status.style.color = "#ef4444";
        status.textContent = "Enter a valid amount.";
        return;
    }

    if (amount > Number(currentUser.balance)) {
        status.style.color = "#ef4444";
        status.textContent = "Insufficient wallet balance.";
        return;
    }

    withdrawBtn.disabled = true;
    withdrawBtn.innerHTML = "Processing...";

    status.style.color = "#facc15";
    status.textContent = "Submitting withdrawal...";

    setTimeout(() => {

        // Deduct balance
        currentUser.balance = Number(currentUser.balance) - amount;

        // Save current user
        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );

        // Update users array
        let users = JSON.parse(localStorage.getItem("users")) || [];

        users = users.map(user => {
            if (user.id === currentUser.id) {
                return currentUser;
            }
            return user;
        });

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        // Save history
        withdrawals.push({
            userId: currentUser.id,
            phone: phone,
            amount: amount,
            status: "Pending",
            date: new Date().toLocaleString()
        });

        localStorage.setItem(
            "withdrawals",
            JSON.stringify(withdrawals)
        );

        // Reload history
        withdrawals = JSON.parse(localStorage.getItem("withdrawals")) || [];

        updateBalance();
        loadHistory();

        amountInput.value = "";

        status.style.color = "#22c55e";
        status.textContent = "Withdrawal request submitted successfully.";

        withdrawBtn.disabled = false;
        withdrawBtn.innerHTML =
            '<i class="fa-solid fa-money-bill-transfer"></i> Withdraw';

    }, 2000);

});
