import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import {
  Package, Truck, CheckCircle, Clock, MapPin, AlertCircle,
  ChevronDown, ChevronUp, ArrowLeft, Calendar, Phone,
  Hash, CreditCard, Sparkles
} from 'lucide-react';

const TrackOrder = () => {
  const { backendUrl, currency, token } = useContext(ShopContext);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        if (!backendUrl || !token || !orderId) {
          throw new Error("Missing backend URL, token, or order ID");
        }

        const response = await fetch(`${backendUrl}/api/order/track/${orderId}`, {
          method: "GET",
          headers: {
            token: token
          }
        })

        const data = await response.json();

        if (data.success) {
          setOrder(data.order);
        } else {
          throw new Error(data.message || 'Failed to load order');
        }
      } catch (err) {
        setError(err.message || 'Failed to load order data');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, backendUrl, token]);

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
    switch (status) {
      case 'Order Placed': return <CheckCircle size={16} />;
      case 'Processing': return <Package size={16} />;
      case 'Shipping': return <Truck size={16} />;
      case 'Out for Delivery': return <Truck size={16} />;
      case 'Delivered': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Out for Delivery':
      case 'Shipping':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Processing':
        return 'text-secondary bg-background/10 border-background';
      case 'Order Placed':
        return 'text-text/70 bg-background/5 border-background/30';
      default:
        return 'text-text/70 bg-background/5 border-background/30';
    }
  };

  const getStatusState = (status) => {
    if (!order || !order.status) return 'upcoming';

    const currentStatusIndex = allStatuses.indexOf(order.status);
    const statusIndex = allStatuses.indexOf(status);

    if (statusIndex < 0) return 'upcoming';

    if (status === 'Order Placed') {
      return 'completed';
    }

    if (order.status === 'Delivered') {
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
    return order.trackingHistory.find(item => item.status === status);
  };

  const getProgressPercentage = () => {
    if (!order || !order.status) return 0;
    const currentIndex = allStatuses.indexOf(order.status);
    return currentIndex >= 0 ? ((currentIndex + 1) / allStatuses.length) * 100 : 0;
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

  const trackingHistory = order.trackingHistory || [
    {
      status: order.status || 'Order Placed',
      location: order.address?.city || 'N/A',
      timestamp: order.date || Date.now(),
      description: `Order status: ${order.status || 'Order Placed'}`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-background/20 mt-20">
      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-[#8B6F47] text-white text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wide shadow-lg mb-6">
              <Sparkles size={14} />
              <span>Order Tracking</span>
            </div>
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
          
          {/* Order Header Card */}
          <div className="bg-white border border-background/20 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-background/20 bg-gradient-to-r from-background/10 to-primary/5">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-secondary" />
                    <span className="text-xs font-semibold text-text/60 uppercase tracking-wider">ORDER ID:</span>
                    <span className="font-semibold text-text tracking-wide">{order._id?.slice(-8)}</span>
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
                                  ? 'bg-white border-secondary text-secondary'
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
                                <p className="text-xs text-secondary mt-2 font-bold uppercase tracking-wider">In Progress</p>
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
                        className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all shadow-md ${
                          state === 'completed'
                            ? 'bg-secondary border-secondary text-white'
                            : state === 'current'
                            ? 'bg-white border-secondary text-secondary'
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
                          <p className="text-sm text-secondary font-bold uppercase tracking-wider mt-1">In Progress</p>
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
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 border border-background/20 rounded-lg hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-background/5">
                          <div className="w-20 h-20 bg-white border border-background/20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.images?.[0] || item.image || '/api/placeholder/80/80'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-text">{item.name}</h5>
                            <div className="mt-2 flex gap-4 text-sm">
                              <span className="text-text/60 font-medium">
                                Size: <span className="text-text font-semibold">{item.size || 'N/A'}</span>
                              </span>
                              <span className="text-text/60 font-medium">
                                Qty: <span className="text-text font-semibold">{item.quantity}</span>
                              </span>
                            </div>
                            <p className="text-lg font-serif font-bold text-secondary mt-2">
                              {currency}{(item.price || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
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
                          <p className="text-text font-semibold mb-2">{order.address?.firstName} {order.address?.lastName}</p>
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
                              ? (order.amount - (order.delivery_fee || 0) - (order.tax || 0)).toFixed(2)
                              : '0.00'}
                          </span>
                        </div>
                        <div className="flex justify-between text-text/70 font-medium">
                          <span>Shipping</span>
                          <span>{currency}{order.delivery_fee ? order.delivery_fee.toFixed(2) : '0.00'}</span>
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
                        <p className="text-text font-semibold">{order.paymentMethod || 'N/A'}</p>
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