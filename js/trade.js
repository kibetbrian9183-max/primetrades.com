// ===================================
// PRIMEVEST TRADE
// ===================================

// Check login
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

// ================= USER BALANCE =================

const balanceElement = document.getElementById("userBalance");
balanceElement.textContent = "$" + Number(currentUser.balance || 0).toFixed(2);

// ================= LIVE PRICE =================

const livePrice = document.getElementById("livePrice");

let currentPrice = 64250.35;

function updatePrice() {

    const change = (Math.random() * 120 - 60);

    currentPrice += change;

    livePrice.textContent = "$" + currentPrice.toFixed(2);

    if (change >= 0) {

        livePrice.style.color = "#22c55e";

    } else {

        livePrice.style.color = "#ef4444";

    }

}

setInterval(updatePrice, 2000);

// ================= CHART =================

const ctx = document.getElementById("tradeChart").getContext("2d");

const labels = ["1","2","3","4","5","6","7","8","9","10"];

let chartData = [
    64000,
    64050,
    64120,
    64080,
    64180,
    64220,
    64160,
    64280,
    64210,
    64250
];

const chart = new Chart(ctx, {

    type: "line",

    data: {

        labels: labels,

        datasets: [{

            data: chartData,

            borderColor: "#3b82f6",

            backgroundColor: "rgba(59,130,246,.15)",

            borderWidth: 3,

            tension: .4,

            fill: true,

            pointRadius: 0

        }]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                display: false

            }

        },

        scales: {

            x: {

                display: false

            },

            y: {

                ticks: {

                    color: "#ffffff"

                },

                grid: {

                    color: "rgba(255,255,255,.05)"

                }

            }

        }

    }

});

// Update chart

setInterval(() => {

    chartData.shift();

    chartData.push(currentPrice);

    chart.data.datasets[0].data = chartData;

    chart.update();

},2000);

// ================= BUY / SELL =================

let tradeType = "BUY";

const buyBtn = document.getElementById("buyBtn");
const sellBtn = document.getElementById("sellBtn");

buyBtn.onclick = () => {

    tradeType = "BUY";

    buyBtn.style.opacity = "1";

    sellBtn.style.opacity = ".6";

}

sellBtn.onclick = () => {

    tradeType = "SELL";

    sellBtn.style.opacity = "1";

    buyBtn.style.opacity = ".6";

}

// ================= START TRADE =================

const startTrade = document.getElementById("startTrade");
const tradeStatus = document.getElementById("tradeStatus");
const historyList = document.getElementById("historyList");

startTrade.onclick = () => {

    const amount = Number(document.getElementById("tradeAmount").value);

    const duration = Number(document.getElementById("duration").value);

    if (amount <= 0) {

        alert("Enter a valid amount.");

        return;

    }

    if (amount > currentUser.balance) {

        alert("Insufficient balance.");

        return;

    }

    tradeStatus.innerHTML = "Trade running...";

    startTrade.disabled = true;

    setTimeout(() => {

        const win = Math.random() > 0.5;

        let message = "";

        if (win) {

            const profit = amount * 0.80;

            currentUser.balance += profit;

            message = `✅ ${tradeType} WIN +$${profit.toFixed(2)}`;

            tradeStatus.style.color = "#22c55e";

        } else {

            currentUser.balance -= amount;

            message = `❌ ${tradeType} LOSS -$${amount.toFixed(2)}`;

            tradeStatus.style.color = "#ef4444";

        }

        tradeStatus.innerHTML = message;

        balanceElement.textContent =
        "$" + currentUser.balance.toFixed(2);

        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );

        let users =
        JSON.parse(localStorage.getItem("users")) || [];

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

        const item = document.createElement("li");

        item.innerHTML =
        `${tradeType} | $${amount} | ${message}`;

        if (historyList.children[0]?.textContent ===
            "No trades yet.") {

            historyList.innerHTML = "";

        }

        historyList.prepend(item);

        startTrade.disabled = false;

    }, duration * 1000);

}
