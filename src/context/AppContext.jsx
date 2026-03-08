import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const DEFAULT_JUICES = [
    { id: 1, name: 'Orange', emoji: '🍊', color: '#f97316', price: { Small: 150, Large: 250 }, stock: 50 },
    { id: 2, name: 'Apple', emoji: '🍎', color: '#ef4444', price: { Small: 120, Large: 200 }, stock: 45 },
    { id: 3, name: 'Mango', emoji: '🥭', color: '#f59e0b', price: { Small: 180, Large: 300 }, stock: 30 },
    { id: 4, name: 'Watermelon', emoji: '🍉', color: '#ec4899', price: { Small: 100, Large: 180 }, stock: 60 },
    { id: 5, name: 'Pineapple', emoji: '🍍', color: '#eab308', price: { Small: 160, Large: 270 }, stock: 25 },
    { id: 6, name: 'Pomegranate', emoji: '🫐', color: '#8b5cf6', price: { Small: 200, Large: 350 }, stock: 15 },
    { id: 7, name: 'Strawberry', emoji: '🍓', color: '#f43f5e', price: { Small: 170, Large: 280 }, stock: 35 },
    { id: 8, name: 'Lemon Mint', emoji: '🍋', color: '#84cc16', price: { Small: 130, Large: 220 }, stock: 40 },
];

function loadData(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function AppProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => loadData('juicedash_dark', false));
    const [juices, setJuices] = useState(() => loadData('juicedash_juices', DEFAULT_JUICES));
    const [orders, setOrders] = useState(() => loadData('juicedash_orders', []));
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [role, setRole] = useState(() => loadData('juicedash_role', 'owner')); // 'owner' or 'staff'
    const [pin, setPin] = useState(() => loadData('juicedash_pin', '1234'));

    // Persist data
    useEffect(() => { saveData('juicedash_dark', darkMode); }, [darkMode]);
    useEffect(() => { saveData('juicedash_juices', juices); }, [juices]);
    useEffect(() => { saveData('juicedash_orders', orders); }, [orders]);
    useEffect(() => { saveData('juicedash_role', role); }, [role]);
    useEffect(() => { saveData('juicedash_pin', pin); }, [pin]);

    // Apply dark mode class
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    // Add order
    const addOrder = (order) => {
        const newOrder = {
            ...order,
            id: Date.now(),
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        const juice = juices.find(j => j.id === order.juiceId);
        if (juice) {
            newOrder.juiceName = juice.name;
            newOrder.emoji = juice.emoji;
            newOrder.total = juice.price[order.size];
            // Deduct stock
            setJuices(prev => prev.map(j =>
                j.id === order.juiceId ? { ...j, stock: Math.max(0, j.stock - 1) } : j
            ));
        }
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };

    // Update order status
    const updateOrderStatus = (orderId, status) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
        ));
    };

    // Delete order
    const deleteOrder = (orderId) => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
    };

    // Update juice
    const updateJuice = (juiceId, updates) => {
        setJuices(prev => prev.map(j => j.id === juiceId ? { ...j, ...updates } : j));
    };

    // Add juice
    const addJuice = (juice) => {
        const newJuice = {
            ...juice,
            id: Date.now(),
            stock: juice.stock || 50,
        };
        setJuices(prev => [...prev, newJuice]);
    };

    // Delete juice
    const deleteJuice = (juiceId) => {
        setJuices(prev => prev.filter(j => j.id !== juiceId));
    };

    // Restock
    const restockJuice = (juiceId, amount) => {
        setJuices(prev => prev.map(j =>
            j.id === juiceId ? { ...j, stock: j.stock + amount } : j
        ));
    };

    // Analytics
    const getTodaysOrders = () => {
        const today = new Date().toDateString();
        return orders.filter(o => new Date(o.createdAt).toDateString() === today);
    };

    const getTodaysSales = () => {
        return getTodaysOrders().reduce((sum, o) => sum + (o.total || 0), 0);
    };

    const getPendingOrders = () => {
        return orders.filter(o => o.status === 'pending');
    };

    const getLowStockItems = () => {
        return juices.filter(j => j.stock <= 10);
    };

    const getBestSellers = () => {
        const todayOrders = getTodaysOrders();
        const counts = {};
        todayOrders.forEach(o => {
            counts[o.juiceName] = (counts[o.juiceName] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count, juice: juices.find(j => j.name === name) }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    };

    // Weekly sales data for charts
    const getWeeklySales = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayStr = d.toDateString();
            const dayName = d.toLocaleDateString('en', { weekday: 'short' });
            const dayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === dayStr);
            const total = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
            days.push({ day: dayName, sales: total, orders: dayOrders.length });
        }
        return days;
    };

    const getOrdersByDateRange = (startDate, endDate) => {
        return orders.filter(o => {
            const d = new Date(o.createdAt);
            return d >= startDate && d <= endDate;
        });
    };

    const value = {
        darkMode, setDarkMode,
        juices, setJuices, updateJuice, addJuice, deleteJuice, restockJuice,
        orders, addOrder, updateOrderStatus, deleteOrder,
        currentPage, setCurrentPage,
        role, setRole, pin, setPin,
        getTodaysOrders, getTodaysSales, getPendingOrders,
        getLowStockItems, getBestSellers, getWeeklySales,
        getOrdersByDateRange,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used inside AppProvider');
    return ctx;
}
