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
        <header className={`sticky top-0 w-full z-40 transition-colors duration-500 border-b
      ${darkMode
                ? 'glass dark border-dark-border/50'
                : 'glass-heavy border-juice-border/50'
            }`}>
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                {/* Left: Title area */}
                <div>
                    {/* Mobile logo */}
                    <div className="flex md:hidden items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff5e00] to-[#ff8c00] flex items-center justify-center text-white text-base font-bold shadow-lg shadow-orange-500/30 animate-float">
                            🍊
                        </div>
                        <span className={`text-xl font-black tracking-tight ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                            Juice<span className="text-juice-orange">Dash</span>
                        </span>
                    </div>

                    <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${darkMode ? 'text-dark-text' : 'text-gray-900'} drop-shadow-sm`}>
                        {titles[currentPage] || 'Dashboard'}
                    </h2>
                    <p className={`text-sm md:text-base font-medium mt-1 ${darkMode ? 'text-dark-muted' : 'text-gray-500'} hidden md:block`}>
                        {greeting} 👋 — Here's your juice shop at a glance.
                    </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Notification bell */}
                    <button className={`relative p-3 rounded-2xl transition-all duration-300
            ${darkMode ? 'bg-dark-surface hover:bg-white/10 text-dark-text' : 'bg-white hover:bg-gray-50 shadow-sm border border-gray-100 text-gray-700 hover:text-juice-orange'}`}>
                        <Bell size={22} className="group-hover:animate-bounce" />
                        {lowStock.length > 0 && (
                            <span className="absolute top-2 right-2 w-3 h-3 bg-juice-red rounded-full border-[2.5px] border-white dark:border-[#1c1c1e] pulse-glow" />
                        )}
                    </button>

                    {/* Dark mode toggle (mobile) */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`md:hidden p-3 rounded-2xl transition-all duration-300
              ${darkMode ? 'bg-dark-surface hover:bg-white/10 text-dark-text' : 'bg-white hover:bg-gray-50 shadow-sm border border-gray-100 text-gray-700'}`}
                    >
                        {darkMode ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} className="text-blue-500" />}
                    </button>
                </div>
            </div>
        </header>
    );
}
