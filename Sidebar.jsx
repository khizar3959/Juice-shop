import { useApp } from '../context/AppContext';
import {
    LayoutDashboard, ShoppingCart, Package, Settings, Moon, Sun,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
    const { currentPage, setCurrentPage, darkMode, setDarkMode } = useApp();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`hidden md:flex flex-col ${collapsed ? 'w-24' : 'w-72'} transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-full relative
      ${darkMode ? 'bg-dark-card/95 border-dark-border' : 'bg-white/95 border-juice-border'} border-r`}>

            {/* Logo */}
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-4'} p-6 mb-4`}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff5e00] to-[#ff8c00] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-500/30 flex-shrink-0 animate-float">
                    🍊
                </div>
                {!collapsed && (
                    <h1 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                        Juice<span className="text-juice-orange">Dash</span>
                    </h1>
                )}
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className={`absolute -right-3 top-16 w-7 h-7 rounded-full flex items-center justify-center z-20 shadow-lg transition-all duration-300
          ${darkMode ? 'bg-dark-surface border-dark-border text-dark-text hover:bg-white/10' : 'bg-white border-juice-border text-gray-600 hover:bg-gray-50'} border-2`}
            >
                {collapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
            </button>

            {/* Nav */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 group relative overflow-hidden
                ${isActive
                                    ? 'text-white shadow-[0_8px_20px_rgba(255,94,0,0.25)]'
                                    : darkMode
                                        ? 'text-dark-muted hover:text-dark-text hover:bg-white/5'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80'
                                }`}
                            title={collapsed ? item.label : ''}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-[#ff5e00] to-[#ff8c00] z-0"></div>
                            )}
                            <div className="relative z-10 flex items-center gap-4 w-full">
                                <Icon size={22} className={`${isActive ? 'text-white' : ''} transition-transform duration-300 group-hover:scale-110`} strokeWidth={isActive ? 2.5 : 2} />
                                {!collapsed && <span className="text-[15px]">{item.label}</span>}
                            </div>
                        </button>
                    );
                })}
            </nav>

            {/* Dark mode */}
            <div className={`p-4 border-t ${darkMode ? 'border-dark-border' : 'border-juice-border'}`}>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 group
            ${darkMode ? 'text-dark-muted hover:text-dark-text hover:bg-white/5 bg-dark-surface border border-dark-border' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 bg-white border border-gray-100 shadow-sm'}`}
                    title={collapsed ? (darkMode ? 'Light Mode' : 'Dark Mode') : ''}
                >
                    {darkMode ? <Sun size={22} className="group-hover:text-yellow-400 group-hover:rotate-90 transition-all duration-500" /> : <Moon size={22} className="group-hover:text-blue-500 group-hover:-rotate-12 transition-all duration-500" />}
                    {!collapsed && <span className="text-[15px]">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>
            </div>
        </aside>
    );
}
