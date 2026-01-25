import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Trash2, Plus, Minus, ShoppingBag, Tag, Truck, ArrowLeft, Heart, ShieldCheck, RefreshCcw, Headset, CreditCard, Package } from 'lucide-react';
import { toast } from 'react-toastify';

const Cart = () => {
  const { products, cartItems, currency, updateQuantity, removeFromCart, updateCustomizationQuantity, removeCustomizationFromCart, getCartAmount, navigate, delivery_fee } = useContext(ShopContext);
  const [cartProducts, setCartProducts] = useState([]);
  const [customizationItems, setCustomizationItems] = useState([]);
  const [savedItems, setSavedItems] = useState(new Set());

  useEffect(() => {
    if (!cartItems) return;

    // Process regular products
    const tempProducts = [];
    for (const itemId in cartItems) {
      if (itemId === 'customizations') continue;

      const product = products.find(p => p._id === itemId);
      if (product) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            tempProducts.push({
              _id: itemId,
              size,
              quantity: cartItems[itemId][size],
              ...product
            });
          }
        }
      }
    }
    setCartProducts(tempProducts);

    // Process customizations
    const tempCustomizations = [];
    if (cartItems.customizations) {
      for (const customId in cartItems.customizations) {
        const customItem = cartItems.customizations[customId];
        if (customItem && customItem.quantity > 0) {
          tempCustomizations.push({
            _id: customId,
            ...customItem
          });
        }
      }
    }
    setCustomizationItems(tempCustomizations);
  }, [cartItems, products]);

  const handleUpdateQuantity = (itemId, size, delta) => {
    const currentQty = cartItems[itemId]?.[size] || 0;
    const newQty = Math.max(0, currentQty + delta);
    updateQuantity(itemId, size, newQty);

    if (delta > 0) {
      toast.success('Quantity updated', { autoClose: 1000 });
    }
  };

  const handleUpdateCustomQuantity = (customId, delta) => {
    const currentQty = cartItems.customizations?.[customId]?.quantity || 0;
    const newQty = Math.max(0, currentQty + delta);
    updateCustomizationQuantity(customId, newQty);

    if (delta > 0) {
      toast.success('Quantity updated', { autoClose: 1000 });
    }
  };

  const handleRemoveItem = (itemId, size) => {
    removeFromCart(itemId, size);
    toast.info('Item removed from cart');
  };

  const handleRemoveCustom = (customId) => {
    removeCustomizationFromCart(customId);
    toast.info('Custom design removed from cart');
  };

  const handleSaveForLater = (itemId) => {
    const newSaved = new Set(savedItems);
    if (newSaved.has(itemId)) {
      newSaved.delete(itemId);
      toast.info('Removed from saved items');
    } else {
      newSaved.add(itemId);
      toast.success('Saved for later');
    }
    setSavedItems(newSaved);
  };

  const cartAmount = getCartAmount();
  const totalAmount = cartAmount + delivery_fee;
  const totalItems = cartProducts.reduce((sum, item) => sum + item.quantity, 0) +
    customizationItems.reduce((sum, item) => sum + item.quantity, 0);
  const freeShipping = cartAmount >= 5000;

  if (cartProducts.length === 0 && customizationItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag size={64} className="text-gray-300" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">0</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8 text-base sm:text-lg">Discover amazing products and start shopping!</p>
          <button
            onClick={() => navigate('/shop/collection')}
            className="px-8 py-4 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 sm:pt-20 pb-6 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/shop/collection')}
            className="flex items-center gap-2 text-gray-600 hover:text-secondary transition-colors mb-4 text-sm sm:text-base"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Continue Shopping</span>
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            <div className="flex items-center gap-2 bg-secondary/10 px-3 sm:px-4 py-2 rounded-full">
              <Package size={18} className="text-secondary" />
              <span className="text-secondary font-bold text-sm sm:text-base">{totalItems} items</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {/* Regular Products */}
            {cartProducts.map((item, index) => (
              <div
                key={`${item._id}-${item.size}-${index}`}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="flex gap-3 sm:gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                      <img
                        src={item.images?.[0] || '/placeholder-image.png'}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => handleSaveForLater(`${item._id}-${item.size}`)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Heart
                            size={18}
                            fill={savedItems.has(`${item._id}-${item.size}`) ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                          Size: {item.size}
                        </span>
                        {item.inStock && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            In Stock
                          </span>
                        )}
                      </div>

                      {/* Price and Controls */}
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <p className="text-lg sm:text-xl md:text-2xl font-bold text-secondary">
                            {currency}{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {currency}{item.price?.toLocaleString()} each
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 sm:px-3 py-1.5 sm:py-2">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.size, -1)}
                              className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold w-6 sm:w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.size, 1)}
                              className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item._id, item.size)}
                            className="flex items-center gap-1.5 text-red-400 hover:text-red-600 transition-colors px-3 py-1.5 hover:bg-red-50 rounded-full text-xs sm:text-sm font-medium"
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Custom Designs */}
            {customizationItems.map((item, index) => {
              const snapshot = item.snapshot || {};
              const productImage = snapshot.productImage || '/placeholder-custom.png';

              return (
                <div
                  key={`custom-${item._id}-${index}`}
                  className="bg-gradient-to-br from-white to-secondary/5 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-secondary/20"
                >
                  <div className="p-3 sm:p-4 md:p-6">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0 bg-white rounded-xl overflow-hidden border-2 border-secondary/30">
                        <img
                          src={productImage}
                          alt={`Custom ${snapshot.dressType}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = '/placeholder-custom.png';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs bg-secondary text-white px-2.5 py-1 rounded-full font-bold shadow-sm">
                              CUSTOM
                            </span>
                            <button
                              onClick={() => handleSaveForLater(`custom-${item._id}`)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Heart
                                size={18}
                                fill={savedItems.has(`custom-${item._id}`) ? 'currentColor' : 'none'}
                              />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-2 line-clamp-1">
                          Custom {snapshot.dressType || 'Design'}
                        </h3>

                        <div className="text-xs text-gray-600 space-y-1 mb-2 sm:mb-3">
                          <p className="flex items-center gap-2">
                            <span className="font-semibold">Fabric:</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded truncate">{snapshot.fabric}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-semibold">Color:</span>
                            <span
                              className="inline-block w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-md"
                              style={{ backgroundColor: snapshot.color }}
                            />
                          </p>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-secondary">
                              {currency}{(item.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {currency}{item.price?.toLocaleString()} each
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 bg-white rounded-full px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm">
                              <button
                                onClick={() => handleUpdateCustomQuantity(item._id, -1)}
                                className="text-gray-600 hover:text-secondary transition-colors p-1"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-bold w-6 sm:w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateCustomQuantity(item._id, 1)}
                                className="text-gray-600 hover:text-secondary transition-colors p-1"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveCustom(item._id)}
                              className="flex items-center gap-1.5 text-red-400 hover:text-red-600 transition-colors px-3 py-1.5 hover:bg-red-50 rounded-full text-xs sm:text-sm font-medium"
                            >
                              <Trash2 size={16} />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary - Sticky on Desktop, Bottom on Mobile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24 space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Tag className="text-secondary flex-shrink-0" size={20} />
                <span>Order Summary</span>
              </h2>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">{currency}{cartAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck size={16} className="flex-shrink-0" />
                    <span>Delivery</span>
                  </span>
                  <span className="font-semibold">
                    {freeShipping ? (
                      <span className="text-green-600 font-bold">FREE</span>
                    ) : (
                      `${currency}${delivery_fee}`
                    )}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-bold text-secondary">
                        {currency}{(freeShipping ? cartAmount : totalAmount).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">Including taxes</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/place-order')}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-secondary to-secondary/90 text-white rounded-full hover:shadow-xl transition-all duration-300 font-bold text-sm sm:text-base md:text-lg transform flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                <span>Proceed to Checkout</span>
              </button>

              <button
                onClick={() => navigate('/shop/collection')}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-secondary text-secondary rounded-full hover:bg-secondary/5 transition-all duration-300 font-semibold text-sm sm:text-base"
              >
                Continue Shopping
              </button>

              {/* Trust Badges */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <ShieldCheck size={16} className="text-green-500 flex-shrink-0" />
                  <span>Secure checkout</span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <RefreshCcw size={16} className="text-green-500 flex-shrink-0" />
                  <span>Free returns within 30 days</span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Headset size={16} className="text-green-500 flex-shrink-0" />
                  <span>Customer support 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;