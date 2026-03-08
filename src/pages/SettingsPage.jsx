import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { Save, Trash2, Plus, Shield, Key, Download, Upload, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
    const { juices, updateJuice, addJuice, deleteJuice, darkMode, role, setRole, pin, setPin, orders } = useApp();
    const [showPinInput, setShowPinInput] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const [newJuice, setNewJuice] = useState({ name: '', emoji: '🧃', price: { Small: 100, Large: 200 }, stock: 50 });
    const [showAddJuice, setShowAddJuice] = useState(false);
    const [priceEdits, setPriceEdits] = useState({});
    const [saveMsg, setSaveMsg] = useState('');

    // Handle price change
    const handlePriceChange = (id, size, value) => {
        setPriceEdits(prev => ({
            ...prev,
            [id]: { ...prev[id], [size]: parseInt(value) || 0 }
        }));
    };

    // Save all prices
    const savePrices = () => {
        Object.entries(priceEdits).forEach(([id, prices]) => {
            const juice = juices.find(j => j.id === parseInt(id));
            if (juice) {
                updateJuice(parseInt(id), {
                    price: { ...juice.price, ...prices }
                });
            }
        });
        setPriceEdits({});
        setSaveMsg('Prices saved!');
        setTimeout(() => setSaveMsg(''), 2000);
    };

    // Add new juice
    const handleAddJuice = () => {
        if (!newJuice.name) return;
        addJuice(newJuice);
        setNewJuice({ name: '', emoji: '🧃', price: { Small: 100, Large: 200 }, stock: 50 });
        setShowAddJuice(false);
    };

    // Export data
    const exportData = () => {
        const data = { juices, orders, exportDate: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `juicedash-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Import data
    const importData = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.juices) {
                    localStorage.setItem('juicedash_juices', JSON.stringify(data.juices));
                }
                if (data.orders) {
                    localStorage.setItem('juicedash_orders', JSON.stringify(data.orders));
                }
                window.location.reload();
            } catch { }
        };
        reader.readAsText(file);
    };

    // Reset all data
    const resetData = () => {
        if (confirm('Are you sure? This will erase ALL your data including orders and settings.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    // Role switch
    const handleRoleSwitch = () => {
        if (role === 'owner') {
            setRole('staff');
        } else {
            setShowPinInput(true);
        }
    };

    const verifyPin = () => {
        if (pinInput === pin) {
            setRole('owner');
            setShowPinInput(false);
            setPinInput('');
        } else {
            alert('Incorrect PIN');
            setPinInput('');
        }
    };

    const emojis = ['🍊', '🍎', '🥭', '🍉', '🍍', '🫐', '🍓', '🍋', '🍇', '🥝', '🍑', '🫒', '🍌', '🥥', '🧃'];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Prices */}
                <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className={`font-bold text-lg flex items-center gap-2 ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                            💰 Per-Flavor Prices
                        </h3>
                        <button
                            onClick={savePrices}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-juice-orange text-white text-sm font-bold hover:bg-orange-600 transition active:scale-95"
                        >
                            <Save size={14} />
                            {saveMsg || 'Save'}
                        </button>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {juices.map(juice => (
                            <div key={juice.id} className={`flex items-center gap-3 p-3 rounded-xl border transition
                ${darkMode ? 'border-dark-border hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                                <span className="text-xl">{juice.emoji}</span>
                                <span className={`text-sm font-semibold flex-1 min-w-0 truncate ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                                    {juice.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <span className={`text-[10px] font-medium ${darkMode ? 'text-dark-muted' : 'text-gray-400'}`}>S</span>
                                        <input
                                            type="number"
                                            value={priceEdits[juice.id]?.Small ?? juice.price.Small}
                                            onChange={e => handlePriceChange(juice.id, 'Small', e.target.value)}
                                            className={`w-16 px-2 py-1 rounded-lg border text-xs text-center font-medium
                        ${darkMode ? 'bg-dark-surface border-dark-border text-dark-text' : 'bg-gray-50 border-gray-200 text-gray-800'}
                        focus:outline-none focus:ring-1 focus:ring-juice-orange focus:border-juice-orange`}
                                        />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className={`text-[10px] font-medium ${darkMode ? 'text-dark-muted' : 'text-gray-400'}`}>L</span>
                                        <input
                                            type="number"
                                            value={priceEdits[juice.id]?.Large ?? juice.price.Large}
                                            onChange={e => handlePriceChange(juice.id, 'Large', e.target.value)}
                                            className={`w-16 px-2 py-1 rounded-lg border text-xs text-center font-medium
                        ${darkMode ? 'bg-dark-surface border-dark-border text-dark-text' : 'bg-gray-50 border-gray-200 text-gray-800'}
                        focus:outline-none focus:ring-1 focus:ring-juice-orange focus:border-juice-orange`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manage Juices */}
                <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
                    <h3 className={`font-bold text-lg mb-5 flex items-center gap-2 ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                        🍹 Manage Flavors
                    </h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 mb-4">
                        {juices.map(juice => (
                            <div key={juice.id} className={`flex items-center gap-3 p-3 rounded-xl border transition
                ${darkMode ? 'border-dark-border hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                                <span className="text-xl">{juice.emoji}</span>
                                <span className={`text-sm font-semibold flex-1 ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>{juice.name}</span>
                                <button
                                    onClick={() => {
                                        if (confirm(`Delete ${juice.name}?`)) deleteJuice(juice.id);
                                    }}
                                    className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-red-500/10 text-dark-muted hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add new flavor */}
                    {showAddJuice ? (
                        <div className={`p-4 rounded-xl border space-y-3 animate-scale-in
              ${darkMode ? 'border-dark-border bg-dark-surface' : 'border-gray-200 bg-gray-50'}`}>
                            <input
                                type="text"
                                value={newJuice.name}
                                onChange={e => setNewJuice(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Flavor name"
                                className={`w-full px-3 py-2 rounded-lg border text-sm
                  ${darkMode ? 'bg-dark-card border-dark-border text-dark-text placeholder-dark-muted' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'}
                  focus:outline-none focus:ring-1 focus:ring-juice-orange`}
                            />
                            <div>
                                <label className={`text-xs font-medium mb-1 block ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>Emoji</label>
                                <div className="flex flex-wrap gap-1">
                                    {emojis.map(e => (
                                        <button
                                            key={e}
                                            onClick={() => setNewJuice(prev => ({ ...prev, emoji: e }))}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition border
                        ${newJuice.emoji === e
                                                    ? 'border-juice-orange bg-orange-50 dark:bg-orange-500/10'
                                                    : darkMode ? 'border-dark-border hover:bg-white/5' : 'border-gray-100 hover:bg-gray-100'
                                                }`}
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className={`text-xs font-medium mb-1 block ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>Small Price</label>
                                    <input
                                        type="number"
                                        value={newJuice.price.Small}
                                        onChange={e => setNewJuice(prev => ({ ...prev, price: { ...prev.price, Small: parseInt(e.target.value) || 0 } }))}
                                        className={`w-full px-3 py-2 rounded-lg border text-sm
                      ${darkMode ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-white border-gray-200 text-gray-800'}
                      focus:outline-none focus:ring-1 focus:ring-juice-orange`}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className={`text-xs font-medium mb-1 block ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>Large Price</label>
                                    <input
                                        type="number"
                                        value={newJuice.price.Large}
                                        onChange={e => setNewJuice(prev => ({ ...prev, price: { ...prev.price, Large: parseInt(e.target.value) || 0 } }))}
                                        className={`w-full px-3 py-2 rounded-lg border text-sm
                      ${darkMode ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-white border-gray-200 text-gray-800'}
                      focus:outline-none focus:ring-1 focus:ring-juice-orange`}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddJuice}
                                    className="flex-1 py-2 rounded-lg bg-juice-green text-white text-sm font-bold hover:bg-green-600 transition"
                                >
                                    Add Flavor
                                </button>
                                <button
                                    onClick={() => setShowAddJuice(false)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition
                    ${darkMode ? 'bg-dark-border text-dark-muted hover:bg-dark-border/80' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddJuice(true)}
                            className={`w-full py-2.5 rounded-xl border-2 border-dashed font-semibold text-sm transition-all flex items-center justify-center gap-2
                ${darkMode ? 'border-dark-border text-dark-muted hover:border-juice-orange hover:text-juice-orange' : 'border-gray-200 text-gray-500 hover:border-juice-orange hover:text-juice-orange'}`}
                        >
                            <Plus size={16} /> Add New Flavor
                        </button>
                    )}
                </div>

                {/* Role & Access */}
                <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
                    <h3 className={`font-bold text-lg mb-5 flex items-center gap-2 ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                        <Shield size={20} className="text-juice-purple" />
                        Access Control
                    </h3>
                    <div className="space-y-4">
                        <div className={`flex items-center justify-between p-4 rounded-xl border
              ${darkMode ? 'border-dark-border' : 'border-gray-100'}`}>
                            <div>
                                <p className={`text-sm font-semibold ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>Current Role</p>
                                <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>
                                    {role === 'owner' ? 'Full access to all features' : 'Limited access — no price editing'}
                                </p>
                            </div>
                            <button
                                onClick={handleRoleSwitch}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition
                  ${role === 'owner'
                                        ? 'bg-purple-50 dark:bg-purple-500/10 text-juice-purple border border-purple-200 dark:border-purple-500/20'
                                        : 'bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-dark-muted'
                                    }`}
                            >
                                {role === 'owner' ? '👑 Owner' : '👤 Staff'}
                            </button>
                        </div>

                        {showPinInput && (
                            <div className="flex gap-2 animate-scale-in">
                                <input
                                    type="password"
                                    maxLength={4}
                                    value={pinInput}
                                    onChange={e => setPinInput(e.target.value)}
                                    placeholder="Enter PIN"
                                    className={`flex-1 px-4 py-2 rounded-xl border text-sm text-center tracking-[0.5em]
                    ${darkMode ? 'bg-dark-surface border-dark-border text-dark-text placeholder-dark-muted' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'}
                    focus:outline-none focus:ring-2 focus:ring-juice-orange/30`}
                                />
                                <button onClick={verifyPin} className="px-4 py-2 rounded-xl bg-juice-orange text-white text-sm font-bold">
                                    <Key size={16} />
                                </button>
                            </div>
                        )}

                        {role === 'owner' && (
                            <div className={`p-4 rounded-xl border ${darkMode ? 'border-dark-border' : 'border-gray-100'}`}>
                                <label className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>Change PIN</label>
                                <input
                                    type="password"
                                    maxLength={4}
                                    value={pin}
                                    onChange={e => setPin(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-xl border text-sm text-center tracking-[0.5em]
                    ${darkMode ? 'bg-dark-surface border-dark-border text-dark-text' : 'bg-gray-50 border-gray-200 text-gray-800'}
                    focus:outline-none focus:ring-2 focus:ring-juice-orange/30`}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Data Management */}
                <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
                    <h3 className={`font-bold text-lg mb-5 flex items-center gap-2 ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                        💾 Data Management
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={exportData}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl border transition
                ${darkMode ? 'border-dark-border hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                                <Download size={18} className="text-juice-blue" />
                            </div>
                            <div className="text-left">
                                <p className={`text-sm font-semibold ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>Export Data</p>
                                <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>Download a backup file</p>
                            </div>
                        </button>

                        <label className={`w-full flex items-center gap-3 p-4 rounded-xl border transition cursor-pointer
              ${darkMode ? 'border-dark-border hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                                <Upload size={18} className="text-juice-green" />
                            </div>
                            <div className="text-left">
                                <p className={`text-sm font-semibold ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>Import Data</p>
                                <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>Restore from a backup file</p>
                            </div>
                            <input type="file" accept=".json" onChange={importData} className="hidden" />
                        </label>

                        <button
                            onClick={resetData}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl border transition
                ${darkMode ? 'border-red-500/20 hover:bg-red-500/10' : 'border-red-100 hover:bg-red-50'}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
                                <RotateCcw size={18} className="text-juice-red" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-juice-red">Reset All Data</p>
                                <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>Erase everything and start fresh</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
