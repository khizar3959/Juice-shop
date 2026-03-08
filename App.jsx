import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import InventoryPage from './pages/InventoryPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { currentPage, darkMode } = useApp();

  const pages = {
    dashboard: <DashboardPage />,
    orders: <OrdersPage />,
    inventory: <InventoryPage />,
    settings: <SettingsPage />,
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 relative
      ${darkMode ? 'bg-dark-bg text-dark-text' : 'bg-[#FAFCFF] text-gray-900'}`}>

      {/* Premium subtle background meshes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-30 transition-colors duration-500 ${darkMode ? 'bg-juice-orange/20' : 'bg-juice-orange/40'}`}></div>
        <div className={`absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-20 transition-colors duration-500 ${darkMode ? 'bg-juice-blue/20' : 'bg-juice-blue/40'}`}></div>
      </div>

      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto w-full relative z-10 pb-24 md:pb-0">
        <Header />
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
          {pages[currentPage] || <DashboardPage />}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
