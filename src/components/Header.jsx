import { useApp } from '../context/AppContext';
import { Moon, Sun, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
    const { darkMode, setDarkMode, currentPage, getLowStockItems } = useApp();
    const [greeting, setGreeting] = useState('');
    const lowStock = getLowStockItems();

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const titles = {
        dashboard: 'Dashboard',
        orders: 'Order Management',
        inventory: 'Inventory Tracking',
        settings: 'Settings & Admin',
    };

    return (
        <header className={`sticky top-0 z-20 backdrop-blur-xl transition-colors duration-300
      ${darkMode
                ? 'bg-dark-bg/80 border-dark-border'
                : 'bg-juice-bg/80 border-gray-100'
            } border-b`}>
            <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
                {/* Left: Title area */}
                <div>
                    {/* Mobile logo */}
                    <div className="flex md:hidden items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-orange-500/20">
                            🍊
                        </div>
                        <span className={`text-lg font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                            Juice<span className="text-juice-orange">Dash</span>
                        </span>
                    </div>

                    <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                        {titles[currentPage] || 'Dashboard'}
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-gray-500'} hidden md:block`}>
                        {greeting} 👋 — Here's your juice shop at a glance.
                    </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Notification bell */}
                    <button className={`relative p-2.5 rounded-xl transition-all
            ${darkMode ? 'hover:bg-white/5 text-dark-muted' : 'hover:bg-gray-100 text-gray-500'}`}>
                        <Bell size={20} />
                        {lowStock.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-juice-red rounded-full border-2 border-white dark:border-dark-bg pulse-glow" />
                        )}
                    </button>

                    {/* Dark mode toggle (mobile) */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`md:hidden p-2.5 rounded-xl transition-all
              ${darkMode ? 'hover:bg-white/5 text-dark-muted' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>
        </header>
    );
}
