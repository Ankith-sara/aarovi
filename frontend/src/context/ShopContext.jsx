import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 50;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // ============= STATE MANAGEMENT =============
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [wishlistItems, setWishlistItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [customizations, setCustomizations] = useState([]);
    const [activeCustomization, setActiveCustomization] = useState(null);
    const [customizationLoading, setCustomizationLoading] = useState(false);

    const navigate = useNavigate();

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // ============= CART FUNCTIONS =============
    const addToCart = useCallback(async (itemId, size, quantity = 1) => {
        if (!size) {
            toast.error('Please select a product size');
            return false;
        }

        try {
            let cartData = structuredClone(cartItems);

            if (cartData[itemId]) {
                cartData[itemId][size] = (cartData[itemId][size] || 0) + quantity;
            } else {
                cartData[itemId] = { [size]: quantity };
            }

            setCartItems(cartData);
            toast.success('Added to cart successfully');

            if (token) {
                await axios.post(`${backendUrl}/api/cart/add`, { itemId, size, quantity });
            }

            return true;
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error(error.response?.data?.message || 'Failed to add to cart');
            return false;
        }
    }, [cartItems, token, backendUrl]);

    const updateQuantity = useCallback(async (itemId, size, quantity) => {
        if (quantity < 0) return;

        try {
            let cartData = structuredClone(cartItems);

            if (quantity === 0) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            } else {
                cartData[itemId][size] = quantity;
            }

            setCartItems(cartData);

            if (token) {
                await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity });
            }
        } catch (error) {
            console.error('Update quantity error:', error);
            toast.error(error.response?.data?.message || 'Failed to update quantity');
        }
    }, [cartItems, token, backendUrl]);

    const removeFromCart = useCallback(async (itemId, size) => {
        try {
            let cartData = structuredClone(cartItems);

            if (cartData[itemId]) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }

            setCartItems(cartData);
            toast.success('Item removed from cart');

            if (token) {
                await axios.post(`${backendUrl}/api/cart/remove`, { itemId, size });
            }
        } catch (error) {
            console.error('Remove from cart error:', error);
            toast.error(error.response?.data?.message || 'Failed to remove item');
        }
    }, [cartItems, token, backendUrl]);

    const clearCart = useCallback(async () => {
        try {
            setCartItems({});

            if (token) {
                await axios.post(`${backendUrl}/api/cart/clear`);
            }

            toast.success('Cart cleared');
        } catch (error) {
            console.error('Clear cart error:', error);
            toast.error('Failed to clear cart');
        }
    }, [token, backendUrl]);

    const getCartCount = useCallback(() => {
        let totalCount = 0;

        for (const items in cartItems) {
            if (items === 'customizations') {
                for (const customId in cartItems.customizations) {
                    try {
                        const customItem = cartItems.customizations[customId];
                        if (customItem && customItem.quantity > 0) {
                            totalCount += customItem.quantity;
                        }
                    } catch (error) {
                        console.error('Customization count error:', error);
                    }
                }
            } else {
                for (const item in cartItems[items]) {
                    try {
                        if (cartItems[items][item] > 0) {
                            totalCount += cartItems[items][item];
                        }
                    } catch (error) {
                        console.error('Cart count error:', error);
                    }
                }
            }
        }
        return totalCount;
    }, [cartItems]);

    const getCartAmount = useCallback(() => {
        if (products.length === 0) return 0;

        let totalAmount = 0;

        // Calculate regular products
        for (const items in cartItems) {
            if (items === 'customizations') continue;

            let itemInfo = products.find((product) => product._id === items);

            if (itemInfo) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }
            }
        }

        // Add customizations amount
        if (cartItems.customizations) {
            for (const customId in cartItems.customizations) {
                try {
                    const custom = cartItems.customizations[customId];
                    if (custom && custom.price && custom.quantity) {
                        totalAmount += custom.price * custom.quantity;
                    }
                } catch (error) {
                    console.error('Customization amount error:', error);
                }
            }
        }

        return totalAmount;
    }, [cartItems, products]);

    const getCartItems = useCallback(() => {
        const items = [];

        // Get regular products
        for (const itemId in cartItems) {
            if (itemId === 'customizations') continue;

            const product = products.find(p => p._id === itemId);
            if (product) {
                for (const size in cartItems[itemId]) {
                    if (cartItems[itemId][size] > 0) {
                        items.push({
                            ...product,
                            size,
                            quantity: cartItems[itemId][size],
                            type: 'product'
                        });
                    }
                }
            }
        }

        // Get customizations
        if (cartItems.customizations) {
            for (const customId in cartItems.customizations) {
                const custom = cartItems.customizations[customId];
                if (custom && custom.quantity > 0) {
                    items.push({
                        _id: customId,
                        ...custom.snapshot,
                        quantity: custom.quantity,
                        price: custom.price,
                        type: 'customization'
                    });
                }
            }
        }

        return items;
    }, [cartItems, products]);

    const getUserCart = useCallback(async (userToken) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/get`,
                {},
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error('Get user cart error:', error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again");
                localStorage.removeItem('token');
                setToken('');
            }
        }
    }, [backendUrl]);

    // ============= WISHLIST FUNCTIONS =============
    const addToWishlist = useCallback(async (itemId) => {
        if (!token) {
            toast.error('Please login to add items to wishlist');
            navigate('/login');
            return false;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/wishlist/add`,
                { itemId }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
                toast.success('Added to wishlist');
                return true;
            }
        } catch (error) {
            console.error('Add to wishlist error:', error);
            if (error.response?.data?.message === "Item already in wishlist") {
                toast.info('Item already in wishlist');
            } else {
                toast.error(error.response?.data?.message || 'Failed to add to wishlist');
            }
            return false;
        }
    }, [token, backendUrl, navigate]);

    const removeFromWishlist = useCallback(async (itemId) => {
        if (!token) {
            toast.error('Please login to manage wishlist');
            return false;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/wishlist/remove`,
                { itemId }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
                toast.success('Removed from wishlist');
                return true;
            }
        } catch (error) {
            console.error('Remove from wishlist error:', error);
            toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
            return false;
        }
    }, [token, backendUrl]);

    const toggleWishlist = useCallback(async (itemId) => {
        if (!token) {
            toast.error('Please login to manage wishlist');
            navigate('/login');
            return false;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/wishlist/toggle`,
                { itemId }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
                toast.success(response.data.message);
                return response.data.isAdded;
            }
        } catch (error) {
            console.error('Toggle wishlist error:', error);
            toast.error(error.response?.data?.message || 'Failed to update wishlist');
            return false;
        }
    }, [token, backendUrl, navigate]);

    const isInWishlist = useCallback((itemId) => {
        return wishlistItems.includes(itemId);
    }, [wishlistItems]);

    const getWishlistCount = useCallback(() => {
        return wishlistItems.length;
    }, [wishlistItems]);

    const getWishlistProducts = useCallback(() => {
        return products.filter(product => wishlistItems.includes(product._id));
    }, [products, wishlistItems]);

    const getUserWishlist = useCallback(async (userToken) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/wishlist/get`,
                {},
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
            }
        } catch (error) {
            console.error('Get user wishlist error:', error);
        }
    }, [backendUrl]);

    // ============= PRODUCT FUNCTIONS =============
    const getProductsData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${backendUrl}/api/product/all`);

            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error('Failed to load products');
            }
        } catch (error) {
            console.error('Get products error:', error);
            toast.error(error.response?.data?.message || 'Failed to load products');
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl]);

    const getProductById = useCallback((productId) => {
        return products.find(product => product._id === productId);
    }, [products]);

    const searchProducts = useCallback((query) => {
        if (!query.trim()) return products;

        const lowercaseQuery = query.toLowerCase();
        return products.filter(product =>
            product.name?.toLowerCase().includes(lowercaseQuery) ||
            product.category?.toLowerCase().includes(lowercaseQuery) ||
            product.subCategory?.toLowerCase().includes(lowercaseQuery) ||
            product.description?.toLowerCase().includes(lowercaseQuery)
        );
    }, [products]);

    const filterProducts = useCallback((filters) => {
        let filtered = [...products];

        if (filters.category && filters.category.length > 0) {
            filtered = filtered.filter(product =>
                filters.category.includes(product.category)
            );
        }

        if (filters.subCategory && filters.subCategory.length > 0) {
            filtered = filtered.filter(product =>
                filters.subCategory.includes(product.subCategory)
            );
        }

        if (filters.priceRange) {
            filtered = filtered.filter(product =>
                product.price >= filters.priceRange.min &&
                product.price <= filters.priceRange.max
            );
        }

        if (filters.inStock) {
            filtered = filtered.filter(product => product.inStock);
        }

        return filtered;
    }, [products]);

    // ============= CUSTOMIZATION FUNCTIONS =============
    const getUserCustomizations = useCallback(async (userToken) => {
        try {
            setCustomizationLoading(true);

            // Send as POST with userId in body to match your auth pattern
            const res = await axios.post(
                `${backendUrl}/api/customization/my`, {}, { headers: { Authorization: `Bearer ${userToken}` } }
            );

            if (res.data.success) {
                setCustomizations(res.data.customizations);
            }
        } catch (err) {
            console.error('Get customizations error:', err);

            if (err.response?.status !== 401) {
                toast.error('Failed to load customizations');
            }
        } finally {
            setCustomizationLoading(false);
        }
    }, [backendUrl]);

    const saveCustomization = useCallback(async (data) => {
        if (!token) {
            toast.error("Please login to save customization");
            navigate("/login");
            return null;
        }

        try {
            setCustomizationLoading(true);

            // FIXED: Removed userId from body, it comes from auth middleware
            const res = await axios.post(
                `${backendUrl}/api/customization/save`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                const savedCustomization = res.data.customization;
                setActiveCustomization(savedCustomization);

                // Update customizations array
                setCustomizations(prev => {
                    const index = prev.findIndex(c => c._id === savedCustomization._id);
                    if (index >= 0) {
                        const updated = [...prev];
                        updated[index] = savedCustomization;
                        return updated;
                    }
                    return [savedCustomization, ...prev];
                });

                toast.success("Customization saved successfully");
                return savedCustomization;
            }
        } catch (err) {
            console.error('Save customization error:', err);
            toast.error(err.response?.data?.message || "Failed to save customization");
            return null;
        } finally {
            setCustomizationLoading(false);
        }
    }, [token, backendUrl, navigate]);

    const updateCustomization = useCallback(async (customizationId, data) => {
        if (!token) {
            toast.error("Please login to update customization");
            return null;
        }

        try {
            setCustomizationLoading(true);

            // FIXED: userId removed from body
            const res = await axios.put(
                `${backendUrl}/api/customization/update/${customizationId}`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                const updatedCustomization = res.data.customization;

                // Update in array
                setCustomizations(prev =>
                    prev.map(c => c._id === customizationId ? updatedCustomization : c)
                );

                toast.success("Customization updated");
                return updatedCustomization;
            }
        } catch (err) {
            console.error('Update customization error:', err);
            toast.error(err.response?.data?.message || "Failed to update customization");
            return null;
        } finally {
            setCustomizationLoading(false);
        }
    }, [token, backendUrl]);

    const submitCustomization = useCallback(async (customizationId) => {
        if (!token) {
            toast.error("Please login to submit customization");
            return false;
        }

        try {
            setCustomizationLoading(true);

            const res = await axios.post(
                `${backendUrl}/api/customization/submit`,
                { customizationId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setCustomizations(prev =>
                    prev.map(c =>
                        c._id === customizationId
                            ? { ...c, status: 'Submitted' }
                            : c
                    )
                );

                toast.success("Customization submitted successfully");
                return true;
            }
            return false;
        } catch (err) {
            console.error('Submit customization error:', err);
            toast.error(err.response?.data?.message || "Submission failed");
            return false;
        } finally {
            setCustomizationLoading(false);
        }
    }, [token, backendUrl]);

const getCustomizationById = useCallback(async (customizationId) => {
        if (!token) {
            return null;
        }

        try {
            // FIXED: Use GET method instead of POST
            const res = await axios.get(
                `${backendUrl}/api/customization/${customizationId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                return res.data.customization;
            }
            return null;
        } catch (err) {
            console.error('Get customization error:', err);
            toast.error(err.response?.data?.message || "Failed to fetch customization");
            return null;
        }
    }, [backendUrl, token]);

    const deleteCustomization = useCallback(async (customizationId) => {
        if (!token) {
            toast.error("Please login to delete customization");
            return false;
        }

        try {
            // FIXED: Use DELETE method
            const res = await axios.delete(
                `${backendUrl}/api/customization/${customizationId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setCustomizations(prev => prev.filter(c => c._id !== customizationId));
                toast.success("Customization deleted");
                return true;
            }
            return false;
        } catch (err) {
            console.error('Delete customization error:', err);
            toast.error(err.response?.data?.message || "Failed to delete");
            return false;
        }
    }, [token, backendUrl]);

    // ============= CUSTOMIZATION CART FUNCTIONS =============
    const addCustomizationToCart = useCallback(async (customization) => {
        if (!customization || !customization._id) {
            toast.error("Invalid customization");
            return false;
        }

        try {
            let updatedCart = structuredClone(cartItems);

            if (!updatedCart.customizations) {
                updatedCart.customizations = {};
            }

            // Check if already in cart
            if (updatedCart.customizations[customization._id]) {
                updatedCart.customizations[customization._id].quantity += 1;
            } else {
                updatedCart.customizations[customization._id] = {
                    price: customization.estimatedPrice || customization.price || 0,
                    quantity: 1,
                    snapshot: {
                        gender: customization.gender,
                        dressType: customization.dressType,
                        fabric: customization.fabric,
                        color: customization.color,
                        designNotes: customization.designNotes,
                        status: customization.status
                    }
                };
            }

            setCartItems(updatedCart);
            toast.success("Customization added to cart");

            if (token) {
                await axios.post(`${backendUrl}/api/cart/add-custom`, {
                    customizationId: customization._id
                });
            }

            return true;
        } catch (err) {
            console.error('Add customization to cart error:', err);
            toast.error(err.response?.data?.message || "Failed to add customization");
            return false;
        }
    }, [cartItems, token, backendUrl]);

    const updateCustomizationQuantity = useCallback(async (customizationId, quantity) => {
        if (quantity < 0) return;

        try {
            let updatedCart = structuredClone(cartItems);

            if (!updatedCart.customizations || !updatedCart.customizations[customizationId]) {
                return;
            }

            if (quantity === 0) {
                delete updatedCart.customizations[customizationId];
                if (Object.keys(updatedCart.customizations).length === 0) {
                    delete updatedCart.customizations;
                }
                toast.success("Customization removed from cart");
            } else {
                updatedCart.customizations[customizationId].quantity = quantity;
            }

            setCartItems(updatedCart);

            if (token) {
                await axios.post(`${backendUrl}/api/cart/update-custom`, {
                    customizationId,
                    quantity
                });
            }
        } catch (err) {
            console.error('Update customization quantity error:', err);
            toast.error("Failed to update quantity");
        }
    }, [cartItems, token, backendUrl]);

    const removeCustomizationFromCart = useCallback(async (customizationId) => {
        try {
            let updatedCart = structuredClone(cartItems);

            if (updatedCart.customizations && updatedCart.customizations[customizationId]) {
                delete updatedCart.customizations[customizationId];

                if (Object.keys(updatedCart.customizations).length === 0) {
                    delete updatedCart.customizations;
                }
            }

            setCartItems(updatedCart);
            toast.success("Customization removed from cart");

            if (token) {
                await axios.post(`${backendUrl}/api/cart/remove-custom`, {
                    customizationId
                });
            }
        } catch (err) {
            console.error('Remove customization from cart error:', err);
            toast.error("Failed to remove customization");
        }
    }, [cartItems, token, backendUrl]);

    // ============= RECENTLY VIEWED =============
    const addProductToRecentlyViewed = useCallback((product) => {
        try {
            let viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

            viewedProducts = viewedProducts.filter(p => p._id !== product._id);

            viewedProducts.unshift({
                _id: product._id,
                name: product.name,
                price: product.price,
                images: product.images,
                category: product.category,
                subCategory: product.subCategory,
                viewedAt: new Date().toISOString()
            });

            viewedProducts = viewedProducts.slice(0, 5);
            localStorage.setItem('recentlyViewed', JSON.stringify(viewedProducts));
        } catch (error) {
            console.error('Add to recently viewed error:', error);
        }
    }, []);

    const getRecentlyViewed = useCallback((allProducts = []) => {
        try {
            let viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

            if (allProducts.length > 0) {
                viewedProducts = viewedProducts
                    .map(vp => {
                        const updated = allProducts.find(p => p._id === vp._id);
                        return updated ? {
                            _id: updated._id,
                            name: updated.name,
                            price: updated.price,
                            images: updated.images,
                            category: updated.category,
                            subCategory: updated.subCategory,
                            viewedAt: vp.viewedAt
                        } : vp;
                    })
                    .filter(vp => allProducts.some(p => p._id === vp._id));

                localStorage.setItem('recentlyViewed', JSON.stringify(viewedProducts));
            }

            return viewedProducts;
        } catch (error) {
            console.error('Get recently viewed error:', error);
            return [];
        }
    }, []);

    const clearRecentlyViewed = useCallback(() => {
        try {
            localStorage.removeItem('recentlyViewed');
            toast.success('Recently viewed cleared');
        } catch (error) {
            console.error('Clear recently viewed error:', error);
        }
    }, []);

    // ============= AUTH & USER FUNCTIONS =============
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken('');
        setCartItems({});
        setWishlistItems([]);
        setUserProfile(null);
        setCustomizations([]);
        setActiveCustomization(null);
        toast.success('Logged out successfully');
        navigate('/login');
    }, [navigate]);

    const getUserProfile = useCallback(async (userToken) => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/user/profile`,
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            if (response.data.success) {
                setUserProfile(response.data.user);
            }
        } catch (error) {
            console.error('Get user profile error:', error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again");
                localStorage.removeItem('token');
                setToken('');
            }
        }
    }, [backendUrl]);

    // ============= CATEGORY MANAGEMENT =============
    const setCategory = useCallback((category) => {
        setSelectedSubCategory(category);
        localStorage.setItem("selectedSubCategory", category);
    }, []);

    // ============= INITIALIZATION =============
    useEffect(() => {
        const storedSubCategory = localStorage.getItem("selectedSubCategory");
        if (storedSubCategory) {
            setSelectedSubCategory(storedSubCategory);
        }
    }, []);

    useEffect(() => {
        getProductsData();
    }, [getProductsData]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!token && storedToken) {
            setToken(storedToken);
            getUserCart(storedToken);
            getUserWishlist(storedToken);
            getUserProfile(storedToken);
            getUserCustomizations(storedToken);
        }
    }, [token, getUserCart, getUserWishlist, getUserProfile, getUserCustomizations]);

    useEffect(() => {
        if (token) {
            getUserWishlist(token);
            getUserProfile(token);
            getUserCustomizations(token);
        } else {
            setWishlistItems([]);
            setUserProfile(null);
            setCustomizations([]);
            setActiveCustomization(null);
        }
    }, [token, getUserWishlist, getUserProfile, getUserCustomizations]);

    // ============= MEMOIZED CONTEXT VALUE =============
    const contextValue = useMemo(() => ({
        // State 
        products,
        currency,
        delivery_fee,
        search,
        showSearch,
        cartItems,
        wishlistItems,
        token,
        selectedSubCategory,
        isLoading,
        userProfile,
        customizations,
        activeCustomization,
        customizationLoading,

        // Setters
        setSearch,
        setShowSearch,
        setCartItems,
        setToken,
        setSelectedSubCategory: setCategory,

        // Cart functions
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartCount,
        getCartAmount,
        getCartItems,

        // Wishlist functions
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        getWishlistCount,
        getWishlistProducts,

        // Product functions
        getProductById,
        searchProducts,
        filterProducts,

        // Customization CRUD
        saveCustomization,
        updateCustomization,
        submitCustomization,
        getCustomizationById,
        deleteCustomization,

        // Customization Cart
        addCustomizationToCart,
        updateCustomizationQuantity,
        removeCustomizationFromCart,

        // Recently viewed
        addProductToRecentlyViewed,
        getRecentlyViewed,
        clearRecentlyViewed,

        // Auth & Navigation
        logout,
        navigate,
        backendUrl
    }), [
        products, currency, delivery_fee, search, showSearch, cartItems,
        wishlistItems, token, selectedSubCategory, isLoading, userProfile,
        customizations, activeCustomization, customizationLoading,
        addToCart, updateQuantity, removeFromCart, clearCart, getCartCount,
        getCartAmount, getCartItems, addToWishlist, removeFromWishlist,
        toggleWishlist, isInWishlist, getWishlistCount, getWishlistProducts,
        getProductById, searchProducts, filterProducts,
        saveCustomization, updateCustomization, submitCustomization,
        getCustomizationById, deleteCustomization,
        addCustomizationToCart, updateCustomizationQuantity,
        removeCustomizationFromCart,
        addProductToRecentlyViewed, getRecentlyViewed, clearRecentlyViewed,
        logout, navigate, backendUrl, setCategory
    ]);

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;