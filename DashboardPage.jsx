import { useApp } from '../context/AppContext';
import { DollarSign, ShoppingCart, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

function StatCard({ icon: Icon, label, value, color, bgColor, darkBgColor, trend, darkMode }) {
    return (
        <div className={`card-hover p-6 rounded-[24px] flex items-center gap-5 animate-fade-in
      ${darkMode ? 'glass dark' : 'glass-heavy'} shadow-sm relative overflow-hidden group`}>
            {/* Subtle gradient background effect */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[40px] opacity-20 transition-all duration-500 group-hover:opacity-40 group-hover:scale-150 ${bgColor.replace('bg-', 'bg-').split(' ')[0]}`}></div>

            <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center flex-shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110 shadow-sm ${darkMode ? darkBgColor : bgColor}`}>
                <Icon size={28} className={color} />
            </div>
            <div className="flex-1 min-w-0 relative z-10">
                <p className={`text-sm font-semibold tracking-wide uppercase ${darkMode ? 'text-dark-muted' : 'text-gray-500'}`}>{label}</p>
                <h3 className={`text-3xl font-black mt-1 truncate ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>{value}</h3>
            </div>
            {trend && (
                <div className="absolute top-6 right-6 flex items-center gap-1 text-juice-green text-sm font-bold bg-green-50/80 dark:bg-green-500/10 px-2.5 py-1 rounded-xl glass">
                    <ArrowUpRight size={16} strokeWidth={3} />
                    {trend}
                </div>
            )}
        </div>
    );
}

function BestSellerBar({ name, count, maxCount, emoji, color, darkMode, index }) {
    const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
    return (
        <div className="flex items-center gap-4 animate-fade-in p-2.5 hover:bg-white/40 dark:hover:bg-white/5 rounded-2xl transition-colors" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="w-12 h-12 rounded-[16px] bg-gray-50 dark:bg-dark-surface flex items-center justify-center shadow-sm text-2xl flex-shrink-0 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                {emoji}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-[15px] font-bold truncate ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>{name}</span>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${darkMode ? 'bg-dark-surface text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{count} sold</span>
                </div>
                <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-dark-border/50' : 'bg-gray-100'}`}>
                    <div
                        className="h-full rounded-full progress-bar relative"
                        style={{ width: `${pct}%`, background: color || '#ff5e00' }}
                    >
                        <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RecentOrderItem({ order, darkMode, onComplete }) {
    return (
        <div className={`flex items-center gap-4 p-4 rounded-[20px] transition-all duration-300 card-hover
      ${darkMode ? 'bg-dark-surface hover:bg-white/10 border border-white/5' : 'bg-white hover:bg-gray-50/80 border border-gray-100 shadow-sm'}`}>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                {order.emoji}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-[15px] font-bold truncate ${darkMode ? 'text-dark-text' : 'text-gray-800'}`}>
                    {order.juiceName} — <span className="text-juice-orange">{order.size}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${darkMode ? 'bg-dark-bg text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        {new Date(order.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {order.sugar === 'Yes' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-juice-purple bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-md">
                            Sugar
                        </span>
                    )}
                </div>
            </div>
            <div className="text-right pl-2 border-l border-gray-100 dark:border-dark-border/50">
                <p className={`text-[15px] font-black ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>Rs {order.total}</p>
                {order.status === 'pending' && (
                    <button
                        onClick={() => onComplete(order.id)}
                        className="mt-2 text-[11px] font-black uppercase tracking-wide text-juice-green bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-xl hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors"
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
            <div className="recharts-default-tooltip">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">Rs {payload[0].value.toLocaleString()}</p>
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
        <div className="space-y-6 sm:space-y-8 animate-fade-in relative z-10">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 stagger-children">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Weekly Sales Chart */}
                <div className={`p-6 sm:p-8 rounded-[24px] shadow-sm card-hover
          ${darkMode ? 'glass dark' : 'glass-heavy'}`}>
                    <h3 className={`font-black tracking-tight text-xl mb-6 flex items-center gap-3 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                        <div className="p-2 bg-gradient-to-br from-[#ff5e00] to-[#ff8c00] rounded-xl text-white shadow-md">
                            <TrendingUp size={20} strokeWidth={2.5} />
                        </div>
                        Weekly Revenue
                    </h3>
                    <div className="h-64 sm:h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff5e00" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#ff5e00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#222' : '#eef0f3'} />
                                <XAxis dataKey="day" tick={{ fontSize: 13, fontWeight: 600, fill: darkMode ? '#8a8a93' : '#828c96' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 13, fontWeight: 600, fill: darkMode ? '#8a8a93' : '#828c96' }} axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ff5e00', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area type="monotone" dataKey="sales" stroke="#ff5e00" fill="url(#salesGradient)" strokeWidth={4} activeDot={{ r: 8, fill: '#ff5e00', stroke: '#fff', strokeWidth: 3 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Best Sellers */}
                <div className={`p-6 sm:p-8 rounded-[24px] shadow-sm card-hover
          ${darkMode ? 'glass dark' : 'glass-heavy'}`}>
                    <h3 className={`font-black tracking-tight text-xl mb-6 flex items-center gap-3 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                        <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl text-white shadow-md">
                            🏆
                        </div>
                        Best Sellers Today
                    </h3>
                    <div className="space-y-2">
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
                            <div className={`text-center py-16 ${darkMode ? 'text-dark-muted' : 'text-gray-400'}`}>
                                <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-dark-surface rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-sm animate-float">📊</div>
                                <p className="font-bold text-lg text-gray-800 dark:text-gray-300">No sales yet today</p>
                                <p className="text-sm mt-1">Start taking orders to see analytics</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Orders + Low Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Recent Pending */}
                <div className={`p-6 sm:p-8 rounded-[24px] shadow-sm
          ${darkMode ? 'glass dark' : 'glass-heavy'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`font-black tracking-tight text-xl flex items-center gap-3 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl text-white shadow-md">
                                🕐
                            </div>
                            Recent Pending
                        </h3>
                        <button
                            onClick={() => setCurrentPage('orders')}
                            className="text-xs font-black uppercase tracking-wider text-juice-orange bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
                        >View All</button>
                    </div>
                    <div className="space-y-3">
                        {pendingOrders.slice(0, 5).map(order => (
                            <RecentOrderItem
                                key={order.id}
                                order={order}
                                darkMode={darkMode}
                                onComplete={(id) => updateOrderStatus(id, 'done')}
                            />
                        ))}
                        {pendingOrders.length === 0 && (
                            <div className={`text-center py-12 ${darkMode ? 'text-dark-muted' : 'text-gray-400'}`}>
                                <div className="w-20 h-20 mx-auto bg-green-50 dark:bg-green-500/10 rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-sm animate-float">✅</div>
                                <p className="font-bold text-lg text-gray-800 dark:text-gray-300">All caught up!</p>
                                <p className="text-sm mt-1">No pending orders</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className={`p-6 sm:p-8 rounded-[24px] shadow-sm
          ${darkMode ? 'glass dark' : 'glass-heavy'}`}>
                    <h3 className={`font-black tracking-tight text-xl mb-6 flex items-center gap-3 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                        <div className="p-2 bg-gradient-to-br from-red-500 to-red-700 rounded-xl text-white shadow-md">
                            <AlertTriangle size={20} className="text-white" strokeWidth={2.5} />
                        </div>
                        Low Stock Alerts
                    </h3>
                    <div className="space-y-3">
                        {lowStock.length > 0 ? lowStock.map(item => (
                            <div key={item.id} className={`flex items-center gap-4 p-4 rounded-[20px] shadow-sm
                ${darkMode ? 'bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20' : 'bg-gradient-to-r from-red-50 to-white border border-red-100'}`}>
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-dark-surface flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                                    {item.emoji}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-[15px] font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>{item.name}</p>
                                    <p className="text-xs font-black uppercase tracking-wider text-juice-red mt-1">Only {item.stock} left!</p>
                                </div>
                                <button
                                    onClick={() => setCurrentPage('inventory')}
                                    className="text-xs font-black uppercase tracking-wide text-white bg-juice-red px-4 py-2 rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
                                >
                                    Restock
                                </button>
                            </div>
                        )) : (
                            <div className={`text-center py-12 ${darkMode ? 'text-dark-muted' : 'text-gray-400'}`}>
                                <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-dark-surface rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-sm animate-float">📦</div>
                                <p className="font-bold text-lg text-gray-800 dark:text-gray-300">Stock levels are healthy</p>
                                <p className="text-sm mt-1">All items above threshold</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
