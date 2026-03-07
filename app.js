const DEFAULT_INVENTORY = {
    Mango: { qty: 200, max: 200, unit: 'units', isFlavor: true, priceSmall: 300, priceLarge: 450 },
    Apple: { qty: 150, max: 150, unit: 'units', isFlavor: true, priceSmall: 350, priceLarge: 500 },
    Orange: { qty: 180, max: 200, unit: 'units', isFlavor: true, priceSmall: 250, priceLarge: 400 },
    Sugar: { qty: 5000, max: 5000, unit: 'g', isFlavor: false },
    Cups: { qty: 100, max: 500, unit: 'pcs', isFlavor: false },
};

const DEFAULT_PRICES = { Small: 300, Large: 450 };

let state = {
    orders: [],
    inventory: JSON.parse(JSON.stringify(DEFAULT_INVENTORY)),
    prices: JSON.parse(JSON.stringify(DEFAULT_PRICES)),
    filter: 'all' // all, pending, done
};

let selectedFlavor = 'Mango'; // Default

// Initialize app
function init() {
    loadData();
    renderAll();
    setupPWA();
}

// Data persistence
function loadData() {
    const saved = localStorage.getItem('juiceDashState');
    if (saved) {
        state = JSON.parse(saved);
        // Fallbacks
        for (let item in DEFAULT_INVENTORY) {
            if (!state.inventory[item]) state.inventory[item] = { ...DEFAULT_INVENTORY[item] };
        }
        if (!state.prices) {
            state.prices = { ...DEFAULT_PRICES };
        }
        // Initialize isFlavor for old data compatibility
        for (let key in state.inventory) {
            if (state.inventory[key].isFlavor === undefined) {
                if (key === 'Mango' || key === 'Apple' || key === 'Orange') {
                    state.inventory[key].isFlavor = true;
                    state.inventory[key].priceSmall = state.prices?.Small || 300;
                    state.inventory[key].priceLarge = state.prices?.Large || 450;
                } else {
                    state.inventory[key].isFlavor = false;
                }
            } else if (state.inventory[key].isFlavor && state.inventory[key].priceSmall === undefined) {
                state.inventory[key].priceSmall = state.prices?.Small || 300;
                state.inventory[key].priceLarge = state.prices?.Large || 450;
            }
        }
    }
}

function saveData() {
    localStorage.setItem('juiceDashState', JSON.stringify(state));
}

// Navigation
function navigate(targetId) {
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.target === targetId) {
            btn.className = "nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-juice-orange bg-orange-50";
        } else {
            btn.className = "nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-gray-500 hover:text-juice-orange hover:bg-orange-50/50";
        }
    });

    document.querySelectorAll('.nav-btn-mobile').forEach(btn => {
        if (btn.dataset.target === targetId) {
            btn.className = "nav-btn-mobile flex flex-col items-center p-2 text-juice-orange";
        } else {
            btn.className = "nav-btn-mobile flex flex-col items-center p-2 text-gray-400 hover:text-juice-orange transition-colors";
        }
    });

    if (targetId === 'settings') {
        renderSettings();
    }
}

// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('bg-gray-900', 'text-white');
            b.classList.add('bg-gray-100', 'text-gray-600');
        });
        e.target.classList.remove('bg-gray-100', 'text-gray-600');
        e.target.classList.add('bg-gray-900', 'text-white');
        state.filter = e.target.dataset.filter;
        renderOrders();
    });
});

// Render Core
function renderAll() {
    renderStats();
    renderOrders();
    renderInventory();
    renderAnalytics();
    renderFlavorPicker();
    renderSettings();
}

function renderStats() {
    const today = new Date().toDateString();

    // Calculate using dynamic state prices instead of global PRICES
    const sales = state.orders
        .filter(o => new Date(o.date).toDateString() === today && o.status === 'done')
        .reduce((sum, o) => sum + (o.price || 0), 0);

    document.getElementById('statSales').textContent = `Rs ${sales.toLocaleString()}`;

    const active = state.orders.filter(o => o.status === 'pending').length;
    document.getElementById('statOrders').textContent = active;

    let lowStockCount = 0;
    for (let key in state.inventory) {
        const item = state.inventory[key];
        const ratio = item.qty / item.max;
        if (ratio <= 0.25) lowStockCount++;
    }

    document.getElementById('statStock').textContent = `${lowStockCount} Item${lowStockCount !== 1 ? 's' : ''}`;

    if (lowStockCount > 0) {
        document.getElementById('statStock').classList.add('text-red-600');
        document.getElementById('statStock').classList.remove('text-green-600');
    } else {
        document.getElementById('statStock').classList.remove('text-red-600');
        document.getElementById('statStock').classList.add('text-green-600');
    }
}

