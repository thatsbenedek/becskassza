const items = [
    {name:'Üveges sör', price:269},
    {name:'Túró rudi', price:99},
    {name:'Tejsüti', price:149},
    {name:'Kúró Rudi (Xtra large)', price:199},
    {name:'Guru', price: 199}
];

let balance = 0;

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

function pay() {
    if (document.getElementById('amount-pay').value > 0) {
        let amount = document.getElementById('amount-pay').value;
        balance += parseInt(amount);
        localStorage.balance = balance;
        displayBalance();
    }
}

function setItemListeners() {
    let counter = 0;
    items.forEach(function(item) {
        document.getElementById(counter).addEventListener('click', function(){
            balance -= parseInt(items[parseInt(event.target.id)].price);
            localStorage.balance = balance;
            displayBalance();
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

    displayItems();
    displayBalance();

    document.getElementById('btn-pay').addEventListener('click', pay);
    setItemListeners();

    installServiceWorkerAsync();
}

startup();