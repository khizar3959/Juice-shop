// State structure
const DEFAULT_INVENTORY = {
    Mango: { qty: 200, max: 200, unit: 'units' },
    Apple: { qty: 150, max: 150, unit: 'units' },
    Orange: { qty: 180, max: 200, unit: 'units' },
    Sugar: { qty: 5000, max: 5000, unit: 'g' },
    Cups: { qty: 100, max: 500, unit: 'pcs' },
};

// Prices to calculate sales
const PRICES = { Small: 4.00, Large: 6.50 };

let state = {
    orders: [],
    inventory: JSON.parse(JSON.stringify(DEFAULT_INVENTORY)),
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
        // Fallback for new inventory items if changed later
        for (let item in DEFAULT_INVENTORY) {
            if (!state.inventory[item]) state.inventory[item] = { ...DEFAULT_INVENTORY[item] };
        }
    }
}

function saveData() {
    localStorage.setItem('juiceDashState', JSON.stringify(state));
}

// Navigation
function navigate(targetId) {
    // Hide all
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    // Show target
    document.getElementById(targetId).classList.add('active');

    // Update active nav buttons desktop
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.target === targetId) {
            btn.className = "nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-juice-orange bg-orange-50";
        } else {
            btn.className = "nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-gray-500 hover:text-juice-orange hover:bg-orange-50/50";
        }
    });

    // Update active nav buttons mobile
    document.querySelectorAll('.nav-btn-mobile').forEach(btn => {
        if (btn.dataset.target === targetId) {
            btn.className = "nav-btn-mobile flex flex-col items-center p-2 text-juice-orange";
        } else {
            btn.className = "nav-btn-mobile flex flex-col items-center p-2 text-gray-400 hover:text-juice-orange transition-colors";
        }
    });
}

// Setup Modals and Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Reset styles
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('bg-gray-900', 'text-white');
            b.classList.add('bg-gray-100', 'text-gray-600');
        });
        // Set active style
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
}

// 1. Dashboard Stats
function renderStats() {
    const today = new Date().toDateString();

    // Sales today
    const sales = state.orders
        .filter(o => new Date(o.date).toDateString() === today && o.status === 'done')
        .reduce((sum, o) => sum + PRICES[o.size], 0);

    document.getElementById('statSales').textContent = `$${sales.toFixed(2)}`;

    // Active orders
    const active = state.orders.filter(o => o.status === 'pending').length;
    document.getElementById('statOrders').textContent = active;

    // Low stock
    let lowStockCount = 0;
    for (let key in state.inventory) {
        const item = state.inventory[key];
        const ratio = item.qty / item.max;
        if (ratio <= 0.25) lowStockCount++; // warning threshold at 25%
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

// 2. Add Order Logic
function renderFlavorPicker() {
    const flavors = ['Mango', 'Apple', 'Orange'];
    const container = document.getElementById('flavorSelect');
    container.innerHTML = flavors.map(f => `
        <label class="cursor-pointer" onclick="selectedFlavor='${f}'">
            <input type="radio" name="flavor" value="${f}" class="peer sr-only" ${f === selectedFlavor ? 'checked' : ''}>
            <div class="text-center py-2 border-2 border-gray-100 rounded-xl peer-checked:border-juice-orange peer-checked:bg-orange-50 peer-checked:text-juice-orange font-medium transition text-sm">
                ${f}
            </div>
        </label>
    `).join('');
}

function submitOrder() {
    const size = document.querySelector('input[name="size"]:checked').value;
    const sugar = document.querySelector('input[name="sugar"]:checked').value;
    const flavor = selectedFlavor;

    if (state.inventory[flavor]) {
        state.inventory[flavor].qty = Math.max(0, state.inventory[flavor].qty - (size === 'Large' ? 2 : 1));
    }
    state.inventory.Cups.qty = Math.max(0, state.inventory.Cups.qty - 1);

    if (sugar === 'Yes') {
        state.inventory.Sugar.qty = Math.max(0, state.inventory.Sugar.qty - (size === 'Large' ? 20 : 10));
    }

    const newOrder = {
        id: Date.now(),
        flavor,
        size,
        sugar,
        status: 'pending',
        date: new Date().toISOString()
    };

    // Add to top
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

// 3. Render Orders
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
                    <button onclick="toggleOrderStatus(${o.id})" class="p-2 rounded-xl border ${isDone ? 'border-gray-200 text-gray-400 hover:text-gray-600' : 'border-green-200 bg-green-50 text-juice-green hover:bg-green-100'} transition" title="Toggle Status">
                        <i class="ph-bold ph-check text-lg"></i>
                    </button>
                </div>
                ` : `
                <button onclick="toggleOrderStatus(${o.id})" class="text-juice-green bg-green-50 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-100 transition whitespace-nowrap"><i class="ph-bold ph-check"></i> Done</button>
                `}
            </div>
        </li>
    `;
}

// 4. Inventory List
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
                    <div class="font-bold text-gray-800">${key}</div>
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
    }
}

// 5. Analytics
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

    document.getElementById('installAppBtnDesktop').addEventListener('click', installHandler);
    document.getElementById('installAppBtnMobile').addEventListener('click', installHandler);
}

// Boot
document.addEventListener('DOMContentLoaded', init);
