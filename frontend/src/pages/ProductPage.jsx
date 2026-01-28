import React, { useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';
import {
  ShoppingBag, X, ChevronDown, Grid3x3, List, Check, SlidersHorizontal, Tag, Sparkles, ChevronUp, ArrowUp
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
    currency
  } = useContext(ShopContext);

  // State management
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [sortOption, setSortOption] = useState('relevant');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 10000 });
  const [showOnSale, setShowOnSale] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    features: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;
  const observerRef = useRef();
  const loadMoreRef = useRef();

  // Get current category products - memoized to prevent recalculation
  const categoryProducts = useMemo(() => {
    let relevantProducts = [...products];
    
    if (subcategory || selectedSubCategory) {
      const targetSubCategory = subcategory || selectedSubCategory;
      relevantProducts = relevantProducts.filter(
        (product) => product.subCategory === targetSubCategory
      );
    }
    
    return relevantProducts;
  }, [products, subcategory, selectedSubCategory]);

  // Calculate price statistics - memoized
  const priceStats = useMemo(() => {
    if (categoryProducts.length === 0) {
      return { min: 0, max: 10000, avg: 5000 };
    }

    const prices = categoryProducts.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length)
    };
  }, [categoryProducts]);

  // Initialize/Reset price range when category changes
  useEffect(() => {
    if (categoryProducts.length > 0) {
      setPriceRange({ min: priceStats.min, max: priceStats.max });
      setTempPriceRange({ min: priceStats.min, max: priceStats.max });
    }
    // Reset other filters when category changes
    setShowOnSale(false);
    setShowNewArrivals(false);
    setSortOption('relevant');
  }, [subcategory, selectedSubCategory, priceStats.min, priceStats.max, categoryProducts.length]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (priceRange.min > priceStats.min || priceRange.max < priceStats.max) count++;
    if (showOnSale) count++;
    if (showNewArrivals) count++;
    if (sortOption !== 'relevant') count++;
    setActiveFiltersCount(count);
  }, [priceRange, sortOption, showOnSale, showNewArrivals, priceStats.min, priceStats.max]);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced filtering logic - FIXED
  useEffect(() => {
    setIsLoading(true);
    
    // Start with category-filtered products
    let updatedProducts = [...categoryProducts];

    // Apply price range filter
    updatedProducts = updatedProducts.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply sale filter
    if (showOnSale) {
      updatedProducts = updatedProducts.filter(
        (product) => product.onSale || product.discount > 0
      );
    }

    // Apply new arrivals filter
    if (showNewArrivals) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      updatedProducts = updatedProducts.filter(
        (product) => {
          const productDate = new Date(product.createdAt || product.dateAdded);
          return productDate > thirtyDaysAgo;
        }
      );
    }

    // Apply sorting
    updatedProducts.sort((a, b) => {
      switch (sortOption) {
        case 'low-high':
          return a.price - b.price;
        case 'high-low':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt || b.dateAdded) - new Date(a.createdAt || a.dateAdded);
        case 'name-az':
          return a.name.localeCompare(b.name);
        case 'name-za':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(updatedProducts);
    setPage(1);
    setDisplayedProducts(updatedProducts.slice(0, ITEMS_PER_PAGE));
    setHasMore(updatedProducts.length > ITEMS_PER_PAGE);
    setTimeout(() => setIsLoading(false), 300);
  }, [
    categoryProducts,
    sortOption,
    priceRange.min, 
    priceRange.max, 
    showOnSale, 
    showNewArrivals
  ]);

  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    const nextPage = page + 1;
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newProducts = filteredProducts.slice(startIndex, endIndex);
    
    if (newProducts.length > 0) {
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setPage(nextPage);
      setHasMore(endIndex < filteredProducts.length);
    } else {
      setHasMore(false);
    }
  }, [page, filteredProducts, hasMore, isLoading]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, isLoading, loadMoreProducts]);

  const clearFilters = () => {
    setPriceRange({ min: priceStats.min, max: priceStats.max });
    setTempPriceRange({ min: priceStats.min, max: priceStats.max });
    setSortOption('relevant');
    setShowOnSale(false);
    setShowNewArrivals(false);
  };

  // FIXED: Apply filters function now properly applies tempPriceRange to priceRange
  const applyFilters = () => {
    setPriceRange(tempPriceRange);
    setShowFilters(false);
  };

  const getCollectionTitle = () => {
    if (subcategory) return subcategory.toUpperCase();
    if (selectedSubCategory) return selectedSubCategory.toUpperCase();
    if (category) return category.toUpperCase();
    return "ALL PRODUCTS";
  };

  const getCollectionSubtitle = () => {
    return `${filteredProducts.length} item${filteredProducts.length !== 1 ? 's' : ''} available`;
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortOptions = [
    { value: 'relevant', label: 'Recommended' },
    { value: 'low-high', label: 'Price: Low to High' },
    { value: 'high-low', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'name-az', label: 'Name: A to Z' },
    { value: 'name-za', label: 'Name: Z to A' }
  ];

  const FilterSection = ({ title, isExpanded, onToggle, children, icon: Icon }) => (
    <div className="border-b border-background/30 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex justify-between items-center text-left font-semibold text-sm hover:text-secondary transition-colors active:scale-[0.99]"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-secondary" />}
          <span className="uppercase tracking-wider">{title}</span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isExpanded && (
        <div className="pb-4 animate-slideDown">
          {children}
        </div>
      )}
    </div>
  );

  const FilterPanel = ({ isMobile = false }) => (
    <div className={`bg-white ${isMobile ? '' : 'border border-background shadow-sm'} overflow-hidden`}>
      <div className={`p-4 sm:p-6 border-b border-background ${isMobile ? 'bg-white' : 'bg-gradient-to-r from-background/20 to-primary'}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-serif font-semibold tracking-wide">FILTERS</h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs uppercase tracking-wider text-secondary hover:text-[#8B6F47] transition-colors font-semibold flex items-center gap-2 active:scale-95"
            >
              <span>Clear</span>
              <span className="w-5 h-5 bg-secondary text-white rounded-full text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Price Range Filter */}
        <FilterSection
          title="Price Range"
          isExpanded={expandedFilters.price}
          onToggle={() => toggleFilterSection('price')}
          icon={Tag}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-text/50 uppercase tracking-wider mb-2">Min</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40 font-medium">{currency}</span>
                  <input
                    type="number"
                    min={priceStats.min}
                    max={tempPriceRange.max}
                    value={tempPriceRange.min}
                    onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: Number(e.target.value) })}
                    className="w-full border-2 border-background pl-8 pr-3 py-2.5 text-sm font-medium focus:border-secondary focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <span className="text-text/40 font-medium pt-6">—</span>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-text/50 uppercase tracking-wider mb-2">Max</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40 font-medium">{currency}</span>
                  <input
                    type="number"
                    min={tempPriceRange.min}
                    max={priceStats.max}
                    value={tempPriceRange.max}
                    onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: Number(e.target.value) })}
                    className="w-full border-2 border-background pl-8 pr-3 py-2.5 text-sm font-medium focus:border-secondary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Range Slider Visual */}
            <div className="px-2">
              <div className="h-1 bg-background rounded-full relative">
                <div 
                  className="absolute h-full bg-secondary rounded-full"
                  style={{
                    left: `${((tempPriceRange.min - priceStats.min) / (priceStats.max - priceStats.min)) * 100}%`,
                    right: `${100 - ((tempPriceRange.max - priceStats.min) / (priceStats.max - priceStats.min)) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Quick price filters - Dynamic based on category */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: `Under ${currency}${Math.floor(priceStats.max * 0.2)}`, min: priceStats.min, max: Math.floor(priceStats.max * 0.2) },
                { label: `${currency}${Math.floor(priceStats.max * 0.2)} - ${currency}${Math.floor(priceStats.max * 0.5)}`, min: Math.floor(priceStats.max * 0.2), max: Math.floor(priceStats.max * 0.5) },
                { label: `${currency}${Math.floor(priceStats.max * 0.5)} - ${currency}${Math.floor(priceStats.max * 0.8)}`, min: Math.floor(priceStats.max * 0.5), max: Math.floor(priceStats.max * 0.8) },
                { label: `Above ${currency}${Math.floor(priceStats.max * 0.8)}`, min: Math.floor(priceStats.max * 0.8), max: priceStats.max }
              ].map((range, index) => (
                <button
                  key={index}
                  onClick={() => setTempPriceRange({ min: range.min, max: range.max })}
                  className={`px-3 py-2 border-2 text-xs font-medium transition-all duration-300 active:scale-95 ${
                    tempPriceRange.min === range.min && tempPriceRange.max === range.max
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-background hover:border-secondary'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Desktop: Apply button */}
            {!isMobile && (
              <button
                onClick={() => setPriceRange(tempPriceRange)}
                className="w-full py-2.5 bg-secondary text-white font-semibold tracking-wide uppercase hover:bg-[#8B6F47] transition-all active:scale-[0.98]"
              >
                Apply Price Filter
              </button>
            )}
          </div>
        </FilterSection>

        {/* Special Features */}
        <FilterSection
          title="Special Features"
          isExpanded={expandedFilters.features}
          onToggle={() => toggleFilterSection('features')}
          icon={Sparkles}
        >
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer group active:scale-[0.99]">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showOnSale}
                  onChange={(e) => setShowOnSale(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 transition-all duration-300 ${showOnSale
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

            <label className="flex items-center cursor-pointer group active:scale-[0.99]">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showNewArrivals}
                  onChange={(e) => setShowNewArrivals(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 transition-all duration-300 ${showNewArrivals
                    ? 'bg-secondary border-secondary'
                    : 'border-background group-hover:border-secondary'
                  }`}>
                  {showNewArrivals && (
                    <Check size={14} className="text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm font-medium group-hover:text-secondary transition-colors">
                New Arrivals
              </span>
              <span className="ml-auto text-xs text-text/50 font-medium">Last 30 days</span>
            </label>
          </div>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white mt-16 sm:mt-20">
      {/* Header Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-b border-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-3">
              {getCollectionTitle()}
            </h1>
            {filteredProducts.length > 0 && (
              <p className="text-text/60 font-light text-base sm:text-lg">
                {getCollectionSubtitle()}
              </p>
            )}
          </div>

          {/* Desktop Controls Bar */}
          <div className="hidden sm:flex justify-between items-center gap-4 p-5 bg-white border border-background shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-background overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-all duration-300 ${viewMode === 'grid' ? 'bg-secondary text-white' : 'bg-white text-text/60 hover:text-secondary'
                    }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-all duration-300 ${viewMode === 'list' ? 'bg-secondary text-white' : 'bg-white text-text/60 hover:text-secondary'
                    }`}
                >
                  <List size={18} />
                </button>
              </div>
              <span className="text-sm text-text/50 font-medium">
                Showing {displayedProducts.length} of {filteredProducts.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-text/60 tracking-wider uppercase">Sort:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none border-2 border-background bg-white px-4 py-2.5 pr-10 font-medium text-sm focus:border-secondary focus:outline-none transition-colors"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Controls */}
      <div className="sm:hidden sticky top-16 z-30 bg-white border-b border-background/30 shadow-sm">
        <div className="flex items-center p-3 gap-2">
          <button
            onClick={() => setShowFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-background bg-white active:bg-background/20 transition-all relative"
          >
            <SlidersHorizontal size={18} />
            <span className="font-semibold text-sm tracking-wide uppercase">Filter</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-secondary text-white rounded-full text-xs flex items-center justify-center font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowSortModal(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-background bg-white active:bg-background/20 transition-all"
          >
            <ChevronDown size={18} />
            <span className="font-semibold text-sm tracking-wide uppercase">Sort</span>
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className={`p-3 border-2 border-background transition-all ${viewMode === 'grid' ? 'bg-secondary text-white' : 'bg-white text-text'}`}
          >
            {viewMode === 'grid' ? <Grid3x3 size={18} /> : <List size={18} />}
          </button>
        </div>
        <div className="px-4 py-2 text-xs text-text/50 font-medium text-center border-t border-background/20">
          Showing {displayedProducts.length} of {filteredProducts.length} items
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col">
          <div className="bg-white flex-1 flex flex-col overflow-hidden animate-slideUp">
            <div className="flex justify-between items-center p-4 border-b border-background bg-gradient-to-r from-background/20 to-primary">
              <h3 className="text-lg font-serif font-semibold uppercase tracking-wide">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-background/20 rounded-full transition-colors active:scale-95">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FilterPanel isMobile={true} />
            </div>
            <div className="p-4 border-t border-background flex gap-3 bg-white">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 border-2 border-background font-semibold tracking-wide uppercase active:scale-[0.98] transition-transform"
              >
                Clear
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-3 bg-secondary text-white font-semibold tracking-wide uppercase active:scale-[0.98] transition-transform"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Modal */}
      {showSortModal && (
        <div className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl overflow-hidden animate-slideUp">
            <div className="flex justify-between items-center p-4 border-b border-background">
              <h3 className="text-lg font-serif font-semibold uppercase tracking-wide">Sort By</h3>
              <button onClick={() => setShowSortModal(false)} className="p-2 active:scale-95">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortOption(option.value);
                    setShowSortModal(false);
                  }}
                  className={`w-full text-left px-5 py-4 transition-all duration-300 active:scale-[0.99] border-b border-background/30 last:border-b-0 ${
                    sortOption === option.value
                      ? 'bg-secondary text-white font-semibold'
                      : 'bg-white text-text hover:bg-background/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FilterPanel />
              </div>
            </div>

            {/* Products Grid/List */}
            <div className="flex-1 min-w-0">
              {isLoading && page === 1 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-background border-t-secondary rounded-full animate-spin mx-auto mb-4"></div>
                    <span className="text-text/60 font-medium">Loading products...</span>
                  </div>
                </div>
              ) : displayedProducts.length > 0 ? (
                <>
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' 
                    : 'space-y-4 sm:space-y-6'
                  }>
                    {displayedProducts.map((product) => (
                      viewMode === 'grid' ? (
                        <div key={product._id} className="group">
                          <ProductItem
                            name={product.name}
                            id={product._id}
                            price={product.price}
                            image={product.images}
                            currency={currency}
                          />
                        </div>
                      ) : (
                        <div
                          key={product._id}
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="flex gap-4 p-4 bg-white border border-background hover:shadow-lg transition-all duration-300 cursor-pointer group active:scale-[0.99]"
                        >
                          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden bg-gradient-to-br from-background/20 to-primary">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif font-semibold text-base sm:text-lg text-text mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="hidden sm:block text-sm text-text/60 font-light mb-3 line-clamp-2">
                                {product.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3">
                              <div className="text-xl sm:text-2xl font-serif font-bold text-secondary">
                                {currency}{product.price}
                              </div>
                              {product.bestseller && (
                                <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wide">
                                  Bestseller
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>

                  {/* Load More Trigger */}
                  {hasMore && (
                    <div ref={loadMoreRef} className="flex justify-center py-8">
                      <div className="w-10 h-10 border-4 border-background border-t-secondary rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* End of Results */}
                  {!hasMore && displayedProducts.length > 0 && (
                    <div className="text-center py-8 border-t border-background/30 mt-8">
                      <p className="text-text/60 font-medium text-sm">
                        You have reached the end of the collection
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-background shadow-sm">
                  <div className="w-20 h-20 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={40} className="text-secondary" />
                  </div>
                  <div className="text-center max-w-md px-4">
                    <h3 className="text-xl sm:text-2xl font-serif font-semibold mb-3">No Products Found</h3>
                    <p className="text-text/70 font-light leading-relaxed mb-6 text-sm sm:text-base">
                      Try adjusting your filters or browse our full collection
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={clearFilters}
                        className="px-6 py-3 bg-secondary text-white font-semibold hover:bg-[#8B6F47] transition-all active:scale-95 text-sm sm:text-base uppercase tracking-wide"
                      >
                        Clear Filters
                      </button>
                      <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 border-2 border-background bg-white text-text font-semibold hover:bg-background/20 transition-all active:scale-95 text-sm sm:text-base uppercase tracking-wide"
                      >
                        Browse All
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-secondary text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#8B6F47] transition-all duration-300 z-40 active:scale-95"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Recently Viewed */}
      {filteredProducts.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
          <div className="max-w-7xl mx-auto">
            <RecentlyViewed />
          </div>
        </section>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
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

export default ProductPage;