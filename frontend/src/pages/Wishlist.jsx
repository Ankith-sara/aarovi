import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, ShoppingCart, Trash2, X, Package, ArrowRight, Plus, Minus, Filter, Grid, List, Share2 } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'price-low', 'price-high', 'name'
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (products && wishlistItems) {
      let filteredProducts = products.filter(product => 
        wishlistItems.includes(product._id)
      );

      // Apply sorting
      switch(sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default: // 'recent'
          break;
      }

      setWishlistProducts(filteredProducts);
      setLoading(false);
    }
  }, [products, wishlistItems, sortBy]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showSizeModal) closeSizeModal();
        if (showDeleteModal) cancelDelete();
        if (showShareModal) setShowShareModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSizeModal, showDeleteModal, showShareModal]);

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

  const handleAddAllToCart = () => {
    wishlistProducts.forEach(product => {
      if (product.sizes && product.sizes.length > 0) {
        openSizeModal(product);
      }
    });
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyWishlistLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    alert('Wishlist link copied to clipboard!');
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

  const getTotalValue = () => {
    return wishlistProducts.reduce((sum, product) => sum + product.price, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary border-t-transparent mx-auto mb-4"></div>
          <span className="text-gray-600">Loading your wishlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-20 ">
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slideUp">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Remove from Wishlist?</h3>
              <p className="text-gray-600 leading-relaxed">
                This item will be removed from your wishlist. You can always add it back later.
              </p>
            </div>
            
            <div className="px-8 pb-8 flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3.5 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all shadow-lg"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Share Wishlist</h3>
                <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-600 mb-6">Share your wishlist with friends and family</p>
              <button
                onClick={copyWishlistLink}
                className="w-full py-4 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-all shadow-lg"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 my-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                My Wishlist
              </h1>
              {wishlistProducts.length > 0 && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Heart size={16} className="text-red-500 fill-red-500" />
                    {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="font-semibold text-secondary">
                    Total Value: {currency}{getTotalValue().toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {wishlistProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                  title="Share Wishlist"
                >
                  <Share2 size={20} className="text-gray-700" />
                </button>
                
                <div className="flex bg-white rounded-full shadow-md p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-secondary text-white' : 'text-gray-600'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-secondary text-white' : 'text-gray-600'}`}
                  >
                    <List size={18} />
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white rounded-full shadow-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="recent">Recently Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-lg">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center">
                  <Heart size={64} className="text-red-300" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-secondary rounded-full flex items-center justify-center shadow-xl">
                  <Package size={28} className="text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-3 text-gray-900">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-8 text-center max-w-md">
                Save your favorite items and keep track of products you love
              </p>
              <button
                onClick={() => navigate('/shop/collection')}
                className="group px-10 py-4 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-all flex items-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                <span>Explore Collection</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map((product) => (
                    <div key={product._id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                      <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-square">
                        <img
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                          src={product.images?.[0]}
                          alt={product.name}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteClick(product._id);
                          }}
                          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all shadow-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </Link>

                      <div className="p-5">
                        <Link to={`/product/${product._id}`}>
                          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-secondary">
                            {currency}{product.price}
                          </span>
                        </div>

                        {product.sizes && product.sizes.length > 0 && (
                          <div className="mb-4">
                            <span className="text-xs text-gray-500 font-medium">Available Sizes:</span>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {product.sizes.filter(size => isSizeAvailable(size)).slice(0, 4).map((size, idx) => (
                                <span 
                                  key={idx} 
                                  className="text-xs bg-gray-100 px-2.5 py-1 text-gray-700 rounded-lg font-semibold"
                                >
                                  {size}
                                </span>
                              ))}
                              {product.sizes.filter(size => isSizeAvailable(size)).length > 4 && (
                                <span className="text-xs text-gray-500 px-2 py-1 font-semibold">
                                  +{product.sizes.filter(size => isSizeAvailable(size)).length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => openSizeModal(product)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-all shadow-lg"
                        >
                          <ShoppingCart size={18} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {wishlistProducts.map((product) => (
                    <div key={product._id} className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 shadow-lg">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="flex-shrink-0">
                          <Link to={`/product/${product._id}`}>
                            <div className="relative w-full sm:w-32 h-40 sm:h-32">
                              <img
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                                src={product.images?.[0]}
                                alt={product.name}
                              />
                            </div>
                          </Link>
                        </div>

                        <div className="flex-grow flex flex-col justify-between min-w-0">
                          <div>
                            <Link to={`/product/${product._id}`}>
                              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                                {product.name}
                              </h3>
                            </Link>

                            <div className="flex items-center gap-4 mb-3">
                              <span className="text-2xl font-bold text-secondary">
                                {currency}{product.price}
                              </span>
                            </div>

                            {product.sizes && product.sizes.length > 0 && (
                              <div className="mb-4">
                                <span className="text-xs text-gray-500 font-medium">Available:</span>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {product.sizes.filter(size => isSizeAvailable(size)).slice(0, 8).map((size, idx) => (
                                    <span 
                                      key={idx} 
                                      className="text-xs bg-gray-100 px-2.5 py-1 text-gray-700 rounded-lg font-semibold"
                                    >
                                      {size}
                                    </span>
                                  ))}
                                  {product.sizes.filter(size => isSizeAvailable(size)).length > 8 && (
                                    <span className="text-xs text-gray-500 px-2 py-1 font-semibold">
                                      +{product.sizes.filter(size => isSizeAvailable(size)).length - 8}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                              <button
                                onClick={() => openSizeModal(product)}
                                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-all shadow-lg text-sm sm:text-base"
                              >
                                <ShoppingCart size={16} />
                                <span>Add to Cart</span>
                              </button>
                              <Link 
                                to={`/product/${product._id}`}
                                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm sm:text-base"
                              >
                                <span>View Details</span>
                              </Link>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-start justify-end">
                          <button
                            onClick={() => handleDeleteClick(product._id)}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => navigate('/shop/collection')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-all shadow-lg"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Size Selection Modal */}
      {showSizeModal && selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeSizeModal}
        >
          <div 
            className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Select Size & Quantity</h3>
              <button
                onClick={closeSizeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-xl p-2">
                  <img
                    src={selectedProduct.images?.[0]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">{selectedProduct.name}</h4>
                  <p className="text-xl font-bold text-secondary">{currency}{selectedProduct.price}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Choose Size *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {sortSizes(selectedProduct.sizes).map((size, index) => {
                    const isAvailable = isSizeAvailable(size);
                    return (
                      <button
                        key={index}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`py-3 px-2 transition-all duration-300 font-semibold rounded-xl text-sm ${
                          selectedSize === size
                            ? 'bg-secondary text-white shadow-lg scale-105'
                            : isAvailable
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quantity
                </label>
                <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3.5 hover:bg-gray-200 transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} className="text-gray-700" />
                  </button>
                  <input
                    type="number"
                    className="w-16 px-2 py-3 text-center focus:outline-none bg-transparent font-bold text-gray-900"
                    value={quantity}
                    min="1"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) setQuantity(value);
                    }}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3.5 hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={18} className="text-gray-700" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeSizeModal}
                  className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCartWithSize}
                  disabled={!selectedSize}
                  className={`flex-1 py-3.5 font-semibold rounded-full transition-all flex items-center justify-center gap-2 ${
                    selectedSize
                      ? 'bg-secondary text-white hover:bg-secondary/90 shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={18} />
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