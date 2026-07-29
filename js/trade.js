// ======================================
// PRIMEVEST TRADE - PART 1
// User, Wallet & UI Controls
// ======================================

// Logged-in user
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

// ===============================
// ELEMENTS
// ===============================

const balance = document.getElementById("balance");

const stakeInput = document.getElementById("stake");

const plusBtn = document.getElementById("plus");

const minusBtn = document.getElementById("minus");

const quickButtons = document.querySelectorAll(".quick button");

const marketButtons = document.querySelectorAll(".market");

const evenOddBox = document.getElementById("evenoddMarket");

const matchBox = document.getElementById("matchMarket");

const raiseBox = document.getElementById("raiseMarket");

const modeButtons = document.querySelectorAll(".modeBtn");

const depositBtn = document.getElementById("depositBtn");

// ===============================
// WALLET
// ===============================

function loadWallet() {

    balance.textContent =
        "$" + Number(currentUser.balance || 0).toFixed(2);

}

loadWallet();

// ===============================
// STAKE CONTROLS
// ===============================

plusBtn.addEventListener("click", () => {

    let value = Number(stakeInput.value);

    value += 1;

    stakeInput.value = value;

});

minusBtn.addEventListener("click", () => {

    let value = Number(stakeInput.value);

    if (value > 1) {

        value -= 1;

    }

    stakeInput.value = value;

});

// ===============================
// QUICK STAKE BUTTONS
// ===============================

quickButtons.forEach(button => {

    button.addEventListener("click", () => {

        stakeInput.value = button.textContent;

    });

});

// ===============================
// MARKET SWITCHING
// ===============================

marketButtons.forEach(button => {

    button.addEventListener("click", () => {

        marketButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        evenOddBox.classList.add("hidden");
        matchBox.classList.add("hidden");
        raiseBox.classList.add("hidden");

        const market = button.dataset.market;

        if (market === "evenodd") {

            evenOddBox.classList.remove("hidden");

        }

        if (market === "match") {

            matchBox.classList.remove("hidden");

        }

        if (market === "raise") {

            raiseBox.classList.remove("hidden");

        }

    });

});

// ===============================
// AUTO / MANUAL
// ===============================

modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        modeButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

    });

});

// ===============================
// DEPOSIT BUTTON
// ===============================

depositBtn.addEventListener("click", () => {

    window.location.href = "deposit.html";

});

// ===============================
// REFRESH BALANCE
// ===============================

window.addEventListener("focus", () => {

    currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {

        loadWallet();

    }

});
// ======================================
// PRIMEVEST TRADE - PART 2
// Live Market Chart
// ======================================

const canvas = document.getElementById("chartCanvas");
const ctx = canvas.getContext("2d");

const priceBox = document.getElementById("price");

// Canvas size
canvas.width = canvas.offsetWidth;
canvas.height = 320;

// Market data
let prices = [];
let currentPrice = 1000;

// Create initial prices
for(let i = 0; i < 60; i++){

    currentPrice += (Math.random() - 0.5) * 8;

    prices.push(currentPrice);

}

// Draw chart
function drawChart(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Background
    ctx.fillStyle="#0b1220";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Grid
    ctx.strokeStyle="#1e293b";
    ctx.lineWidth=1;

    for(let y=0;y<canvas.height;y+=40){

        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(canvas.width,y);
        ctx.stroke();

    }

    // Find range
    const max=Math.max(...prices);
    const min=Math.min(...prices);

    const range=max-min || 1;

    // Line
    ctx.beginPath();
    ctx.lineWidth=3;
    ctx.strokeStyle="#3b82f6";

    prices.forEach((value,index)=>{

        const x=index*(canvas.width/(prices.length-1));

        const y=canvas.height-
        ((value-min)/range)*canvas.height;

        if(index===0){

            ctx.moveTo(x,y);

        }else{

            ctx.lineTo(x,y);

        }

    });

    ctx.stroke();

}

// Update market every second
function updateMarket(){

    const previous=currentPrice;

    currentPrice += (Math.random()-0.5)*10;

    prices.push(currentPrice);

    if(prices.length>60){

        prices.shift();

    }

    priceBox.textContent=currentPrice.toFixed(2);

    if(currentPrice>previous){

        priceBox.classList.remove("price-down");
        priceBox.classList.add("price-up");

    }else{

        priceBox.classList.remove("price-up");
        priceBox.classList.add("price-down");

    }

    drawChart();

}

// Start
drawChart();

setInterval(updateMarket,1000);

// Resize support
window.addEventListener("resize",()=>{

    canvas.width=canvas.offsetWidth;
    canvas.height=320;

    drawChart();

});
// ======================================
// PRIMEVEST TRADE - PART 3
// Trading Engine
// ======================================

const buyButtons = document.querySelectorAll(".buy");
const sellButtons = document.querySelectorAll(".sell");
const matchDigit = document.getElementById("matchDigit");

let lastPrice = currentPrice;

