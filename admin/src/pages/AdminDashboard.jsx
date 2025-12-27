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
    Clock, CheckCircle, Download, Filter, Search, MoreVertical, TrendingDown
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { backendUrl, currency } from "../App";

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
                    navigate("/login");
                }
            }
        };
        if (token) fetchAdminData();
    }, [token, navigate]);

    return (
        <div className="mt-20 min-h-screen bg-white">
            <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-b border-background/30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                                <Shield size={24} className="text-secondary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-serif font-bold text-text">Admin Dashboard</h1>
                                <p className="text-sm text-text/50 font-light">Management & Analytics</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                                    activeTab === 'dashboard' ? 'bg-secondary text-white shadow-lg shadow-secondary/30' : 'text-text/70 hover:bg-background/40'
                                }`}
                            >
                                <span className="flex items-center gap-2"><BarChart2 size={18} />Dashboard</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                                    activeTab === 'profile' ? 'bg-secondary text-white shadow-lg shadow-secondary/30' : 'text-text/70 hover:bg-background/40'
                                }`}
                            >
                                <span className="flex items-center gap-2"><User size={18} />Profile</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <main className="px-4 sm:px-6 lg:px-8 py-12">
                {activeTab === "dashboard" && <AdminDashboard token={token} />}
                {activeTab === "profile" && <AdminProfile token={token} adminData={adminData} setAdminData={setAdminData} />}
            </main>
        </div>
    );
};