function getFlavorsList() {
    return Object.keys(state.inventory).filter(k => state.inventory[k].isFlavor);
}

function renderFlavorPicker() {
    const flavors = getFlavorsList();
    if (flavors.length > 0 && !flavors.includes(selectedFlavor)) selectedFlavor = flavors[0];

    const container = document.getElementById('flavorSelect');
    container.innerHTML = flavors.map(f => `
        <label class="cursor-pointer" onclick="selectedFlavor='${f}'">
            <input type="radio" name="flavor" value="${f}" class="peer sr-only" ${f === selectedFlavor ? 'checked' : ''}>
            <div class="text-center py-2 border-2 border-gray-100 rounded-xl peer-checked:border-juice-orange peer-checked:bg-orange-50 peer-checked:text-juice-orange font-medium transition text-sm flex flex-col items-center">
                <span>${f}</span>
                <span class="text-[10px] text-gray-500 font-bold">Rs ${state.inventory[f].priceSmall} / Rs ${state.inventory[f].priceLarge}</span>
            </div>
        </label>
    `).join('');
}

function submitOrder() {
    const size = document.querySelector('input[name="size"]:checked').value;
    const sugar = document.querySelector('input[name="sugar"]:checked').value;
    const flavor = selectedFlavor;

    if (!flavor) return alert("Please select a flavor!");

    if (state.inventory[flavor]) {
        state.inventory[flavor].qty = Math.max(0, state.inventory[flavor].qty - (size === 'Large' ? 2 : 1));
    }
    if (state.inventory.Cups) {
        state.inventory.Cups.qty = Math.max(0, state.inventory.Cups.qty - 1);
    }

    if (sugar === 'Yes' && state.inventory.Sugar) {
        state.inventory.Sugar.qty = Math.max(0, state.inventory.Sugar.qty - (size === 'Large' ? 20 : 10));
    }

    const total = size === 'Small' ? state.inventory[flavor].priceSmall : state.inventory[flavor].priceLarge;

    const newOrder = {
        id: Date.now(),
        flavor,
        size,
        sugar,
        status: 'pending',
        price: total,
        date: new Date().toISOString()
    };

    state.orders.unshift(newOrder);
    document.getElementById('addOrderModal').classList.add('hidden');
    saveData();
    renderAll();
}

function toggleOrderStatus(id) {
    const order = state.orders.find(o => o.id === id);
    if (order) {
        order.status = order.status === 'pending' ? 'done' : 'pending';
        saveData();
        renderAll();
    }
}

function renderOrders() {
    const list = document.getElementById('ordersList');
    const recentList = document.getElementById('recentOrdersList');

    const filtered = state.orders.filter(o => state.filter === 'all' || o.status === state.filter);

    if (filtered.length === 0) {
        list.innerHTML = `<div class="p-8 text-center text-gray-500">No orders found.</div>`;
    } else {
        list.innerHTML = filtered.map(o => createOrderHTML(o, true)).join('');
    }

    const pending = state.orders.filter(o => o.status === 'pending').slice(0, 3);
    if (pending.length === 0) {
        recentList.innerHTML = `<p class="text-sm text-gray-500">No pending orders.</p>`;
    } else {
        recentList.innerHTML = pending.map(o => createOrderHTML(o, false)).join('');
    }
}

