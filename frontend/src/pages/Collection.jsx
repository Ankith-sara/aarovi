import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import RecentlyViewed from '../components/RecentlyViewed';
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, ShoppingBag, Grid3x3, List, Check, Gift, DollarSign, Star, Heart, Sparkles, Tag, SlidersHorizontal, Package, Filter, ArrowUp
} from 'lucide-react';

const Collection = () => {
  const {
    products = [],
    search,
    showSearch,
    navigate,
    currency,
    addToWishlist,
    removeFromWishlist,
    wishlist = []
  } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 10000 });
  const [sortType, setSortType] = useState('relevant');
  const [giftingIdea, setGiftingIdea] = useState(false);
  const [budgetFriendly, setBudgetFriendly] = useState(false);
  const [rareItems, setRareItems] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    subCategory: true,
    price: true,
    features: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;
  const observerRef = useRef();
  const loadMoreRef = useRef();

  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];

  const calculatePriceStats = () => {
    let relevantProducts = [...products];
    
    if (category.length > 0) {
      relevantProducts = relevantProducts.filter(item => category.includes(item.category));
    }
    
    if (subCategory.length > 0) {
      relevantProducts = relevantProducts.filter(item => subCategory.includes(item.subCategory));
    }

    if (relevantProducts.length === 0) {
      return { min: 0, max: 10000, avg: 5000 };
    }

    return {
      min: Math.min(...relevantProducts.map(p => p.price)),
      max: Math.max(...relevantProducts.map(p => p.price)),
      avg: Math.round(relevantProducts.reduce((sum, p) => sum + p.price, 0) / relevantProducts.length)
    };
  };

  const priceStats = calculatePriceStats();

  // Initialize price range when categories change
  useEffect(() => {
    if (products.length > 0) {
      const stats = calculatePriceStats();
      setPriceRange({ min: stats.min, max: stats.max });
      setTempPriceRange({ min: stats.min, max: stats.max });
    }
  }, [category.length, subCategory.length, products.length]);

  const getFilteredSubCategories = () => {
    if (category.length === 0) {
      return [...new Set(products.map(product => product.subCategory).filter(Boolean))];
    } else {
      return [...new Set(
        products
          .filter(product => category.includes(product.category))
          .map(product => product.subCategory)
          .filter(Boolean)
      )];
    }
  };

  const filteredSubCategories = getFilteredSubCategories();

  const toggleCategory = (selectedCategory) => {
    let newCategories;
    if (category.includes(selectedCategory)) {
      newCategories = category.filter(item => item !== selectedCategory);
    } else {
      newCategories = [...category, selectedCategory];
    }
    setCategory(newCategories);

    if (newCategories.length > 0) {
      const validSubCategories = [...new Set(
        products
          .filter(product => newCategories.includes(product.category))
          .map(product => product.subCategory)
          .filter(Boolean)
      )];
      setSubCategory(prev => prev.filter(sub => validSubCategories.includes(sub)));
    }
  };

  const toggleSubCategory = (selectedSubCategory) => {
    if (subCategory.includes(selectedSubCategory)) {
      setSubCategory(prev => prev.filter(item => item !== selectedSubCategory));
    } else {
      setSubCategory(prev => [...prev, selectedSubCategory]);
    }
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    const stats = calculatePriceStats();
    setPriceRange({ min: stats.min, max: stats.max });
    setTempPriceRange({ min: stats.min, max: stats.max });
    setSortType('relevant');
    setGiftingIdea(false);
    setBudgetFriendly(false);
    setRareItems(false);
  };

  const applyFilters = () => {
    // Apply the temporary price range to the actual price range
    setPriceRange({ min: tempPriceRange.min, max: tempPriceRange.max });
    setShowFilter(false);
  };

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (category.length > 0) count++;
    if (subCategory.length > 0) count++;
    if (priceRange.min > priceStats.min || priceRange.max < priceStats.max) count++;
    if (sortType !== 'relevant') count++;
    if (giftingIdea) count++;
    if (budgetFriendly) count++;
    if (rareItems) count++;
    setActiveFiltersCount(count);
  }, [category, subCategory, priceRange, sortType, giftingIdea, budgetFriendly, rareItems, priceStats.min, priceStats.max]);

  // Apply filters and sorting
  useEffect(() => {
    setIsLoading(true);
    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }

    productsCopy = productsCopy.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    );

    if (giftingIdea) {
      productsCopy = productsCopy.filter(
        (item) => item.giftable === true || item.category === 'Gift Sets' || item.price <= 2000
      );
    }

    if (budgetFriendly) {
      productsCopy = productsCopy.filter((item) => item.price < 1000);
    }

    if (rareItems) {
      productsCopy = productsCopy.filter(
        (item) => item.rare === true || item.limited === true || item.stock < 5
      );
    }

    // Apply sorting
    switch (sortType) {
      case 'low-high':
        productsCopy.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        productsCopy.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        productsCopy.sort((a, b) => new Date(b.createdAt || b.dateAdded) - new Date(a.createdAt || a.dateAdded));
        break;
      case 'popular':
        productsCopy.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'rating':
        productsCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name-az':
        productsCopy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        productsCopy.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilterProducts(productsCopy);
    setPage(1);
    setDisplayedProducts(productsCopy.slice(0, ITEMS_PER_PAGE));
    setHasMore(productsCopy.length > ITEMS_PER_PAGE);
    setTimeout(() => setIsLoading(false), 300);
  }, [category, subCategory, search, showSearch, products, priceRange.min, priceRange.max, giftingIdea, budgetFriendly, rareItems, sortType]);

  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    const nextPage = page + 1;
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newProducts = filterProducts.slice(startIndex, endIndex);
    
    if (newProducts.length > 0) {
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setPage(nextPage);
      setHasMore(endIndex < filterProducts.length);
    } else {
      setHasMore(false);
    }
  }, [page, filterProducts, hasMore, isLoading]);

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

  useEffect(() => {
    document.title = 'Aarovi Collection | Aarovi';
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortOptions = [
    { value: 'relevant', label: 'Recommended' },
    { value: 'low-high', label: 'Price: Low to High' },
    { value: 'high-low', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
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
                    max={isMobile ? tempPriceRange.max : priceRange.max}
                    value={isMobile ? tempPriceRange.min : priceRange.min}
                    onChange={(e) => {
                      const newMin = Number(e.target.value);
                      if (isMobile) {
                        setTempPriceRange({ ...tempPriceRange, min: newMin });
                      } else {
                        setPriceRange({ ...priceRange, min: newMin });
                      }
                    }}
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
                    min={isMobile ? tempPriceRange.min : priceRange.min}
                    max={priceStats.max}
                    value={isMobile ? tempPriceRange.max : priceRange.max}
                    onChange={(e) => {
                      const newMax = Number(e.target.value);
                      if (isMobile) {
                        setTempPriceRange({ ...tempPriceRange, max: newMax });
                      } else {
                        setPriceRange({ ...priceRange, max: newMax });
                      }
                    }}
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
                    left: `${((isMobile ? tempPriceRange.min : priceRange.min) - priceStats.min) / (priceStats.max - priceStats.min) * 100}%`,
                    right: `${100 - ((isMobile ? tempPriceRange.max : priceRange.max) - priceStats.min) / (priceStats.max - priceStats.min) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Quick price filters */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Under 1K', min: priceStats.min, max: 1000 },
                { label: '1K - 3K', min: 1000, max: 3000 },
                { label: '3K - 5K', min: 3000, max: 5000 },
                { label: 'Above 5K', min: 5000, max: priceStats.max }
              ].map((range, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (isMobile) {
                      setTempPriceRange({ min: range.min, max: range.max });
                    } else {
                      setPriceRange({ min: range.min, max: range.max });
                    }
                  }}
                  className={`px-3 py-2 border-2 text-xs font-medium transition-all duration-300 active:scale-95 ${
                    (isMobile ? tempPriceRange.min : priceRange.min) === range.min && 
                    (isMobile ? tempPriceRange.max : priceRange.max) === range.max
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-background hover:border-secondary'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Categories */}
        <FilterSection
          title="Categories"
          isExpanded={expandedFilters.category}
          onToggle={() => toggleFilterSection('category')}
          icon={Package}
        >
          <div className="space-y-3">
            {categories.map((item) => (
              <label key={item} className="flex items-center cursor-pointer group active:scale-[0.99]">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={category.includes(item)}
                    onChange={() => toggleCategory(item)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 transition-all duration-300 ${category.includes(item)
                      ? 'bg-secondary border-secondary'
                      : 'border-background group-hover:border-secondary'
                    }`}>
                    {category.includes(item) && (
                      <Check size={14} className="text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium group-hover:text-secondary transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* SubCategories */}
        {filteredSubCategories.length > 0 && (
          <FilterSection
            title="Type"
            isExpanded={expandedFilters.subCategory}
            onToggle={() => toggleFilterSection('subCategory')}
            icon={Filter}
          >
            <div className="space-y-3">
              {filteredSubCategories.map((item) => (
                <label key={item} className="flex items-center cursor-pointer group active:scale-[0.99]">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={subCategory.includes(item)}
                      onChange={() => toggleSubCategory(item)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 transition-all duration-300 ${subCategory.includes(item)
                        ? 'bg-secondary border-secondary'
                        : 'border-background group-hover:border-secondary'
                      }`}>
                      {subCategory.includes(item) && (
                        <Check size={14} className="text-white absolute top-0.5 left-0.5" />
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm font-medium group-hover:text-secondary transition-colors">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

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
                  checked={giftingIdea}
                  onChange={(e) => setGiftingIdea(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 transition-all duration-300 ${giftingIdea
                    ? 'bg-secondary border-secondary'
                    : 'border-background group-hover:border-secondary'
                  }`}>
                  {giftingIdea && (
                    <Check size={14} className="text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm font-medium group-hover:text-secondary transition-colors">
                Gifting Ideas
              </span>
            </label>

            <label className="flex items-center cursor-pointer group active:scale-[0.99]">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={budgetFriendly}
                  onChange={(e) => setBudgetFriendly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 transition-all duration-300 ${budgetFriendly
                    ? 'bg-secondary border-secondary'
                    : 'border-background group-hover:border-secondary'
                  }`}>
                  {budgetFriendly && (
                    <Check size={14} className="text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm font-medium group-hover:text-secondary transition-colors">
                Budget Friendly (Under ₹1K)
              </span>
            </label>

            <label className="flex items-center cursor-pointer group active:scale-[0.99]">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rareItems}
                  onChange={(e) => setRareItems(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 transition-all duration-300 ${rareItems
                    ? 'bg-secondary border-secondary'
                    : 'border-background group-hover:border-secondary'
                  }`}>
                  {rareItems && (
                    <Check size={14} className="text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm font-medium group-hover:text-secondary transition-colors">
                Rare & Limited
              </span>
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
              AAROVI COLLECTION
            </h1>
            {filterProducts.length > 0 && (
              <p className="text-text/60 font-light text-base sm:text-lg">
                Discover {filterProducts.length} carefully curated piece{filterProducts.length !== 1 ? 's' : ''}
                {showSearch && search && ` matching "${search}"`}
              </p>
            )}
          </div>

          {/* Desktop Controls Bar */}
          <div className="hidden sm:flex justify-between items-center gap-4 p-5 bg-white border border-background shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-background overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-all duration-300 ${viewMode === 'grid' ? 'bg-secondary text-white' : 'bg-white text-text/60 hover:text-secondary'}`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-all duration-300 ${viewMode === 'list' ? 'bg-secondary text-white' : 'bg-white text-text/60 hover:text-secondary'}`}
                >
                  <List size={18} />
                </button>
              </div>
              <span className="text-sm text-text/50 font-medium">
                Showing {displayedProducts.length} of {filterProducts.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-text/60 tracking-wider uppercase">Sort:</span>
              <div className="relative">
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
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
            onClick={() => setShowFilter(true)}
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
          Showing {displayedProducts.length} of {filterProducts.length} items
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilter && (
        <div className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col">
          <div className="bg-white flex-1 flex flex-col overflow-hidden animate-slideUp">
            <div className="flex justify-between items-center p-4 border-b border-background bg-gradient-to-r from-background/20 to-primary">
              <h3 className="text-lg font-serif font-semibold uppercase tracking-wide">Filters</h3>
              <button onClick={() => setShowFilter(false)} className="p-2 hover:bg-background/20 rounded-full transition-colors active:scale-95">
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
                    setSortType(option.value);
                    setShowSortModal(false);
                  }}
                  className={`w-full text-left px-5 py-4 transition-all duration-300 active:scale-[0.99] border-b border-background/30 last:border-b-0 ${
                    sortType === option.value
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
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {displayedProducts.map((product) => {
                        if (!product.name || !product._id || !product.price || !product.images?.length) {
                          return null;
                        }
                        return (
                          <div key={product._id} className="group">
                            <ProductItem
                              name={product.name}
                              id={product._id}
                              price={product.price}
                              image={product.images}
                              currency={currency}
                              company={product.company}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {displayedProducts.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="flex gap-4 p-4 bg-white border border-background hover:shadow-lg transition-all duration-300 cursor-pointer group active:scale-[0.99]"
                        >
                          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-serif font-semibold text-base sm:text-lg text-text line-clamp-2 group-hover:text-secondary transition-colors flex-1">
                                  {product.name}
                                </h3>
                                {product.rating && (
                                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                    <Star size={14} className="text-yellow-400 fill-current" />
                                    <span className="text-xs sm:text-sm text-text/60">{product.rating}</span>
                                  </div>
                                )}
                              </div>

                              {product.description && (
                                <p className="hidden sm:block text-sm text-text/60 font-light mb-3 line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-background/30">
                              <div className="flex items-center gap-2">
                                <div className="text-xl sm:text-2xl font-serif font-bold text-secondary">
                                  {currency}{product.price}
                                </div>
                                {product.discount && (
                                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold">
                                    -{product.discount}%
                                  </span>
                                )}
                              </div>
                              {product.bestseller && (
                                <span className="hidden sm:inline px-2 py-1 bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wide">
                                  Bestseller
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

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
                      We couldn't find any products matching your current filters.
                      Try adjusting your search criteria or browse our full collection.
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
      {filterProducts.length > 0 && (
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

export default Collection;