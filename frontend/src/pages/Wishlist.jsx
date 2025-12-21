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
    document.title = 'Wishlist | Aasvi';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-slideUp border border-background">
            <div className="p-6 border-b border-background flex items-center justify-between">
              <h3 className="text-xl font-serif font-semibold text-text">Remove from Wishlist</h3>
              <button
                onClick={cancelDelete}
                className="text-text/40 hover:text-text transition-colors p-1 hover:bg-background/30 rounded-full"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-text/70 font-light leading-relaxed">
                Are you sure you want to remove this item from your wishlist?
              </p>
            </div>
            
            <div className="p-6 border-t border-background flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 py-3 border-2 border-background text-text font-medium rounded-lg hover:bg-background/20 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">
            My Wishlist
          </h1>
          {wishlistProducts.length > 0 && (
            <p className="text-text/60 font-light text-lg">
              {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved for later
            </p>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-background shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center mb-6">
                <Heart size={40} className="text-secondary" />
              </div>
              <div className="text-center max-w-md mb-8">
                <h3 className="text-2xl font-serif font-semibold mb-3 text-text">Your Wishlist is Empty</h3>
                <p className="text-text/70 font-light leading-relaxed">
                  Save items you love to your wishlist and never lose track of them
                </p>
              </div>
              <button
                onClick={() => navigate('/shop/collection')}
                className="px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <span>Browse Collection</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-background shadow-sm overflow-hidden">
                <div className="p-6 border-b border-background bg-gradient-to-r from-background/20 to-primary">
                  <div className="flex items-center gap-3">
                    <Package size={20} className="text-secondary" />
                    <span className="text-sm font-semibold text-text uppercase tracking-wider">
                      Items in Wishlist: <span className="text-secondary">{wishlistProducts.length}</span>
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-background/50">
                  {wishlistProducts.map((product, index) => (
                    <div key={product._id} className="p-6 hover:bg-background/10 transition-colors duration-300">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <Link to={`/product/${product._id}`}>
                            <div className="w-full h-48 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden bg-gradient-to-br from-background/20 to-primary cursor-pointer">
                              <img
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                src={product.images?.[0]}
                                alt={product.name}
                              />
                            </div>
                          </Link>
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow flex flex-col lg:flex-row justify-between gap-6">
                          <div className="flex-grow space-y-4">
                            <div>
                              <Link
                                to={`/product/${product._id}`}
                                className="group"
                              >
                                <h3 className="font-serif font-semibold text-xl text-text mb-1 group-hover:text-secondary transition-colors line-clamp-2">
                                  {product.name}
                                </h3>
                              </Link>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <span className="block text-xs font-semibold text-text/50 uppercase tracking-wider">
                                  Price
                                </span>
                                <span className="font-semibold text-text text-lg">
                                  {currency}{product.price}
                                </span>
                              </div>

                              {product.sizes && product.sizes.length > 0 && (
                                <div className="space-y-1 col-span-2">
                                  <span className="block text-xs font-semibold text-text/50 uppercase tracking-wider">
                                    Available Sizes
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {product.sizes.filter(size => isSizeAvailable(size)).slice(0, 6).map((size, idx) => (
                                      <span 
                                        key={idx} 
                                        className="text-xs bg-gradient-to-br from-background/30 to-primary px-2 py-1 text-text rounded font-semibold border border-background"
                                      >
                                        {size}
                                      </span>
                                    ))}
                                    {product.sizes.filter(size => isSizeAvailable(size)).length > 6 && (
                                      <span className="text-xs text-text/50 px-2 py-1 font-semibold">
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
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-all duration-300 uppercase tracking-wider"
                              >
                                <ShoppingCart size={16} />
                                Add to Cart
                              </button>
                              <button
                                onClick={() => navigate(`/product/${product._id}`)}
                                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-background text-text font-semibold rounded-lg hover:bg-background/20 transition-all duration-300 uppercase tracking-wider"
                              >
                                View Details
                              </button>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <div className="flex lg:flex-col items-center lg:items-end justify-end lg:justify-start">
                            <button
                              onClick={() => handleDeleteClick(product._id)}
                              className="p-3 text-text/40 hover:text-red-500 hover:bg-red-50 rounded-lg border-2 border-transparent hover:border-red-200 transition-all duration-300"
                              aria-label="Remove from wishlist"
                            >
                              <Trash2 size={20} />
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
                  className="px-8 py-4 border-2 border-background text-text font-semibold rounded-lg hover:bg-background/20 transition-all duration-300 uppercase tracking-wider"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeSizeModal}
        >
          <div 
            className="bg-white max-w-md w-full rounded-lg shadow-2xl overflow-hidden animate-slideUp border border-background"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-background bg-gradient-to-r from-background/20 to-primary">
              <h3 className="text-xl font-serif font-semibold text-text">Select Size & Quantity</h3>
              <button
                onClick={closeSizeModal}
                className="text-text/40 hover:text-text transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Product Info */}
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-background">
                  <img
                    src={selectedProduct.images?.[0]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif font-semibold text-text mb-1 line-clamp-2">{selectedProduct.name}</h4>
                  <p className="text-lg font-semibold text-secondary">{currency}{selectedProduct.price}</p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
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
                        className={`py-2.5 px-4 transition-all duration-300 font-semibold rounded-lg ${
                          selectedSize === size
                            ? 'bg-secondary text-white shadow-md'
                            : isAvailable
                            ? 'bg-white text-text border-2 border-background hover:border-secondary'
                            : 'bg-background/50 text-text/30 border-2 border-background/50 cursor-not-allowed line-through'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-text/50 uppercase tracking-wider mb-3">
                  Quantity
                </label>
                <div className="flex items-center border-2 border-background rounded-lg overflow-hidden w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-background/20 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} className={quantity <= 1 ? 'text-text/30' : 'text-text'} />
                  </button>
                  <input
                    type="number"
                    className="w-16 h-10 text-center focus:outline-none bg-white font-semibold text-text"
                    value={quantity}
                    min="1"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) setQuantity(value);
                    }}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-background/20 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeSizeModal}
                  className="flex-1 py-3 border-2 border-background text-text font-semibold rounded-lg hover:bg-background/20 transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCartWithSize}
                  disabled={!selectedSize}
                  className={`flex-1 py-3 font-semibold rounded-lg transition-colors uppercase tracking-wider flex items-center justify-center gap-2 ${
                    selectedSize
                      ? 'bg-secondary text-white hover:bg-secondary/90'
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

export default Wishlist;