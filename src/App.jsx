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
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-dark-bg' : 'bg-juice-bg'}`}>
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto w-full relative pb-20 md:pb-0">
        <Header />
        <div className="p-5 md:p-8 max-w-6xl mx-auto w-full">
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
