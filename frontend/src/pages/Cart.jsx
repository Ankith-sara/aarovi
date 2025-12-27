import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';
import { Trash2, Sparkles, Palette, ShoppingBag, Package, ArrowRight, Plus, Minus, X } from 'lucide-react';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, updateCustomizationQuantity, removeCustomizationFromCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (products.length > 0 || cartItems.customizations) {
      const tempData = [];

      // Add regular products
      for (const items in cartItems) {
        if (items === 'customizations') continue;

        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
              type: 'product'
            });
          }
        }
      }

      // Add customizations
      if (cartItems.customizations) {
        for (const customId in cartItems.customizations) {
          const custom = cartItems.customizations[customId];
          if (custom && custom.quantity > 0) {
            tempData.push({
              _id: customId,
              quantity: custom.quantity,
              price: custom.price,
              snapshot: custom.snapshot,
              type: 'customization'
            });
          }
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showDeleteModal) {
        cancelDelete();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showDeleteModal]);

  useEffect(() => {
    document.title = 'Shopping Cart | Aarovi';
  }, []);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'customization') {
        removeCustomizationFromCart(itemToDelete._id);
      } else {
        updateQuantity(itemToDelete._id, itemToDelete.size, 0);
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <div className="mt-20 min-h-screen bg-white">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-text mb-3">Remove from Cart?</h3>
              <p className="text-text/60 font-light leading-relaxed text-sm">
                This item will be removed from your cart. You can add it back anytime.
              </p>
            </div>

            <div className="px-8 pb-8 flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 py-3.5 bg-gray-100 text-text font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                Keep Item
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/30"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-2">
              Shopping Cart
            </h1>
            {cartData.length > 0 && (
              <p className="text-text/50 font-light flex items-center gap-2">
                <ShoppingBag size={16} />
                {cartData.length} {cartData.length === 1 ? 'item' : 'items'} in cart
              </p>
            )}
          </div>
        </div>
      </section>

      {cartData.length === 0 ? (
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-background/20 to-background/40 rounded-full flex items-center justify-center">
                  <ShoppingBag size={56} className="text-text/30" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Package size={24} className="text-secondary" />
                </div>
              </div>
              <div className="text-center max-w-md mb-10">
                <h3 className="text-3xl font-serif font-bold mb-3 text-text">Your cart is empty</h3>
                <p className="text-text/60 font-light leading-relaxed">
                  Add some amazing products to get started with your shopping
                </p>
              </div>
              <button
                onClick={() => navigate('/collection')}
                className="group px-10 py-4 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center gap-3 shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 hover:-translate-y-0.5"
              >
                <span>Start Shopping</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartData.map((item, index) => {
                  if (item.type === 'customization') {
                    // CUSTOM PRODUCT CARD
                    const customData = item.snapshot;
                    return (
                      <div
                        key={`custom-${item._id}`}
                        className="group bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-secondary/30"
                      >
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Custom Badge & Image */}
                          <div className="flex-shrink-0 relative">
                            <div className="absolute -top-2 -left-2 z-10">
                              <div className="bg-gradient-to-r from-secondary to-secondary/80 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                                <Sparkles size={14} className="animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-wider">Custom</span>
                              </div>
                            </div>
                            <div className="w-full sm:w-40 h-48 sm:h-40 bg-gradient-to-br from-background/20 to-background/40 rounded-xl flex items-center justify-center border border-background/30 relative overflow-hidden">
                              <Palette size={40} className="text-text/30" strokeWidth={1.5} />
                              <div
                                className="absolute inset-0"
                                style={{
                                  backgroundColor: customData.color || '#e11d48',
                                  opacity: 0.2
                                }}
                              />
                            </div>
                          </div>

                          {/* Custom Details */}
                          <div className="flex-1 min-w-0">
                            <div className="mb-4">
                              <h3 className="font-serif font-bold text-lg text-text mb-3">
                                Custom {customData.dressType}
                              </h3>

                              <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-text/50 font-medium min-w-[60px]">Gender:</span>
                                  <span className="text-text font-semibold">{customData.gender}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-text/50 font-medium min-w-[60px]">Fabric:</span>
                                  <span className="text-text font-semibold">{customData.fabric}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-text/50 font-medium min-w-[60px]">Color:</span>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-5 h-5 rounded-full border-2 border-background/50 shadow-sm"
                                      style={{ backgroundColor: customData.color }}
                                    />
                                    <span className="text-text/70 text-xs font-semibold">{customData.color}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-text/50 font-medium min-w-[60px]">Status:</span>
                                  <span className="text-secondary font-semibold text-xs bg-secondary/10 px-3 py-1 rounded-full">
                                    {customData.status}
                                  </span>
                                </div>
                              </div>

                              {customData.designNotes && (
                                <div className="p-3 bg-background/30 rounded-xl border border-background/40">
                                  <p className="text-xs text-text/70 italic">
                                    <span className="font-semibold text-text">Note:</span> {customData.designNotes}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Quantity & Price */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-center bg-background/30 rounded-xl overflow-hidden">
                                <button
                                  onClick={() => updateCustomizationQuantity(item._id, item.quantity - 1)}
                                  className="p-3 hover:bg-background/60 transition-colors disabled:opacity-30"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} className="text-text" />
                                </button>
                                <span className="px-4 py-3 font-bold text-text">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCustomizationQuantity(item._id, item.quantity + 1)}
                                  className="p-3 hover:bg-background/60 transition-colors"
                                >
                                  <Plus size={16} className="text-text" />
                                </button>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-secondary">
                                    {currency}{(item.price * item.quantity).toLocaleString()}
                                  </p>
                                  <p className="text-xs text-text/50">
                                    {currency}{item.price.toLocaleString()} each
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleDeleteClick(item)}
                                  className="p-2.5 text-text/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    // REGULAR PRODUCT CARD
                    const productData = products.find((product) => product._id === item._id);
                    if (!productData) return null;

                    return (
                      <div
                        key={index}
                        className="group bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-background/50"
                      >
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="relative w-full sm:w-40 h-48 sm:h-40 rounded-xl overflow-hidden bg-white border border-background/30">
                              <img
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                src={productData.images[0]}
                                alt={productData.name}
                              />
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="mb-4">
                              <h3 className="font-serif font-bold text-lg text-text mb-3 line-clamp-2">
                                {productData.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-text/60 mb-3">
                                <div className="flex items-center gap-2">
                                  <Package size={16} />
                                  <span className="font-medium">Size: <span className="text-text font-semibold">{item.size}</span></span>
                                </div>
                                <div className="px-3 py-1 bg-background/50 rounded-full">
                                  <span className="font-semibold text-text">{productData.category}</span>
                                </div>
                              </div>
                            </div>

                            {/* Quantity & Price */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-center bg-background/30 rounded-xl overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                                  className="p-3 hover:bg-background/60 transition-colors disabled:opacity-30"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} className="text-text" />
                                </button>
                                <span className="px-4 py-3 font-bold text-text">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                  className="p-3 hover:bg-background/60 transition-colors"
                                >
                                  <Plus size={16} className="text-text" />
                                </button>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-secondary">
                                    {currency}{(productData.price * item.quantity).toLocaleString()}
                                  </p>
                                  <p className="text-xs text-text/50">
                                    {currency}{productData.price.toLocaleString()} each
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleDeleteClick(item)}
                                  className="p-2.5 text-text/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-white rounded-2xl shadow-xl border border-background/50 p-8">
                    <h3 className="text-2xl font-serif font-bold mb-6 text-text">Order Summary</h3>
                    <CartTotal />
                    <div className="mt-8 space-y-3">
                      <button
                        onClick={() => navigate('/place-order')}
                        className="w-full py-4 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all duration-300 shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 font-bold text-lg flex items-center justify-center gap-2"
                      >
                        <span>Proceed to Checkout</span>
                        <ArrowRight size={20} />
                      </button>
                      <button
                        onClick={() => navigate('/collection')}
                        className="w-full py-3 bg-background/40 text-text rounded-xl hover:bg-background/60 transition-all duration-300 font-semibold"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Cart;