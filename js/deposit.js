// ======================================
// PRIMEVEST DEPOSIT
// ======================================

// Change this to your deployed backend
const API_BASE_URL = "https://investment-mpesa-backend.onrender.com";

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

// Prefill phone number if available
if (currentUser.phone) {
    phoneInput.value = currentUser.phone;
}

// ======================================
// LOAD HISTORY
// ======================================

let deposits = JSON.parse(localStorage.getItem("deposits")) || [];

function loadHistory() {

    historyList.innerHTML = "";

    if (deposits.length === 0) {
        historyList.innerHTML = "<li>No deposits yet.</li>";
        return;
    }

    deposits
        .filter(item => item.userId === currentUser.id)
        .reverse()
        .forEach(item => {

            historyList.innerHTML += `
                <li>
                    KES ${item.amount} - ${item.status}<br>
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

    const phone = phoneInput.value.trim();
    const amount = Number(amountInput.value);

    if (!phone || amount <= 0) {
        alert("Enter a valid phone number and amount.");
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

                phone: phone,
                amount: amount,
                accountReference: "PrimeVest Deposit",
                transactionDesc: "Wallet Deposit"

            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Payment failed.");
        }

        statusBox.style.color = "#22c55e";
        statusBox.textContent =
            "STK Push sent. Complete the payment on your phone.";

        // Demo update
        // Replace this with callback verification in production

        setTimeout(() => {

            currentUser.balance =
                Number(currentUser.balance || 0) + amount;

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

            deposits.push({

                userId: currentUser.id,
                amount: amount,
                status: "Completed",
                date: new Date().toLocaleString()

            });

            localStorage.setItem(
                "deposits",
                JSON.stringify(deposits)
            );

            loadHistory();

            amountInput.value = "";

        }, 5000);

    } catch (error) {

        statusBox.style.color = "#ef4444";
        statusBox.textContent = error.message;

    } finally {

        depositBtn.disabled = false;
        depositBtn.innerHTML =
            '<i class="fa-solid fa-wallet"></i> Deposit Now';

    }

});
