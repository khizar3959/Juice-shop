import { useApp } from '../context/AppContext';
import { DollarSign, ShoppingCart, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

function StatCard({ icon: Icon, label, value, color, bgColor, darkBgColor, trend, darkMode }) {
    return (
        <div className={`card-hover p-5 rounded-2xl border flex items-center gap-4 animate-fade-in
      ${darkMode ? `bg-dark-card border-dark-border` : `bg-white border-gray-100`} shadow-sm`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${darkMode ? darkBgColor : bgColor}`}>
                <Icon size={24} className={color} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>{label}</p>
                <h3 className={`text-2xl font-bold truncate ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>{value}</h3>
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-juice-green text-xs font-semibold bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={14} />
                    {trend}
                </div>
            )}
        </div>
    );
}

function BestSellerBar({ name, count, maxCount, emoji, color, darkMode, index }) {
    const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
    return (
        <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <span className="text-xl w-8 text-center">{emoji}</span>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-semibold truncate ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>{name}</span>
                    <span className={`text-xs font-bold ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>{count} sold</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-dark-border' : 'bg-gray-100'}`}>
                    <div
                        className="h-full rounded-full progress-bar"
                        style={{ width: `${pct}%`, background: color || '#f97316' }}
                    />
                </div>
            </div>
        </div>
    );
}

function RecentOrderItem({ order, darkMode, onComplete }) {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl transition-all
      ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
            <span className="text-xl">{order.emoji}</span>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                    {order.juiceName} — {order.size}
                </p>
                <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>
                    {new Date(order.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                    {order.sugar === 'Yes' && ' • Sugar'}
                </p>
            </div>
            <div className="text-right">
                <p className={`text-sm font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>Rs {order.total}</p>
                {order.status === 'pending' && (
                    <button
                        onClick={() => onComplete(order.id)}
                        className="text-[10px] font-bold text-juice-green bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-md hover:bg-green-100 transition"
                    >
                        Complete
                    </button>
                )}
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Rs {payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

export default function DashboardPage() {
    const {
        darkMode, getTodaysSales, getPendingOrders, getLowStockItems,
        getBestSellers, getTodaysOrders, getWeeklySales, updateOrderStatus,
        setCurrentPage
    } = useApp();

    const todaysSales = getTodaysSales();
    const pendingOrders = getPendingOrders();
    const lowStock = getLowStockItems();
    const bestSellers = getBestSellers();
    const todaysOrders = getTodaysOrders();
    const weeklySales = getWeeklySales();
    const maxSold = bestSellers.length > 0 ? bestSellers[0].count : 0;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                <StatCard
                    icon={DollarSign}
                    label="Today's Sales"
                    value={`Rs ${todaysSales.toLocaleString()}`}
                    color="text-juice-green"
                    bgColor="bg-green-50"
                    darkBgColor="bg-green-500/10"
                    darkMode={darkMode}
                />
                <StatCard
                    icon={ShoppingCart}
                    label="Today's Orders"
                    value={todaysOrders.length}
                    color="text-juice-blue"
                    bgColor="bg-blue-50"
                    darkBgColor="bg-blue-500/10"
                    darkMode={darkMode}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Pending"
                    value={pendingOrders.length}
                    color="text-juice-orange"
                    bgColor="bg-orange-50"
                    darkBgColor="bg-orange-500/10"
                    darkMode={darkMode}
                />
                <StatCard
                    icon={AlertTriangle}
                    label="Low Stock"
                    value={`${lowStock.length} items`}
                    color="text-juice-red"
                    bgColor="bg-red-50"
                    darkBgColor="bg-red-500/10"
                    darkMode={darkMode}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Sales Chart */}
                <div className={`p-6 rounded-2xl border shadow-sm card-hover
          ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
                    <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                        <TrendingUp size={20} className="text-juice-orange" />
                        Weekly Sales
                    </h3>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklySales}>
                                <defs>
                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#f1f5f9'} />
                                <XAxis dataKey="day" tick={{ fontSize: 12, fill: darkMode ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: darkMode ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="sales" stroke="#f97316" fill="url(#salesGradient)" strokeWidth={2.5} dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Best Sellers */}
                <div className={`p-6 rounded-2xl border shadow-sm card-hover
          ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
                    <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                        🏆 Best Sellers Today
                    </h3>
                    <div className="space-y-4">
                        {bestSellers.length > 0 ? bestSellers.map((bs, i) => (
                            <BestSellerBar
                                key={bs.name}
                                name={bs.name}
                                count={bs.count}
                                maxCount={maxSold}
                                emoji={bs.juice?.emoji || '🧃'}
                                color={bs.juice?.color}
                                darkMode={darkMode}
                                index={i}
                            />
                        )) : (
                            <div className={`text-center py-12 ${darkMode ? 'text-dark-muted' : 'text-gray-400'}`}>
                                <p className="text-4xl mb-3">📊</p>
                                <p className="font-medium">No sales yet today</p>
                                <p className="text-sm mt-1">Start taking orders to see analytics</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Orders + Low Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Pending */}
                <div className={`p-6 rounded-2xl border shadow-sm
          ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-lg flex items-center gap-2 ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                            🕐 Recent Pending
                        </h3>
                        <button
                            onClick={() => setCurrentPage('orders')}
                            className="text-sm text-juice-orange font-semibold hover:underline"
                        >View All</button>
                    </div>
                    <div className="space-y-1">
                        {pendingOrders.slice(0, 5).map(order => (
                            <RecentOrderItem
                                key={order.id}
                                order={order}
                                darkMode={darkMode}
                                onComplete={(id) => updateOrderStatus(id, 'done')}
                            />
                        ))}
                        {pendingOrders.length === 0 && (
                            <div className={`text-center py-8 ${darkMode ? 'text-dark-muted' : 'text-gray-400'}`}>
                                <p className="text-3xl mb-2">✅</p>
                                <p className="font-medium">All caught up!</p>
                                <p className="text-sm">No pending orders</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className={`p-6 rounded-2xl border shadow-sm
          ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
                    <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                        <AlertTriangle size={20} className="text-juice-red" />
                        Low Stock Alerts
                    </h3>
                    <div className="space-y-3">
                        {lowStock.length > 0 ? lowStock.map(item => (
                            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl
                ${darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'} border`}>
                                <span className="text-xl">{item.emoji}</span>
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>{item.name}</p>
                                    <p className="text-xs text-juice-red font-medium">Only {item.stock} left!</p>
                                </div>
                                <button
                                    onClick={() => {/* Navigate to inventory */ }}
                                    className="text-xs font-bold text-juice-orange hover:underline"
                                >
                                    Restock
                                </button>
                            </div>
                        )) : (
                            <div className={`text-center py-8 ${darkMode ? 'text-dark-muted' : 'text-gray-400'}`}>
                                <p className="text-3xl mb-2">📦</p>
                                <p className="font-medium">Stock levels are healthy</p>
                                <p className="text-sm">All items above threshold</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
