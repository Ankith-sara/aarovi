import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ShoppingBag, User, MapPin, CreditCard, Package2, Filter, Search, CheckCircle, Clock, Truck, Package, PackageCheck, AlertCircle, Phone, IndianRupee, RefreshCw, TrendingUp, BarChart3, Sparkles, Eye, Download, Palette, Ruler, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { backendUrl, currency } from '../App';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    "Order Placed": {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Package,
      dotColor: "bg-blue-500"
    },
    "Processing": {
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: Clock,
      dotColor: "bg-yellow-500"
    },
    "Shipping": {
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: Truck,
      dotColor: "bg-purple-500"
    },
    "Out for delivery": {
      color: "bg-orange-50 text-orange-700 border-orange-200",
      icon: Package2,
      dotColor: "bg-orange-500"
    },
    "Delivered": {
      color: "bg-green-50 text-green-700 border-green-200",
      icon: PackageCheck,
      dotColor: "bg-green-500"
    }
  };

  const config = statusConfig[status] || statusConfig["Order Placed"];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${config.color}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
      <Icon size={12} />
      {status}
    </span>
  );
};

const ProductionStatusBadge = ({ status }) => {
  const statusConfig = {
    'DESIGNING': 'bg-blue-50 text-blue-700 border-blue-200',
    'CUTTING': 'bg-orange-50 text-orange-700 border-orange-200',
    'STITCHING': 'bg-purple-50 text-purple-700 border-purple-200',
    'QC': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'READY': 'bg-green-50 text-green-700 border-green-200'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${statusConfig[status] || statusConfig.DESIGNING}`}>
      {status}
    </span>
  );
};

const PaymentBadge = ({ payment, paymentMethod, transactionId }) => (
  <div className="space-y-1">
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${payment ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
      }`}>
      {payment ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
      {payment ? 'Paid' : 'Pending'}
    </span>
    <div className="flex items-center gap-1">
      <p className="text-xs text-text/60 font-medium">{paymentMethod}</p>
      {paymentMethod === 'QR' && <QrCode size={12} className="text-green-600" />}
    </div>
    {transactionId && (
      <p className="text-xs text-green-600 font-mono truncate" title={transactionId}>
        ID: {transactionId.substring(0, 12)}...
      </p>
    )}
  </div>
);

const CanvasModal = ({ item, onClose }) => {
  // Get the canvas image - check multiple possible locations
  const canvasImage = item.customization?.canvasDesign?.pngUrl ||
    item.customization?.canvasDesign?.png ||
    item.image;

  const downloadCanvas = () => {
    if (canvasImage) {
      const link = document.createElement('a');
      link.href = canvasImage;
      link.download = `${item.name.replace(/\s+/g, '_')}_canvas.png`;
      link.click();
    }
  };

  const downloadSVG = () => {
    const svgData = item.customization?.canvasDesign?.svg;
    if (svgData) {
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.name.replace(/\s+/g, '_')}_canvas.svg`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const TransactionIdDisplay = ({ transactionId }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
      navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
        <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-3">
          <QrCode size={16} className="text-green-600" />
          Transaction ID
        </h4>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white px-3 py-2 rounded-lg border border-green-200">
            <p className="text-sm font-mono font-semibold text-green-700 break-all">
              {transactionId}
            </p>
          </div>
          <button
            onClick={copyToClipboard}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
            title="Copy transaction ID"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <p className="text-xs text-green-600 font-medium mt-2">
          ✓ Payment verified via QR code
        </p>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10 flex items-center justify-between sticky top-0 z-10 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
              <Sparkles size={20} className="text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-text">Canvas Design Preview</h2>
              <p className="text-sm text-text/50 font-light">{item.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text/40 hover:text-text hover:bg-background/30 rounded-xl transition-all duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Canvas Image */}
        <div className="p-6">
          {canvasImage ? (
            <div className="mb-6 bg-gray-50 rounded-xl p-4 border-2 border-background/30">
              <img
                src={canvasImage}
                alt="Canvas Design"
                className="w-full max-h-[500px] object-contain rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-64 items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <Palette size={48} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Canvas image not available</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 bg-gray-50 rounded-xl p-8 border-2 border-background/30 flex items-center justify-center h-64">
              <div className="text-center">
                <Palette size={48} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No canvas design available</p>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Design Details */}
            <div className="bg-background/20 rounded-xl p-4 border border-background/30">
              <h4 className="font-serif font-bold text-text flex items-center gap-2 mb-4">
                <Palette size={18} className="text-secondary" />
                Design Details
              </h4>
              <div className="space-y-2 text-sm">
                {item.customization?.gender && (
                  <div className="flex justify-between">
                    <span className="text-text/60 font-light">Gender:</span>
                    <span className="font-semibold">{item.customization.gender}</span>
                  </div>
                )}
                {item.customization?.dressType && (
                  <div className="flex justify-between">
                    <span className="text-text/60 font-light">Dress Type:</span>
                    <span className="font-semibold">{item.customization.dressType}</span>
                  </div>
                )}
                {item.customization?.fabric && (
                  <div className="flex justify-between">
                    <span className="text-text/60 font-light">Fabric:</span>
                    <span className="font-semibold">{item.customization.fabric}</span>
                  </div>
                )}
                {item.customization?.color && (
                  <div className="flex justify-between items-center">
                    <span className="text-text/60 font-light">Color:</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-background/40"
                        style={{ backgroundColor: item.customization.color }}
                      />
                      <span className="text-xs font-mono">{item.customization.color}</span>
                    </div>
                  </div>
                )}
                {item.customization?.neckStyle && (
                  <div className="flex justify-between">
                    <span className="text-text/60 font-light">Neck Style:</span>
                    <span className="font-semibold">{item.customization.neckStyle}</span>
                  </div>
                )}
                {item.customization?.sleeveStyle && (
                  <div className="flex justify-between">
                    <span className="text-text/60 font-light">Sleeve Style:</span>
                    <span className="font-semibold">{item.customization.sleeveStyle}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Measurements */}
            {item.customization?.measurements && Object.values(item.customization.measurements).some(v => v) && (
              <div className="bg-background/20 rounded-xl p-4 border border-background/30">
                <h4 className="font-serif font-bold text-text flex items-center gap-2 mb-4">
                  <Ruler size={18} className="text-secondary" />
                  Measurements
                </h4>
                <div className="space-y-2 text-sm">
                  {item.customization.measurements.bust && (
                    <div className="flex justify-between">
                      <span className="text-text/60 font-light">Bust:</span>
                      <span className="font-semibold">{item.customization.measurements.bust}"</span>
                    </div>
                  )}
                  {item.customization.measurements.waist && (
                    <div className="flex justify-between">
                      <span className="text-text/60 font-light">Waist:</span>
                      <span className="font-semibold">{item.customization.measurements.waist}"</span>
                    </div>
                  )}
                  {item.customization.measurements.hips && (
                    <div className="flex justify-between">
                      <span className="text-text/60 font-light">Hips:</span>
                      <span className="font-semibold">{item.customization.measurements.hips}"</span>
                    </div>
                  )}
                  {item.customization.measurements.shoulder && (
                    <div className="flex justify-between">
                      <span className="text-text/60 font-light">Shoulder:</span>
                      <span className="font-semibold">{item.customization.measurements.shoulder}"</span>
                    </div>
                  )}
                  {item.customization.measurements.sleeveLength && (
                    <div className="flex justify-between">
                      <span className="text-text/60 font-light">Sleeve Length:</span>
                      <span className="font-semibold">{item.customization.measurements.sleeveLength}"</span>
                    </div>
                  )}
                  {item.customization.measurements.length && (
                    <div className="flex justify-between">
                      <span className="text-text/60 font-light">Length:</span>
                      <span className="font-semibold">{item.customization.measurements.length}"</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Design Notes */}
          {item.customization?.designNotes && (
            <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/20 mb-6">
              <h4 className="font-serif font-bold text-text mb-2">Design Notes:</h4>
              <p className="text-sm text-text/70 font-light">{item.customization.designNotes}</p>
            </div>
          )}

          {/* Download Buttons */}
          <div className="flex gap-3">
            {canvasImage && (
              <button
                onClick={downloadCanvas}
                className="flex-1 px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-secondary/30 font-semibold"
              >
                <Download size={20} />
                Download PNG
              </button>
            )}
            {item.customization?.canvasDesign?.svg && (
              <button
                onClick={downloadSVG}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg font-semibold"
              >
                <Download size={20} />
                Download SVG
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [authError, setAuthError] = useState(false);
  const [selectedCanvas, setSelectedCanvas] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch Orders
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

      if (response.data.success) {
        const ordersData = [...response.data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } else {
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 401) {
          setAuthError(true);
          toast.error('Authentication failed. Please log in again.');
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

  const updateProductionStatus = async (orderId, itemIndex, productionStatus) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/update-production`,
        { orderId, itemIndex, productionStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Production status updated');
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || 'Failed to update production status');
      }
    } catch (error) {
      console.error('Error updating production status:', error);
      toast.error('Failed to update production status');
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
    setCurrentPage(1);
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
    revenue: orders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0),
    customOrders: orders.filter(order => order.items?.some(item => item.type === 'CUSTOM')).length
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPaymentFilter('');
    setCurrentPage(1);
  };

  // Show authentication error message
  if (authError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-background/50 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-600" size={40} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-text mb-2">Authentication Required</h2>
          <p className="text-text/60 font-light mb-6">
            Your session has expired or you don't have permission to view orders. Please log in again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all duration-300 font-semibold shadow-lg shadow-secondary/30"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-2">
              Order Management
            </h1>
            <p className="text-text/50 font-light leading-relaxed">
              Track, manage, and update all customer orders from one dashboard
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden mb-6">
            <div className="p-6 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <BarChart3 size={20} className="text-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-text">Order Statistics</h2>
                  <p className="text-sm text-text/50 font-light">Overview of all orders</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <ShoppingBag className="text-blue-600" size={20} />
                  </div>
                  <p className="text-xs text-text/60 font-light mb-1">Total Orders</p>
                  <p className="text-2xl font-serif font-bold text-blue-600">{stats.total}</p>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Clock className="text-yellow-600" size={20} />
                  </div>
                  <p className="text-xs text-text/60 font-light mb-1">Pending</p>
                  <p className="text-2xl font-serif font-bold text-yellow-600">{stats.pending}</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Package className="text-purple-600" size={20} />
                  </div>
                  <p className="text-xs text-text/60 font-light mb-1">Processing</p>
                  <p className="text-2xl font-serif font-bold text-purple-600">{stats.processing}</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <PackageCheck className="text-green-600" size={20} />
                  </div>
                  <p className="text-xs text-text/60 font-light mb-1">Delivered</p>
                  <p className="text-2xl font-serif font-bold text-green-600">{stats.delivered}</p>
                </div>

                <div className="text-center p-4 bg-pink-50 rounded-xl border border-pink-200">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="text-pink-600" size={20} />
                  </div>
                  <p className="text-xs text-text/60 font-light mb-1">Custom Orders</p>
                  <p className="text-2xl font-serif font-bold text-pink-600">{stats.customOrders}</p>
                </div>

                <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="text-emerald-600" size={20} />
                  </div>
                  <p className="text-xs text-text/60 font-light mb-1">Revenue</p>
                  <div className="flex items-center justify-center gap-0.5">
                    <IndianRupee size={14} className="text-emerald-600" />
                    <span className="text-xl font-serif font-bold text-emerald-600">{stats.revenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden mb-6">
            <div className="p-6 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Search size={20} className="text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-text">Search & Filter</h2>
                    <p className="text-sm text-text/50 font-light">Find orders quickly</p>
                  </div>
                </div>
                <button
                  onClick={fetchAllOrders}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-xl transition-all duration-300 disabled:opacity-50 font-semibold"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-text/70 mb-2">Search Orders</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40" size={20} />
                    <input
                      type="text"
                      placeholder="Search by customer, phone, product, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all duration-300 bg-white font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text/70 mb-2">Order Status</label>
                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40" size={20} />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all duration-300 appearance-none bg-white font-light"
                    >
                      <option value="">All Status</option>
                      <option value="Order Placed">Order Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text/70 mb-2">Payment Status</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40" size={20} />
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all duration-300 appearance-none bg-white font-light"
                    >
                      <option value="">All Payments</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-background/30">
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-text/60 font-light">
                    Showing {currentItems.length} of {filteredOrders.length} orders
                    {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                  </div>
                  {(searchTerm || statusFilter || paymentFilter) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {searchTerm && (
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                          Search: "{searchTerm}"
                        </span>
                      )}
                      {statusFilter && (
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                          Status: {statusFilter}
                        </span>
                      )}
                      {paymentFilter && (
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                          Payment: {paymentFilter === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      )}
                      <button
                        onClick={clearAllFilters}
                        className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full hover:bg-red-100 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden">
            <div className="p-6 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <ShoppingBag size={20} className="text-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-text">Customer Orders</h2>
                  <p className="text-sm text-text/50 font-light">Complete order details</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-3 border-secondary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-lg text-text/60 font-light">Loading orders...</span>
                  </div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-background/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="text-text/30" size={40} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-text mb-3">No orders found</h3>
                  <p className="text-text/50 font-light max-w-md mx-auto mb-6">
                    {orders.length === 0
                      ? "Your store hasn't received any orders yet"
                      : "Try adjusting your search terms or filters to find what you're looking for"
                    }
                  </p>
                  {(searchTerm || statusFilter || paymentFilter) && (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-all duration-300 shadow-lg shadow-secondary/30"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {currentItems.map((order, index) => {
                      const hasCustomItems = order.items?.some(item => item.type === 'CUSTOM');

                      return (
                        <div
                          key={order._id || index}
                          className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden hover:shadow-lg transition-all duration-200 ${hasCustomItems ? 'border-purple-200' : 'border-background/30'}`}
                        >
                          {/* Order Header */}
                          <div className={`p-6 border-b border-background/30 ${hasCustomItems
                            ? 'bg-gradient-to-r from-purple-50 to-pink-50'
                            : 'bg-gradient-to-br from-secondary/5 to-secondary/10'
                            }`}>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasCustomItems ? 'bg-purple-200' : 'bg-secondary/20'}`}>
                                  {hasCustomItems ? (
                                    <Sparkles size={24} className="text-purple-600" />
                                  ) : (
                                    <ShoppingBag size={24} className="text-secondary" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-serif font-bold text-text">
                                      Order #{indexOfFirstItem + index + 1}
                                    </h3>
                                    {hasCustomItems && (
                                      <span className="px-2 py-1 bg-secondary text-white rounded-full text-xs font-bold">
                                        CUSTOM
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-text/60 font-light mt-1">
                                    {new Date(order.date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <StatusBadge status={order.status} />
                            </div>
                          </div>

                          <div className="p-6">
                            {/* Order Items */}
                            <div className="mb-6">
                              <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-4">
                                <Package size={16} />
                                Order Items ({order.items.length})
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className={`flex items-start gap-4 p-4 rounded-xl border ${item.type === 'CUSTOM'
                                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                                      : 'bg-background/10 border-background/30'
                                      }`}
                                  >
                                    {/* Item Image */}
                                    <div className="flex-shrink-0">
                                      {item.image ? (
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm"
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                          }}
                                        />
                                      ) : null}
                                      <div
                                        className={`w-20 h-20 rounded-lg flex items-center justify-center ${item.image ? 'hidden' : 'flex'
                                          } ${item.type === 'CUSTOM'
                                            ? 'bg-gradient-to-br from-purple-200 to-pink-200'
                                            : 'bg-background/30'
                                          }`}
                                      >
                                        {item.type === 'CUSTOM' ? (
                                          <Palette size={24} className="text-purple-600" />
                                        ) : (
                                          <Package size={24} className="text-text/40" />
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      {/* Custom Badge */}
                                      {item.type === 'CUSTOM' && (
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-white rounded-full text-xs font-bold">
                                            CUSTOM
                                          </span>
                                          <ProductionStatusBadge status={item.productionStatus} />
                                        </div>
                                      )}

                                      <p className="font-serif font-bold text-text mb-1">{item.name}</p>

                                      <div className="flex flex-wrap items-center gap-3 text-sm text-text/60 font-light mb-2">
                                        <span>Qty: <span className="font-semibold">{item.quantity}</span></span>
                                        <span>•</span>
                                        <span>Size: <span className="font-semibold">{item.size || 'Custom'}</span></span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1 font-semibold text-secondary">
                                          <IndianRupee size={14} />
                                          {(item.finalPrice || item.basePrice || 0).toLocaleString()}
                                        </div>
                                      </div>

                                      {/* Custom Item Details */}
                                      {item.type === 'CUSTOM' && item.customization && (
                                        <div className="space-y-2 mt-3">
                                          <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                              <span className="text-text/50 font-light">Gender:</span>
                                              <span className="ml-1 font-semibold text-text">{item.customization.gender}</span>
                                            </div>
                                            <div>
                                              <span className="text-text/50 font-light">Dress:</span>
                                              <span className="ml-1 font-semibold text-text">{item.customization.dressType}</span>
                                            </div>
                                            <div>
                                              <span className="text-text/50 font-light">Fabric:</span>
                                              <span className="ml-1 font-semibold text-text">{item.customization.fabric}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <span className="text-text/50 font-light">Color:</span>
                                              <div
                                                className="w-4 h-4 rounded-full border border-background/40 ml-1"
                                                style={{ backgroundColor: item.customization.color }}
                                              />
                                            </div>
                                          </div>

                                          {item.customization.designNotes && (
                                            <div className="p-2 bg-white/60 rounded-lg text-xs">
                                              <span className="font-semibold text-purple-700">Note:</span> {item.customization.designNotes}
                                            </div>
                                          )}

                                          {/* Production Status Update */}
                                          <div className="flex gap-2 mt-3">
                                            <select
                                              value={item.productionStatus}
                                              onChange={(e) => updateProductionStatus(order._id, idx, e.target.value)}
                                              className="flex-1 px-3 py-2 text-xs border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 font-light"
                                            >
                                              <option value="DESIGNING">Designing</option>
                                              <option value="CUTTING">Cutting</option>
                                              <option value="STITCHING">Stitching</option>
                                              <option value="QC">QC</option>
                                              <option value="READY">Ready</option>
                                            </select>

                                            {/* View Canvas Button */}
                                            {item.customization?.canvasDesign?.pngUrl || item.customization?.canvasDesign?.png || item.image ? (
                                              <button
                                                onClick={() => setSelectedCanvas(item)}
                                                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-semibold flex items-center gap-1"
                                              >
                                                <Eye size={12} />
                                                Canvas
                                              </button>
                                            ) : null}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Customer & Delivery Info */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                              <div className="bg-background/20 rounded-xl p-4 border border-background/30">
                                <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-3">
                                  <User size={16} />
                                  Customer Information
                                </h4>
                                <div className="space-y-2">
                                  <p className="font-serif font-bold text-text">{order.address.Name}</p>
                                  <div className="flex items-center gap-2 text-text/60 font-light">
                                    <Phone size={14} />
                                    <span className="text-sm">{order.address.phone}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-background/20 rounded-xl p-4 border border-background/30">
                                <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-3">
                                  <MapPin size={16} />
                                  Delivery Address
                                </h4>
                                <div className="space-y-1 text-sm text-text/60 font-light">
                                  <p>{order.address.street}</p>
                                  <p>{order.address.city}, {order.address.country}</p>
                                  <p className="font-semibold">PIN: {order.address.pincode}</p>
                                </div>
                              </div>
                            </div>

                            {/* Payment, Amount & Status Update */}
                            <div className={`grid grid-cols-1 gap-4 ${order.paymentMethod === 'QR' && order.transactionId
                              ? 'lg:grid-cols-4'
                              : 'lg:grid-cols-3'
                              }`}>
                              {/* Payment Status */}
                              <div className="bg-background/20 rounded-xl p-4 border border-background/30">
                                <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-3">
                                  <CreditCard size={16} />
                                  Payment Status
                                </h4>
                                <PaymentBadge payment={order.payment} paymentMethod={order.paymentMethod} />
                              </div>

                              {/* Transaction ID - Only show for QR payments */}
                              {order.paymentMethod === 'QR' && order.transactionId && (
                                <TransactionIdDisplay transactionId={order.transactionId} />
                              )}

                              {/* Total Amount */}
                              <div className="bg-background/20 rounded-xl p-4 border border-background/30">
                                <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-3">
                                  <IndianRupee size={16} />
                                  Total Amount
                                </h4>
                                <div className="flex items-center gap-1">
                                  <IndianRupee size={20} className="text-secondary" />
                                  <span className="text-2xl font-serif font-bold text-secondary">{order.amount}</span>
                                </div>
                              </div>

                              {/* Update Status */}
                              <div className="bg-background/20 rounded-xl p-4 border border-background/30">
                                <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-3">
                                  <Package2 size={16} />
                                  Update Status
                                </h4>
                                <select
                                  onChange={(event) => statusHandler(event, order._id)}
                                  value={order.status}
                                  className="w-full px-3 py-2 border border-background/40 rounded-lg focus:outline-none focus:border-secondary transition-all duration-300 text-sm font-light"
                                >
                                  <option value="Order Placed">Order Placed</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipping">Shipping</option>
                                  <option value="Out for delivery">Out for delivery</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-background/40 hover:bg-background/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft size={20} />
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
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === page
                                  ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
                                  : 'bg-background/20 text-text hover:bg-background/40'
                                  }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2 py-2 text-text/40">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-background/40 hover:bg-background/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Canvas Modal */}
      {selectedCanvas && (
        <CanvasModal
          item={selectedCanvas}
          onClose={() => setSelectedCanvas(null)}
        />
      )}
    </div>
  );
};

export default Orders;