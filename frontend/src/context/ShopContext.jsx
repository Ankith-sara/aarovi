import { createContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 50;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
    const initializedRef = useRef('');

    const navigate = useNavigate();

    // ── Axios auth header ──────────────────────────────────────────────────
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // ============= HELPER FUNCTIONS =============
    const handleAuthError = useCallback((error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            setToken('');
            setCartItems({});
            setWishlistItems([]);
            setUserProfile(null);
            setCustomizations([]);
            setActiveCustomization(null);
            navigate('/login');
            return true;
        }
        return false;
    }, [navigate]);

    // ============= CART HELPER =============
    // Cart entries for regular products are stored as objects:
    // cartItems[itemId][size] = { quantity, neckStyle, sleeveStyle }
    // This helper safely reads the quantity from either the old number format or new object format.
    const getEntryQuantity = (entry) => {
        if (entry === null || entry === undefined) return 0;
        if (typeof entry === 'object') return entry.quantity || 0;
        return entry; // legacy number
    };

    // ============= CART FUNCTIONS =============
    const addToCart = useCallback(async (itemId, size, quantity = 1, options = {}) => {
        if (!size) { toast.error('Please select a size'); return false; }

        const { neckStyle = null, sleeveStyle = null } = options;

        try {
            const cartData = structuredClone(cartItems);
            if (!cartData[itemId]) cartData[itemId] = {};

            const existing = cartData[itemId][size];
            const existingQty = getEntryQuantity(existing);

            // Always store as object so style options are preserved
            cartData[itemId][size] = {
                quantity: existingQty + quantity,
                neckStyle: neckStyle,
                sleeveStyle: sleeveStyle,
            };

            setCartItems(cartData);
            toast.success('Added to cart');

            if (token) {
                await axios.post(`${backendUrl}/api/cart/add`, {
                    itemId,
                    size,
                    quantity,
                    neckStyle,
                    sleeveStyle,
                });
            }
            return true;
        } catch (error) {
            if (!handleAuthError(error)) toast.error(error.response?.data?.message || 'Unable to add item');
            return false;
        }
    }, [cartItems, token, backendUrl, handleAuthError]);

    const updateQuantity = useCallback(async (itemId, size, quantity) => {
        if (quantity < 0) return;
        try {
            const cartData = structuredClone(cartItems);
            if (quantity === 0) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
            } else {
                const existing = cartData[itemId]?.[size];
                if (typeof existing === 'object' && existing !== null) {
                    // Preserve style options, just update quantity
                    cartData[itemId][size] = { ...existing, quantity };
                } else {
                    // Legacy number format — upgrade to object
                    cartData[itemId][size] = { quantity, neckStyle: null, sleeveStyle: null };
                }
            }
            setCartItems(cartData);
            if (token) await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity });
        } catch (error) {
            if (!handleAuthError(error)) toast.error('Unable to update quantity');
        }
    }, [cartItems, token, backendUrl, handleAuthError]);

    const removeFromCart = useCallback(async (itemId, size) => {
        try {
            const cartData = structuredClone(cartItems);
            if (cartData[itemId]) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
            }
            setCartItems(cartData);
            toast.success('Item removed');
            if (token) await axios.post(`${backendUrl}/api/cart/remove`, { itemId, size });
        } catch (error) {
            if (!handleAuthError(error)) toast.error('Unable to remove item');
        }
    }, [cartItems, token, backendUrl, handleAuthError]);

    const clearCart = useCallback(async () => {
        try {
            setCartItems({});
            if (token) await axios.post(`${backendUrl}/api/cart/clear`);
            toast.success('Cart cleared');
        } catch (error) { handleAuthError(error); }
    }, [token, backendUrl, handleAuthError]);

    const getCartCount = useCallback(() => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            if (itemId === 'customizations') {
                for (const customId in cartItems.customizations) {
                    if (cartItems.customizations[customId]?.quantity > 0)
                        totalCount += cartItems.customizations[customId].quantity;
                }
            } else {
                for (const size in cartItems[itemId]) {
                    totalCount += getEntryQuantity(cartItems[itemId][size]);
                }
            }
        }
        return totalCount;
    }, [cartItems]);

    const getCartAmount = useCallback(() => {
        if (products.length === 0) return 0;
        let totalAmount = 0;
        for (const itemId in cartItems) {
            if (itemId === 'customizations') continue;
            const itemInfo = products.find((product) => product._id === itemId);
            if (itemInfo) {
                for (const size in cartItems[itemId]) {
                    const qty = getEntryQuantity(cartItems[itemId][size]);
                    if (qty > 0) totalAmount += itemInfo.price * qty;
                }
            }
        }
        if (cartItems.customizations) {
            for (const customId in cartItems.customizations) {
                const custom = cartItems.customizations[customId];
                if (custom?.price && custom?.quantity) totalAmount += custom.price * custom.quantity;
            }
        }
        return totalAmount;
    }, [cartItems, products]);

    const getCartItems = useCallback(() => {
        const items = [];
        for (const itemId in cartItems) {
            if (itemId === 'customizations') continue;
            const product = products.find(p => p._id === itemId);
            if (product) {
                for (const size in cartItems[itemId]) {
                    const entry = cartItems[itemId][size];
                    const quantity = getEntryQuantity(entry);
                    if (quantity > 0) {
                        items.push({
                            ...product,
                            size,
                            quantity,
                            neckStyle: typeof entry === 'object' ? entry.neckStyle : null,
                            sleeveStyle: typeof entry === 'object' ? entry.sleeveStyle : null,
                            type: 'product',
                        });
                    }
                }
            }
        }
        if (cartItems.customizations) {
            for (const customId in cartItems.customizations) {
                const custom = cartItems.customizations[customId];
                if (custom?.quantity > 0) {
                    const snapshot = custom.snapshot || {};
                    items.push({
                        _id: customId, type: 'customization',
                        name: `Custom ${snapshot.gender || ''} ${snapshot.dressType || 'Design'}`.trim(),
                        quantity: custom.quantity, price: custom.price,
                        gender: snapshot.gender || '', dressType: snapshot.dressType || '',
                        fabric: snapshot.fabric || '', color: snapshot.color || '',
                        designNotes: snapshot.designNotes || '', measurements: snapshot.measurements || {},
                        canvasDesign: snapshot.canvasDesign || {}, referenceImages: snapshot.referenceImages || [],
                        aiPrompt: snapshot.aiPrompt || '', neckStyle: snapshot.neckStyle || '',
                        sleeveStyle: snapshot.sleeveStyle || '',
                        image: snapshot.canvasDesign?.png || '',
                        images: [snapshot.canvasDesign?.png || ''].filter(Boolean)
                    });
                }
            }
        }
        return items;
    }, [cartItems, products]);

    const getUserCart = useCallback(async (userToken) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/get`, {},
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            if (response.data.success) setCartItems(response.data.cartData);
        } catch (error) { handleAuthError(error); }
    }, [backendUrl, handleAuthError]);

    // ============= WISHLIST FUNCTIONS =============
    const addToWishlist = useCallback(async (itemId) => {
        if (!token) {
            setWishlistItems(prev => prev.includes(itemId) ? prev : [...prev, itemId]);
            toast.success('Added to wishlist');
            return true;
        }
        try {
            const response = await axios.post(`${backendUrl}/api/wishlist/add`, { itemId });
            if (response.data.success) { setWishlistItems(response.data.wishlist); toast.success('Added to wishlist'); return true; }
        } catch (error) {
            if (!handleAuthError(error)) {
                if (error.response?.data?.message === "Item already in wishlist") toast.info('Already in wishlist');
                else { setWishlistItems(prev => prev.includes(itemId) ? prev : [...prev, itemId]); toast.success('Added to wishlist'); }
            }
            return false;
        }
    }, [token, backendUrl, handleAuthError]);

    const removeFromWishlist = useCallback(async (itemId) => {
        if (!token) {
            setWishlistItems(prev => prev.filter(id => id !== itemId));
            toast.info('Removed from wishlist');
            return true;
        }
        try {
            const response = await axios.post(`${backendUrl}/api/wishlist/remove`, { itemId });
            if (response.data.success) { setWishlistItems(response.data.wishlist); toast.info('Removed from wishlist'); return true; }
        } catch (error) {
            if (!handleAuthError(error)) { setWishlistItems(prev => prev.filter(id => id !== itemId)); toast.info('Removed from wishlist'); }
            return false;
        }
    }, [token, backendUrl, handleAuthError]);

    const toggleWishlist = useCallback(async (itemId) => {
        const alreadyIn = wishlistItems.includes(itemId);
        if (!token) {
            if (alreadyIn) { setWishlistItems(prev => prev.filter(id => id !== itemId)); toast.info('Removed from wishlist'); return false; }
            else { setWishlistItems(prev => [...prev, itemId]); toast.success('Added to wishlist'); return true; }
        }
        try {
            const response = await axios.post(`${backendUrl}/api/wishlist/toggle`, { itemId });
            if (response.data.success) { setWishlistItems(response.data.wishlist); toast.success(response.data.message); return response.data.isAdded; }
        } catch (error) {
            if (!handleAuthError(error)) {
                if (alreadyIn) { setWishlistItems(prev => prev.filter(id => id !== itemId)); toast.info('Removed from wishlist'); return false; }
                else { setWishlistItems(prev => [...prev, itemId]); toast.success('Added to wishlist'); return true; }
            }
            return false;
        }
    }, [token, backendUrl, handleAuthError, wishlistItems]);

    const isInWishlist = useCallback((itemId) => wishlistItems.includes(itemId), [wishlistItems]);
    const getWishlistCount = useCallback(() => wishlistItems.length, [wishlistItems]);
    const getWishlistProducts = useCallback(() => products.filter(product => wishlistItems.includes(product._id)), [products, wishlistItems]);

    const getUserWishlist = useCallback(async (userToken) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/wishlist/get`, {},
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            if (response.data.success) setWishlistItems(response.data.wishlist);
        } catch (error) { handleAuthError(error); }
    }, [backendUrl, handleAuthError]);

    // ============= PRODUCT FUNCTIONS =============
    const getProductsData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${backendUrl}/api/product/all`);
            if (response.data.success) setProducts(response.data.products);
        } catch (error) { }
        finally { setIsLoading(false); }
    }, [backendUrl]);

    const getProductById = useCallback((productId) => products.find(product => product._id === productId), [products]);

    const searchProducts = useCallback((query) => {
        if (!query?.trim()) return products;
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
        if (filters.category?.length > 0) filtered = filtered.filter(p => filters.category.includes(p.category));
        if (filters.subCategory?.length > 0) filtered = filtered.filter(p => filters.subCategory.includes(p.subCategory));
        if (filters.priceRange) filtered = filtered.filter(p => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max);
        if (filters.inStock) filtered = filtered.filter(p => p.inStock);
        return filtered;
    }, [products]);

    // ============= CUSTOMIZATION FUNCTIONS =============
    const getUserCustomizations = useCallback(async (userToken, profileId) => {
        if (!profileId) return;
        try {
            setCustomizationLoading(true);
            const res = await axios.post(
                `${backendUrl}/api/customization/my`,
                { userId: profileId },
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            if (res.data.success) setCustomizations(res.data.customizations);
        } catch (err) { handleAuthError(err); }
        finally { setCustomizationLoading(false); }
    }, [backendUrl, handleAuthError]);

    const submitCustomization = useCallback(async (customizationId) => {
        if (!token) { toast.error("Please login to continue"); return false; }
        try {
            setCustomizationLoading(true);
            const res = await axios.post(`${backendUrl}/api/customization/submit`, { customizationId }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                setCustomizations(prev => prev.map(c => c._id === customizationId ? { ...c, status: 'Submitted' } : c));
                toast.success("Customization submitted successfully");
                return true;
            }
            return false;
        } catch (err) { if (!handleAuthError(err)) toast.error(err.response?.data?.message || "Unable to submit"); return false; }
        finally { setCustomizationLoading(false); }
    }, [token, backendUrl, handleAuthError]);

    const saveCustomization = useCallback(async (data) => {
        if (!token) { toast.error("Please login to save"); navigate("/login"); return null; }
        if (!userProfile?._id) { toast.error("Please login again"); return null; }
        try {
            setCustomizationLoading(true);
            const res = await axios.post(`${backendUrl}/api/customization/save`, { ...data, userId: userProfile._id }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                const saved = res.data.customization;
                setActiveCustomization(saved);
                setCustomizations(prev => {
                    const idx = prev.findIndex(c => c._id === saved._id);
                    if (idx >= 0) { const u = [...prev]; u[idx] = saved; return u; }
                    return [saved, ...prev];
                });
                toast.success("Saved successfully");
                return saved;
            }
        } catch (err) { if (!handleAuthError(err)) toast.error(err.response?.data?.message || "Unable to save"); return null; }
        finally { setCustomizationLoading(false); }
    }, [token, backendUrl, navigate, userProfile, handleAuthError]);

    const updateCustomization = useCallback(async (customizationId, data) => {
        if (!token || !userProfile?._id) { toast.error("Please login to continue"); return null; }
        try {
            setCustomizationLoading(true);
            const res = await axios.put(`${backendUrl}/api/customization/update/${customizationId}`, { ...data, userId: userProfile._id }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                const updated = res.data.customization;
                setCustomizations(prev => prev.map(c => c._id === customizationId ? updated : c));
                toast.success("Updated successfully");
                return updated;
            }
        } catch (err) { if (!handleAuthError(err)) toast.error(err.response?.data?.message || "Unable to update"); return null; }
        finally { setCustomizationLoading(false); }
    }, [token, backendUrl, userProfile, handleAuthError]);

    const getCustomizationById = useCallback(async (customizationId) => {
        if (!token || !userProfile?._id) return null;
        try {
            const res = await axios.post(`${backendUrl}/api/customization/${customizationId}`, { userId: userProfile._id }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) return res.data.customization;
            return null;
        } catch (err) { handleAuthError(err); return null; }
    }, [backendUrl, token, userProfile, handleAuthError]);

    const deleteCustomization = useCallback(async (customizationId) => {
        if (!token || !userProfile?._id) { toast.error("Please login to continue"); return false; }
        try {
            const res = await axios.delete(`${backendUrl}/api/customization/${customizationId}`, { headers: { Authorization: `Bearer ${token}` }, data: { userId: userProfile._id } });
            if (res.data.success) { setCustomizations(prev => prev.filter(c => c._id !== customizationId)); toast.success("Deleted successfully"); return true; }
            return false;
        } catch (err) { if (!handleAuthError(err)) toast.error("Unable to delete"); return false; }
    }, [token, backendUrl, userProfile, handleAuthError]);

    // ============= CUSTOMIZATION CART FUNCTIONS =============
    const addCustomizationToCart = useCallback(async (customization) => {
        if (!customization?._id) { toast.error("Invalid customization"); return false; }
        try {
            const updatedCart = structuredClone(cartItems);
            if (!updatedCart.customizations) updatedCart.customizations = {};
            if (updatedCart.customizations[customization._id]) {
                updatedCart.customizations[customization._id].quantity += 1;
            } else {
                updatedCart.customizations[customization._id] = {
                    price: customization.estimatedPrice || customization.price || 0,
                    quantity: 1,
                    snapshot: {
                        gender: customization.gender, dressType: customization.dressType,
                        fabric: customization.fabric, color: customization.color,
                        designNotes: customization.designNotes, measurements: customization.measurements,
                        canvasDesign: customization.canvasDesign, referenceImages: customization.referenceImages,
                        aiPrompt: customization.aiPrompt,
                        neckStyle: customization.canvasDesign?.neckStyle || '',
                        sleeveStyle: customization.canvasDesign?.sleeveStyle || '',
                        status: customization.status
                    }
                };
            }
            setCartItems(updatedCart);
            toast.success("Added to cart");
            if (token) {
                await axios.post(`${backendUrl}/api/cart/add-custom`, {
                    customizationId: customization._id,
                    snapshot: updatedCart.customizations[customization._id].snapshot,
                    price: customization.estimatedPrice || customization.price || 0
                });
            }
            return true;
        } catch (err) { if (!handleAuthError(err)) toast.error(err.response?.data?.message || "Unable to add"); return false; }
    }, [cartItems, token, backendUrl, handleAuthError]);

    const updateCustomizationQuantity = useCallback(async (customizationId, quantity) => {
        if (quantity < 0) return;
        try {
            const updatedCart = structuredClone(cartItems);
            if (!updatedCart.customizations?.[customizationId]) return;
            if (quantity === 0) {
                delete updatedCart.customizations[customizationId];
                if (Object.keys(updatedCart.customizations).length === 0) delete updatedCart.customizations;
                toast.success("Item removed");
            } else {
                updatedCart.customizations[customizationId].quantity = quantity;
            }
            setCartItems(updatedCart);
            if (token) await axios.post(`${backendUrl}/api/cart/update-custom`, { customizationId, quantity });
        } catch (err) { handleAuthError(err); }
    }, [cartItems, token, backendUrl, handleAuthError]);

    const removeCustomizationFromCart = useCallback(async (customizationId) => {
        try {
            const updatedCart = structuredClone(cartItems);
            if (updatedCart.customizations?.[customizationId]) {
                delete updatedCart.customizations[customizationId];
                if (Object.keys(updatedCart.customizations).length === 0) delete updatedCart.customizations;
            }
            setCartItems(updatedCart);
            toast.success("Item removed");
            if (token) await axios.post(`${backendUrl}/api/cart/remove-custom`, { customizationId });
        } catch (err) { handleAuthError(err); }
    }, [cartItems, token, backendUrl, handleAuthError]);

    // ============= RECENTLY VIEWED =============
    const addProductToRecentlyViewed = useCallback((product) => {
        try {
            let viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
            viewed = viewed.filter(p => p._id !== product._id);
            viewed.unshift({ _id: product._id, name: product.name, price: product.price, images: product.images, category: product.category, subCategory: product.subCategory, viewedAt: new Date().toISOString() });
            localStorage.setItem('recentlyViewed', JSON.stringify(viewed.slice(0, 5)));
        } catch (error) { }
    }, []);

    const getRecentlyViewed = useCallback((allProducts = []) => {
        try {
            let viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
            if (allProducts.length > 0) {
                viewed = viewed.map(vp => { const u = allProducts.find(p => p._id === vp._id); return u ? { ...vp, name: u.name, price: u.price, images: u.images } : vp; }).filter(vp => allProducts.some(p => p._id === vp._id));
                localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
            }
            return viewed;
        } catch (error) { return []; }
    }, []);

    const clearRecentlyViewed = useCallback(() => {
        try { localStorage.removeItem('recentlyViewed'); toast.success('History cleared'); } catch (error) { }
    }, []);

    // ============= AUTH & USER FUNCTIONS =============
    const logout = useCallback(() => {
        initializedRef.current = '';
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
            const response = await axios.get(`${backendUrl}/api/user/profile`, { headers: { Authorization: `Bearer ${userToken}` } });
            if (response.data.success) {
                setUserProfile(response.data.user);
                return response.data.user;
            }
        } catch (error) { handleAuthError(error); }
        return null;
    }, [backendUrl, handleAuthError]);

    // ============= CATEGORY MANAGEMENT =============
    const setCategory = useCallback((category) => {
        setSelectedSubCategory(category);
        localStorage.setItem("selectedSubCategory", category);
    }, []);

    // ============= INITIALIZATION =============
    useEffect(() => {
        const storedSubCategory = localStorage.getItem("selectedSubCategory");
        if (storedSubCategory) setSelectedSubCategory(storedSubCategory);
    }, []);

    useEffect(() => {
        getProductsData();
    }, [getProductsData]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const activeToken = token || storedToken;

        if (!activeToken || initializedRef.current === activeToken) return;

        if (!token && storedToken) setToken(storedToken);

        initializedRef.current = activeToken;

        const bootstrap = async () => {
            await getUserCart(activeToken);
            await getUserWishlist(activeToken);
            const profile = await getUserProfile(activeToken);
            if (profile?._id) await getUserCustomizations(activeToken, profile._id);
        };

        bootstrap();
    }, [token, getUserCart, getUserWishlist, getUserProfile, getUserCustomizations]);

    // ── Clear data on logout ───────────────────────────────────────────────
    useEffect(() => {
        if (!token) {
            setWishlistItems([]);
            setUserProfile(null);
            setCustomizations([]);
            setActiveCustomization(null);
        }
    }, [token]);

    // ============= MEMOIZED CONTEXT VALUE =============
    const contextValue = useMemo(() => ({
        products, currency, delivery_fee, search, showSearch, cartItems, wishlistItems,
        token, selectedSubCategory, isLoading, userProfile, customizations, activeCustomization, customizationLoading,
        setSearch, setShowSearch, setCartItems, setToken, setSelectedSubCategory: setCategory,
        addToCart, updateQuantity, removeFromCart, clearCart, getCartCount, getCartAmount, getCartItems,
        addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, getWishlistCount, getWishlistProducts,
        getProductById, searchProducts, filterProducts,
        saveCustomization, updateCustomization, submitCustomization, getCustomizationById, deleteCustomization,
        addCustomizationToCart, updateCustomizationQuantity, removeCustomizationFromCart,
        addProductToRecentlyViewed, getRecentlyViewed, clearRecentlyViewed,
        logout, navigate, backendUrl
    }), [
        products, search, showSearch, cartItems, wishlistItems, token,
        selectedSubCategory, isLoading, userProfile, customizations, activeCustomization, customizationLoading,
        addToCart, updateQuantity, removeFromCart, clearCart, getCartCount, getCartAmount, getCartItems,
        addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, getWishlistCount, getWishlistProducts,
        getProductById, searchProducts, filterProducts,
        saveCustomization, updateCustomization, submitCustomization, getCustomizationById, deleteCustomization,
        addCustomizationToCart, updateCustomizationQuantity, removeCustomizationFromCart,
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