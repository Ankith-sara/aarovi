import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';
import { Trash2, ShoppingBag, Package, X, Plus, Minus, ArrowRight, Shield } from 'lucide-react';
import RecentlyViewed from '../components/RecentlyViewed';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems, products]);

  const handleDeleteClick = (id, size) => {
    setItemToDelete({ id, size });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      updateQuantity(itemToDelete.id, itemToDelete.size, 0);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleQuantityChange = (id, size, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(id, size, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!token) {
      sessionStorage.setItem('returnUrl', '/cart');
      navigate('/login');
      return;
    }
    navigate('/place-order');
  };

  useEffect(() => {
    document.title = 'Cart | Aarovi'
  })

  return (
    <div className="mt-20 min-h-screen">
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-text mb-3">Remove Item?</h3>
              <p className="text-text/60 font-light leading-relaxed text-sm">
                This item will be removed from your cart. You can always add it back later.
              </p>
            </div>

            <div className="px-8 pb-8 flex gap-3">
              <button onClick={cancelDelete} className="flex-1 py-3.5 bg-gray-100 text-text font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300">
                Keep Item
              </button>
              <button onClick={confirmDelete} className="flex-1 py-3.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/30">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-2">
                Your Cart
              </h1>
              {cartData.length > 0 && (
                <p className="text-text/50 font-light flex items-center gap-2">
                  <ShoppingBag size={16} />
                  {cartData.length} {cartData.length === 1 ? 'item' : 'items'} in your cart
                </p>
              )}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {cartData.length === 0 ? (
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
                  Start exploring our collection and discover unique pieces crafted just for you
                </p>
              </div>
              <button
                onClick={() => navigate('/shop/collection')}
                className="group px-10 py-4 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center gap-3 shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 hover:-translate-y-0.5"
              >
                <span>Explore Collection</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="grid xl:grid-cols-[1.5fr_1fr] gap-10">
              <div className="space-y-4">
                {cartData.map((item, index) => {
                  const productData = products.find(
                    (product) => product._id === item._id
                  );

                  if (!productData) {
                    return (
                      <div key={index} className="p-6 bg-red-50 rounded-2xl border-l-4 border-red-400">
                        <p className="font-semibold text-red-800">Product unavailable</p>
                        <p className="text-sm text-red-600 mt-1">This item is no longer in our catalog</p>
                      </div>
                    );
                  }

                  return (
                    <div key={index} className="group bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-background/50">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <Link to={`/product/${item._id}`}>
                            <div className="relative w-full sm:w-32 h-40 sm:h-32">
                              <img
                                className="w-full h-full object-contain"
                                src={productData.images[0]}
                                alt={productData.name}
                              />
                            </div>
                          </Link>
                        </div>

                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <Link
                              to={`/product/${item._id}`}
                              className="block mb-3"
                            >
                              <h3 className="font-serif font-bold text-lg text-text group-hover:text-secondary transition-colors line-clamp-2">
                                {productData.name}
                              </h3>
                            </Link>

                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-text/50 font-medium">Size:</span>
                                <span className="px-3 py-1 bg-background/50 rounded-lg font-semibold text-text text-sm">
                                  {item.size}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-text/50 font-medium">Price:</span>
                                <span className="font-bold text-text">
                                  {currency}{productData.price}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center bg-background/30 rounded-xl overflow-hidden">
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.size, item.quantity - 1)}
                                  className="p-2.5 hover:bg-background/60 transition-colors disabled:opacity-30"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} className="text-text" />
                                </button>
                                <input
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1;
                                    handleQuantityChange(item._id, item.size, value);
                                  }}
                                  className="w-14 px-2 py-2 text-center focus:outline-none bg-transparent font-bold text-text"
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                />
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.size, item.quantity + 1)}
                                  className="p-2.5 hover:bg-background/60 transition-colors"
                                >
                                  <Plus size={16} className="text-text" />
                                </button>
                              </div>
                              <span className="font-bold text-secondary text-lg">
                                {currency}{(productData.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-end">
                          <button
                            onClick={() => handleDeleteClick(item._id, item.size)}
                            className="p-2.5 text-text/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                            aria-label="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-white to-background/20 rounded-2xl p-8 border border-background/50 shadow-xl sticky top-6">
                  <h3 className="text-2xl font-serif font-bold text-text mb-6">Order Summary</h3>

                  <div className="space-y-6">
                    <CartTotal />

                    <div className="pt-6 border-t border-background/30 space-y-3">
                      <button
                        onClick={handleCheckout}
                        className="group w-full py-4 bg-secondary text-white font-bold rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center justify-center gap-3 shadow-secondary/30 hover:shadow-secondary/40 hover:-translate-y-0.5"
                      >
                        <span>Proceed to Checkout</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => navigate('/shop/collection')}
                        className="w-full py-4 bg-background/40 text-text font-semibold rounded-full hover:bg-background/60 transition-all duration-300"
                      >
                        Continue Shopping
                      </button>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center justify-center gap-2 text-xs text-text/50 font-medium bg-green-50 py-3 rounded-xl">
                        <Shield size={16} className="text-green-600" />
                        <span>Secure SSL Encrypted Checkout</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {cartData.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <RecentlyViewed />
          </div>
        </section>
      )}

      <style jsx>{`
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

export default Cart;