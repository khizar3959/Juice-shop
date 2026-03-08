import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { Plus, Search, Check, Trash2, Clock, Filter, X } from 'lucide-react';

function OrderModal({ isOpen, onClose }) {
    const { juices, addOrder, darkMode } = useApp();
    const [selectedJuice, setSelectedJuice] = useState(null);
    const [size, setSize] = useState('Small');
    const [sugar, setSugar] = useState('Yes');
    const [customerName, setCustomerName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!selectedJuice) return;
        addOrder({
            juiceId: selectedJuice.id,
            size,
            sugar,
            customerName: customerName || 'Walk-in',
        });
        setSelectedJuice(null);
        setSize('Small');
        setSugar('Yes');
        setCustomerName('');
        onClose();
    };

    const selectedPrice = selectedJuice ? selectedJuice.price[size] : 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative z-10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]
        ${darkMode ? 'bg-dark-card' : 'bg-white'}`}>

                {/* Header */}
                <div className={`p-6 border-b flex items-center justify-between
          ${darkMode ? 'border-dark-border bg-dark-surface' : 'border-gray-100 bg-gray-50/50'}`}>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>New Order</h3>
                    <button onClick={onClose} className={`p-2 rounded-xl transition ${darkMode ? 'hover:bg-white/10 text-dark-muted' : 'hover:bg-gray-100 text-gray-400'}`}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-5">
                    {/* Customer name */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>Customer Name</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                            placeholder="Walk-in"
                            className={`w-full px-4 py-2.5 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-juice-orange/30 focus:border-juice-orange
                ${darkMode ? 'bg-dark-surface border-dark-border text-dark-text placeholder-dark-muted' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'}`}
                        />
                    </div>

                    {/* Flavor select */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>Flavor</label>
                        <div className="grid grid-cols-3 gap-2">
                            {juices.map(j => (
                                <button
                                    key={j.id}
                                    onClick={() => setSelectedJuice(j)}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200
                    ${selectedJuice?.id === j.id
                                            ? 'border-juice-orange bg-orange-50 dark:bg-orange-500/10 scale-[1.02]'
                                            : darkMode
                                                ? 'border-dark-border hover:border-dark-muted'
                                                : 'border-gray-100 hover:border-gray-300'
                                        }
                    ${j.stock === 0 ? 'opacity-40 pointer-events-none' : ''}`}
                                >
                                    <span className="text-2xl">{j.emoji}</span>
                                    <span className={`text-xs font-medium ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>{j.name}</span>
                                    {j.stock <= 10 && j.stock > 0 && (
                                        <span className="text-[9px] text-juice-red font-bold">Low!</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>Size</label>
                        <div className="flex gap-3">
                            {['Small', 'Large'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    className={`flex-1 py-2.5 rounded-xl border-2 font-medium transition-all duration-200
                    ${size === s
                                            ? 'border-juice-orange bg-orange-50 dark:bg-orange-500/10 text-juice-orange'
                                            : darkMode
                                                ? 'border-dark-border text-dark-muted hover:border-dark-muted'
                                                : 'border-gray-100 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    {s}
                                    {selectedJuice && <span className="block text-xs mt-0.5 opacity-70">Rs {selectedJuice.price[s]}</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sugar */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>Add Sugar?</label>
                        <div className="flex gap-3">
                            {['Yes', 'No'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSugar(s)}
                                    className={`flex-1 py-2.5 rounded-xl border-2 font-medium transition-all duration-200
                    ${sugar === s
                                            ? 'border-juice-orange bg-orange-50 dark:bg-orange-500/10 text-juice-orange'
                                            : darkMode
                                                ? 'border-dark-border text-dark-muted hover:border-dark-muted'
                                                : 'border-gray-100 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`p-6 border-t ${darkMode ? 'border-dark-border bg-dark-surface' : 'border-gray-100 bg-gray-50/50'}`}>
                    {selectedJuice && (
                        <div className={`flex items-center justify-between mb-3 ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                            <span className="text-sm font-medium">Total</span>
                            <span className="text-lg font-bold">Rs {selectedPrice}</span>
                        </div>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedJuice}
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-200
              ${selectedJuice
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-500/30 hover:shadow-xl active:scale-[0.98]'
                                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                            }`}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function OrdersPage() {
    const { orders, updateOrderStatus, deleteOrder, darkMode } = useApp();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    const filtered = orders.filter(o => {
        if (filter !== 'all' && o.status !== filter) return false;
        if (search && !o.juiceName?.toLowerCase().includes(search.toLowerCase()) &&
            !o.customerName?.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const statusStyles = {
        pending: {
            bg: darkMode ? 'bg-amber-500/10' : 'bg-amber-50',
            text: 'text-amber-600',
            border: darkMode ? 'border-amber-500/20' : 'border-amber-200',
            label: 'Pending',
        },
        done: {
            bg: darkMode ? 'bg-green-500/10' : 'bg-green-50',
            text: 'text-green-600',
            border: darkMode ? 'border-green-500/20' : 'border-green-200',
            label: 'Done',
        },
        cancelled: {
            bg: darkMode ? 'bg-red-500/10' : 'bg-red-50',
            text: 'text-red-500',
            border: darkMode ? 'border-red-500/20' : 'border-red-200',
            label: 'Cancelled',
        },
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                {/* Search */}
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border flex-1 max-w-sm transition
          ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'}
          focus-within:ring-2 focus-within:ring-juice-orange/30 focus-within:border-juice-orange`}>
                    <Search size={18} className={darkMode ? 'text-dark-muted' : 'text-gray-400'} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search orders..."
                        className={`bg-transparent flex-1 outline-none text-sm ${darkMode ? 'text-dark-text placeholder-dark-muted' : 'text-gray-800 placeholder-gray-400'}`}
                    />
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all flex items-center gap-2 text-sm active:scale-[0.98]"
                >
                    <Plus size={18} /> New Order
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {[
                    { id: 'all', label: 'All', count: orders.length },
                    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
                    { id: 'done', label: 'Done', count: orders.filter(o => o.status === 'done').length },
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200
              ${filter === f.id
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                                : darkMode
                                    ? 'bg-dark-card text-dark-muted border border-dark-border hover:bg-white/5'
                                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        {f.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-md
              ${filter === f.id
                                ? 'bg-white/20'
                                : darkMode ? 'bg-dark-border' : 'bg-gray-100'
                            }`}>
                            {f.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Orders list */}
            <div className={`rounded-2xl border shadow-sm overflow-hidden
        ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
                {filtered.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-dark-border">
                        {filtered.map((order, i) => {
                            const st = statusStyles[order.status] || statusStyles.pending;
                            return (
                                <div
                                    key={order.id}
                                    className={`flex items-center gap-4 p-4 transition-all hover:${darkMode ? 'bg-white/5' : 'bg-gray-50'} animate-fade-in`}
                                    style={{ animationDelay: `${i * 0.03}s` }}
                                >
                                    <span className="text-2xl">{order.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className={`text-sm font-bold ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                                                {order.juiceName}
                                            </p>
                                            <span className={`badge ${st.bg} ${st.text} border ${st.border}`}>
                                                {order.status === 'pending' && <Clock size={10} />}
                                                {order.status === 'done' && <Check size={10} />}
                                                {st.label}
                                            </span>
                                        </div>
                                        <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-gray-500'} mt-0.5`}>
                                            {order.size} • {order.sugar === 'Yes' ? 'Sugar' : 'No Sugar'}
                                            {order.customerName && ` • ${order.customerName}`}
                                            {' • '}
                                            {new Date(order.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                                            Rs {order.total}
                                        </span>
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'done')}
                                                className="p-2 rounded-lg bg-green-50 dark:bg-green-500/10 text-juice-green hover:bg-green-100 transition"
                                                title="Mark Done"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteOrder(order.id)}
                                            className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-red-500/10 text-dark-muted hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={`text-center py-16 ${darkMode ? 'text-dark-muted' : 'text-gray-400'}`}>
                        <p className="text-5xl mb-4">🧃</p>
                        <p className="font-semibold text-lg">No orders found</p>
                        <p className="text-sm mt-1">{search ? 'Try a different search' : 'Tap "New Order" to get started'}</p>
                    </div>
                )}
            </div>

            <OrderModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}
