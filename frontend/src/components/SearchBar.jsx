import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, X, Clock, Sparkles, TrendingUp } from 'lucide-react';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch, products } = useContext(ShopContext) || {};
    const [visible, setVisible] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchInputRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location]);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Generate suggestions based on search input
    useEffect(() => {
        if (search && search.length > 1 && products) {
            const filtered = products
                .filter(product =>
                    product.name.toLowerCase().includes(search.toLowerCase()) ||
                    product.category.toLowerCase().includes(search.toLowerCase()) ||
                    product.subCategory?.toLowerCase().includes(search.toLowerCase())
                )
                .slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [search, products]);

    const handleSearch = (value) => {
        setSearch?.(value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (search.trim()) {
            // Save to recent searches
            const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (product) => {
        setSearch?.(product.name);
        setShowSuggestions(false);
        navigate(`/product/${product._id}`);
    };

    const handleRecentSearchClick = (searchTerm) => {
        setSearch?.(searchTerm);
        searchInputRef.current?.focus();
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const handleClose = () => {
        setShowSearch?.(false);
        setSearch?.('');
        setShowSuggestions(false);
    };

    if (!showSearch || !visible) return null;

    return (
        <div className="mt-20 mb-[-75px] border-b border-background/30 bg-white sticky top-0 z-40 shadow-lg">
            <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-6">
                <form onSubmit={handleSearchSubmit} className="relative">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-secondary" size={22} />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    className="w-full pl-14 pr-5 py-4 border-2 border-background/50 rounded-2xl text-text placeholder-text/40 focus:outline-none focus:border-secondary transition-all duration-300 text-base font-light shadow-sm hover:shadow-md focus:shadow-lg"
                                    value={search || ''}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder="Search for products, categories, styles..."
                                    aria-label="Search"
                                />
                            </div>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-background/50 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50">
                                    {!search && recentSearches.length > 0 && (
                                        <div className="p-5 border-b border-background/30">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={18} className="text-secondary" />
                                                    <h3 className="text-sm font-bold text-text uppercase tracking-wider">Recent Searches</h3>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={clearRecentSearches}
                                                    className="text-xs text-text/60 hover:text-secondary uppercase tracking-wide font-semibold transition-colors"
                                                >
                                                    Clear All
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {recentSearches.map((term, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => handleRecentSearchClick(term)}
                                                        className="w-full text-left px-4 py-3 hover:bg-secondary/5 rounded-xl border-2 border-transparent hover:border-secondary/20 transition-all duration-300 group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Clock size={16} className="text-text/40 group-hover:text-secondary transition-colors" />
                                                            <span className="text-text font-light group-hover:font-medium transition-all">{term}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Suggestions */}
                                    {search && suggestions.length > 0 && (
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-4">
                                                <TrendingUp size={18} className="text-secondary" />
                                                <h3 className="text-sm font-bold text-text uppercase tracking-wider">Suggested Products</h3>
                                            </div>
                                            <div className="space-y-2">
                                                {suggestions.map((product) => (
                                                    <button
                                                        key={product._id}
                                                        type="button"
                                                        onClick={() => handleSuggestionClick(product)}
                                                        className="w-full text-left p-4 hover:bg-secondary/5 rounded-xl border-2 border-transparent hover:border-secondary/20 transition-all duration-300 group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-background/30 group-hover:border-secondary/30 transition-colors shadow-sm flex-shrink-0">
                                                                <img
                                                                    src={product.images?.[0]}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-text truncate mb-1 group-hover:text-secondary transition-colors">
                                                                    {product.name}
                                                                </p>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className="text-xs px-2 py-1 bg-background/30 text-text/70 rounded-lg font-medium uppercase tracking-wide">
                                                                        {product.category}
                                                                    </span>
                                                                    <span className="text-sm font-bold text-secondary">₹{product.price}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* No Results */}
                                    {search && suggestions.length === 0 && (
                                        <div className="p-12 text-center">
                                            <div className="w-16 h-16 bg-background/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search className="text-text/40" size={32} />
                                            </div>
                                            <p className="text-base text-text font-semibold mb-2">No products found</p>
                                            <p className="text-sm text-text/60 font-light">No results for "<span className="font-medium">{search}</span>"</p>
                                            <p className="text-xs text-text/50 mt-3 font-light">Try different keywords or browse our collections</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-4 border-2 border-background/50 rounded-2xl hover:border-secondary hover:bg-secondary/5 transition-all duration-300 group shadow-sm hover:shadow-md"
                            aria-label="Close search"
                        >
                            <X size={22} className="text-text/60 group-hover:text-secondary transition-colors" />
                        </button>
                    </div>
                </form>
            </div>

            {showSuggestions && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowSuggestions(false)}
                />
            )}
        </div>
    );
};

export default SearchBar;