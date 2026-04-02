import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import {
  Truck, Package, CheckCircle, RefreshCw, ShoppingBag, Calendar,
  CreditCard, Hash, ArrowRight, Sparkles
} from 'lucide-react';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder]     = useState('newest');
  const navigate = useNavigate();

  const loadOrderData = async () => {
    try {
      if (!token) return;
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status:           order.status,
              payment:          order.payment,
              paymentMethod:    order.paymentMethod,
              date:             order.date,
              orderId:          order._id,
              price:            item.finalPrice || item.basePrice || item.price || 0,
              quantity:         item.quantity || 1,
              image:            item.image || item.customization?.canvasDesign?.pngUrl || '',
              type:             item.type || 'READY_MADE',
              productionStatus: item.productionStatus,
              customization:    item.customization,
              // style customisations for READY_MADE items
              neckStyle:            item.neckStyle || '',
              sleeveStyle:          item.sleeveStyle || '',
              specialInstructions:  item.specialInstructions || '',
            });
          });
        });

        allOrdersItem.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrderData(allOrdersItem);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrderData(); }, [token]);
  useEffect(() => { document.title = 'Order History | Aarovi'; }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':                                  return <CheckCircle size={16} className="text-green-600" />;
      case 'shipped': case 'out for delivery': case 'shipping': return <Truck size={16} className="text-blue-600" />;
      case 'processing':                                 return <RefreshCw size={16} className="text-amber-600" />;
      default:                                           return <Package size={16} className="text-text/50" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':                                         return 'text-green-700 bg-green-50 border-green-200';
      case 'shipped': case 'out for delivery': case 'shipping': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'processing':                                        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'cancelled':                                         return 'text-red-700 bg-red-50 border-red-200';
      default:                                                  return 'text-text/70 bg-[#FBF7F3]/20 border-background';
    }
  };

  const getProductionStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'designing':     return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'cutting':       return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'stitching':     return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'finishing':     return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'quality_check': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'ready':         return 'text-green-700 bg-green-50 border-green-200';
      default:              return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getFilteredOrders = () => {
    let filtered = filterStatus !== 'all'
      ? orderData.filter(o => o.status?.toLowerCase() === filterStatus.toLowerCase())
      : orderData;

    return sortOrder === 'oldest'
      ? [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date))
      : [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredOrders = getFilteredOrders();

  const stats = {
    total:     orderData.length,
    delivered: orderData.filter(i => i.status?.toLowerCase() === 'delivered').length,
    processing: orderData.filter(i =>
      ['processing','shipped','shipping','out for delivery'].includes(i.status?.toLowerCase())
    ).length,
    totalSpent: orderData.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-[68px]" style={{ background: "#FBF7F3" }}>
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse mb-3" />
            <div className="h-4 bg-gray-100 rounded w-64 animate-pulse" />
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-5xl mx-auto space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="p-5 border-b border-gray-100 flex gap-6">
                  <div className="h-4 bg-gray-200 rounded w-40" />
                  <div className="h-4 bg-gray-100 rounded w-28" />
                </div>
                <div className="p-5 flex gap-5">
                  <div className="w-28 h-28 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[68px]" style={{ background: "#FBF7F3" }}>
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: "#AF8255" }}>Your Orders</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-4" style={{ fontFamily: "'Cormorant Garamond',serif", color: "#2A1506" }}>Order History</h1>
          {orderData.length > 0 && (
            <p className="text-text/60 font-light text-lg">
              Track and manage your {orderData.length} order{orderData.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">

          {/* Stats */}
          {orderData.length > 0 && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Orders', value: stats.total,     icon: Package,      bg: 'from-[#FBF7F3]/30 to-primary', border: 'border-background', vc: 'text-text',       ic: 'text-[#4F200D]' },
                  { label: 'Delivered',    value: stats.delivered, icon: CheckCircle,  bg: 'from-green-50 to-green-100',    border: 'border-green-200',  vc: 'text-green-700',  ic: 'text-green-600' },
                  { label: 'In Transit',   value: stats.processing,icon: Truck,        bg: 'from-blue-50 to-blue-100',      border: 'border-blue-200',   vc: 'text-blue-700',   ic: 'text-blue-600'  },
                ].map(({ label, value, icon: Icon, bg, border, vc, ic }) => (
                  <div key={label} className={`bg-gradient-to-br ${bg} rounded-lg p-6 border ${border}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon size={20} className={ic} />
                      <span className={`text-xs font-semibold uppercase tracking-wider ${vc}/70`}>{label}</span>
                    </div>
                    <p className={`text-3xl font-bold ${vc}`}>{value}</p>
                  </div>
                ))}
                <div className="bg-gradient-to-br from-[#FBF7F3]/30 to-primary rounded-lg p-6 border border-background">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard size={20} className="text-[#4F200D]" />
                    <span className="text-xs font-semibold text-text/50 uppercase tracking-wider">Total Spent</span>
                  </div>
                  <p className="text-3xl font-bold text-[#4F200D]">{currency}{stats.totalSpent.toFixed(2)}</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg border border-background shadow-sm p-6 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-wrap gap-3">
                    {[
                      { key: 'all',        label: 'All Orders' },
                      { key: 'delivered',  label: 'Delivered'  },
                      { key: 'shipped',    label: 'Shipped'    },
                      { key: 'processing', label: 'Processing' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setFilterStatus(key)}
                        className={`px-5 py-2.5 text-sm font-semibold tracking-wide rounded-lg border-2 transition-all duration-300 ${
                          filterStatus === key
                            ? 'bg-[#4F200D] text-white border-[#4F200D] shadow-md'
                            : 'bg-white text-text border-background hover:border-[#4F200D] hover:text-[#4F200D]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-text/50 uppercase tracking-wider">Sort:</span>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="appearance-none border-2 border-background bg-white px-4 py-2.5 pr-8 font-semibold rounded-lg focus:border-[#4F200D] focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Empty state */}
          {orderData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-background shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FBF7F3]/30 to-primary rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={40} className="text-[#4F200D]" />
              </div>
              <div className="text-center max-w-md mb-8">
                <h3 className="text-2xl font-serif font-semibold mb-3 text-text">No Orders Yet</h3>
                <p className="text-text/70 font-light leading-relaxed">
                  Your order history is empty. Start exploring our amazing collection.
                </p>
              </div>
              <button
                onClick={() => navigate('/shop/collection')}
                className="px-8 py-4 bg-[#4F200D] text-white font-semibold rounded-lg hover:bg-[#4F200D]/90 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <span>Browse Collection</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((item, index) => (
                <div
                  key={`${item.orderId}-${index}`}
                  className="bg-white rounded-lg border border-background shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Order header */}
                  <div className="p-6 border-b border-background bg-gradient-to-r from-[#FBF7F3]/20 to-primary">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Hash size={14} className="text-text/40" />
                          <span className="text-xs font-semibold text-text/50 uppercase tracking-wider">Order ID:</span>
                          <span className="font-bold text-text tracking-wide">{item.orderId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-text/40" />
                          <span className="text-sm text-text/70 font-medium">{formatDate(item.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} className="text-text/40" />
                          <span className="text-sm text-text/70 font-medium">{item.paymentMethod}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className={`px-4 py-1.5 border-2 text-xs font-bold uppercase tracking-wider rounded-md ${getStatusColor(item.status)}`}>
                          {item.status || 'Processing'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order content */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <div className="w-full h-48 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                          {item.image ? (
                            <img
                              className="w-full h-full object-contain"
                              src={item.image}
                              alt={item.name}
                              onError={(e) => { e.target.src = '/placeholder-dress.png'; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {item.type === 'CUSTOM'
                                ? <Sparkles size={40} className="text-[#4F200D]/80" />
                                : <Package size={40} className="text-text/30" />
                              }
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-grow flex flex-col lg:flex-row justify-between gap-6">
                        <div className="flex-grow space-y-4">
                          <div>
                            <h3 className="font-serif font-semibold text-xl text-text mb-2 tracking-wide group-hover:text-[#4F200D] transition-colors line-clamp-2">
                              {item.name}
                            </h3>
                            {item.type === 'CUSTOM' && (
                              <span className="inline-block px-3 py-1 bg-[#4F200D] text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                Custom Design
                              </span>
                            )}
                          </div>

                          {/* Core details grid */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <span className="block text-xs font-semibold text-text/50 uppercase tracking-wider">Price</span>
                              <span className="font-bold text-text text-lg">{currency}{Number(item.price || 0).toFixed(2)}</span>
                            </div>
                            <div className="space-y-1">
                              <span className="block text-xs font-semibold text-text/50 uppercase tracking-wider">Quantity</span>
                              <span className="font-bold text-text">{item.quantity}</span>
                            </div>
                            <div className="space-y-1">
                              <span className="block text-xs font-semibold text-text/50 uppercase tracking-wider">
                                {item.type === 'CUSTOM' ? 'Size' : 'Size'}
                              </span>
                              <span className="inline-block px-3 py-1 bg-gradient-to-br from-[#FBF7F3]/30 to-primary rounded-md font-semibold text-text text-sm">
                                {item.type === 'CUSTOM'
                                  ? (item.customization?.size || item.size || 'Custom')
                                  : (item.size || 'Standard')}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <span className="block text-xs font-semibold text-text/50 uppercase tracking-wider">Total</span>
                              <span className="font-bold text-[#4F200D] text-lg">
                                {currency}{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* ── Style customisations for READY_MADE items ── */}
                          {item.type !== 'CUSTOM' && (item.neckStyle || item.sleeveStyle || item.specialInstructions) && (
                            <div className="p-3 bg-primary/80 border border-gray-200 rounded-lg space-y-2">
                              <p className="text-xs font-semibold text-text/60 uppercase tracking-wider">Style Customisations</p>
                              <div className="flex flex-wrap gap-2">
                                {item.neckStyle && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold capitalize">
                                    {item.neckStyle} neck
                                  </span>
                                )}
                                {item.sleeveStyle && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold capitalize">
                                    {item.sleeveStyle} sleeve
                                  </span>
                                )}
                                {item.specialInstructions && (
                                  <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-semibold">
                                    📝 Note added
                                  </span>
                                )}
                              </div>
                              {item.specialInstructions && (
                                <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
                                  <span className="font-semibold">Special Instructions: </span>
                                  {item.specialInstructions}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Custom item production status */}
                          {item.type === 'CUSTOM' && item.productionStatus && (
                            <div className="mt-4 p-3 bg-primary/80 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Package size={16} className="text-[#4F200D]" />
                                <span className="text-xs font-semibold text-text uppercase tracking-wider">Production:</span>
                                <span className={`px-3 py-1 border-2 text-xs font-bold uppercase tracking-wider rounded-md ${getProductionStatusColor(item.productionStatus)}`}>
                                  {item.productionStatus.replace('_', ' ')}
                                </span>
                              </div>
                              {item.customization && (
                                <div className="mt-3 text-xs text-text/80 space-y-1">
                                  {item.customization.fabric    && <p><span className="font-semibold">Fabric:</span> {item.customization.fabric}</p>}
                                  {item.customization.color     && <p><span className="font-semibold">Color:</span> {item.customization.color}</p>}
                                  {item.customization.size      && <p><span className="font-semibold">Size:</span> {item.customization.size}</p>}
                                  {item.customization.neckStyle && <p><span className="font-semibold">Neckline:</span> <span className="capitalize">{item.customization.neckStyle}</span></p>}
                                  {item.customization.sleeveStyle && <p><span className="font-semibold">Sleeve:</span> <span className="capitalize">{item.customization.sleeveStyle}</span></p>}
                                  {item.customization.specialInstructions && (
                                    <div className="mt-1 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                                      <span className="font-semibold">Special Instructions: </span>
                                      {item.customization.specialInstructions}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex lg:flex-col items-center lg:items-end justify-start lg:justify-center gap-3">
                          <button
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4F200D] text-white font-semibold tracking-wide rounded-lg hover:bg-[#4F200D]/80 transition-all duration-300 shadow-md hover:shadow-lg"
                            onClick={() => navigate(`/status/${item.orderId}`)}
                          >
                            <Truck size={16} />
                            <span>Track Order</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && filterStatus !== 'all' && (
                <div className="text-center py-20 bg-white rounded-lg border border-background shadow-sm">
                  <Package size={48} className="text-text/30 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold text-text mb-2">No {filterStatus} orders found</h3>
                  <p className="text-text/60">Try selecting a different filter</p>
                </div>
              )}

              <div className="mt-12 bg-gradient-to-br from-[#FBF7F3]/20 to-primary rounded-lg border border-background p-8 text-center shadow-sm">
                <h3 className="text-2xl font-serif font-semibold text-text mb-3 tracking-wide">Want to Order More?</h3>
                <p className="text-text/70 font-light leading-relaxed mb-6 max-w-md mx-auto">
                  Discover new arrivals and trending products in our collection of handcrafted fashion.
                </p>
                <button
                  onClick={() => navigate('/shop/collection')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#4F200D] text-white font-semibold rounded-lg hover:bg-[#4F200D]/90 transition-all duration-300 shadow-lg"
                >
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Orders;