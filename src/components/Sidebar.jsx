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
        <aside className={`hidden md:flex flex-col ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out h-full relative
      ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'} border-r`}>

            {/* Logo */}
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} p-5 mb-2`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-orange-500/20 flex-shrink-0">
                    🍊
                </div>
                {!collapsed && (
                    <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                        Juice<span className="text-juice-orange">Dash</span>
                    </h1>
                )}
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className={`absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center z-10 shadow-md transition-colors
          ${darkMode ? 'bg-dark-card border-dark-border text-dark-muted hover:text-dark-text' : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'} border`}
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-1">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group
                ${isActive
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                                    : darkMode
                                        ? 'text-dark-muted hover:text-dark-text hover:bg-white/5'
                                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                            title={collapsed ? item.label : ''}
                        >
                            <Icon size={20} className={isActive ? 'text-white' : ''} />
                            {!collapsed && <span className="text-sm">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Dark mode & user */}
            <div className={`p-3 border-t ${darkMode ? 'border-dark-border' : 'border-gray-100'}`}>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200
            ${darkMode ? 'text-dark-muted hover:text-dark-text hover:bg-white/5' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                    title={collapsed ? (darkMode ? 'Light Mode' : 'Dark Mode') : ''}
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    {!collapsed && <span className="text-sm">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>
            </div>
        </aside>
    );
}
