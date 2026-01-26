import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import {
  Package, Truck, CheckCircle, Clock, MapPin, AlertCircle,
  ChevronDown, ChevronUp, ArrowLeft, Calendar, Phone,
  Hash, CreditCard, Sparkles, Palette
} from 'lucide-react';

const TrackOrder = () => {
  const { backendUrl, currency, token } = useContext(ShopContext);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIXED: Match these statuses with your actual database statuses
  const allStatuses = [
    'Order Placed',
    'Processing',
    'Shipping',
    'Out for Delivery',
    'Delivered'
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!backendUrl || !orderId) {
          throw new Error("Missing backend URL or order ID");
        }

        console.log('Fetching order from:', `${backendUrl}/api/order/status/${orderId}`);

        const response = await fetch(`${backendUrl}/api/order/status/${orderId}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('Order data received:', data);

        if (data.success) {
          setOrder(data.order);
        } else {
          throw new Error(data.message || 'Failed to load order');
        }
      } catch (err) {
        console.error('Fetch order error:', err);
        setError(err.message || 'Failed to load order data');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, backendUrl]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('placed')) return <CheckCircle size={16} />;
    if (statusLower.includes('processing')) return <Package size={16} />;
    if (statusLower.includes('shipping') || statusLower.includes('shipped')) return <Truck size={16} />;
    if (statusLower.includes('delivery')) return <Truck size={16} />;
    if (statusLower.includes('delivered')) return <CheckCircle size={16} />;
    return <Clock size={16} />;
  };

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return 'text-green-700 bg-green-50 border-green-200';
    if (statusLower.includes('delivery') || statusLower.includes('shipping') || statusLower.includes('shipped')) {
      return 'text-blue-700 bg-blue-50 border-blue-200';
    }
    if (statusLower.includes('processing')) return 'text-secondary bg-background/10 border-background';
    if (statusLower.includes('placed')) return 'text-text/70 bg-background/5 border-background/30';
    return 'text-text/70 bg-background/5 border-background/30';
  };

  // FIXED: Better status matching logic
  const normalizeStatus = (status) => {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('placed')) return 'Order Placed';
    if (statusLower.includes('processing')) return 'Processing';
    if (statusLower.includes('shipping') || statusLower.includes('shipped')) return 'Shipping';
    if (statusLower.includes('out') && statusLower.includes('delivery')) return 'Out for Delivery';
    if (statusLower.includes('delivered')) return 'Delivered';
    
    return status; // Return original if no match
  };

  const getStatusState = (status) => {
    if (!order || !order.status) return 'upcoming';

    const normalizedOrderStatus = normalizeStatus(order.status);
    const currentStatusIndex = allStatuses.indexOf(normalizedOrderStatus);
    const statusIndex = allStatuses.indexOf(status);

    console.log('Order Status:', order.status);
    console.log('Normalized Order Status:', normalizedOrderStatus);
    console.log('Current Index:', currentStatusIndex);
    console.log('Checking Status:', status, 'Index:', statusIndex);

    if (statusIndex < 0) return 'upcoming';

    if (status === 'Order Placed') {
      return 'completed';
    }

    if (normalizedOrderStatus === 'Delivered') {
      return 'completed';
    }

    if (statusIndex < currentStatusIndex) {
      return 'completed';
    } else if (statusIndex === currentStatusIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  const findHistoryForStatus = (status) => {
    if (!order || !order.trackingHistory) return null;
    return order.trackingHistory.find(item => normalizeStatus(item.status) === status);
  };

  const getProgressPercentage = () => {
    if (!order || !order.status) return 0;
    const normalizedStatus = normalizeStatus(order.status);
    const currentIndex = allStatuses.indexOf(normalizedStatus);
    const percentage = currentIndex >= 0 ? ((currentIndex + 1) / allStatuses.length) * 100 : 0;
    console.log('Progress:', percentage, '% for status:', order.status);
    return percentage;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-background/20 mt-20">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-text mb-3">
                Order Tracking
              </h1>
              <p className="text-text/60 font-light text-lg">Track your order progress</p>
            </div>
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary border-t-transparent mx-auto mb-4"></div>
                <span className="text-text/60 font-medium">Loading order details...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-background/20 mt-20">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-text mb-3">
                Order Tracking
              </h1>
              <p className="text-text/60 font-light text-lg">Track your order progress</p>
            </div>
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-background/20 rounded-xl shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} className="text-red-400" />
              </div>
              <div className="text-center max-w-md mb-8">
                <h3 className="text-2xl font-serif font-semibold mb-3 text-text">Order Not Found</h3>
                <p className="text-text/60 font-light leading-relaxed">
                  {error || 'The order you are looking for could not be found.'}
                </p>
              </div>
              <button
                onClick={() => navigate('/orders')}
                className="px-8 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-[#8B6F47] transition-all duration-300 shadow-md"
              >
                VIEW ALL ORDERS
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Create tracking history with normalized statuses
  const trackingHistory = order.trackingHistory || [
    {
      status: normalizeStatus(order.status) || 'Order Placed',
      location: order.address?.city || 'N/A',
      timestamp: order.date || Date.now(),
      description: `Order status: ${order.status || 'Order Placed'}`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-background/20 mt-16">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-text mb-3">
              Track Your Order
            </h1>
            <p className="text-text/60 font-light text-lg">
              Monitor your order progress and delivery status
            </p>
          </div>
        </div>
      </section>

      {/* Order Status Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white border border-background/20 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-background/20 bg-gradient-to-r from-background/10 to-primary/5">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-secondary" />
                    <span className="text-xs font-semibold text-text/60 uppercase tracking-wider">ORDER ID:</span>
                    <span className="font-semibold text-text tracking-wide">{order._id?.slice(-8) || orderId.slice(-8)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-secondary" />
                    <span className="text-sm text-text/70 font-medium">{formatDate(order.date)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-secondary" />
                    <span className="text-sm text-text/70 font-medium">{order.paymentMethod || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1.5 border-2 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status || 'Processing'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-text/60 mb-3 font-medium">
                  <span className="uppercase tracking-wider">Order Progress</span>
                  <span className="font-semibold">{Math.round(getProgressPercentage())}% Complete</span>
                </div>
                <div className="w-full bg-background/30 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-secondary to-[#8B6F47] h-2 transition-all duration-500 rounded-full"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="p-6">
              <h3 className="text-xl font-serif font-semibold mb-8 text-text tracking-wide">Tracking Timeline</h3>
              
              {/* Desktop Timeline */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-8 left-0 w-full h-1 bg-background/30 rounded-full"></div>
                  <div 
                    className="absolute top-8 left-0 h-1 bg-gradient-to-r from-secondary to-[#8B6F47] transition-all duration-1000 rounded-full"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>

                  <div className="flex justify-between relative">
                    {allStatuses.map((status, index) => {
                      const state = getStatusState(status);
                      const historyItem = findHistoryForStatus(status);
                      
                      return (
                        <div key={index} className="flex-1 relative">
                          <div className="flex flex-col items-center">
                            {/* Status Circle */}
                            <div
                              className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-300 shadow-md ${
                                state === 'completed'
                                  ? 'bg-secondary border-secondary text-white'
                                  : state === 'current'
                                  ? 'bg-white border-secondary text-secondary animate-pulse'
                                  : 'bg-white border-background/40 text-text/40'
                              }`}
                            >
                              {getStatusIcon(status)}
                            </div>

                            {/* Status Details */}
                            <div className="mt-6 text-center max-w-32">
                              <h4
                                className={`font-semibold text-sm uppercase tracking-wide ${
                                  state === 'upcoming'
                                    ? 'text-text/40'
                                    : state === 'current'
                                    ? 'text-secondary'
                                    : 'text-text'
                                }`}
                              >
                                {status}
                              </h4>

                              {historyItem && (
                                <div className="mt-3 space-y-1">
                                  <p className="text-xs text-text/60 font-medium">
                                    {formatDate(historyItem.timestamp)}
                                  </p>
                                  <p className="text-xs text-text/60 font-medium">
                                    {formatTime(historyItem.timestamp)}
                                  </p>
                                  {historyItem.location && (
                                    <div className="flex items-center justify-center mt-2">
                                      <MapPin size={10} className="text-secondary mr-1" />
                                      <span className="text-xs text-text/60 font-medium">
                                        {historyItem.location}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {state === 'current' && !historyItem && (
                                <p className="text-xs text-secondary mt-2 font-bold uppercase tracking-wider animate-pulse">In Progress</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Timeline */}
              <div className="lg:hidden space-y-6">
                {allStatuses.map((status, index) => {
                  const state = getStatusState(status);
                  const historyItem = findHistoryForStatus(status);
                  
                  return (
                    <div key={index} className="flex items-start gap-4">
                      {/* Status Circle */}
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all shadow-md flex-shrink-0 ${
                          state === 'completed'
                            ? 'bg-secondary border-secondary text-white'
                            : state === 'current'
                            ? 'bg-white border-secondary text-secondary animate-pulse'
                            : 'bg-white border-background/40 text-text/40'
                        }`}
                      >
                        {getStatusIcon(status)}
                      </div>

                      {/* Status Info */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-semibold uppercase tracking-wide ${
                            state === 'upcoming'
                              ? 'text-text/40'
                              : state === 'current'
                              ? 'text-secondary'
                              : 'text-text'
                          }`}
                        >
                          {status}
                        </h4>

                        {historyItem && (
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-text/70 font-medium">
                              {formatDate(historyItem.timestamp)} at {formatTime(historyItem.timestamp)}
                            </p>
                            {historyItem.location && (
                              <div className="flex items-center mt-1">
                                <MapPin size={12} className="text-secondary mr-1" />
                                <span className="text-sm text-text/60 font-medium">
                                  {historyItem.location}
                                </span>
                              </div>
                            )}
                            {historyItem.description && (
                              <p className="text-sm text-text/70 font-light mt-1">
                                {historyItem.description}
                              </p>
                            )}
                          </div>
                        )}

                        {state === 'current' && !historyItem && (
                          <p className="text-sm text-secondary font-bold uppercase tracking-wider mt-1 animate-pulse">In Progress</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details Section */}
          <div className="bg-white border border-background/20 rounded-xl shadow-md overflow-hidden">
            <button
              className="w-full p-6 flex justify-between items-center hover:bg-background/5 transition-colors border-b border-background/20"
              onClick={() => setShowDetails(!showDetails)}
            >
              <h3 className="text-lg font-serif font-semibold text-text uppercase tracking-wide">Order Details</h3>
              {showDetails ? <ChevronUp size={20} className="text-secondary" /> : <ChevronDown size={20} className="text-secondary" />}
            </button>

            {showDetails && (
              <div className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Order Items */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-semibold text-text/60 uppercase tracking-wider">
                      Order Items ({order.items?.length || 0})
                    </h4>
                    
                    <div className="space-y-4">
                      {order.items?.map((item, index) => {
                        const itemPrice = item.finalPrice || item.basePrice || item.price || 0;
                        const isCustom = item.type === 'CUSTOM';
                        
                        return (
                          <div 
                            key={index} 
                            className={`flex gap-4 p-4 border rounded-lg hover:shadow-md transition-all duration-300 ${
                              isCustom 
                                ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50' 
                                : 'border-background/20 bg-gradient-to-br from-white to-background/5'
                            }`}
                          >
                            <div className="w-20 h-20 bg-white border border-background/20 rounded-lg overflow-hidden flex-shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className={`w-full h-full ${item.image ? 'hidden' : 'flex'} items-center justify-center bg-background/10`}>
                                {isCustom ? (
                                  <Palette size={24} className="text-purple-400" />
                                ) : (
                                  <Package size={24} className="text-text/30" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              {isCustom && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-bold mb-1">
                                  <Sparkles size={10} />
                                  CUSTOM
                                </span>
                              )}
                              <h5 className="font-semibold text-text">{item.name}</h5>
                              <div className="mt-2 flex gap-4 text-sm">
                                <span className="text-text/60 font-medium">
                                  Size: <span className="text-text font-semibold">{item.size || 'Custom'}</span>
                                </span>
                                <span className="text-text/60 font-medium">
                                  Qty: <span className="text-text font-semibold">{item.quantity || 1}</span>
                                </span>
                              </div>
                              <p className="text-lg font-serif font-bold text-secondary mt-2">
                                {currency}{Number(itemPrice).toFixed(2)}
                              </p>
                              
                              {/* Production Status for Custom Items */}
                              {isCustom && item.productionStatus && (
                                <div className="mt-2">
                                  <span className="text-xs text-purple-600 font-semibold">
                                    Production: {item.productionStatus.replace('_', ' ')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-6">
                    {/* Shipping Address */}
                    <div>
                      <h4 className="text-sm font-semibold text-text/60 uppercase tracking-wider mb-4">
                        Shipping Address
                      </h4>
                      <div className="border border-background/20 rounded-lg p-4 bg-gradient-to-br from-background/5 to-white">
                        <address className="not-italic text-text/70 font-medium">
                          <p className="text-text font-semibold mb-2">
                            {order.address?.firstName || order.address?.Name} {order.address?.lastName || ''}
                          </p>
                          <p className="mt-1">{order.address?.street || 'N/A'}</p>
                          <p>
                            {order.address?.city || ''}{order.address?.city && order.address?.state ? ', ' : ''}
                            {order.address?.state || ''} {order.address?.pincode || order.address?.zipCode || ''}
                          </p>
                          <p>{order.address?.country || 'N/A'}</p>
                          {order.address?.phone && (
                            <div className="flex items-center mt-3 pt-3 border-t border-background/20">
                              <Phone size={14} className="text-secondary mr-2" />
                              <span className="font-semibold">{order.address.phone}</span>
                            </div>
                          )}
                        </address>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                      <h4 className="text-sm font-semibold text-text/60 uppercase tracking-wider mb-4">
                        Order Summary
                      </h4>
                      <div className="border border-background/20 rounded-lg p-4 space-y-3 bg-gradient-to-br from-background/5 to-white">
                        <div className="flex justify-between text-text/70 font-medium">
                          <span>Subtotal</span>
                          <span>
                            {currency}
                            {order.amount
                              ? (order.amount - (order.delivery_fee || 50)).toFixed(2)
                              : '0.00'}
                          </span>
                        </div>
                        <div className="flex justify-between text-text/70 font-medium">
                          <span>Shipping</span>
                          <span>{currency}{(order.delivery_fee || 50).toFixed(2)}</span>
                        </div>
                        {order.tax > 0 && (
                          <div className="flex justify-between text-text/70 font-medium">
                            <span>Tax</span>
                            <span>{currency}{order.tax ? order.tax.toFixed(2) : '0.00'}</span>
                          </div>
                        )}
                        <div className="pt-3 border-t border-background/30 flex justify-between text-lg font-serif font-bold text-secondary">
                          <span>Total</span>
                          <span>{currency}{order.amount ? order.amount.toFixed(2) : '0.00'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h4 className="text-sm font-semibold text-text/60 uppercase tracking-wider mb-4">
                        Payment Method
                      </h4>
                      <div className="border border-background/20 rounded-lg p-4 bg-gradient-to-br from-background/5 to-white">
                        <div className="flex items-center justify-between">
                          <p className="text-text font-semibold">{order.paymentMethod || 'N/A'}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.payment 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {order.payment ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center pt-8">
            <button
              onClick={() => navigate('/orders')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-[#8B6F47] transition-all duration-300 shadow-md"
            >
              <ArrowLeft size={16} />
              <span>BACK TO ORDERS</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrackOrder;