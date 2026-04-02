import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, ShoppingCart, Trash2, X, ArrowLeft, Grid3x3, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const {
    products, currency, wishlistItems,
    removeFromWishlist, addToCart, navigate
  } = useContext(ShopContext) || {};

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => { document.title = 'Wishlist | Aarovi'; }, []);

  useEffect(() => {
    if (products && wishlistItems) {
      let filtered = products.filter(p => wishlistItems.includes(p._id));
      if (sortBy === 'price-low')       filtered.sort((a, b) => a.price - b.price);
      else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
      else if (sortBy === 'name')       filtered.sort((a, b) => a.name.localeCompare(b.name));
      setWishlistProducts(filtered);
      setLoading(false);
    }
  }, [products, wishlistItems, sortBy]);

  const openSizeModal  = (product) => { setSelectedProduct(product); setSelectedSize(''); setShowSizeModal(true); };
  const closeSizeModal = () => { setShowSizeModal(false); setSelectedProduct(null); setSelectedSize(''); };

  const handleAddToCart = async () => {
    if (!selectedSize) { toast.error('Please select a size'); return; }
    const ok = await addToCart(selectedProduct._id, selectedSize, 1);
    if (ok) {
      await removeFromWishlist(selectedProduct._id);
      closeSizeModal();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white pt-20">
        <div className="animate-spin w-8 h-8 border-2 border-[#4F200D] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: '#FBF7F3' }} flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart size={64} className="text-gray-300" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#4F200D] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">0</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-8 text-base sm:text-lg">Save items you love and come back to them anytime!</p>
          <button
            onClick={() => navigate('/shop/collection')}
            className="px-8 py-4 bg-[#4F200D] text-white rounded-full hover:bg-[#4F200D]/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Explore Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FBF7F3' }} py-20 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/shop/collection')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#4F200D] transition-colors mb-4 text-sm sm:text-base"
          >
            <ArrowLeft size={18} /><span className="font-medium">Continue Shopping</span>
          </button>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs border border-stone-200 rounded-full px-3 py-2 text-gray-700 bg-white focus:outline-none focus:border-[#4F200D]"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
              <div className="flex rounded-full border border-stone-200 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#4F200D] text-white' : 'bg-white text-stone-500'}`}
                >
                  <Grid3x3 size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[#4F200D] text-white' : 'bg-white text-stone-500'}`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'
          : 'space-y-3 sm:space-y-4 max-w-3xl'
        }>
          {wishlistProducts.map((product) => (
            viewMode === 'list' ? (
              /* ── LIST VIEW ── */
              <div key={product._id} className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="flex gap-3 sm:gap-4">
                    <Link
                      to={`/product/${product._id}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 block"
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 line-clamp-2 mb-2 hover:text-[#4F200D] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      {product.category && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium capitalize">
                            {product.category}
                          </span>
                          {product.subCategory && (
                            <span className="text-xs bg-[#4F200D]/10 text-[#4F200D] px-2 py-1 rounded-full font-medium capitalize">
                              {product.subCategory}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#4F200D] mb-3">
                        {currency}{product.price?.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openSizeModal(product)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#4F200D] text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-[#4F200D]/90 transition-all shadow-sm hover:shadow-md"
                        >
                          <ShoppingCart size={14} /> Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product._id)}
                          className="flex items-center gap-1.5 text-red-400 hover:text-red-600 transition-colors px-3 py-2 hover:bg-red-50 rounded-full text-xs sm:text-sm font-medium"
                        >
                          <Trash2 size={16} /><span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ── GRID VIEW ── */
              <div key={product._id} className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col">
                <Link to={`/product/${product._id}`} className="relative block aspect-[3/4] bg-gray-50 overflow-hidden">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={e => { e.preventDefault(); removeFromWishlist(product._id); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                </Link>
                <div className="p-3 flex flex-col flex-1">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-[#4F200D] transition-colors leading-snug">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm sm:text-base font-bold text-[#4F200D] mt-1 mb-3">
                    {currency}{product.price?.toLocaleString()}
                  </p>
                  <button
                    onClick={() => openSizeModal(product)}
                    className="mt-auto w-full flex items-center justify-center gap-1.5 py-2 bg-[#4F200D] text-white text-xs font-semibold rounded-xl hover:bg-[#4F200D]/90 transition-all"
                  >
                    <ShoppingCart size={13} /> Add to Cart
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Size Selection Modal */}
      {showSizeModal && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={closeSizeModal}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={selectedProduct.images?.[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1">{selectedProduct.name}</h3>
                  <p className="text-[#4F200D] font-bold text-sm mt-0.5">{currency}{selectedProduct.price?.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={closeSizeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wide">Select Size</p>
            <div className="flex gap-2 flex-wrap mb-5">
              {selectedProduct.sizes?.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedSize === s
                      ? 'border-[#4F200D] bg-[#4F200D] text-white'
                      : 'border-stone-200 text-gray-700 hover:border-[#4F200D]/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="w-full py-3.5 bg-gradient-to-r from-secondary to-[#4F200D]/90 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={15} /> Move to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;