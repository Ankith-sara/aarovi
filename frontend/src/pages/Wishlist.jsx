import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, ShoppingCart, Trash2, X, Package, ArrowRight, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { 
    products, 
    currency, 
    wishlistItems, 
    removeFromWishlist, 
    addToCart,
    navigate,
    token 
  } = useContext(ShopContext) || {};

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (products && wishlistItems) {
      const filteredProducts = products.filter(product => 
        wishlistItems.includes(product._id)
      );
      setWishlistProducts(filteredProducts);
      setLoading(false);
    }
  }, [products, wishlistItems]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showSizeModal) {
          closeSizeModal();
        }
        if (showDeleteModal) {
          cancelDelete();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSizeModal, showDeleteModal]);

  useEffect(() => {
    document.title = 'Wishlist | Aarovi';
  }, []);

  const handleDeleteClick = (productId) => {
    setItemToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await removeFromWishlist(itemToDelete);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const openSizeModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize('');
    setQuantity(1);
    setShowSizeModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeSizeModal = () => {
    setShowSizeModal(false);
    setSelectedProduct(null);
    setSelectedSize('');
    setQuantity(1);
    document.body.style.overflow = 'unset';
  };

  const handleAddToCartWithSize = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addToCart(selectedProduct._id, selectedSize, quantity);
    await removeFromWishlist(selectedProduct._id);
    closeSizeModal();
  };

  const isSizeAvailable = (size) => {
    const sizeString = String(size).trim();
    return sizeString !== 'N/A' && 
           sizeString.toLowerCase() !== 'out of stock' && 
           sizeString !== '';
  };

  const sortSizes = (sizes) => {
    return [...sizes].sort((a, b) => {
      const sizeOrder = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7 };
      
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      
      const aOrder = sizeOrder[a.toUpperCase()] || 999;
      const bOrder = sizeOrder[b.toUpperCase()] || 999;
      return aOrder - bOrder;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <span className="text-text/60 font-light">Loading wishlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 min-h-screen">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-text mb-3">Remove from Wishlist?</h3>
              <p className="text-text/60 font-light leading-relaxed text-sm">
                This item will be removed from your wishlist. You can always add it back later.
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
                My Wishlist
              </h1>
              {wishlistProducts.length > 0 && (
                <p className="text-text/50 font-light flex items-center gap-2">
                  <Heart size={16} />
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                </p>
              )}
            </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-background/20 to-background/40 rounded-full flex items-center justify-center">
                  <Heart size={56} className="text-text/30" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Package size={24} className="text-secondary" />
                </div>
              </div>
              <div className="text-center max-w-md mb-10">
                <h3 className="text-3xl font-serif font-bold mb-3 text-text">Your wishlist is empty</h3>
                <p className="text-text/60 font-light leading-relaxed">
                  Save your favorite items and keep track of products you love
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
            <div className="space-y-6">
              <div className="space-y-4">
                {wishlistProducts.map((product) => (
                  <div key={product._id} className="group bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-background/50">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Link to={`/product/${product._id}`}>
                          <div className="relative w-full sm:w-40 h-48 sm:h-40 rounded-xl overflow-hidden bg-white border border-background/30">
                            <img
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                              src={product.images?.[0]}
                              alt={product.name}
                            />
                          </div>
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <Link
                            to={`/product/${product._id}`}
                            className="block mb-3"
                          >
                            <h3 className="font-serif font-bold text-lg text-text group-hover:text-secondary transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-text/50 font-medium">Price:</span>
                              <span className="font-bold text-secondary text-xl">
                                {currency}{product.price}
                              </span>
                            </div>
                          </div>

                          {/* Available Sizes */}
                          {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-4">
                              <span className="text-xs text-text/50 font-medium mr-2">Available Sizes:</span>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {product.sizes.filter(size => isSizeAvailable(size)).slice(0, 8).map((size, idx) => (
                                  <span 
                                    key={idx} 
                                    className="text-xs bg-background/50 px-2.5 py-1 text-text rounded-lg font-semibold"
                                  >
                                    {size}
                                  </span>
                                ))}
                                {product.sizes.filter(size => isSizeAvailable(size)).length > 8 && (
                                  <span className="text-xs text-text/50 px-2 py-1 font-semibold">
                                    +{product.sizes.filter(size => isSizeAvailable(size)).length - 8}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => openSizeModal(product)}
                              className="flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-all duration-300 shadow-lg shadow-secondary/20"
                            >
                              <ShoppingCart size={16} />
                              <span>Add to Cart</span>
                            </button>
                            <button
                              onClick={() => navigate(`/product/${product._id}`)}
                              className="flex items-center gap-2 px-6 py-3 bg-background/40 text-text font-semibold rounded-xl hover:bg-background/60 transition-all duration-300"
                            >
                              <span>View Details</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-end">
                        <button
                          onClick={() => handleDeleteClick(product._id)}
                          className="p-2.5 text-text/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center pt-2">
                <button
                  onClick={() => navigate('/shop/collection')}
                  className="px-10 py-4 bg-background/40 text-text font-semibold rounded-full hover:bg-background/60 transition-all duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Size Selection Modal */}
      {showSizeModal && selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeSizeModal}
        >
          <div 
            className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-background/30">
              <h3 className="text-xl font-serif font-bold text-text">Select Size & Quantity</h3>
              <button
                onClick={closeSizeModal}
                className="text-text/40 hover:text-text transition-colors p-1 hover:bg-background/20 rounded-full"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Product Info */}
              <div className="flex gap-4">
                <div className="w-20 h-20">
                  <img
                    src={selectedProduct.images?.[0]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-text mb-1 line-clamp-2">{selectedProduct.name}</h4>
                  <p className="text-lg font-bold text-secondary">{currency}{selectedProduct.price}</p>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-xs font-semibold text-text/50 uppercase tracking-wider mb-3">
                  Choose Size *
                </label>
                <div className="flex flex-wrap gap-2">
                  {sortSizes(selectedProduct.sizes).map((size, index) => {
                    const isAvailable = isSizeAvailable(size);
                    return (
                      <button
                        key={index}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`py-2.5 px-4 transition-all duration-300 font-semibold rounded-xl ${
                          selectedSize === size
                            ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
                            : isAvailable
                            ? 'bg-background/30 text-text hover:bg-background/50'
                            : 'bg-background/20 text-text/30 cursor-not-allowed line-through'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <label className="block text-xs font-semibold text-text/50 uppercase tracking-wider mb-3">
                  Quantity
                </label>
                <div className="flex items-center bg-background/30 rounded-xl overflow-hidden w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-background/60 transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} className="text-text" />
                  </button>
                  <input
                    type="number"
                    className="w-16 px-2 py-3 text-center focus:outline-none bg-transparent font-bold text-text"
                    value={quantity}
                    min="1"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) setQuantity(value);
                    }}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-background/60 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeSizeModal}
                  className="flex-1 py-3.5 bg-gray-100 text-text font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCartWithSize}
                  disabled={!selectedSize}
                  className={`flex-1 py-3.5 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                    selectedSize
                      ? 'bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/30'
                      : 'bg-background/50 text-text/30 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default Wishlist;