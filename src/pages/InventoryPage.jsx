import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { Package, AlertTriangle, Plus, Minus, Search } from 'lucide-react';

export default function InventoryPage() {
    const { juices, restockJuice, darkMode } = useApp();
    const [search, setSearch] = useState('');
    const [restockAmounts, setRestockAmounts] = useState({});

    const filtered = juices.filter(j =>
        j.name.toLowerCase().includes(search.toLowerCase())
    );

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600', bg: darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200' };
        if (stock <= 10) return { label: 'Low Stock', color: 'text-amber-600', bg: darkMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200' };
        if (stock <= 25) return { label: 'Medium', color: 'text-blue-600', bg: darkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200' };
        return { label: 'In Stock', color: 'text-green-600', bg: darkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200' };
    };

    const handleRestock = (juiceId) => {
        const amount = restockAmounts[juiceId] || 10;
        restockJuice(juiceId, amount);
        setRestockAmounts(prev => ({ ...prev, [juiceId]: 10 }));
    };

    const totalStock = juices.reduce((sum, j) => sum + j.stock, 0);
    const lowItems = juices.filter(j => j.stock <= 10).length;
    const outItems = juices.filter(j => j.stock === 0).length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 stagger-children">
                <div className={`p-4 rounded-2xl border card-hover
          ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'} shadow-sm`}>
                    <div className="flex items-center gap-2 mb-1">
                        <Package size={16} className="text-juice-blue" />
                        <span className={`text-xs font-semibold ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>Total Stock</span>
                    </div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>{totalStock}</p>
                </div>
                <div className={`p-4 rounded-2xl border card-hover
          ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'} shadow-sm`}>
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={16} className="text-amber-500" />
                        <span className={`text-xs font-semibold ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>Low Stock</span>
                    </div>
                    <p className={`text-2xl font-bold text-amber-500`}>{lowItems}</p>
                </div>
                <div className={`p-4 rounded-2xl border card-hover col-span-2 sm:col-span-1
          ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'} shadow-sm`}>
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={16} className="text-juice-red" />
                        <span className={`text-xs font-semibold ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>Out of Stock</span>
                    </div>
                    <p className={`text-2xl font-bold text-juice-red`}>{outItems}</p>
                </div>
            </div>

            {/* Search */}
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border max-w-sm transition
        ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'}
        focus-within:ring-2 focus-within:ring-juice-orange/30 focus-within:border-juice-orange`}>
                <Search size={18} className={darkMode ? 'text-dark-muted' : 'text-gray-400'} />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search inventory..."
                    className={`bg-transparent flex-1 outline-none text-sm ${darkMode ? 'text-dark-text placeholder-dark-muted' : 'text-gray-800 placeholder-gray-400'}`}
                />
            </div>

            {/* Inventory table */}
            <div className={`rounded-2xl border shadow-sm overflow-hidden
        ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${darkMode ? 'border-dark-border bg-dark-surface' : 'border-gray-100 bg-gray-50/50'}`}>
                                <th className={`text-left p-4 text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-gray-600'}`}>Item</th>
                                <th className={`text-left p-4 text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-gray-600'}`}>Stock Level</th>
                                <th className={`text-left p-4 text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-gray-600'}`}>Status</th>
                                <th className={`text-left p-4 text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-gray-600'}`}>Price (S/L)</th>
                                <th className={`text-right p-4 text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-gray-600'}`}>Restock</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-dark-border' : 'divide-gray-100'}`}>
                            {filtered.map((juice, i) => {
                                const status = getStockStatus(juice.stock);
                                const amount = restockAmounts[juice.id] || 10;
                                return (
                                    <tr key={juice.id} className={`transition ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'} animate-fade-in`}
                                        style={{ animationDelay: `${i * 0.03}s` }}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{juice.emoji}</span>
                                                <span className={`font-semibold text-sm ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>{juice.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-24 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-dark-border' : 'bg-gray-100'}`}>
                                                    <div
                                                        className="h-full rounded-full progress-bar"
                                                        style={{
                                                            width: `${Math.min(100, (juice.stock / 60) * 100)}%`,
                                                            background: juice.stock === 0 ? '#ef4444' : juice.stock <= 10 ? '#f59e0b' : '#22c55e'
                                                        }}
                                                    />
                                                </div>
                                                <span className={`text-sm font-medium ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>{juice.stock}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`badge border ${status.bg} ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-gray-600'}`}>
                                                Rs {juice.price.Small} / Rs {juice.price.Large}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => setRestockAmounts(prev => ({ ...prev, [juice.id]: Math.max(1, (prev[juice.id] || 10) - 5) }))}
                                                        className={`p-1 rounded-lg transition ${darkMode ? 'hover:bg-white/10 text-dark-muted' : 'hover:bg-gray-100 text-gray-400'}`}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className={`text-sm font-medium w-8 text-center ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>{amount}</span>
                                                    <button
                                                        onClick={() => setRestockAmounts(prev => ({ ...prev, [juice.id]: (prev[juice.id] || 10) + 5 }))}
                                                        className={`p-1 rounded-lg transition ${darkMode ? 'hover:bg-white/10 text-dark-muted' : 'hover:bg-gray-100 text-gray-400'}`}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => handleRestock(juice.id)}
                                                    className="px-3 py-1.5 rounded-lg bg-juice-green text-white text-xs font-bold hover:bg-green-600 transition shadow-sm active:scale-95"
                                                >
                                                    Restock
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile card view */}
                <div className="sm:hidden divide-y divide-gray-100 dark:divide-dark-border">
                    {filtered.map((juice, i) => {
                        const status = getStockStatus(juice.stock);
                        const amount = restockAmounts[juice.id] || 10;
                        return (
                            <div key={juice.id} className="p-4 animate-fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{juice.emoji}</span>
                                        <span className={`font-semibold text-sm ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>{juice.name}</span>
                                    </div>
                                    <span className={`badge border ${status.bg} ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-dark-border' : 'bg-gray-100'}`}>
                                        <div
                                            className="h-full rounded-full progress-bar"
                                            style={{
                                                width: `${Math.min(100, (juice.stock / 60) * 100)}%`,
                                                background: juice.stock === 0 ? '#ef4444' : juice.stock <= 10 ? '#f59e0b' : '#22c55e'
                                            }}
                                        />
                                    </div>
                                    <span className={`text-sm font-bold ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>{juice.stock}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>
                                        Rs {juice.price.Small} / Rs {juice.price.Large}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setRestockAmounts(prev => ({ ...prev, [juice.id]: Math.max(1, (prev[juice.id] || 10) - 5) }))}
                                                className={`p-1 rounded-lg ${darkMode ? 'hover:bg-white/10 text-dark-muted' : 'hover:bg-gray-100 text-gray-400'}`}
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className={`text-xs font-medium w-6 text-center ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>{amount}</span>
                                            <button
                                                onClick={() => setRestockAmounts(prev => ({ ...prev, [juice.id]: (prev[juice.id] || 10) + 5 }))}
                                                className={`p-1 rounded-lg ${darkMode ? 'hover:bg-white/10 text-dark-muted' : 'hover:bg-gray-100 text-gray-400'}`}
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRestock(juice.id)}
                                            className="px-3 py-1.5 rounded-lg bg-juice-green text-white text-[11px] font-bold hover:bg-green-600 transition"
                                        >
                                            Restock
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className={`text-center py-16 ${darkMode ? 'text-dark-muted' : 'text-gray-400'}`}>
                        <p className="text-5xl mb-4">📦</p>
                        <p className="font-semibold text-lg">No items found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
