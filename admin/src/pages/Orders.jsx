import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ShoppingBag, User, MapPin, CreditCard, Package2, Filter, Search, CheckCircle, Clock, Truck, Package, PackageCheck, AlertCircle, Phone, IndianRupee, Grid, List as ListIcon, RefreshCw, TrendingUp, BarChart3
} from 'lucide-react';

// Mock data for demonstration
const backendUrl = 'http://localhost:4000';
const currency = '₹';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    "Order Placed": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Package,
      dotColor: "bg-blue-500"
    },
    "Processing": {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
      dotColor: "bg-yellow-500"
    },
    "Shipping": {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Truck,
      dotColor: "bg-purple-500"
    },
    "Out of delivery": {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: Package2,
      dotColor: "bg-orange-500"
    },
    "Delivered": {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: PackageCheck,
      dotColor: "bg-green-500"
    }
  };

  const config = statusConfig[status] || statusConfig["Order Placed"];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.color}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
      <Icon size={12} />
      {status}
    </span>
  );
};

const PaymentBadge = ({ payment, paymentMethod }) => (
  <div className="space-y-1">
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${payment ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
      {payment ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
      {payment ? 'Paid' : 'Pending'}
    </span>
    <p className="text-xs text-gray-600 font-medium">{paymentMethod}</p>
  </div>
);

const OrderCard = ({ order, index, onStatusChange }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
    <div className="bg-black text-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag size={24} className="text-gray-300" />
          <div>
            <h3 className="text-xl font-semibold">Order #{index + 1}</h3>
            <p className="text-gray-300 mt-1">{new Date(order.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>
    </div>

    <div className="p-6 space-y-6">
      {/* Order Items */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-4">
          <Package size={16} />
          Order Items ({order.items.length})
        </h4>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package size={16} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                  {item.size && (
                    <span className="text-sm text-gray-600">Size: {item.size}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer & Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
            <User size={16} />
            Customer Information
          </h4>
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">{order.address.Name}</p>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} />
              <span className="text-sm">{order.address.phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
            <MapPin size={16} />
            Delivery Address
          </h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>{order.address.street}</p>
            <p>{order.address.city}, {order.address.country}</p>
            <p className="font-medium">PIN: {order.address.pincode}</p>
          </div>
        </div>
      </div>

      {/* Payment, Amount & Status Update */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
            <CreditCard size={16} />
            Payment Status
          </h4>
          <PaymentBadge payment={order.payment} paymentMethod={order.paymentMethod} />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
            <IndianRupee size={16} />
            Total Amount
          </h4>
          <div className="flex items-center gap-1">
            <IndianRupee size={18} className="text-green-600" />
            <span className="text-xl font-bold text-green-600">{order.amount}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
            <Package2 size={16} />
            Update Status
          </h4>
          <select
            onChange={(event) => onStatusChange(event, order._id)}
            value={order.status}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
          >
            <option value="Order Placed">Order Placed</option>
            <option value="Processing">Processing</option>
            <option value="Shipping">Shipping</option>
            <option value="Out of delivery">Out of delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [authError, setAuthError] = useState(false);

  // Fetch Orders with improved error handling
  const fetchAllOrders = async () => {
    if (!token) {
      toast.error('Authentication token is missing. Please log in again.');
      setAuthError(true);
      return;
    }

    setLoading(true);
    setAuthError(false);

    try {
      const response = await axios.get(
        `${backendUrl}/api/order/list`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('Response:', response.data);

      if (response.data.success) {
        const ordersData = response.data.orders.reverse();
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } else {
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 401) {
          setAuthError(true);
          toast.error('Authentication failed. Please log in again.');
          console.error('Auth error details:', {
            status,
            message,
            token: token ? 'Present (length: ' + token.length + ')' : 'Missing'
          });
        } else if (status === 403) {
          toast.error('Access denied. You do not have permission to view orders.');
        } else if (status === 404) {
          toast.error('Orders endpoint not found. Please check the API configuration.');
        } else {
          toast.error(`Server Error: ${message || 'Unable to fetch orders'}`);
        }
      } else if (error.request) {
        toast.error('Network Error: Could not connect to the server');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.success) {
        toast.success('Order status updated successfully');
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
      } else {
        toast.error('Failed to update order status');
      }
    }
  };

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order =>
        order.address?.Name?.toLowerCase().includes(searchLower) ||
        order.address?.phone?.includes(searchTerm) ||
        order.items?.some(item => item.name?.toLowerCase().includes(searchLower)) ||
        order.address?.city?.toLowerCase().includes(searchLower) ||
        order.address?.country?.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (paymentFilter) {
      filtered = filtered.filter(order => {
        if (paymentFilter === 'paid') return order.payment;
        if (paymentFilter === 'pending') return !order.payment;
        return true;
      });
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(order => order.status === 'Order Placed').length,
    processing: orders.filter(order => order.status === 'Processing').length,
    delivered: orders.filter(order => order.status === 'Delivered').length,
    revenue: orders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0)
  };

  // Show authentication error message
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Your session has expired or you don't have permission to view orders. Please log in again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ORDER <span className="text-gray-600">MANAGEMENT</span>
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Track, manage, and update all customer orders from one dashboard
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-black text-white p-6">
            <div className="flex items-center gap-3">
              <BarChart3 size={24} className="text-gray-300" />
              <h2 className="text-xl font-semibold">Order Statistics</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="text-blue-600" size={24} />
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Package className="text-purple-600" size={24} />
                </div>
                <p className="text-sm text-gray-600 mb-1">Processing</p>
                <p className="text-3xl font-bold text-purple-600">{stats.processing}</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <PackageCheck className="text-green-600" size={24} />
                </div>
                <p className="text-sm text-gray-600 mb-1">Delivered</p>
                <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
              </div>

              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="text-emerald-600" size={24} />
                </div>
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee size={18} className="text-emerald-600" />
                  <span className="text-2xl font-bold text-emerald-600">{stats.revenue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-black text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search size={24} className="text-gray-300" />
                <h2 className="text-xl font-semibold">Search & Filter Orders</h2>
              </div>
              <button
                onClick={fetchAllOrders}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by customer name, phone, product, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                >
                  <option value="">All Status</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Out of delivery">Out of delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                >
                  <option value="">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <ListIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-black text-white p-6">
            <div className="flex items-center gap-3">
              <ShoppingBag size={24} className="text-gray-300" />
              <h2 className="text-xl font-semibold">Customer Orders</h2>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg text-gray-600 font-medium">Loading orders...</span>
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {orders.length === 0
                    ? "Your store hasn't received any orders yet"
                    : "Try adjusting your filters"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order, index) => (
                  <OrderCard
                    key={order._id || index}
                    order={order}
                    index={index}
                    onStatusChange={statusHandler}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;