import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import {
  ShoppingBag, X, ChevronDown, Grid3x3, List, Check, Heart, SlidersHorizontal, TrendingUp, Star, ChevronUp, Tag, Sparkles
} from 'lucide-react';
import RecentlyViewed from '../components/RecentlyViewed';

const ProductPage = () => {
  const location = useLocation();
  const { subcategory } = useParams(); 
  const { category } = location.state || {};

  const {
    products = [],
    selectedSubCategory,
    setSelectedSubCategory,
    navigate,
    currency,
    addToWishlist,
    removeFromWishlist,
    wishlist = []
  } = useContext(ShopContext);

  // Enhanced state management
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('relevant');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showOnSale, setShowOnSale] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    price: true,
    features: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Calculate price statistics
  const priceStats = products.length > 0 ? {
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price)),
    avg: Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
  } : { min: 0, max: 10000, avg: 5000 };

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (priceRange.min > priceStats.min || priceRange.max < priceStats.max) count++;
    if (showOnSale) count++;
    if (showNewArrivals) count++;
    if (sortOption !== 'relevant') count++;
    setActiveFiltersCount(count);
  }, [priceRange, sortOption, showOnSale, showNewArrivals, priceStats]);

  // Enhanced filtering logic
  useEffect(() => {
    setIsLoading(true);
    let updatedProducts = [...products];

    // Subcategory filter
    if (subcategory || selectedSubCategory) {
      const targetSubCategory = subcategory || selectedSubCategory;
      updatedProducts = updatedProducts.filter(
        (product) => product.subCategory === targetSubCategory
      );
    }

    // Price range filter
    updatedProducts = updatedProducts.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sale filter
    if (showOnSale) {
      updatedProducts = updatedProducts.filter(
        (product) => product.onSale || product.discount > 0
      );
    }

    // New arrivals filter
    if (showNewArrivals) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      updatedProducts = updatedProducts.filter(
        (product) => new Date(product.createdAt || product.dateAdded) > thirtyDaysAgo
      );
    }

    // Enhanced sorting
    updatedProducts.sort((a, b) => {
      switch (sortOption) {
        case 'low-high':
          return a.price - b.price;
        case 'high-low':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt || b.dateAdded) - new Date(a.createdAt || a.dateAdded);
        case 'popular':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name-az':
          return a.name.localeCompare(b.name);
        case 'name-za':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(updatedProducts);
    setTimeout(() => setIsLoading(false), 300);
  }, [
    products, selectedSubCategory, subcategory, category, sortOption,
    priceRange, showOnSale, showNewArrivals,
  ]);

  const clearFilters = () => {
    setPriceRange({ min: priceStats.min, max: priceStats.max });
    setSortOption('relevant');
    setShowOnSale(false);
    setShowNewArrivals(false);
  };

  const getCollectionTitle = () => {
    if (subcategory) return subcategory.toUpperCase();
    if (selectedSubCategory) return selectedSubCategory.toUpperCase();
    if (category) return category.toUpperCase();
    return "AASVI";
  };

  const getCollectionSubtitle = () => {
    return `Discover ${filteredProducts.length} carefully curated piece${filteredProducts.length !== 1 ? 's' : ''}${
      (subcategory || selectedSubCategory) ? ` in ${(subcategory || selectedSubCategory).toLowerCase()}` : ''
    }`;
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ title, isExpanded, onToggle, children, icon: Icon }) => (
    <div className="border-b border-background/30">
      <button
        onClick={onToggle}
        className="w-full py-4 px-0 flex justify-between items-center text-left font-semibold text-sm hover:text-secondary transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-secondary" />}
          {title}
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isExpanded && (
        <div className="pb-4">
          <div className="w-12 h-0.5 bg-secondary mb-4 rounded-full"></div>
          {children}
        </div>
      )}
    </div>
  );

  const FilterPanel = () => (
    <div className="bg-white border border-background rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-background bg-gradient-to-r from-background/20 to-primary">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-semibold tracking-wide">Filters</h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs uppercase tracking-wider text-secondary hover:text-[#8B6F47] transition-colors font-semibold flex items-center gap-1"
            >
              Clear All
              <span className="w-5 h-5 bg-secondary text-white rounded-full text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="px-6">
        {/* Price Range Filter */}
        <FilterSection
          title="PRICE RANGE"
          isExpanded={expandedFilters.price}
          onToggle={() => toggleFilterSection('price')}
          icon={Tag}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-text/60 font-medium">
              <span>{currency}{priceStats.min}</span>
              <span className="text-secondary">AVG: {currency}{priceStats.avg}</span>
              <span>{currency}{priceStats.max}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  min={priceStats.min}
                  max={priceStats.max}
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-full border-2 border-background rounded-lg px-3 py-2 text-sm font-medium focus:border-secondary focus:outline-none transition-colors"
                  placeholder="Min"
                />
              </div>
              <span className="text-text/40 font-medium">—</span>
              <div className="flex-1">
                <input
                  type="number"
                  min={priceStats.min}
                  max={priceStats.max}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-full border-2 border-background rounded-lg px-3 py-2 text-sm font-medium focus:border-secondary focus:outline-none transition-colors"
                  placeholder="Max"
                />
              </div>
            </div>
            {/* Quick price filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Under ₹1000', min: 0, max: 1000 },
                { label: '₹1000-₹3000', min: 1000, max: 3000 },
                { label: '₹3000-₹5000', min: 3000, max: 5000 },
                { label: 'Above ₹5000', min: 5000, max: priceStats.max }
              ].map((range, index) => (
                <button
                  key={index}
                  onClick={() => setPriceRange({ min: range.min, max: range.max })}
                  className="px-3 py-1.5 border-2 border-background rounded-lg text-xs font-medium hover:border-secondary hover:bg-background/20 transition-all duration-300"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Special Features */}
        <FilterSection
          title="SPECIAL FEATURES"
          isExpanded={expandedFilters.features}
          onToggle={() => toggleFilterSection('features')}
          icon={Sparkles}
        >
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showOnSale}
                  onChange={(e) => setShowOnSale(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all duration-300 ${showOnSale
                    ? 'bg-secondary border-secondary'
                    : 'border-background group-hover:border-secondary'
                  }`}>
                  {showOnSale && (
                    <Check size={14} className="text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm font-medium group-hover:text-secondary transition-colors">
                On Sale
              </span>
            </label>

            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showNewArrivals}
                  onChange={(e) => setShowNewArrivals(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all duration-300 ${showNewArrivals
                    ? 'bg-secondary border-secondary'
                    : 'border-background group-hover:border-secondary'
                  }`}>
                  {showNewArrivals && (
                    <Check size={14} className="text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm font-medium group-hover:text-secondary transition-colors">
                New Arrivals (30 days)
              </span>
            </label>
          </div>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">
              {getCollectionTitle()}
            </h1>
            {filteredProducts.length > 0 && (
              <p className="text-text/60 font-light text-lg">
                {getCollectionSubtitle()}
              </p>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start lg:items-center gap-4 p-6 bg-white rounded-lg border border-background shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-background rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all duration-300 ${viewMode === 'grid' ? 'bg-secondary text-white' : 'bg-white text-text/60 hover:text-secondary'
                    }`}
                  aria-label="Grid view"
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-300 ${viewMode === 'list' ? 'bg-secondary text-white' : 'bg-white text-text/60 hover:text-secondary'
                    }`}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 border-2 border-background rounded-lg bg-white hover:border-secondary transition-all duration-300 relative"
                >
                  <SlidersHorizontal size={18} />
                  <span className="font-semibold tracking-wide">FILTERS</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-secondary text-white rounded-full text-xs flex items-center justify-center font-semibold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-text/60 tracking-wide">SORT BY:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none border-2 border-background bg-white px-4 py-3 pr-10 font-medium rounded-lg tracking-wide focus:border-secondary focus:outline-none transition-colors"
                >
                  <option value="relevant">Relevance</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="name-az">Name: A to Z</option>
                  <option value="name-za">Name: Z to A</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-text/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-start overflow-y-auto pt-20 px-4 pb-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-background bg-gradient-to-r from-background/20 to-primary rounded-t-lg">
              <h3 className="text-lg font-serif font-semibold tracking-wide">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-background/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <FilterPanel />
            </div>
            <div className="p-6 border-t border-background flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 border-2 border-background rounded-lg font-semibold tracking-wide hover:border-secondary transition-all duration-300"
              >
                CLEAR ALL
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 bg-secondary text-white rounded-lg font-semibold tracking-wide hover:bg-[#8B6F47] transition-all duration-300"
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FilterPanel />
              </div>
            </div>

            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary border-t-transparent mx-auto mb-4"></div>
                    <span className="text-text/60 font-medium">Loading products...</span>
                  </div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product, index) => (
                        <div key={product._id} className="group">
                          <ProductItem
                            name={product.name}
                            id={product._id}
                            price={product.price}
                            image={product.images}
                            currency={currency}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredProducts.map((product, index) => (
                        <div
                          key={product._id}
                          className="flex flex-col md:flex-row gap-6 p-6 bg-white border border-background rounded-lg hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="md:w-1/4 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-background/20 to-primary">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-xl font-serif font-semibold tracking-wide group-hover:text-secondary transition-colors">
                                  {product.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  {product.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star size={14} className="text-yellow-400 fill-current" />
                                      <span className="text-sm text-text/70 font-medium">{product.rating}</span>
                                    </div>
                                  )}
                                  <button
                                    onClick={() => {
                                      if (wishlist.includes(product._id)) {
                                        removeFromWishlist(product._id);
                                      } else {
                                        addToWishlist(product._id);
                                      }
                                    }}
                                    className={`p-2 border-2 rounded-lg transition-all duration-300 ${wishlist.includes(product._id)
                                        ? 'bg-secondary text-white border-secondary'
                                        : 'bg-white text-text border-background hover:border-secondary'
                                      }`}
                                  >
                                    <Heart size={14} className={wishlist.includes(product._id) ? 'fill-current' : ''} />
                                  </button>
                                </div>
                              </div>

                              <div className="text-sm text-text/60 mb-3 font-medium">
                                {product.category} • {product.subCategory}
                              </div>

                              {product.description && (
                                <p className="text-text/70 font-light leading-relaxed mb-4">
                                  {product.description.length > 200
                                    ? product.description.substring(0, 200) + '...'
                                    : product.description
                                  }
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-background/30">
                              <div className="flex items-center gap-3">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-serif font-bold text-secondary">
                                    {currency}{product.price}
                                  </span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-sm text-text/50 line-through font-medium">
                                      {currency}{product.originalPrice}
                                    </span>
                                  )}
                                </div>
                                {product.discount && (
                                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
                                    -{product.discount}% OFF
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigate ? navigate(`/product/${product._id}`) : window.location.href = `/product/${product._id}`}
                                  className="px-6 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-[#8B6F47] transition-all duration-300"
                                >
                                  VIEW DETAILS
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-background rounded-lg shadow-sm">
                  <div className="w-20 h-20 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={40} className="text-secondary" />
                  </div>
                  <div className="text-center max-w-md">
                    <h3 className="text-2xl font-serif font-semibold mb-3 text-text">No Products Found</h3>
                    <p className="text-text/70 font-light leading-relaxed mb-6">
                      We couldn't find any products matching your current filters. Try adjusting your search criteria or browse our full collection.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={clearFilters}
                        className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-[#8B6F47] transition-all duration-300"
                      >
                        CLEAR ALL FILTERS
                      </button>
                      <button
                        onClick={() => navigate ? navigate('/') : window.location.href = '/'}
                        className="px-6 py-3 border-2 border-background bg-white text-text font-semibold rounded-lg hover:bg-background/20 transition-all duration-300"
                      >
                        BROWSE ALL PRODUCTS
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      {filteredProducts.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-7xl mx-auto">
            <RecentlyViewed />
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;