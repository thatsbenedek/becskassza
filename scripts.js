const items = [
    {name:'Üveges sör', price:269},
    {name:'Cider', price:329},
    {name:'Normál rudi', price:119},
    {name:'Óriás rudi', price:169},
    {name:'Guru', price:199},
    {name:'Bor', price:899}
];

let balance = 0;
let history = [];
const vibrationLength = 100;
const historyDisplayLimit = 10;

function displayItems() {
    const firstColunm = document.getElementById('products-first');
    const secondColumn = document.getElementById('products-second');
    let flag = 'first';
    let counter = 0;

    items.forEach(function(item) {
        let string = '<div class="card shadow-sm bg-light"><div class="card-body"><h5 class="card-title">' + item.name + '</h5><h6 class="card-subtitle mb-2 text-muted">HUF ' + item.price + '</h6><button class="btn btn-link stretched-link" id="' + counter + '">Hozzáadás</button></div>';
        if (flag === 'first') {
            firstColunm.insertAdjacentHTML('beforeend', string);
            flag = 'second';
        } else {
            secondColumn.insertAdjacentHTML('beforeend', string);
            flag = 'first';
        }
        counter++;
    });
}

function displayBalance() {
    const balanceAlert = document.getElementById('balance-alert');
    const balanceDisplay = document.getElementById('balance');
    let string = 'HUF ' + balance;
    balanceDisplay.textContent = string;
    
    if ((parseInt(balance) > 0) ||
        (parseInt(balance) === 0)) {
        balanceAlert.classList.remove('alert-danger');
        balanceAlert.classList.add('alert-success');
    } else {
        balanceAlert.classList.remove('alert-success');
        balanceAlert.classList.add('alert-danger');
    }
}

function displayHistory() {
    const table = document.getElementById('history-table');
    table.innerHTML = '';

    const historyEventCount = history.length;
    let historyEventDisplayLocalLimit = historyEventCount - historyDisplayLimit;
    if (historyEventDisplayLocalLimit < 0)
        historyEventDisplayLocalLimit = 0;

    for(let i = historyEventCount-1; i >= historyEventDisplayLocalLimit; i--) {
        let item = history[i];
        let row = '<tr class="history-event-' + item.type + '">';
        row += '<td class="timestamp">' + formatDate(item.timestamp) + '</td>';
        row += '<td class="comment">' + item.comment + '</td class="comment">';
        row += '<td class="amount">HUF ' + (item.type == "pay" ? "+" : "-") + item.amount + '</td class="amount">';
        row += '</tr>';
        table.insertAdjacentHTML('beforeend', row);
    }
}

function formatDate(timestamp) {
    let dateObj = new Date(0);
    dateObj.setUTCSeconds(timestamp/1000);
    let str = dateObj.getFullYear() + '. ';
    let m = dateObj.getMonth() + 1;
    str += ((m < 10) ? '0' : '') + m + '. ';
    let d = dateObj.getDate();
    str += ((d < 10) ? '0' : '') + d + '. ';
    let h = dateObj.getHours();
    str += ((h < 10) ? '0' : '') + h + ':';
    let i = dateObj.getMinutes();
    str += ((i < 10) ? '0' : '') + i;
    return str;
}

function addHistoryEvent(type, amount, comment) {
    history.push({
        'type': type,
        'amount': amount,
        'comment': comment,
        'timestamp': (new Date()).getTime()
    });
    localStorage.history = JSON.stringify(history);
}

function pay() {
    if (document.getElementById('amount-pay').value > 0) {
        navigator.vibrate(vibrationLength);
        let amount = document.getElementById('amount-pay').value;
        balance += parseInt(amount);
        localStorage.balance = balance;
        addHistoryEvent('pay', amount, 'befizetés');
        displayBalance();
        displayHistory();
        document.getElementById('amount-pay').value = '';
    }
}

function setItemListeners() {
    let counter = 0;
    items.forEach(function(item) {
        document.getElementById(counter).addEventListener('click', function(){
            navigator.vibrate(vibrationLength);
            let itemData = items[parseInt(event.target.id)];
            balance -= parseInt(itemData.price);
            localStorage.balance = balance;
            addHistoryEvent('buy', itemData.price, itemData.name);
            displayBalance();
            displayHistory();
        });
        counter++;
    });
}

async function installServiceWorkerAsync() {
    if ('serviceWorker' in navigator) {
        try {
            let serviceWorker = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service worker registered.');
        } catch (err) {
            console.error('Failed to register service worker.');
        }
    }
}

function startup() {
    if (localStorage.balance) {
        balance = parseInt(localStorage.balance);
    } else {
        localStorage.balance = balance;
    }

    if (localStorage.history) {
        history = JSON.parse(localStorage.history);
    } else {
        localStorage.history = JSON.stringify(history);
    }
   

    displayItems();
    displayBalance();
    displayHistory();

    document.getElementById('btn-pay').addEventListener('click', pay);
    setItemListeners();

    installServiceWorkerAsync();
}

startup();
