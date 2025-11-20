import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, ShoppingCart, Trash2, X, Package } from 'lucide-react';
import Title from '../components/Title';
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

  // Filter products that are in wishlist
  useEffect(() => {
    if (products && wishlistItems) {
      const filteredProducts = products.filter(product => 
        wishlistItems.includes(product._id)
      );
      setWishlistProducts(filteredProducts);
      setLoading(false);
    }
  }, [products, wishlistItems]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Close modal on Escape key
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
    document.title = 'Wishlist | Aharyas';
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

  // Check if size is available
  const isSizeAvailable = (size) => {
    const sizeString = String(size).trim();
    return sizeString !== 'N/A' && 
           sizeString.toLowerCase() !== 'out of stock' && 
           sizeString !== '';
  };

  // Sort sizes function
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <span className="text-gray-600">Loading wishlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black mt-20">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-sm shadow-2xl max-w-md w-full animate-slideUp">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-medium tracking-wide">Remove from Wishlist</h3>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 font-light leading-relaxed">
                Are you sure you want to remove this item from your wishlist?
              </p>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 py-3 border border-gray-300 text-black font-light tracking-wide hover:bg-gray-50 transition-all duration-300 uppercase"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-white text-black border border-gray-300 font-light tracking-wide hover:bg-red-100 hover:text-red-600 transition-all duration-300 uppercase"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-3xl mb-3">
              <Title text1="MY" text2="WISHLIST" />
            </div>
            {wishlistProducts.length > 0 && (
              <p className="text-gray-500 font-light">
                {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved for later
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 shadow-sm">
              <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-6">
                <Heart size={32} className="text-gray-400" />
              </div>
              <div className="text-center max-w-md mb-8">
                <h3 className="text-2xl font-medium mb-3 tracking-wide">YOUR WISHLIST IS EMPTY</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Save items you love to your wishlist and never lose track of them
                </p>
              </div>
              <button
                onClick={() => navigate('/shop/collection')}
                className="px-8 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
              >
                BROWSE PRODUCTS
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items in Wishlist:
                      </span>
                      <span className="font-medium text-black tracking-wide">{wishlistProducts.length}</span>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {wishlistProducts.map((product) => (
                    <div key={product._id} className="p-6 hover:bg-gray-50 transition-colors duration-300">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <Link to={`/product/${product._id}`}>
                            <div className="w-full h-48 sm:w-32 sm:h-32 lg:w-40 lg:h-40 cursor-pointer">
                              <img
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                src={product.images?.[0]}
                                alt={product.name}
                              />
                            </div>
                          </Link>
                        </div>

                        <div className="flex-grow flex flex-col lg:flex-row justify-between gap-6">
                          <div className="flex-grow space-y-4">
                            <div>
                              <Link
                                to={`/product/${product._id}`}
                                className="group"
                              >
                                <h3 className="font-medium text-xl text-black mb-2 tracking-wide group-hover:text-gray-700 transition-colors line-clamp-2">
                                  {product.name}
                                </h3>
                              </Link>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  PRICE
                                </span>
                                <span className="font-medium text-black text-lg">
                                  {currency}{product.price}
                                </span>
                              </div>

                              {product.sizes && product.sizes.length > 0 && (
                                <div className="space-y-1 col-span-2">
                                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    AVAILABLE SIZES
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {product.sizes.filter(size => isSizeAvailable(size)).slice(0, 6).map((size, index) => (
                                      <span 
                                        key={index} 
                                        className="text-xs bg-gray-100 px-2 py-1 text-gray-600 border border-gray-200"
                                      >
                                        {size}
                                      </span>
                                    ))}
                                    {product.sizes.filter(size => isSizeAvailable(size)).length > 6 && (
                                      <span className="text-xs text-gray-500 px-2 py-1">
                                        +{product.sizes.filter(size => isSizeAvailable(size)).length - 6} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                              <button
                                onClick={() => openSizeModal(product)}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300 uppercase"
                              >
                                <ShoppingCart size={16} />
                                ADD TO CART
                              </button>
                              <button
                                onClick={() => navigate(`/product/${product._id}`)}
                                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-black font-light tracking-wide hover:border-black hover:bg-gray-50 transition-all duration-300 uppercase"
                              >
                                VIEW DETAILS
                              </button>
                            </div>
                          </div>

                          <div className="flex lg:flex-col items-center lg:items-end justify-end lg:justify-start">
                            <button
                              onClick={() => handleDeleteClick(product._id)}
                              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-300"
                              aria-label="Remove from wishlist"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="text-center">
                <button
                  onClick={() => navigate('/shop/collection')}
                  className="px-8 py-4 border border-gray-300 text-black font-light tracking-wide hover:border-black hover:bg-gray-50 transition-all duration-300 uppercase"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Size Selection Modal */}
      {showSizeModal && selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeSizeModal}
        >
          <div 
            className="bg-white max-w-md w-full rounded-sm shadow-2xl overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 tracking-wide">Select Size</h3>
              <button
                onClick={closeSizeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Product Info */}
              <div className="flex gap-4 mb-6">
                <img
                  src={selectedProduct.images?.[0]}
                  alt={selectedProduct.name}
                  className="w-20 h-20 object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{selectedProduct.name}</h4>
                  <p className="text-lg font-medium text-black">{currency}{selectedProduct.price}</p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
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
                        className={`py-2.5 px-4 transition-all duration-300 font-light relative ${
                          selectedSize === size
                            ? 'bg-black text-white shadow-md'
                            : isAvailable
                            ? 'bg-white text-gray-700 border border-gray-300 hover:border-black'
                            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {size}
                        {!isAvailable && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-full h-px bg-gray-400 rotate-[-25deg] transform origin-center"></span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-300"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="w-16 h-10 text-center focus:outline-none bg-white font-medium"
                    value={quantity}
                    min="1"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) setQuantity(value);
                    }}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeSizeModal}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-light tracking-wide hover:border-gray-400 transition-colors uppercase"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddToCartWithSize}
                  disabled={!selectedSize}
                  className={`flex-1 py-3 font-light tracking-wide transition-colors uppercase ${
                    selectedSize
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
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
      `}</style>
    </div>
  );
};

export default Wishlist;