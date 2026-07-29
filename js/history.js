// ======================================
// PRIMEVEST HISTORY
// ======================================

// Check Login
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

// Elements
const depositTotal = document.getElementById("depositTotal");
const withdrawTotal = document.getElementById("withdrawTotal");
const tradeTotal = document.getElementById("tradeTotal");
const historyList = document.getElementById("historyList");

// Load Data
const deposits = JSON.parse(localStorage.getItem("deposits")) || [];
const withdrawals = JSON.parse(localStorage.getItem("withdrawals")) || [];
const trades = JSON.parse(localStorage.getItem("trades")) || [];

// Filter current user's data
const userDeposits = deposits.filter(item => item.userId === currentUser.id);
const userWithdrawals = withdrawals.filter(item => item.userId === currentUser.id);
const userTrades = trades.filter(item => item.userId === currentUser.id);

// Totals
const totalDeposits = userDeposits.reduce((sum, item) => sum + Number(item.amount || 0), 0);
const totalWithdrawals = userWithdrawals.reduce((sum, item) => sum + Number(item.amount || 0), 0);

depositTotal.textContent = "$" + totalDeposits.toFixed(2);
withdrawTotal.textContent = "$" + totalWithdrawals.toFixed(2);
tradeTotal.textContent = userTrades.length;

// Merge History
let history = [];

// Deposits
userDeposits.forEach(item => {
    history.push({
        type: "deposit",
        amount: item.amount,
        status: item.status,
        date: item.date
    });
});

// Withdrawals
userWithdrawals.forEach(item => {
    history.push({
        type: "withdraw",
        amount: item.amount,
        status: item.status,
        date: item.date
    });
});

// Trades
userTrades.forEach(item => {
    history.push({
        type: "trade",
        amount: item.amount,
        status: item.result || "Completed",
        date: item.date
    });
});

// Sort newest first
history.sort((a, b) => new Date(b.date) - new Date(a.date));

// Display History
historyList.innerHTML = "";

if (history.length === 0) {

    historyList.innerHTML = `
        <p class="empty">
            No transactions found.
        </p>
    `;

} else {

    history.forEach(item => {

        let title = "";
        let icon = "";

        switch (item.type) {

            case "deposit":
                title = "Deposit";
                icon = "💰";
                break;

            case "withdraw":
                title = "Withdrawal";
                icon = "💸";
                break;

            case "trade":
                title = "Trade";
                icon = "📈";
                break;

        }

        historyList.innerHTML += `

        <div class="history-item ${item.type}">

            <div class="history-title">

                <h4>${icon} ${title}</h4>

                <span>${item.date}</span>

            </div>

            <p>
                Amount: $${Number(item.amount).toFixed(2)}
            </p>

            <p>
                Status: ${item.status}
            </p>

        </div>

        `;

    });

}
