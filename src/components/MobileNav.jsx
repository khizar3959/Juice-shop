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
        <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 pt-2 pb-safe
      ${darkMode
                ? 'bg-dark-card/95 border-dark-border shadow-[0_-4px_20px_rgba(0,0,0,0.3)]'
                : 'bg-white/95 border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'
            } border-t backdrop-blur-xl`}>
            {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id)}
                        className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 relative
              ${isActive
                                ? 'text-juice-orange'
                                : darkMode
                                    ? 'text-dark-muted'
                                    : 'text-gray-400'
                            }`}
                    >
                        {isActive && (
                            <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-juice-orange" />
                        )}
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                        <span className={`text-[10px] font-semibold ${isActive ? 'text-juice-orange' : ''}`}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