const AdminDashboard = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, pendingOrders: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (token) { fetchOrders(); fetchProducts(); }
    }, [token]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/order/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                const orders = response.data.orders.slice().reverse();
                setOrders(orders);
                setStats(prev => ({ 
                    ...prev, 
                    totalRevenue: orders.reduce((sum, o) => sum + o.amount, 0),
                    totalOrders: orders.length, 
                    pendingOrders: orders.filter(o => !o.payment).length 
                }));
            }
        } catch (error) { console.error(error); }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setProducts(response.data.products);
                setStats(prev => ({ ...prev, totalProducts: response.data.products.length }));
            }
        } catch (error) { console.error(error); }
    };

    const revenueChart = {
        labels: orders.slice(0, 12).reverse().map(o => new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
            label: "Revenue",
            data: orders.slice(0, 12).reverse().map(o => o.amount),
            borderColor: "#e11d48",
            backgroundColor: "rgba(225, 29, 72, 0.1)",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
        }]
    };

    const statusChart = {
        labels: ['Paid', 'Pending', 'Processing'],
        datasets: [{
            data: [orders.filter(o => o.payment).length, orders.filter(o => !o.payment).length, Math.floor(orders.length * 0.2)],
            backgroundColor: ['#10b981', '#f59e0b', '#e11d48'],
        }]
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.address.Name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || (filterStatus === 'paid' && o.payment) || (filterStatus === 'pending' && !o.payment);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-2xl p-8 text-white shadow-xl">
                <h2 className="text-3xl font-serif font-bold mb-2">Welcome back, Admin!</h2>
                <p className="text-white/80 font-light">Here's what's happening with your store today</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: IndianRupee, color: 'green', label: 'Total Revenue', value: `${currency}${stats.totalRevenue.toLocaleString()}`, trend: '+12.5%' },
                    { icon: ShoppingBag, color: 'blue', label: 'Total Orders', value: stats.totalOrders, trend: '+8.2%' },
                    { icon: Package, color: 'purple', label: 'Total Products', value: stats.totalProducts, trend: '+3.1%' },
                    { icon: Clock, color: 'amber', label: 'Pending Orders', value: stats.pendingOrders, trend: '-2.3%', down: true }
                ].map((stat, i) => (
                    <div key={i} className="group bg-white rounded-2xl shadow-md border border-background/50 p-6 hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`text-${stat.color}-600`} size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-${stat.color}-600 text-sm font-semibold`}>
                                {stat.down ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                                <span>{stat.trend}</span>
                            </div>
                        </div>
                        <p className="text-text/60 text-sm font-semibold mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-text">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-background/50">
                    <div className="p-6 border-b border-background/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                                <TrendingUp size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold text-text">Revenue Analytics</h3>
                                <p className="text-sm text-text/50 font-light">Last 12 orders</p>
                            </div>
                        </div>
                        <Download size={16} />
                    </div>
                    <div className="p-6"><div className="h-72"><Line data={revenueChart} /></div></div>
                </div>

                <div className="bg-white rounded-2xl shadow-md border border-background/50">
                    <div className="p-6 border-b border-background/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                                <CheckCircle size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold text-text">Order Status</h3>
                                <p className="text-sm text-text/50 font-light">Distribution</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6"><div className="h-72 flex items-center justify-center"><Doughnut data={statusChart} options={{ cutout: '70%' }} /></div></div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-md border border-background/50">
                <div className="p-6 border-b border-background/30">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                                <ShoppingBag size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold text-text">Recent Orders</h3>
                                <p className="text-sm text-text/50 font-light">{filteredOrders.length} orders</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-background/40 rounded-xl focus:outline-none focus:border-secondary text-sm"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-background/40 rounded-xl focus:outline-none focus:border-secondary text-sm font-semibold"
                            >
                                <option value="all">All</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background/20">
                            <tr>
                                {['Order', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Action'].map(h => (
                                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-text/60 uppercase">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-background/30">
                            {filteredOrders.slice(0, 10).map((order, i) => (
                                <tr key={order._id} className="hover:bg-background/10">
                                    <td className="px-6 py-4"><span className="text-sm font-bold">#{(i + 1).toString().padStart(4, '0')}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-background/40 rounded-full flex items-center justify-center">
                                                <User size={16} />
                                            </div>
                                            <span className="text-sm font-semibold">{order.address.Name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm">{order.items.length} items</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold">{currency}{order.amount.toLocaleString()}</span></td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.payment ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {order.payment ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-text/60">{new Date(order.date).toLocaleDateString()}</span></td>
                                    <td className="px-6 py-4"><button className="p-2 hover:bg-background/40 rounded-lg"><MoreVertical size={16} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
            setEditProfile({ name: adminData.name, email: adminData.email, image: null, imagePreview: adminData.image || "" });
        }
    }, [adminData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setEditProfile(prev => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
    };

    const handleEditProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("name", editProfile.name);
        formData.append("email", editProfile.email);
        if (editProfile.image) formData.append("image", editProfile.image);

        try {
            const res = await axios.put(`${backendUrl}/api/user/profile/${adminData._id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}`, "Content-Type": "multipart/form-data" }
            });
            if (res.data.success) {
                setAdminData(res.data.user);
                toast.success("Profile updated!");
                setEditModalOpen(false);
            }
        } catch (err) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (!adminData) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-background/50 overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-secondary to-secondary/80"></div>
                <div className="px-8 pb-8 relative">
                    <div className="w-36 h-36 rounded-2xl border-4 border-white overflow-hidden -mt-20 mb-6 shadow-2xl">
                        <img src={adminData.image || 'https://via.placeholder.com/150'} alt="Admin" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-4xl font-serif font-bold">{adminData.name}</h2>
                                <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold">ADMIN</span>
                            </div>
                            <div className="flex items-center gap-2 text-text/60 mb-4">
                                <Mail size={18} />
                                <span className="text-lg font-light">{adminData.email}</span>
                            </div>
                            <div className="flex gap-6 text-sm text-text/50 mb-6">
                                <span className="flex items-center gap-2"><Calendar size={16} />Joined {new Date(adminData.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-2"><Activity size={16} /><span className="w-2 h-2 bg-green-500 rounded-full"></span>Active</span>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { icon: Shield, color: 'green', label: 'Status', value: 'Active' },
                                    { icon: Users, color: 'secondary', label: 'Role', value: 'Administrator' },
                                    { icon: Calendar, color: 'orange', label: 'Last Login', value: new Date().toLocaleDateString() }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-background/20 rounded-xl p-5 border border-background/30">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center`}>
                                                <stat.icon size={22} className={`text-${stat.color}-600`} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-text/60 font-semibold">{stat.label}</p>
                                                <p className="font-bold text-text">{stat.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setEditModalOpen(true)}
                            className="px-6 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/30 flex items-center gap-2"
                        >
                            <Edit2 size={18} />Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-background/30">
                            <h3 className="text-xl font-serif font-bold">Edit Profile</h3>
                            <button onClick={() => setEditModalOpen(false)} className="p-2 hover:bg-background/20 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <img src={editProfile.imagePreview || 'https://via.placeholder.com/150'} alt="Preview" className="w-28 h-28 rounded-xl object-cover border-4 border-background/30" />
                                    <label className="absolute -bottom-2 -right-2 bg-secondary text-white p-2 rounded-lg cursor-pointer shadow-lg">
                                        <Camera size={16} />
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text/70 mb-2">Name</label>
                                <input
                                    value={editProfile.name}
                                    onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text/70 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editProfile.email}
                                    onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setEditModalOpen(false)} className="flex-1 px-6 py-3 bg-background/40 rounded-xl font-semibold hover:bg-background/60">Cancel</button>
                                <button onClick={handleEditProfileSubmit} disabled={loading} className="flex-1 px-6 py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary/90 shadow-lg shadow-secondary/30 disabled:opacity-50">
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;