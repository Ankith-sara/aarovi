import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { Truck, Package, CheckCircle, RefreshCw, ShoppingBag, Calendar, CreditCard, Hash, ArrowRight, Sparkles } from 'lucide-react';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
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
        let allOrdersItem = [];
        
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            const processedItem = {
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
              price: item.finalPrice || item.basePrice || item.price || 0,
              quantity: item.quantity || 1,
              image: item.image || item.customization?.canvasDesign?.pngUrl || '',
              type: item.type || 'READY_MADE',
              productionStatus: item.productionStatus,
              customization: item.customization
            };

            allOrdersItem.push(processedItem);
          });
        });

        allOrdersItem.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setOrderData(allOrdersItem);
        console.log('Loaded orders:', allOrdersItem.length);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  useEffect(() => {
    document.title = 'Order History | Aarovi';
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'shipped':
      case 'out for delivery':
      case 'shipping':
        return <Truck size={16} className="text-blue-600" />;
      case 'processing':
        return <RefreshCw size={16} className="text-amber-600" />;
      default:
        return <Package size={16} className="text-text/50" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'shipped':
      case 'out for delivery':
      case 'shipping':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'processing':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-text/70 bg-background/20 border-background';
    }
  };

  const getProductionStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'designing':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'cutting':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'stitching':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'finishing':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'quality_check':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'ready':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getFilteredOrders = () => {
    let filtered = orderData;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(order =>
        order.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Sort orders
    if (sortOrder === 'newest') {
      filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === 'oldest') {
      filtered = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const getOrderStats = () => {
    const total = orderData.length;
    const delivered = orderData.filter(item => item.status?.toLowerCase() === 'delivered').length;
    const processing = orderData.filter(item =>
      item.status?.toLowerCase() === 'processing' ||
      item.status?.toLowerCase() === 'shipped' ||
      item.status?.toLowerCase() === 'shipping' ||
      item.status?.toLowerCase() === 'out for delivery'
    ).length;

    const totalSpent = orderData.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return sum + (price * quantity);
    }, 0);

    return { total, delivered, processing, totalSpent };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="min-h-screen mt-20">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">
              Order History
            </h1>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-background border-t-secondary mx-auto mb-6"></div>
                <span className="text-text/60 font-light text-lg">Loading your orders...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">
            Order History
          </h1>
          {orderData.length > 0 && (
            <p className="text-text/60 font-light text-lg">
              Track and manage your {orderData.length} order{orderData.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {orderData.length > 0 && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-background/30 to-primary rounded-lg p-6 border border-background">
                  <div className="flex items-center gap-3 mb-2">
                    <Package size={20} className="text-secondary" />
                    <span className="text-xs font-semibold text-text/50 uppercase tracking-wider">Total Orders</span>
                  </div>
                  <p className="text-3xl font-bold text-text">{stats.total}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="text-xs font-semibold text-green-700/70 uppercase tracking-wider">Delivered</span>
                  </div>
                  <p className="text-3xl font-bold text-green-700">{stats.delivered}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Truck size={20} className="text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700/70 uppercase tracking-wider">In Transit</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-700">{stats.processing}</p>
                </div>

                <div className="bg-gradient-to-br from-background/30 to-primary rounded-lg p-6 border border-background">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard size={20} className="text-secondary" />
                    <span className="text-xs font-semibold text-text/50 uppercase tracking-wider">Total Spent</span>
                  </div>
                  <p className="text-3xl font-bold text-secondary">{currency}{stats.totalSpent.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-background shadow-sm p-6 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-wrap gap-3">
                    {[
                      { key: 'all', label: 'All Orders' },
                      { key: 'delivered', label: 'Delivered' },
                      { key: 'shipped', label: 'Shipped' },
                      { key: 'processing', label: 'Processing' }
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setFilterStatus(key)}
                        className={`px-5 py-2.5 text-sm font-semibold tracking-wide rounded-lg border-2 transition-all duration-300 ${filterStatus === key
                          ? 'bg-secondary text-white border-secondary shadow-md'
                          : 'bg-white text-text border-background hover:border-secondary hover:text-secondary'
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
                      className="appearance-none border-2 border-background bg-white px-4 py-2.5 pr-8 font-semibold rounded-lg focus:border-secondary focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {orderData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-background shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={40} className="text-secondary" />
              </div>
              <div className="text-center max-w-md mb-8">
                <h3 className="text-2xl font-serif font-semibold mb-3 text-text">No Orders Yet</h3>
                <p className="text-text/70 font-light leading-relaxed">
                  Your order history is empty. Start exploring our amazing collection of handcrafted fashion and place your first order.
                </p>
              </div>
              <button
                onClick={() => navigate('/shop/collection')}
                className="px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-[#8B6F47] transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <span>Browse Collection</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((item, index) => (
                <div key={`${item.orderId}-${index}`} className="bg-white rounded-lg border border-background shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="p-6 border-b border-background bg-gradient-to-r from-background/20 to-primary">
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

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className={`px-4 py-1.5 border-2 text-xs font-bold uppercase tracking-wider rounded-md ${getStatusColor(item.status)}`}>
                            {item.status || 'Processing'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-full h-48 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                          {item.image ? (
                            <img
                              className="w-full h-full object-contain"
                              src={item.image}
                              alt={item.name}
                              onError={(e) => {
                                e.target.src = '/placeholder-dress.png';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {item.type === 'CUSTOM' ? (
                                <Sparkles size={40} className="text-secondary/80" />
                              ) : (
                                <Package size={40} className="text-text/30" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="flex-grow flex flex-col lg:flex-row justify-between gap-6">
                        <div className="flex-grow space-y-4">
                          <div>
                            <h3 className="font-serif font-semibold text-xl text-text mb-2 tracking-wide group-hover:text-secondary transition-colors line-clamp-2">
                              {item.name}
                            </h3>

                            {item.type === 'CUSTOM' && (
                              <span className="inline-block px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                Custom Design
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <span className="block text-xs font-semibold text-text/50 uppercase tracking-wider">
                                Price
                              </span>
                              <span className="font-bold text-text text-lg">
                                {currency}{Number(item.price || 0).toFixed(2)}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <span className="block text-xs font-semibold text-text/50 uppercase tracking-wider">
                                Quantity
                              </span>
                              <span className="font-bold text-text">{item.quantity}</span>
                            </div>

                            <div className="space-y-1">
                              <span className="block text-xs font-semibold text-text/50 uppercase tracking-wider">
                                {item.type === 'CUSTOM' ? 'Type' : 'Size'}
                              </span>
                              <span className="inline-block px-3 py-1 bg-gradient-to-br from-background/30 to-primary rounded-md font-semibold text-text text-sm">
                                {item.type === 'CUSTOM' ? 'Custom Made' : (item.size || 'Standard')}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <span className="block text-xs font-semibold text-text/50 uppercase tracking-wider">
                                Total
                              </span>
                              <span className="font-bold text-secondary text-lg">
                                {currency}{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {item.type === 'CUSTOM' && item.productionStatus && (
                            <div className="mt-4 p-3 bg-primary/80 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Package size={16} className="text-secondary" />
                                <span className="text-xs font-semibold text-text uppercase tracking-wider">
                                  Production:
                                </span>
                                <span className={`px-3 py-1 border-2 text-xs font-bold uppercase tracking-wider rounded-md ${getProductionStatusColor(item.productionStatus)}`}>
                                  {item.productionStatus.replace('_', ' ')}
                                </span>
                              </div>
                              
                              {item.customization && (
                                <div className="mt-3 text-xs text-text/80 space-y-1">
                                  {item.customization.fabric && (
                                    <p><span className="font-semibold">Fabric:</span> {item.customization.fabric}</p>
                                  )}
                                  {item.customization.color && (
                                    <p><span className="font-semibold">Color:</span> {item.customization.color}</p>
                                  )}
                                  {item.customization.sleeveStyle && (
                                    <p><span className="font-semibold">Sleeve:</span> {item.customization.sleeveStyle}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex lg:flex-col items-center lg:items-end justify-start lg:justify-center gap-3">
                          <button
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white font-semibold tracking-wide rounded-lg hover:bg-secondary/80 transition-all duration-300 shadow-md hover:shadow-lg"
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

              <div className="mt-12 bg-gradient-to-br from-background/20 to-primary rounded-lg border border-background p-8 text-center shadow-sm">
                <h3 className="text-2xl font-serif font-semibold text-text mb-3 tracking-wide">Want to Order More?</h3>
                <p className="text-text/70 font-light leading-relaxed mb-6 max-w-md mx-auto">
                  Discover new arrivals and trending products in our carefully curated collection of handcrafted fashion
                </p>
                <button
                  onClick={() => navigate('/shop/collection')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-[#8B6F47] transition-all duration-300 shadow-lg"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        /* Hide number input arrows */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default Orders;