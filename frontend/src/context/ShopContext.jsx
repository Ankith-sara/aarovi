import { createContext, useEffect, useState, useCallback, useMemo } from "react";
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

    const navigate = useNavigate();

    // Configure axios defaults
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

    // ============= CART FUNCTIONS =============
    const addToCart = useCallback(async (itemId, size, quantity = 1) => {
        if (!size) {
            toast.error('Please select a size');
            return false;
        }

        try {
            const cartData = structuredClone(cartItems);

            if (cartData[itemId]) {
                cartData[itemId][size] = (cartData[itemId][size] || 0) + quantity;
            } else {
                cartData[itemId] = { [size]: quantity };
            }

            setCartItems(cartData);
            toast.success('Added to cart');

            if (token) {
                await axios.post(`${backendUrl}/api/cart/add`, { itemId, size, quantity });
            }

            return true;
        } catch (error) {
            if (!handleAuthError(error)) {
                toast.error(error.response?.data?.message || 'Unable to add item');
            }
            return false;
        }
    }, [cartItems, token, backendUrl, handleAuthError]);

    const updateQuantity = useCallback(async (itemId, size, quantity) => {
        if (quantity < 0) return;

        try {
            const cartData = structuredClone(cartItems);

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
            if (!handleAuthError(error)) {
                toast.error('Unable to update quantity');
            }
        }
    }, [cartItems, token, backendUrl, handleAuthError]);

    const removeFromCart = useCallback(async (itemId, size) => {
        try {
            const cartData = structuredClone(cartItems);

            if (cartData[itemId]) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }

            setCartItems(cartData);
            toast.success('Item removed');

            if (token) {
                await axios.post(`${backendUrl}/api/cart/remove`, { itemId, size });
            }
        } catch (error) {
            if (!handleAuthError(error)) {
                toast.error('Unable to remove item');
            }
        }
    }, [cartItems, token, backendUrl, handleAuthError]);

    const clearCart = useCallback(async () => {
        try {
            setCartItems({});

            if (token) {
                await axios.post(`${backendUrl}/api/cart/clear`);
            }

            toast.success('Cart cleared');
        } catch (error) {
            handleAuthError(error);
        }
    }, [token, backendUrl, handleAuthError]);

    const getCartCount = useCallback(() => {
        let totalCount = 0;

        for (const items in cartItems) {
            if (items === 'customizations') {
                for (const customId in cartItems.customizations) {
                    const customItem = cartItems.customizations[customId];
                    if (customItem?.quantity > 0) {
                        totalCount += customItem.quantity;
                    }
                }
            } else {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                }
            }
        }
        return totalCount;
    }, [cartItems]);

    const getCartAmount = useCallback(() => {
        if (products.length === 0) return 0;

        let totalAmount = 0;

        for (const items in cartItems) {
            if (items === 'customizations') continue;

            const itemInfo = products.find((product) => product._id === items);

            if (itemInfo) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }
            }
        }

        if (cartItems.customizations) {
            for (const customId in cartItems.customizations) {
                const custom = cartItems.customizations[customId];
                if (custom?.price && custom?.quantity) {
                    totalAmount += custom.price * custom.quantity;
                }
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

        if (cartItems.customizations) {
            for (const customId in cartItems.customizations) {
                const custom = cartItems.customizations[customId];
                if (custom?.quantity > 0) {
                    const snapshot = custom.snapshot || {};
                    items.push({
                        _id: customId,
                        type: 'customization',
                        name: `Custom ${snapshot.gender || ''} ${snapshot.dressType || 'Design'}`.trim(),
                        quantity: custom.quantity,
                        price: custom.price,
                        gender: snapshot.gender || '',
                        dressType: snapshot.dressType || '',
                        fabric: snapshot.fabric || '',
                        color: snapshot.color || '',
                        designNotes: snapshot.designNotes || '',
                        measurements: snapshot.measurements || {},
                        canvasDesign: snapshot.canvasDesign || {},
                        referenceImages: snapshot.referenceImages || [],
                        aiPrompt: snapshot.aiPrompt || '',
                        neckStyle: snapshot.neckStyle || '',
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
                `${backendUrl}/api/cart/get`,
                {},
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            handleAuthError(error);
        }
    }, [backendUrl, handleAuthError]);

    // ============= WISHLIST FUNCTIONS =============
    const addToWishlist = useCallback(async (itemId) => {
        if (!token) {
            toast.error('Please login to save items');
            navigate('/login');
            return false;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/wishlist/add`, { itemId });

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
                toast.success('Added to wishlist');
                return true;
            }
        } catch (error) {
            if (!handleAuthError(error)) {
                if (error.response?.data?.message === "Item already in wishlist") {
                    toast.info('Already in wishlist');
                } else {
                    toast.error('Unable to add to wishlist');
                }
            }
            return false;
        }
    }, [token, backendUrl, navigate, handleAuthError]);

    const removeFromWishlist = useCallback(async (itemId) => {
        if (!token) {
            toast.error('Please login to manage wishlist');
            return false;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/wishlist/remove`, { itemId });

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
                toast.success('Removed from wishlist');
                return true;
            }
        } catch (error) {
            if (!handleAuthError(error)) {
                toast.error('Unable to remove from wishlist');
            }
            return false;
        }
    }, [token, backendUrl, handleAuthError]);

    const toggleWishlist = useCallback(async (itemId) => {
        if (!token) {
            toast.error('Please login to save items');
            navigate('/login');
            return false;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/wishlist/toggle`, { itemId });

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
                toast.success(response.data.message);
                return response.data.isAdded;
            }
        } catch (error) {
            if (!handleAuthError(error)) {
                toast.error('Unable to update wishlist');
            }
            return false;
        }
    }, [token, backendUrl, navigate, handleAuthError]);

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
            handleAuthError(error);
        }
    }, [backendUrl, handleAuthError]);

    // ============= PRODUCT FUNCTIONS =============
    const getProductsData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${backendUrl}/api/product/all`);

            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) { }
        finally {
            setIsLoading(false);
        }
    }, [backendUrl]);

    const getProductById = useCallback((productId) => {
        return products.find(product => product._id === productId);
    }, [products]);

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

        if (filters.category?.length > 0) {
            filtered = filtered.filter(product =>
                filters.category.includes(product.category)
            );
        }

        if (filters.subCategory?.length > 0) {
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
    const submitCustomization = useCallback(async (customizationId) => {
        if (!token) {
            toast.error("Please login to continue");
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
            if (!handleAuthError(err)) {
                toast.error(err.response?.data?.message || "Unable to submit");
            }
            return false;
        } finally {
            setCustomizationLoading(false);
        }
    }, [token, backendUrl, handleAuthError]);

    const saveCustomization = useCallback(async (data) => {
        if (!token) {
            toast.error("Please login to save");
            navigate("/login");
            return null;
        }

        if (!userProfile?._id) {
            toast.error("Please login again");
            return null;
        }

        try {
            setCustomizationLoading(true);

            const res = await axios.post(
                `${backendUrl}/api/customization/save`,
                { ...data, userId: userProfile._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                const savedCustomization = res.data.customization;
                setActiveCustomization(savedCustomization);

                setCustomizations(prev => {
                    const index = prev.findIndex(c => c._id === savedCustomization._id);
                    if (index >= 0) {
                        const updated = [...prev];
                        updated[index] = savedCustomization;
                        return updated;
                    }
                    return [savedCustomization, ...prev];
                });

                toast.success("Saved successfully");
                return savedCustomization;
            }
        } catch (err) {
            if (!handleAuthError(err)) {
                toast.error(err.response?.data?.message || "Unable to save");
            }
            return null;
        } finally {
            setCustomizationLoading(false);
        }
    }, [token, backendUrl, navigate, userProfile, handleAuthError]);

    const updateCustomization = useCallback(async (customizationId, data) => {
        if (!token) {
            toast.error("Please login to continue");
            return null;
        }

        if (!userProfile?._id) {
            toast.error("Please login again");
            return null;
        }

        try {
            setCustomizationLoading(true);

            const res = await axios.put(
                `${backendUrl}/api/customization/update/${customizationId}`,
                { ...data, userId: userProfile._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                const updatedCustomization = res.data.customization;

                setCustomizations(prev =>
                    prev.map(c => c._id === customizationId ? updatedCustomization : c)
                );

                toast.success("Updated successfully");
                return updatedCustomization;
            }
        } catch (err) {
            if (!handleAuthError(err)) {
                toast.error(err.response?.data?.message || "Unable to update");
            }
            return null;
        } finally {
            setCustomizationLoading(false);
        }
    }, [token, backendUrl, userProfile, handleAuthError]);

    const getCustomizationById = useCallback(async (customizationId) => {
        if (!token || !userProfile?._id) return null;

        try {
            const res = await axios.post(
                `${backendUrl}/api/customization/${customizationId}`,
                { userId: userProfile._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                return res.data.customization;
            }
            return null;
        } catch (err) {
            handleAuthError(err);
            return null;
        }
    }, [backendUrl, token, userProfile, handleAuthError]);

    const deleteCustomization = useCallback(async (customizationId) => {
        if (!token) {
            toast.error("Please login to continue");
            return false;
        }

        if (!userProfile?._id) {
            toast.error("Please login again");
            return false;
        }

        try {
            const res = await axios.delete(
                `${backendUrl}/api/customization/${customizationId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { userId: userProfile._id }
                }
            );

            if (res.data.success) {
                setCustomizations(prev => prev.filter(c => c._id !== customizationId));
                toast.success("Deleted successfully");
                return true;
            }
            return false;
        } catch (err) {
            if (!handleAuthError(err)) {
                toast.error("Unable to delete");
            }
            return false;
        }
    }, [token, backendUrl, userProfile, handleAuthError]);

    const getUserCustomizations = useCallback(async (userToken) => {
        if (!userProfile?._id) return;

        try {
            setCustomizationLoading(true);

            const res = await axios.post(
                `${backendUrl}/api/customization/my`,
                { userId: userProfile._id },
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            if (res.data.success) {
                setCustomizations(res.data.customizations);
            }
        } catch (err) {
            handleAuthError(err);
        } finally {
            setCustomizationLoading(false);
        }
    }, [backendUrl, userProfile, handleAuthError]);

    // ============= CUSTOMIZATION CART FUNCTIONS =============
    const addCustomizationToCart = useCallback(async (customization) => {
        if (!customization?._id) {
            toast.error("Invalid customization");
            return false;
        }

        try {
            const updatedCart = structuredClone(cartItems);

            if (!updatedCart.customizations) {
                updatedCart.customizations = {};
            }

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
                        measurements: customization.measurements,
                        canvasDesign: customization.canvasDesign,
                        referenceImages: customization.referenceImages,
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
        } catch (err) {
            if (!handleAuthError(err)) {
                toast.error(err.response?.data?.message || "Unable to add");
            }
            return false;
        }
    }, [cartItems, token, backendUrl, handleAuthError]);

    const updateCustomizationQuantity = useCallback(async (customizationId, quantity) => {
        if (quantity < 0) return;

        try {
            const updatedCart = structuredClone(cartItems);

            if (!updatedCart.customizations?.[customizationId]) return;

            if (quantity === 0) {
                delete updatedCart.customizations[customizationId];
                if (Object.keys(updatedCart.customizations).length === 0) {
                    delete updatedCart.customizations;
                }
                toast.success("Item removed");
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
            handleAuthError(err);
        }
    }, [cartItems, token, backendUrl, handleAuthError]);

    const removeCustomizationFromCart = useCallback(async (customizationId) => {
        try {
            const updatedCart = structuredClone(cartItems);

            if (updatedCart.customizations?.[customizationId]) {
                delete updatedCart.customizations[customizationId];

                if (Object.keys(updatedCart.customizations).length === 0) {
                    delete updatedCart.customizations;
                }
            }

            setCartItems(updatedCart);
            toast.success("Item removed");

            if (token) {
                await axios.post(`${backendUrl}/api/cart/remove-custom`, {
                    customizationId
                });
            }
        } catch (err) {
            handleAuthError(err);
        }
    }, [cartItems, token, backendUrl, handleAuthError]);

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
        } catch (error) { }
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
            return [];
        }
    }, []);

    const clearRecentlyViewed = useCallback(() => {
        try {
            localStorage.removeItem('recentlyViewed');
            toast.success('History cleared');
        } catch (error) { }
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
            handleAuthError(error);
        }
    }, [backendUrl, handleAuthError]);

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
        products, currency, delivery_fee, search, showSearch, cartItems,
        wishlistItems, token, selectedSubCategory, isLoading, userProfile,
        customizations, activeCustomization, customizationLoading,
        addToCart, updateQuantity, removeFromCart, clearCart, getCartCount,
        getCartAmount, getCartItems, addToWishlist, removeFromWishlist,
        toggleWishlist, isInWishlist, getWishlistCount, getWishlistProducts,
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