function createOrderHTML(o, showActions) {
    const isDone = o.status === 'done';
    const bg = isDone ? 'bg-gray-50' : 'bg-white';
    const badge = isDone ?
        `<span class="px-2.5 py-1 bg-green-100 text-juice-green text-xs font-bold rounded-lg uppercase tracking-wide">Done</span>` :
        `<span class="px-2.5 py-1 bg-orange-100 text-juice-orange text-xs font-bold rounded-lg uppercase tracking-wide">Pending</span>`;

    const time = new Date(o.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
        <li class="p-4 ${bg} hover:bg-gray-50 transition border-l-4 ${isDone ? 'border-green-400' : 'border-juice-orange'}">
            <div class="flex items-center justify-between gap-4">
                <div class="flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                    <div class="flex items-center gap-3">
                        ${badge}
                        <b class="text-gray-800 text-lg">${o.flavor}</b>
                    </div>
                    <div class="text-sm text-gray-500 flex items-center gap-2">
                        <span>${o.size}</span>
                        <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>${o.sugar === 'Yes' ? 'Sugar' : 'No Sugar'}</span>
                        <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>${time}</span>
                    </div>
                </div>
                ${showActions ? `
                <div class="flex items-center gap-2">
                    <span class="font-bold text-gray-800 hidden sm:block">Rs ${o.price || 0}</span>
                    <button onclick="toggleOrderStatus(${o.id})" class="p-2 rounded-xl border ${isDone ? 'border-gray-200 text-gray-400 hover:text-gray-600' : 'border-green-200 bg-green-50 text-juice-green hover:bg-green-100'} transition" title="Toggle Status">
                        <i class="ph-bold ph-check text-lg"></i>
                    </button>
                </div>
                ` : `
                <div class="flex items-center gap-2">
                    <span class="font-bold text-gray-800">Rs ${o.price || 0}</span>
                    <button onclick="toggleOrderStatus(${o.id})" class="text-juice-green bg-green-50 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-100 transition whitespace-nowrap"><i class="ph-bold ph-check"></i> Done</button>
                </div>
                `}
            </div>
        </li>
    `;
}

function renderInventory() {
    const tbody = document.getElementById('inventoryTable');

    tbody.innerHTML = Object.keys(state.inventory).map(key => {
        const item = state.inventory[key];
        const ratio = item.qty / item.max;
        const width = Math.max(0, Math.min(100, ratio * 100));

        let colorClass = 'bg-juice-green';
        let statusBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-juice-green">Good</span>`;
        if (ratio <= 0.25) {
            colorClass = 'bg-red-500';
            statusBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-md bg-red-100 text-red-600">Low</span>`;
        } else if (ratio <= 0.5) {
            colorClass = 'bg-yellow-400';
            statusBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-md bg-yellow-100 text-yellow-700">Medium</span>`;
        }

        return `
            <tr class="hover:bg-gray-50 border-b border-gray-50 last:border-0 transition">
                <td class="p-4">
                    <div class="font-bold text-gray-800 flex items-center gap-2">
                        ${key}
                        ${item.isFlavor ? '<span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] uppercase font-bold rounded">Flavor</span>' : ''}
                    </div>
                </td>
                <td class="p-4 w-1/3 min-w-[150px]">
                    <div class="flex items-center justify-between mb-1 text-xs font-medium text-gray-500">
                        <span>${item.qty} ${item.unit}</span>
                        <span>${item.max} ${item.unit}</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div class="${colorClass} h-2 rounded-full transition-all duration-500" style="width: ${width}%"></div>
                    </div>
                </td>
                <td class="p-4">
                    ${statusBadge}
                </td>
                <td class="p-4 text-right">
                    <button onclick="restockItem('${key}')" class="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition shadow-sm">
                        Restock
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function restockItem(key) {
    if (state.inventory[key]) {
        state.inventory[key].qty = state.inventory[key].max;
        saveData();
        renderAll();

        // Custom visual toast for restocked item
        const toast = document.createElement('div');
        toast.className = 'fixed top-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-xl fade-in z-[200] flex items-center gap-2';
        toast.innerHTML = `<i class="ph-fill ph-check-circle text-juice-green text-lg"></i> ${key} restocked!`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }
}

function renderAnalytics() {
    const container = document.getElementById('analyticsChart');
    const today = new Date().toDateString();

    const todayOrders = state.orders.filter(o => new Date(o.date).toDateString() === today);

    const countByFlavor = {};
    todayOrders.forEach(o => {
        countByFlavor[o.flavor] = (countByFlavor[o.flavor] || 0) + 1;
    });

    const flavors = Object.keys(countByFlavor);
    if (flavors.length === 0) {
        container.innerHTML = `<div class="h-40 flex items-center justify-center text-gray-400">No data for today yet</div>`;
        return;
    }

    const maxCount = Math.max(...Object.values(countByFlavor));

    container.innerHTML = flavors.sort((a, b) => countByFlavor[b] - countByFlavor[a]).map(flavor => {
        const count = countByFlavor[flavor];
        const width = (count / maxCount) * 100;
        return `
            <div>
                <div class="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                    <span>${flavor}</span>
                    <span class="text-gray-500">${count} orders</span>
                </div>
                <div class="w-full bg-orange-50 rounded-lg h-3 overflow-hidden">
                    <div class="bg-juice-orange h-3 rounded-lg" style="width: ${width}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Settings Handlers
function renderSettings() {
    const pContainer = document.getElementById('settingsPrices');
    if (pContainer) {
        pContainer.innerHTML = '<div class="text-sm text-gray-500 mb-2">Global Prices are disabled. Prices are now set per flavor below.</div>';
    }

    const jContainer = document.getElementById('settingsJuices');
    if (jContainer) {
        jContainer.innerHTML = Object.keys(state.inventory).map(key => {
            const item = state.inventory[key];
            const priceInputs = item.isFlavor ? `
                <div class="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                    <div class="flex-1">
                        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Sm Price (Rs)</label>
                        <input type="number" step="10" onchange="updateJuiceProp('${key}', 'priceSmall', this.value)" value="${item.priceSmall || 0}" class="w-full bg-white border border-gray-200 rounded py-1 px-2 text-sm outline-none mt-1">
                    </div>
                    <div class="flex-1">
                        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Lg Price (Rs)</label>
                        <input type="number" step="10" onchange="updateJuiceProp('${key}', 'priceLarge', this.value)" value="${item.priceLarge || 0}" class="w-full bg-white border border-gray-200 rounded py-1 px-2 text-sm outline-none mt-1">
                    </div>
                </div>
            ` : '';
            return `
                <div class="p-4 border border-gray-100 rounded-xl bg-gray-50 flex items-start gap-3">
                    <div class="flex-1">
                        <div class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                           ${key} 
                           ${item.isFlavor ? '<span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] uppercase font-bold rounded">Flavor</span>' : '<span class="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] uppercase font-bold rounded">Supply</span>'}
                        </div>
                        <div class="flex gap-2">
                            <div class="flex-1">
                                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Max Stock</label>
                                <input type="number" onchange="updateJuiceProp('${key}', 'max', this.value)" value="${item.max}" class="w-full bg-white border border-gray-200 rounded py-1 px-2 text-sm outline-none mt-1">
                            </div>
                            <div class="flex-1">
                                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Unit</label>
                                <input type="text" onchange="updateJuiceProp('${key}', 'unit', this.value)" value="${item.unit}" class="w-full bg-white border border-gray-200 rounded py-1 px-2 text-sm outline-none mt-1">
                            </div>
                        </div>
                        ${priceInputs}
                    </div>
                </div>
            `;
        }).join('');
    }
}

function updateJuiceProp(key, prop, value) {
    if (state.inventory[key]) {
        if (prop === 'max') {
            state.inventory[key][prop] = parseInt(value, 10) || 0;
            // Prevent qty > max
            if (state.inventory[key].qty > state.inventory[key].max) {
                state.inventory[key].qty = state.inventory[key].max;
            }
        } else if (prop === 'priceSmall' || prop === 'priceLarge') {
            state.inventory[key][prop] = parseFloat(value) || 0;
        } else {
            state.inventory[key][prop] = value;
        }
        saveData();
        renderAll();
    }
}

function saveSettings() {
    for (let size in state.prices) {
        const input = document.getElementById('price_' + size);
        if (input) {
            state.prices[size] = parseFloat(input.value) || 0;
        }
    }
    saveData();
    renderAll();

    const btn = document.querySelector('#settings button');
    btn.innerHTML = "Saved!";
    setTimeout(() => btn.innerHTML = "Save Prices", 1000);
}

function addNewJuice() {
    const defaultName = prompt("Enter new juice flavor name (e.g. Pineapple):");
    if (defaultName && defaultName.trim() !== '') {
        const name = defaultName.trim();
        if (state.inventory[name]) {
            alert("This item already exists!");
            return;
        }
        const initialMax = parseInt(prompt("Enter Maximum Stock level (e.g. 150):"), 10) || 100;

        state.inventory[name] = {
            qty: initialMax,
            max: initialMax,
            unit: 'units',
            isFlavor: true,
            priceSmall: 300,
            priceLarge: 450
        };

        saveData();
        renderAll();
    }
}

// PWA Install Prompt
let deferredPrompt;

function setupPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const deskBtn = document.getElementById('installAppContainerDesktop');
        if (deskBtn) deskBtn.classList.remove('hidden');
        const mobBtn = document.getElementById('installAppBtnMobile');
        if (mobBtn) mobBtn.classList.remove('hidden');
    });

    const installHandler = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                deferredPrompt = null;
                document.getElementById('installAppContainerDesktop').classList.add('hidden');
                document.getElementById('installAppBtnMobile').classList.add('hidden');
            }
        }
    };

    const deskBtn = document.getElementById('installAppBtnDesktop');
    if (deskBtn) deskBtn.addEventListener('click', installHandler);

    const mobBtn = document.getElementById('installAppBtnMobile');
    if (mobBtn) mobBtn.addEventListener('click', installHandler);
}

// Boot
document.addEventListener('DOMContentLoaded', init);