// Execute trade
function executeTrade(type){

    const stake = Number(stakeInput.value);

    if(stake <= 0){
        alert("Enter a valid stake.");
        return;
    }

    if(stake > Number(currentUser.balance || 0)){
        alert("Insufficient balance.");
        return;
    }

    // Deduct stake immediately
    currentUser.balance -= stake;

    let win = false;

    const newPrice = currentPrice;
    const lastDigit = Math.floor(newPrice) % 10;

    // Even / Odd
    if(type === "EVEN"){

        win = lastDigit % 2 === 0;

    }else if(type === "ODD"){

        win = lastDigit % 2 !== 0;

    }

    // Matches / Differs
    else if(type === "MATCH"){

        win = lastDigit === Number(matchDigit.value);

    }else if(type === "DIFFER"){

        win = lastDigit !== Number(matchDigit.value);

    }

    // Raise / Fall
    else if(type === "RAISE"){

        win = newPrice > lastPrice;

    }else if(type === "FALL"){

        win = newPrice < lastPrice;

    }

    // 95% payout
    if(win){

        const payout = stake * 1.95;

        currentUser.balance += payout;

        alert(
            "🎉 WIN!\n\nPayout: $" +
            payout.toFixed(2)
        );

    }else{

        alert("❌ You Lost");

    }

    // Update last price
    lastPrice = currentPrice;

    // Save wallet
    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

    // Update users array
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

    loadWallet();

    // Save history
    let trades =
        JSON.parse(localStorage.getItem("trades")) || [];

    trades.push({

        userId: currentUser.id,

        market: document.querySelector(".market.active").textContent,

        trade: type,

        amount: stake,

        result: win ? "WIN" : "LOSS",

        balance: currentUser.balance,

        date: new Date().toLocaleString()

    });

    localStorage.setItem(
        "trades",
        JSON.stringify(trades)
    );

}

// EVEN buttons
buyButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        const text = button.textContent.trim();

        if(text.includes("EVEN")){

            executeTrade("EVEN");

        }

        if(text.includes("MATCH")){

            executeTrade("MATCH");

        }

        if(text.includes("RAISE")){

            executeTrade("RAISE");

        }

    });

});

// ODD buttons
sellButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        const text = button.textContent.trim();

        if(text.includes("ODD")){

            executeTrade("ODD");

        }

        if(text.includes("DIFFERS")){

            executeTrade("DIFFER");

        }

        if(text.includes("FALL")){

            executeTrade("FALL");

        }

    });

});
// ======================================
// PRIMEVEST TRADE - PART 4
// Animations & Trade Result
// ======================================

// Create result popup
const resultPopup = document.createElement("div");

resultPopup.id = "tradePopup";

resultPopup.style.cssText = `
position:fixed;
top:50%;
left:50%;
transform:translate(-50%,-50%);
background:#111827;
padding:25px;
border-radius:18px;
text-align:center;
box-shadow:0 15px 40px rgba(0,0,0,.5);
display:none;
z-index:9999;
min-width:260px;
`;

document.body.appendChild(resultPopup);

// Countdown
function countdown(seconds){

    return new Promise(resolve=>{

        let time = seconds;

        resultPopup.style.display="block";

        const timer=setInterval(()=>{

            resultPopup.innerHTML=`
            <h2>Trade Running</h2>
            <h1 style="margin:20px 0;color:#3b82f6;">
            ${time}
            </h1>
            <p>Please wait...</p>
            `;

            time--;

            if(time<0){

                clearInterval(timer);

                resolve();

            }

        },1000);

    });

}

// Show result
function showResult(win,payout){

    resultPopup.style.display="block";

    if(win){

        resultPopup.innerHTML=`

        <h1 style="color:#22c55e;">
        🎉 WIN
        </h1>

        <h2 style="margin:15px 0;">
        +$${payout.toFixed(2)}
        </h2>

        <p>Trade completed successfully.</p>

        `;

    }else{

        resultPopup.innerHTML=`

        <h1 style="color:#ef4444;">
        ❌ LOSS
        </h1>

        <h2 style="margin:15px 0;">
        Better luck next time
        </h2>

        <p>Your stake was lost.</p>

        `;

    }

    setTimeout(()=>{

        resultPopup.style.display="none";

    },2500);

}

// ======================================
// Replace executeTrade()
// ======================================

const oldExecuteTrade = executeTrade;

executeTrade = async function(type){

    await countdown(3);

    oldExecuteTrade(type);

};

// ======================================
// AUTO MODE
// ======================================

let autoTrading=false;

modeButtons.forEach(btn=>{

    btn.addEventListener("click",()=>{

        autoTrading =
        btn.textContent.trim()==="AUTO";

    });

});

// ======================================
// LIVE PRICE EFFECT
// ======================================

setInterval(()=>{

    if(currentPrice>lastPrice){

        priceBox.style.color="#22c55e";

    }else{

        priceBox.style.color="#ef4444";

    }

},1000);

// ======================================
// SAVE TRADE SUMMARY
// ======================================

function updateStatistics(){

    const trades=
    JSON.parse(localStorage.getItem("trades"))||[];

    const wins=
    trades.filter(t=>
    t.userId===currentUser.id &&
    t.result==="WIN").length;

    const losses=
    trades.filter(t=>
    t.userId===currentUser.id &&
    t.result==="LOSS").length;

    localStorage.setItem("tradeStats",
    JSON.stringify({

        wins,
        losses

    }));

}

updateStatistics();

// ======================================
// PAGE REFRESH
// ======================================

window.addEventListener("focus",()=>{

    currentUser=
    JSON.parse(localStorage.getItem("currentUser"));

    if(currentUser){

        loadWallet();

    }

});
