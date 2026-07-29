// ===============================
// PRIMEVEST DASHBOARD
// ===============================

// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    alert("Please login first.");
    window.location.href = "index.html";
}

// ===============================
// DISPLAY USER BALANCE
// ===============================

const balanceElement = document.getElementById("balance");

function formatCurrency(amount) {
    return "$" + Number(amount).toFixed(2);
}

balanceElement.textContent = formatCurrency(currentUser.balance || 0);

// ===============================
// MARKET CHART
// ===============================

const ctx = document.getElementById("marketChart").getContext("2d");

const labels = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00"
];

let prices = [
    120,
    128,
    125,
    132,
    138,
    136,
    142
];

const marketChart = new Chart(ctx, {

    type: "line",

    data: {

        labels: labels,

        datasets: [{

            label: "PrimeVest Market",

            data: prices,

            borderColor: "#3b82f6",

            backgroundColor: "rgba(59,130,246,0.15)",

            borderWidth: 3,

            fill: true,

            tension: 0.4,

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

                ticks: {

                    color: "#ffffff"

                },

                grid: {

                    color: "rgba(255,255,255,.05)"

                }

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

// ===============================
// LIVE MARKET SIMULATION
// ===============================

setInterval(() => {

    let lastPrice = prices[prices.length - 1];

    let nextPrice = lastPrice + (Math.random() * 8 - 4);

    nextPrice = Math.max(80, nextPrice);

    prices.shift();

    prices.push(Number(nextPrice.toFixed(2)));

    marketChart.data.datasets[0].data = prices;

    marketChart.update();

}, 2000);

// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

}
