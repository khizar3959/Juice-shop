import { useApp } from '../context/AppContext';
import { LayoutDashboard, ShoppingCart, Package, Settings } from 'lucide-react';

const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'inventory', label: 'Stock', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function MobileNav() {
    const { currentPage, setCurrentPage, darkMode } = useApp();

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm">
            <nav className={`flex justify-around items-center px-2 py-3 rounded-3xl transition-all duration-300
                ${darkMode
                    ? 'glass dark shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
                    : 'glass-heavy shadow-[0_8px_32px_rgba(255,100,0,0.15)] bg-white/80'
                }`}>
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 relative min-w-[64px]
                                ${isActive
                                    ? darkMode ? 'bg-white/10' : 'bg-orange-50/80 shadow-sm'
                                    : 'hover:bg-gray-100/50 dark:hover:bg-white/5'
                                }`}
                        >
                            <div className="relative">
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={`transition-colors duration-300 ${isActive ? 'text-juice-orange' : darkMode ? 'text-dark-muted' : 'text-gray-400'}`}
                                />
                                {isActive && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-juice-orange animate-scale-in border-2 border-white dark:border-[#1e1e1e]" />
                                )}
                            </div>
                            <span className={`text-[10px] font-bold tracking-wide transition-all ${isActive ? 'text-juice-orange opacity-100' : darkMode ? 'text-dark-muted opacity-80' : 'text-gray-400 opacity-80'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
