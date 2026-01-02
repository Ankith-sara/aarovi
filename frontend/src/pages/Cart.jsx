import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';

const Cart = () => {
  const { products, cartItems, currency, updateQuantity, removeFromCart, updateCustomizationQuantity, removeCustomizationFromCart, getCartAmount, navigate, delivery_fee } = useContext(ShopContext);
  const [cartProducts, setCartProducts] = useState([]);
  const [customizationItems, setCustomizationItems] = useState([]);

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
  };

  const handleUpdateCustomQuantity = (customId, delta) => {
    const currentQty = cartItems.customizations?.[customId]?.quantity || 0;
    const newQty = Math.max(0, currentQty + delta);
    updateCustomizationQuantity(customId, newQty);
  };

  const cartAmount = getCartAmount();
  const totalAmount = cartAmount + delivery_fee;

  if (cartProducts.length === 0 && customizationItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={80} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Add some items to get started!</p>
          <button
            onClick={() => navigate('/shop/collection')}
            className="px-6 py-3 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map((item, index) => (
              <div key={`${item._id}-${item.size}-${index}`} className="bg-white rounded-2xl shadow-lg p-6 flex gap-4">
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={item.images?.[0] || '/placeholder-image.png'}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-lg font-bold text-secondary mt-2">
                    {currency}{item.price?.toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item._id, item.size)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.size, -1)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.size, 1)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Custom Designs */}
            {customizationItems.map((item, index) => {
              const snapshot = item.snapshot || {};
              const productImage = snapshot.productImage || '/placeholder-custom.png';

              return (
                <div key={`custom-${item._id}-${index}`} className="bg-white rounded-2xl shadow-lg p-6 flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={productImage}
                      alt={`Custom ${snapshot.dressType}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        console.error('Failed to load custom design image:', productImage);
                        e.target.src = '/placeholder-custom.png';
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-secondary text-white px-2 py-1 rounded-full font-semibold">
                        CUSTOM DESIGN
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      Custom {snapshot.dressType || 'Design'}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1 mt-2">
                      <p><span className="font-medium">Fabric:</span> {snapshot.fabric}</p>
                      <p><span className="font-medium">Color:</span>
                        <span
                          className="inline-block w-4 h-4 rounded-full ml-2 border border-gray-300"
                          style={{ backgroundColor: snapshot.color }}
                        />
                        {snapshot.designNotes && (
                          <p className="notes">{snapshot.designNotes.substring(0, 50)}...</p>
                        )}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-secondary mt-2">
                      {currency}{item.price?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeCustomizationFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                      <button
                        onClick={() => handleUpdateCustomQuantity(item._id, -1)}
                        className="text-text hover:text-text transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateCustomQuantity(item._id, 1)}
                        className="text-text hover:text-text transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{currency}{cartAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">{currency}{delivery_fee}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-secondary">{currency}{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/place-order')}
                className="w-full mt-6 px-6 py-4 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/shop/collection')}
                className="w-full mt-3 px-6 py-3 border-2 border-secondary text-secondary rounded-full hover:bg-secondary/5 transition-all duration-300 font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;