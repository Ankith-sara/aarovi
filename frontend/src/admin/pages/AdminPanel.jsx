import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from "chart.js";
import { useNavigate } from "react-router-dom";
import {
    User, ShoppingBag, BarChart2, Edit2, X, Camera, Mail,
    TrendingUp, Package, Calendar, Activity, Shield,
    Eye, ArrowUpRight, IndianRupee, Sparkles, Users,
    Clock, CheckCircle, Download, Filter, Search, MoreVertical, TrendingDown,
    RefreshCw, MapPin, Phone, CreditCard, Truck, PackageCheck, AlertCircle,
    ChevronLeft, ChevronRight
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { backendUrl, currency } from "../AdminLayout";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

const AdminPanel = ({ token, setToken }) => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [adminData, setAdminData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const decoded = jwtDecode(token);
                const res = await axios.get(`${backendUrl}/api/user/profile/${decoded.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.data.success) setAdminData(res.data.user);
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error('Session expired');
                    setToken('');
                    localStorage.removeItem('token');
                    localStorage.removeItem('adminToken');
                }
            }
        };
        if (token) fetchAdminData();
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-background">
            <section className="sticky top-0 z-30 bg-primary/90 backdrop-blur-xl border-b border-secondary/15">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                                <Shield size={22} className="text-secondary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-polysans tracking-tight font-bold text-text">Admin Dashboard</h1>
                                <p className="text-xs text-text/50 font-light font-inter">Management & Analytics</p>
                            </div>
                        </div>
                        <div className="flex bg-background/60 border border-secondary/10 rounded-full p-1 shadow-sm">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                                    activeTab === 'dashboard' ? 'bg-secondary text-primary shadow-sm' : 'text-text/70 hover:text-text'
                                }`}
                            >
                                <span className="flex items-center gap-2"><BarChart2 size={15} />Dashboard</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                                    activeTab === 'profile' ? 'bg-secondary text-primary shadow-sm' : 'text-text/70 hover:text-text'
                                }`}
                            >
                                <span className="flex items-center gap-2"><User size={15} />Profile</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-inter">
                {activeTab === "dashboard" && <AdminDashboard token={token} />}
                {activeTab === "profile" && <AdminProfile token={token} adminData={adminData} setAdminData={setAdminData} />}
            </main>
        </div>
    );
};

const AdminDashboard = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ 
        totalRevenue: 0, 
        totalOrders: 0, 
        totalProducts: 0, 
        pendingOrders: 0,
        deliveredOrders: 0,
        customOrders: 0,
        avgOrderValue: 0,
        revenueGrowth: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    useEffect(() => {
        if (token) { 
            fetchOrders(); 
            fetchProducts(); 
        }
    }, [token]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/order/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                const ordersData = response.data.orders.slice().reverse();
                setOrders(ordersData);
                calculateStats(ordersData);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const calculateStats = (ordersData) => {
        const totalRevenue = ordersData.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);
        const totalOrders = ordersData.length;
        const pendingOrders = ordersData.filter(o => !o.payment).length;
        const deliveredOrders = ordersData.filter(o => o.status === 'Delivered').length;
        const customOrders = ordersData.filter(o => o.items?.some(item => item.type === 'CUSTOM')).length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Calculate revenue growth (comparing last 30 days vs previous 30 days)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const recentRevenue = ordersData
            .filter(o => new Date(o.date) >= thirtyDaysAgo)
            .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);

        const previousRevenue = ordersData
            .filter(o => new Date(o.date) >= sixtyDaysAgo && new Date(o.date) < thirtyDaysAgo)
            .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);

        const revenueGrowth = previousRevenue > 0 
            ? ((recentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
            : 0;

        setStats({
            totalRevenue,
            totalOrders,
            totalProducts: products.length,
            pendingOrders,
            deliveredOrders,
            customOrders,
            avgOrderValue,
            revenueGrowth: parseFloat(revenueGrowth)
        });
    };

    // Revenue chart data - last 12 orders
    const revenueChart = {
        labels: orders.slice(0, 12).reverse().map(o => 
            new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ),
        datasets: [{
            label: "Revenue",
            data: orders.slice(0, 12).reverse().map(o => parseFloat(o.amount || 0)),
            borderColor: "#4F200D",
            backgroundColor: "rgba(79, 32, 13, 0.06)",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
        }]
    };

    const revenueChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                displayColors: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                ticks: { 
                    callback: (value) => `${currency}${value.toLocaleString()}`,
                    font: { size: 11 }
                }
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } }
            }
        }
    };

    // Order status distribution
    const statusChart = {
        labels: ['Paid', 'Pending'],
        datasets: [{
            data: [
                orders.filter(o => o.payment).length, 
                orders.filter(o => !o.payment).length
            ],
            backgroundColor: ['#4F200D', '#AF8255'],
            borderWidth: 0,
        }]
    };

    const statusChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    font: { size: 12, weight: 'bold' },
                    usePointStyle: true,
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                displayColors: false,
            }
        }
    };

    // Category distribution chart
    const categoryData = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {});

    const categoryChart = {
        labels: Object.keys(categoryData),
        datasets: [{
            label: 'Products by Category',
            data: Object.values(categoryData),
            backgroundColor: ['#4F200D', '#AF8255', 'rgba(79, 32, 13, 0.6)', 'rgba(175, 130, 85, 0.6)'],
            borderWidth: 0,
        }]
    };

    const categoryChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                ticks: { font: { size: 11 } }
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } }
            }
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.address?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             o.address?.phone?.includes(searchTerm);
        const matchesFilter = filterStatus === 'all' || 
                             (filterStatus === 'paid' && o.payment) || 
                             (filterStatus === 'pending' && !o.payment);
        return matchesSearch && matchesFilter;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Banner */}
            <div className="bg-primary rounded-lg border border-secondary/15 overflow-hidden shadow-sm">
                <div className="p-8 bg-background/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-polysans tracking-tight font-bold text-text mb-1">Welcome back, Admin!</h2>
                            <p className="text-text/60 font-light text-sm">Here's what's happening with your store today</p>
                        </div>
                        <button
                            onClick={() => { fetchOrders(); fetchProducts(); }}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-text hover:bg-secondary/20 rounded-full border border-secondary/15 transition-all duration-300 disabled:opacity-50 font-semibold text-xs"
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        icon: IndianRupee, 
                        bgColor: 'bg-secondary/5', 
                        iconColor: 'text-secondary', 
                        label: 'Total Revenue', 
                        value: `${currency}${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
                        trend: `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth}%`,
                        trendUp: stats.revenueGrowth >= 0
                    },
                    { 
                        icon: ShoppingBag, 
                        bgColor: 'bg-gold/5', 
                        iconColor: 'text-gold', 
                        label: 'Total Orders', 
                        value: stats.totalOrders,
                        subValue: `${stats.deliveredOrders} delivered`
                    },
                    { 
                        icon: Package, 
                        bgColor: 'bg-secondary/5', 
                        iconColor: 'text-secondary', 
                        label: 'Total Products', 
                        value: stats.totalProducts,
                        subValue: `${Object.keys(categoryData).length} categories`
                    },
                    { 
                        icon: Sparkles, 
                        bgColor: 'bg-gold/5', 
                        iconColor: 'text-gold', 
                        label: 'Custom Orders', 
                        value: stats.customOrders,
                        subValue: `${stats.pendingOrders} pending payment`
                    }
                ].map((stat, i) => (
                    <div key={i} className="group bg-primary rounded-lg border border-secondary/15 p-6 shadow-sm hover:border-secondary/30 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                <stat.icon className={stat.iconColor} size={22} />
                            </div>
                            {stat.trend && (
                                <div className={`flex items-center gap-1 ${stat.trendUp ? 'text-green-700' : 'text-red-700'} text-xs font-bold`}>
                                    {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    <span>{stat.trend}</span>
                                </div>
                            )}
                        </div>
                        <p className="text-text/50 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className="text-3xl font-polysans tracking-tight font-bold text-text mb-1">{stat.value}</p>
                        {stat.subValue && <p className="text-xs text-text/40 font-light">{stat.subValue}</p>}
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue Analytics */}
                <div className="lg:col-span-2 bg-primary rounded-lg border border-secondary/15 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-secondary/15 bg-background/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                                    <TrendingUp size={18} className="text-secondary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-polysans tracking-tight font-bold text-text">Revenue Analytics</h3>
                                    <p className="text-xs text-text/50 font-light">Last 12 orders trend</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="h-72">
                            <Line data={revenueChart} options={revenueChartOptions} />
                        </div>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="bg-primary rounded-lg border border-secondary/15 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-secondary/15 bg-background/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                                <CheckCircle size={18} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-polysans tracking-tight font-bold text-text">Payment Status</h3>
                                <p className="text-xs text-text/50 font-light">Order distribution</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="h-72 flex items-center justify-center">
                            <Doughnut data={statusChart} options={statusChartOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Distribution */}
            {Object.keys(categoryData).length > 0 && (
                <div className="bg-primary rounded-lg border border-secondary/15 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-secondary/15 bg-background/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                                <Package size={18} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-polysans tracking-tight font-bold text-text">Product Categories</h3>
                                <p className="text-xs text-text/50 font-light">Distribution by category</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="h-72">
                            <Bar data={categoryChart} options={categoryChartOptions} />
                        </div>
                    </div>
                </div>
            )}

            {/* Orders Table */}
            <div className="bg-primary rounded-lg border border-secondary/15 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-secondary/15 bg-background/30">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                                <ShoppingBag size={18} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-polysans tracking-tight font-bold text-text">Recent Orders</h3>
                                <p className="text-xs text-text/50 font-light">{filteredOrders.length} orders found</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" />
                                <input
                                    type="text"
                                    placeholder="Search customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-secondary/15 bg-primary rounded-full focus:outline-none focus:border-secondary text-sm font-light text-text"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-5 pr-10 py-2 border border-secondary/15 bg-primary text-text rounded-full focus:outline-none focus:border-secondary text-sm font-semibold appearance-none cursor-pointer"
                                >
                                    <option value="all">All Orders</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text/55">
                                    <Filter size={12} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm text-text/60 font-light">Loading orders...</span>
                            </div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-background/40 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="text-text/30" size={30} />
                            </div>
                            <h3 className="text-xl font-polysans tracking-tight font-bold text-text mb-2">No orders found</h3>
                            <p className="text-text/50 font-light text-sm">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-lg border border-secondary/15">
                                <table className="w-full">
                                    <thead className="bg-background/40">
                                        <tr>
                                            {['Order', 'Customer', 'Items', 'Amount', 'Status', 'Date'].map(h => (
                                                <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-text/60 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-secondary/10">
                                        {currentItems.map((order, i) => (
                                            <tr key={order._id} className="hover:bg-background/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-text">#{(indexOfFirstItem + i + 1).toString().padStart(4, '0')}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-secondary/10 rounded-full flex items-center justify-center">
                                                            <User size={15} className="text-secondary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-text">{order.address?.Name || 'N/A'}</p>
                                                            <p className="text-xs text-text/45 font-light">{order.address?.phone || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Package size={14} className="text-text/40" />
                                                        <span className="text-sm font-light text-text">{order.items?.length || 0} items</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1">
                                                        <IndianRupee size={12} className="text-secondary" />
                                                        <span className="text-sm font-bold text-secondary">{parseFloat(order.amount || 0).toLocaleString()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                                        order.payment 
                                                            ? 'bg-green-500/10 text-green-700 border-green-500/20' 
                                                            : 'bg-gold/10 text-gold border-gold/20'
                                                    }`}>
                                                        {order.payment ? <CheckCircle size={10} /> : <Clock size={10} />}
                                                        {order.payment ? "Paid" : "Pending"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-text/60">
                                                        <Calendar size={13} />
                                                        <span className="text-sm font-light">{new Date(order.date).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-6 flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-full border border-secondary/20 hover:bg-secondary/5 disabled:opacity-50 disabled:cursor-not-allowed text-text transition-all"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => paginate(page)}
                                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                                            currentPage === page
                                                                ? 'bg-secondary text-primary shadow-sm'
                                                                : 'bg-secondary/10 text-text hover:bg-secondary/20'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                return <span key={page} className="px-2 py-1.5 text-xs text-text/40">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-full border border-secondary/20 hover:bg-secondary/5 disabled:opacity-50 disabled:cursor-not-allowed text-text transition-all"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Quick Insights */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary rounded-lg border border-secondary/15 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                            <TrendingUp size={18} className="text-gold" />
                        </div>
                        <div>
                            <h3 className="text-lg font-polysans tracking-tight font-bold text-text">Average Order Value</h3>
                            <p className="text-xs text-text/50 font-light font-inter">Per transaction</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <IndianRupee size={28} className="text-gold" />
                        <span className="text-4xl font-polysans tracking-tight font-bold text-text">
                            {stats.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                <div className="bg-primary rounded-lg border border-secondary/15 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                            <Activity size={18} className="text-secondary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-polysans tracking-tight font-bold text-text">Recent Activity</h3>
                            <p className="text-xs text-text/50 font-light font-inter">Last 7 days</p>
                        </div>
                    </div>
                    <div className="space-y-3 font-inter">
                        {orders.slice(0, 3).map((order, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-background/20 rounded-lg border border-secondary/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                                        <ShoppingBag size={13} className="text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-text">{order.address?.Name}</p>
                                        <p className="text-xs text-text/45 font-light">
                                            {new Date(order.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-secondary font-bold">
                                    <IndianRupee size={11} />
                                    <span className="text-sm">{parseFloat(order.amount || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminProfile = ({ token, adminData, setAdminData }) => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editProfile, setEditProfile] = useState({ name: "", email: "", image: null, imagePreview: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (adminData) {
            setEditProfile({ 
                name: adminData.name, 
                email: adminData.email, 
                image: null, 
                imagePreview: adminData.image || "" 
            });
        }
    }, [adminData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProfile(prev => ({ 
                ...prev, 
                image: file, 
                imagePreview: URL.createObjectURL(file) 
            }));
        }
    };

    const handleEditProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("name", editProfile.name);
        formData.append("email", editProfile.email);
        if (editProfile.image) formData.append("image", editProfile.image);

        try {
            const res = await axios.put(
                `${backendUrl}/api/user/profile/${adminData._id}`, 
                formData, 
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`, 
                        "Content-Type": "multipart/form-data" 
                    }
                }
            );
            if (res.data.success) {
                setAdminData(res.data.user);
                toast.success("Profile updated successfully!");
                setEditModalOpen(false);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!adminData) {
        return (
            <div className="flex justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-text/60 font-light">Loading profile...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-primary rounded-lg border border-secondary/15 overflow-hidden shadow-sm">
                {/* Header Banner */}
                <div className="h-40 bg-background/40 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent"></div>
                </div>

                <div className="px-8 pb-8 relative font-inter">
                    {/* Profile Image */}
                    <div className="w-32 h-32 rounded-lg border-4 border-primary overflow-hidden -mt-16 mb-6 shadow-sm bg-primary">
                        <img 
                            src={adminData.image || 'https://via.placeholder.com/150'} 
                            alt="Admin" 
                            className="w-full h-full object-cover" 
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-4xl font-polysans tracking-tight font-bold text-text">{adminData.name}</h2>
                                <span className="px-3 py-1 bg-secondary/10 text-text border border-secondary/20 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Shield size={12} />
                                    ADMIN
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-text/60 mb-4 text-sm font-light">
                                <Mail size={16} />
                                <span>{adminData.email}</span>
                            </div>
                            <div className="flex gap-6 text-xs text-text/50 mb-6 font-light">
                                <span className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    Joined {new Date(adminData.createdAt).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Activity size={14} />
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Active Now
                                </span>
                            </div>

                            {/* Profile Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { 
                                        icon: Shield, 
                                        bgColor: 'bg-secondary/5', 
                                        iconColor: 'text-secondary border border-secondary/10', 
                                        label: 'Account Status', 
                                        value: 'Active' 
                                    },
                                    { 
                                        icon: Users, 
                                        bgColor: 'bg-gold/5', 
                                        iconColor: 'text-gold border border-gold/10', 
                                        label: 'Role', 
                                        value: 'Administrator' 
                                    },
                                    { 
                                        icon: Calendar, 
                                        bgColor: 'bg-secondary/5', 
                                        iconColor: 'text-secondary border border-secondary/10', 
                                        label: 'Last Login', 
                                        value: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                    }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-background/30 rounded-lg p-5 border border-secondary/10">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                                <stat.icon size={20} className={stat.iconColor} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-text/50 font-semibold">{stat.label}</p>
                                                <p className="font-bold text-text text-sm">{stat.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setEditModalOpen(true)}
                            className="px-6 py-3 bg-secondary text-primary font-semibold rounded-full hover:bg-secondary/90 transition-all shadow-sm flex items-center justify-center gap-2 h-fit text-sm"
                        >
                            <Edit2 size={16} />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-primary rounded-lg w-full max-w-md border border-secondary/20 shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-secondary/15 bg-background/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                                    <Edit2 size={18} className="text-secondary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-polysans tracking-tight font-bold text-text">Edit Profile</h3>
                                    <p className="text-xs text-text/50 font-light font-inter">Update your information</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setEditModalOpen(false)} 
                                className="p-2 text-text/40 hover:text-text hover:bg-secondary/10 rounded-full transition-all duration-300"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleEditProfileSubmit} className="p-6 space-y-5 font-inter">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <img 
                                        src={editProfile.imagePreview || 'https://via.placeholder.com/150'} 
                                        alt="Preview" 
                                        className="w-24 h-24 rounded-lg object-cover border-2 border-secondary/15" 
                                    />
                                    <label className="absolute -bottom-2 -right-2 bg-secondary text-primary p-2 rounded-full cursor-pointer shadow-sm hover:bg-secondary/90 transition-all">
                                        <Camera size={14} />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange} 
                                            className="hidden" 
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text/70 mb-2 uppercase tracking-wide">Name</label>
                                <input
                                    value={editProfile.name}
                                    onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-secondary/20 rounded-lg bg-primary text-text focus:outline-none focus:border-secondary transition-all text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text/70 mb-2 uppercase tracking-wide">Email</label>
                                <input
                                    type="email"
                                    value={editProfile.email}
                                    onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-secondary/20 rounded-lg bg-primary text-text focus:outline-none focus:border-secondary transition-all text-sm"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setEditModalOpen(false)} 
                                    className="flex-1 px-6 py-2.5 bg-background/50 text-text border border-secondary/15 rounded-full font-semibold text-xs hover:bg-background/80 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading} 
                                    className="flex-1 px-6 py-2.5 bg-secondary text-primary rounded-full font-semibold text-xs hover:bg-secondary/90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;