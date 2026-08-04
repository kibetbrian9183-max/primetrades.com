// ======================================
// PRIMEVEST DEPOSIT
// ======================================

const API_BASE_URL = "https://smartpaypesa-backend.onrender.com";
const USD_TO_KES = 130; // Exchange Rate

// ======================================
// CHECK LOGIN
// ======================================

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

// ======================================
// DISPLAY BALANCE
// ======================================

const balance = document.getElementById("balance");
const phoneInput = document.getElementById("phone");
const amountInput = document.getElementById("amount");
const depositBtn = document.getElementById("depositBtn");
const statusBox = document.getElementById("status");
const historyList = document.getElementById("depositHistory");

balance.textContent = "$" + Number(currentUser.balance || 0).toFixed(2);

// Prefill phone
if (currentUser.phone) {
    phoneInput.value = currentUser.phone;
}

// ======================================
// LOAD HISTORY
// ======================================

let deposits = JSON.parse(localStorage.getItem("deposits")) || [];

function loadHistory() {

    historyList.innerHTML = "";

    const userDeposits = deposits.filter(item => item.userId === currentUser.id);

    if (userDeposits.length === 0) {
        historyList.innerHTML = "<li>No deposits yet.</li>";
        return;
    }

    userDeposits.reverse().forEach(item => {

        historyList.innerHTML += `
            <li>
                KES ${(item.kesAmount ?? item.amount).toLocaleString()} - ${item.status}<br>
                <small>${item.date}</small>
            </li>
        `;

    });

}

loadHistory();

// ======================================
// DEPOSIT
// ======================================

depositBtn.addEventListener("click", async () => {

    let phone = phoneInput.value.trim();

    // Remove spaces, dashes and +
    phone = phone.replace(/[\s\-+]/g, "");

    // Convert to 254 format
    if (phone.startsWith("07") || phone.startsWith("01")) {
        phone = "254" + phone.substring(1);
    } else if (phone.startsWith("7") || phone.startsWith("1")) {
        phone = "254" + phone;
    }

    phone = phone.replace(/\D/g, "");

    if (!/^254(7|1)\d{8}$/.test(phone)) {
        alert("Enter a valid Safaricom phone number.");
        return;
    }

    const amount = Number(
        amountInput.value.replace(/[^\d.]/g, "")
    );

    if (isNaN(amount) || amount <= 0) {
        alert("Enter a valid amount.");
        return;
    }

    depositBtn.disabled = true;
    depositBtn.innerHTML = "Processing...";
    statusBox.style.color = "#facc15";
    statusBox.textContent = "Sending STK Push...";

    try {

        const response = await fetch(`${API_BASE_URL}/api/mpesa/stkpush`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                phone,
                amount,
                accountReference: "PrimeVest Deposit",
                transactionDesc: "Wallet Deposit",
                purpose: "deposit"
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Payment failed.");
        }

        statusBox.style.color = "#22c55e";
        statusBox.textContent =
            "STK Push sent. Complete payment on your phone.";

        const checkoutRequestId = data.checkoutRequestId;

// Check payment status every 3 seconds
const interval = setInterval(async () => {

    try {

        const res = await fetch(
            `${API_BASE_URL}/api/mpesa/status/${checkoutRequestId}`
        );

        const payment = await res.json();

        if (payment.status === "pending") {
            return;
        }

        clearInterval(interval);

        if (payment.status === "failed") {

            statusBox.style.color = "#ef4444";
            statusBox.textContent =
                payment.failureReason || "Payment failed.";

            depositBtn.disabled = false;
            depositBtn.innerHTML =
                '<i class="fa-solid fa-wallet"></i> Deposit Now';

            return;
        }

        // Convert deposited KES to USD
        const usdAmount = Number(payment.amountPaid) / USD_TO_KES;

        // Credit wallet
        currentUser.balance =
            Number(currentUser.balance || 0) + usdAmount;

        balance.textContent =
            "$" + currentUser.balance.toFixed(2);

        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        users = users.map(user =>
            user.id === currentUser.id ? currentUser : user
        );

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        // Save deposit history in KES
        deposits.push({
            userId: currentUser.id,
            amount: Number(payment.amountPaid),
            usdAmount: usdAmount,
            mpesaReceipt: payment.mpesaReceipt,
            status: "Completed",
            date: new Date().toLocaleString()
        });

        localStorage.setItem(
            "deposits",
            JSON.stringify(deposits)
        );

        loadHistory();

        amountInput.value = "";

        statusBox.style.color = "#22c55e";
        statusBox.textContent =
            "Deposit completed successfully.";

        depositBtn.disabled = false;
        depositBtn.innerHTML =
            '<i class="fa-solid fa-wallet"></i> Deposit Now';

    } catch (err) {

        clearInterval(interval);

        statusBox.style.color = "#ef4444";
        statusBox.textContent =
            "Unable to verify payment.";

        depositBtn.disabled = false;
        depositBtn.innerHTML =
            '<i class="fa-solid fa-wallet"></i> Deposit Now';

    }

}, 3000);

// Stop checking after 2 minutes
setTimeout(() => {

    clearInterval(interval);

    if (depositBtn.disabled) {

        depositBtn.disabled = false;
        depositBtn.innerHTML =
            '<i class="fa-solid fa-wallet"></i> Deposit Now';

        statusBox.style.color = "#ef4444";
        statusBox.textContent =
            "Payment verification timed out.";

    }

}, 120000);
            } catch (error) {

        statusBox.style.color = "#ef4444";
        statusBox.textContent =
            error.message || "Failed to send STK Push.";

        depositBtn.disabled = false;
        depositBtn.innerHTML =
            '<i class="fa-solid fa-wallet"></i> Deposit Now';

    }

});
