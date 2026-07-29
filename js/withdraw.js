// ======================================
// PRIMEVEST WITHDRAW
// ======================================

const USD_TO_KES = 130; // Exchange rate

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

// Display balance (USD)
balance.textContent = "$" + Number(currentUser.balance || 0).toFixed(2);

// Prefill phone
if (currentUser.phone) {
    phoneInput.value = currentUser.phone;
}

// Load withdrawal history
let withdrawals = JSON.parse(localStorage.getItem("withdrawals")) || [];

function loadHistory() {

    historyList.innerHTML = "";

    const userWithdrawals = withdrawals.filter(item => item.userId === currentUser.id);

    if (userWithdrawals.length === 0) {
        historyList.innerHTML = "<li>No withdrawals yet.</li>";
        return;
    }

    userWithdrawals.reverse().forEach(item => {

        const kesAmount = item.kesAmount ?? Math.round((item.usdAmount || item.amount) * USD_TO_KES);

        historyList.innerHTML += `
        <li>
            KES ${kesAmount.toLocaleString()} - ${item.status}<br>
            <small>${item.date}</small>
        </li>
        `;

    });

}

loadHistory();

// Withdraw button
withdrawBtn.addEventListener("click", () => {

    const phone = phoneInput.value.trim();
    const usdAmount = Number(amountInput.value);

    if (!phone || isNaN(usdAmount) || usdAmount <= 0) {
        status.style.color = "#ef4444";
        status.textContent = "Enter a valid phone number and amount.";
        return;
    }

    if (usdAmount > Number(currentUser.balance || 0)) {
        status.style.color = "#ef4444";
        status.textContent = "Insufficient balance.";
        return;
    }

    const kesAmount = Math.round(usdAmount * USD_TO_KES);

    withdrawBtn.disabled = true;
    withdrawBtn.innerHTML = "Processing...";

    // Simulate processing
    setTimeout(() => {

        // Deduct USD balance
        currentUser.balance -= usdAmount;

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

        // Save withdrawal
        withdrawals.push({
            userId: currentUser.id,
            phone: phone,
            usdAmount: usdAmount,
            kesAmount: kesAmount,
            status: "Pending",
            date: new Date().toLocaleString()
        });

        localStorage.setItem(
            "withdrawals",
            JSON.stringify(withdrawals)
        );

        // Update balance display
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
