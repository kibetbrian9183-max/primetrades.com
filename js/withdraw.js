// ======================================
// PRIMEVEST WITHDRAW
// ======================================

const USD_TO_KES = 130;

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

const balance = document.getElementById("balance");
const phoneInput = document.getElementById("phone");
const amountInput = document.getElementById("amount");
const withdrawBtn = document.getElementById("withdrawBtn");
const status = document.getElementById("status");
const historyList = document.getElementById("withdrawHistory");

// Display wallet balance (USD)
balance.textContent = "$" + Number(currentUser.balance || 0).toFixed(2);

// Prefill phone
if (currentUser.phone) {
    phoneInput.value = currentUser.phone;
}

// Load history
let withdrawals = JSON.parse(localStorage.getItem("withdrawals")) || [];

function loadHistory() {

    historyList.innerHTML = "";

    const userWithdrawals = withdrawals.filter(item => item.userId === currentUser.id);

    if (userWithdrawals.length === 0) {
        historyList.innerHTML = "<li>No withdrawals yet.</li>";
        return;
    }

    userWithdrawals.reverse().forEach(item => {

        historyList.innerHTML += `
        <li>
            KES ${Number(item.kesAmount).toLocaleString()} - ${item.status}<br>
            <small>${item.date}</small>
        </li>
        `;

    });

}

loadHistory();

// Withdraw
withdrawBtn.addEventListener("click", () => {

    let phone = phoneInput.value.trim();

    phone = phone.replace(/[\s\-+]/g, "");

    if (phone.startsWith("07") || phone.startsWith("01")) {
        phone = "254" + phone.substring(1);
    } else if (phone.startsWith("7") || phone.startsWith("1")) {
        phone = "254" + phone;
    }

    phone = phone.replace(/\D/g, "");

    if (!/^254(7|1)\d{8}$/.test(phone)) {
        status.style.color = "#ef4444";
        status.textContent = "Enter a valid Safaricom number.";
        return;
    }

    const kesAmount = Number(amountInput.value.replace(/[^\d.]/g, ""));

    if (isNaN(kesAmount) || kesAmount <= 0) {
        status.style.color = "#ef4444";
        status.textContent = "Enter a valid amount.";
        return;
    }

    const usdAmount = kesAmount / USD_TO_KES;

    if (usdAmount > Number(currentUser.balance || 0)) {
        status.style.color = "#ef4444";
        status.textContent = "Insufficient wallet balance.";
        return;
    }

    withdrawBtn.disabled = true;
    withdrawBtn.innerHTML = "Processing...";

    setTimeout(() => {

        currentUser.balance -= usdAmount;

        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        let users = JSON.parse(localStorage.getItem("users")) || [];

        users = users.map(user =>
            user.id === currentUser.id ? currentUser : user
        );

        localStorage.setItem("users", JSON.stringify(users));

        withdrawals.push({
            userId: currentUser.id,
            phone: phone,
            kesAmount: kesAmount,
            usdAmount: usdAmount,
            status: "Pending",
            date: new Date().toLocaleString()
        });

        localStorage.setItem("withdrawals", JSON.stringify(withdrawals));

        balance.textContent = "$" + currentUser.balance.toFixed(2);

        loadHistory();

        amountInput.value = "";

        status.style.color = "#22c55e";
        status.textContent = "Withdrawal request submitted successfully.";

        withdrawBtn.disabled = false;
        withdrawBtn.innerHTML =
            '<i class="fa-solid fa-money-bill-transfer"></i> Withdraw';

    }, 2000);

});    withdrawBtn.innerHTML = "Processing...";

    // Simulate processing
    setTimeout(() => {

        currentUser.balance -= amount;

        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );

        let users = JSON.parse(localStorage.getItem("users")) || [];

        users = users.map(user =>
            user.id === currentUser.id ? currentUser : user
        );

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

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

        balance.textContent =
            "$" + Number(currentUser.balance).toFixed(2);

        loadHistory();

        amountInput.value = "";

        status.style.color = "#22c55e";
        status.textContent =
            "Withdrawal request submitted successfully.";

        withdrawBtn.disabled = false;
        withdrawBtn.innerHTML =
            '<i class="fa-solid fa-money-bill-transfer"></i> Withdraw';

    }, 2000);

});
