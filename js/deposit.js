// ======================================
// PRIMEVEST DEPOSIT
// ======================================

const API_BASE_URL = "https://smartpaypesa-backend.onrender.com";
const USD_TO_KES = 130;

// ======================================
// CHECK LOGIN
// ======================================

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

// ======================================
// ELEMENTS
// ======================================

const balance = document.getElementById("balance");
const phoneInput = document.getElementById("phone");
const amountInput = document.getElementById("amount");
const depositBtn = document.getElementById("depositBtn");
const statusBox = document.getElementById("status");
const historyList = document.getElementById("depositHistory");

// ======================================
// DISPLAY BALANCE
// ======================================

function updateBalance() {
    balance.textContent =
        "$" + Number(currentUser.balance || 0).toFixed(2);
}

updateBalance();

if (currentUser.phone) {
    phoneInput.value = currentUser.phone;
}

// ======================================
// LOAD HISTORY
// ======================================

let deposits = JSON.parse(localStorage.getItem("deposits")) || [];

function loadHistory() {

    historyList.innerHTML = "";

    const userDeposits = deposits
        .filter(item => item.userId === currentUser.id)
        .reverse();

    if (userDeposits.length === 0) {

        historyList.innerHTML =
            "<li>No deposits yet.</li>";

        return;
    }

    userDeposits.forEach(item => {

        historyList.innerHTML += `
            <li>
                KES ${Number(item.amount).toLocaleString()} - ${item.status}<br>
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

    phone = phone.replace(/\D/g, "");

    if (phone.startsWith("07") || phone.startsWith("01")) {
        phone = "254" + phone.substring(1);
    } else if (phone.startsWith("7") || phone.startsWith("1")) {
        phone = "254" + phone;
    }

    if (!/^254(7|1)\d{8}$/.test(phone)) {
        statusBox.style.color = "#ef4444";
        statusBox.textContent = "Enter a valid phone number.";
        return;
    }

    const amount = Number(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        statusBox.style.color = "#ef4444";
        statusBox.textContent = "Enter a valid amount.";
        return;
    }

    depositBtn.disabled = true;
    depositBtn.innerHTML = "Processing...";

    statusBox.style.color = "#facc15";
    statusBox.textContent = "Sending STK Push...";

    try {

        const response = await fetch(`${API_BASE_URL}/api/payment`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                phone,
                amount
            })

        });

        const data = await response.json();

        if (!data.success) {

            throw new Error(data.message || "Failed to send STK Push.");

        }

        statusBox.style.color = "#22c55e";
        statusBox.textContent =
            "STK Push sent. Complete payment on your phone.";

        const checkoutId = data.checkout_request_id;

        const interval = setInterval(async () => {

            try {

                const verify = await fetch(
                    `${API_BASE_URL}/api/local/${checkoutId}`
                );

                const payment = await verify.json();

                if (payment.status === "PENDING") {
                    return;
                }

                clearInterval(interval);

                if (payment.status !== "COMPLETED") {

                    statusBox.style.color = "#ef4444";
                    statusBox.textContent =
                        payment.resultDesc || "Payment failed.";

                    depositBtn.disabled = false;
                    depositBtn.innerHTML =
                        '<i class="fa-solid fa-wallet"></i> Deposit Now';

                    return;
                }

                // Convert KES to USD
                const usd = Number(payment.amount) / USD_TO_KES;

                currentUser.balance =
                    Number(currentUser.balance || 0) + usd;

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(currentUser)
                );

                let users =
                    JSON.parse(localStorage.getItem("users")) || [];

                users = users.map(user =>
                    user.id === currentUser.id
                        ? currentUser
                        : user
                );

                localStorage.setItem(
                    "users",
                    JSON.stringify(users)
                );

                deposits.push({

                    userId: currentUser.id,
                    amount: payment.amount,
                    usdAmount: usd,
                    receipt: payment.receipt,
                    status: "Completed",
                    date: new Date().toLocaleString()

                });

                localStorage.setItem(
                    "deposits",
                    JSON.stringify(deposits)
                );

                updateBalance();
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

    } catch (err) {

        statusBox.style.color = "#ef4444";
        statusBox.textContent = err.message;

        depositBtn.disabled = false;
        depositBtn.innerHTML =
            '<i class="fa-solid fa-wallet"></i> Deposit Now';

    }

});
