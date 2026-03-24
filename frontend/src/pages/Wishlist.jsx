import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, ShoppingCart, Trash2, X, ArrowRight, Grid3x3, List } from 'lucide-react';
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
      if (sortBy === 'price-low')  filtered.sort((a, b) => a.price - b.price);
      else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
      else if (sortBy === 'name')       filtered.sort((a, b) => a.name.localeCompare(b.name));
      setWishlistProducts(filtered);
      setLoading(false);
    }
  }, [products, wishlistItems, sortBy]);

  const openSizeModal  = (product) => { setSelectedProduct(product); setSelectedSize(''); setShowSizeModal(true); };
  const closeSizeModal = () => { setShowSizeModal(false); setSelectedProduct(null); setSelectedSize(''); };

  // Add to cart → then remove from wishlist automatically
  const handleAddToCart = async () => {
    if (!selectedSize) { toast.error('Please select a size'); return; }

    const ok = await addToCart(selectedProduct._id, selectedSize, 1);
    if (ok) {
      // Remove from wishlist after successful cart add
      await removeFromWishlist(selectedProduct._id);
      closeSizeModal();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary pt-20">
        <div className="animate-spin w-8 h-8 border-2 border-secondary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4 pt-20">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-background/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-secondary/40" />
          </div>
          <h2 className="text-2xl font-light text-text mb-3 tracking-tight">Your wishlist is empty</h2>
          <p className="text-text/50 text-sm mb-8 leading-relaxed">Save items you love and come back to them anytime.</p>
          <button
            onClick={() => navigate('/shop/collection')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-background rounded-full text-sm font-medium hover:bg-secondary/90 transition-all"
          >
            Explore Collection <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-text tracking-tight">My Wishlist</h1>
            <p className="text-sm text-text/40 mt-1">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs border border-stone-200 rounded-full px-3 py-2 text-text bg-white focus:outline-none focus:border-secondary"
            >
              <option value="recent">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
            <div className="flex rounded-full border border-stone-200 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-secondary text-background' : 'bg-white text-stone-500'}`}
              >
                <Grid3x3 size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-secondary text-background' : 'bg-white text-stone-500'}`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid / List */}
        <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 max-w-2xl'}`}>
          {wishlistProducts.map(product => (
            <div
              key={product._id}
              className={`bg-white border border-stone-100 rounded-2xl overflow-hidden hover:shadow-md transition-all group ${viewMode === 'list' ? 'flex gap-4 p-4' : ''}`}
            >
              <Link
                to={`/product/${product._id}`}
                className={`block relative overflow-hidden bg-stone-50 ${viewMode === 'list' ? 'w-28 h-28 flex-shrink-0 rounded-xl' : 'aspect-[3/4]'}`}
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={e => { e.preventDefault(); removeFromWishlist(product._id); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  title="Remove from wishlist"
                >
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </Link>

              {/* Info */}
              <div className={`${viewMode === 'list' ? 'flex-1 flex flex-col justify-between py-1' : 'p-3 sm:p-4'}`}>
                <div>
                  <Link to={`/product/${product._id}`} className="block">
                    <h3 className="text-sm font-medium text-text leading-snug line-clamp-2 hover:text-secondary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-base font-semibold text-secondary mt-1.5">
                    {currency}{product.price?.toLocaleString()}
                  </p>
                </div>

                <div className={`${viewMode === 'list' ? 'flex items-center gap-2 mt-3' : 'mt-3 space-y-2'}`}>
                  <button
                    onClick={() => openSizeModal(product)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 bg-secondary text-background text-xs font-semibold rounded-xl hover:bg-secondary/90 transition-all ${viewMode === 'list' ? 'px-4' : 'w-full'}`}
                  >
                    <ShoppingCart size={13} /> Add to Cart
                  </button>
                  {viewMode === 'list' && (
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="p-2.5 border border-stone-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={13} className="text-stone-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Size Modal */}
      {showSizeModal && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={closeSizeModal}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-text">Select Size</h3>
                <p className="text-xs text-text/50 mt-0.5 line-clamp-1">{selectedProduct.name}</p>
              </div>
              <button
                onClick={closeSizeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex gap-2 flex-wrap mb-5">
              {selectedProduct.sizes?.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedSize === s
                      ? 'border-secondary bg-secondary text-background'
                      : 'border-stone-200 text-text hover:border-secondary/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="w-full py-3.5 bg-secondary text-background rounded-xl font-semibold text-sm hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
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