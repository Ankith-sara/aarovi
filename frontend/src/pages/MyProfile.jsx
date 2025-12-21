import React, { useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  ChevronRight, Heart, Clock, User, ShoppingBag, Settings, LogOut, Edit2, Trash2,
  MapPinHouse, X, Camera, Mail, Calendar, Plus, ArrowRight, AlertCircle
} from "lucide-react";
import ProductItem from "../components/ProductItem";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [editProfile, setEditProfile] = useState({ name: "", email: "", image: "" });
  const [addressModal, setAddressModal] = useState({ open: false, address: {}, index: -1 });
  const [loading, setLoading] = useState(false);

  // Custom modal states
  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteAddressModal, setDeleteAddressModal] = useState({ open: false, index: -1 });
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });

  const { backendUrl, setToken, navigate } = useContext(ShopContext);

  // Fetch user details
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      navigate("/login");
      return;
    }
    axios
      .get(backendUrl + `/api/user/profile/${userId}`, { headers: { token } })
      .then((res) => {
        if (res.data.success) {
          setUserData(res.data.user);
          setEditProfile({
            name: res.data.user.name,
            email: res.data.user.email,
            image: res.data.user.image || "",
          });
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate, backendUrl]);

  // Fetch recently viewed products
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setRecentlyViewed(storedProducts);
  }, []);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
  };

  // --- Profile Image Upload ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditProfile((prev) => ({
      ...prev,
      imageFile: file,
      image: URL.createObjectURL(file),
    }));
  };

  // --- Edit Profile Submit ---
  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", editProfile.name);
      formData.append("email", editProfile.email);
      if (editProfile.imageFile) {
        formData.append("image", editProfile.imageFile);
      }

      const res = await axios.put(
        `${backendUrl}/api/user/profile/${userData._id}`,
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setUserData(res.data.user);
        setEditProfile({
          name: res.data.user.name,
          email: res.data.user.email,
          image: res.data.user.image || "",
        });
        setActiveSection(null);
      } else {
        setErrorModal({ open: true, message: res.data.message || "Failed to update profile." });
      }
    } catch (err) {
      console.error("Edit profile failed:", err);
      setErrorModal({ open: true, message: "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  // --- Address Management ---
  const saveAddress = async (addressObj, index = -1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${backendUrl}/api/user/address/${userData._id}`,
        { addressObj, index },
        { headers: { token } }
      );
      if (res.data.success) {
        setUserData((prev) => ({ ...prev, addresses: res.data.addresses }));
        setAddressModal({ open: false, address: {}, index: -1 });
      } else {
        setErrorModal({ open: true, message: res.data.message || "Failed to save address." });
      }
    } catch (err) {
      setErrorModal({ open: true, message: "Failed to save address." });
    }
    setLoading(false);
  };

  const confirmDeleteAddress = async () => {
    const index = deleteAddressModal.index;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${backendUrl}/api/user/address/${userData._id}`,
        { data: { index }, headers: { token } }
      );
      if (res.data.success) {
        setUserData((prev) => ({ ...prev, addresses: res.data.addresses }));
        setDeleteAddressModal({ open: false, index: -1 });
      } else {
        setErrorModal({ open: true, message: res.data.message || "Failed to delete address." });
      }
    } catch (err) {
      setErrorModal({ open: true, message: "Failed to delete address." });
    }
    setLoading(false);
  };

  const menuItems = [
    { icon: <MapPinHouse size={18} />, text: "Delivery Address", description: "Manage your delivery locations" },
    { icon: <ShoppingBag size={18} />, text: "Order History", link: "/orders", description: "View your past orders" },
    { icon: <Heart size={18} />, text: "Wishlist", link: "/wishlist", description: "Items you've saved for later" },
    { icon: <Settings size={18} />, text: "Account Settings", description: "Notifications, password, privacy" },
  ];

  if (!userData) {
    return (
      <div className="min-h-screen bg-white mt-20">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">
                My Profile
              </h1>
            </div>
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
                <span className="text-text/60 font-light">Loading profile...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Logout Confirmation Modal */}
      {logoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-slideUp border border-background">
            <div className="p-6 border-b border-background flex items-center justify-between">
              <h3 className="text-xl font-serif font-semibold text-text">Confirm Logout</h3>
              <button
                onClick={() => setLogoutModal(false)}
                className="text-text/40 hover:text-text transition-colors p-1 hover:bg-background/30 rounded-full"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-text/70 font-light leading-relaxed">
                Are you sure you want to log out of your account?
              </p>
            </div>

            <div className="p-6 border-t border-background flex gap-3">
              <button
                onClick={() => setLogoutModal(false)}
                className="flex-1 py-3 border-2 border-background text-text font-semibold rounded-lg hover:bg-background/20 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => { setLogoutModal(false); logout(); }}
                className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Address Confirmation Modal */}
      {deleteAddressModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-slideUp border border-background">
            <div className="p-6 border-b border-background flex items-center justify-between">
              <h3 className="text-xl font-serif font-semibold text-text">Delete Address</h3>
              <button
                onClick={() => setDeleteAddressModal({ open: false, index: -1 })}
                className="text-text/40 hover:text-text transition-colors p-1 hover:bg-background/30 rounded-full"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-text/70 font-light leading-relaxed">
                Are you sure you want to delete this delivery address? This action cannot be undone.
              </p>
            </div>

            <div className="p-6 border-t border-background flex gap-3">
              <button
                onClick={() => setDeleteAddressModal({ open: false, index: -1 })}
                className="flex-1 py-3 border-2 border-background text-text font-semibold rounded-lg hover:bg-background/20 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAddress}
                disabled={loading}
                className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-slideUp border border-background">
            <div className="p-6 border-b border-background flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-red-500" />
                <h3 className="text-xl font-serif font-semibold text-text">Error</h3>
              </div>
              <button
                onClick={() => setErrorModal({ open: false, message: "" })}
                className="text-text/40 hover:text-text transition-colors p-1 hover:bg-background/30 rounded-full"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-text/70 font-light leading-relaxed">
                {errorModal.message}
              </p>
            </div>

            <div className="p-6 border-t border-background">
              <button
                onClick={() => setErrorModal({ open: false, message: "" })}
                className="w-full py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-all duration-300"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">
            My Profile
          </h1>
          <p className="text-text/60 font-light text-lg">
            Manage your account and personal preferences
          </p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid xl:grid-cols-[1fr_2fr] gap-8">
            {/* Profile Information Card */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-background shadow-lg">
                <div className="p-6 border-b border-background bg-gradient-to-r from-background/20 to-primary">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-secondary" />
                    <span className="text-sm font-semibold text-text uppercase tracking-wider">
                      Profile Information
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg">
                        <img
                          src={userData.image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        className="absolute bottom-2 right-2 w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-secondary/90 transition-all duration-300"
                        onClick={() => setActiveSection("Edit Profile")}
                        title="Edit Photo"
                      >
                        <Camera size={16} />
                      </button>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-text mt-4 mb-2">{userData.name}</h3>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-text/60 font-semibold uppercase tracking-wider">Active Member</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-br from-background/20 to-primary rounded-lg p-4 border border-background">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail size={14} className="text-secondary" />
                        <span className="text-xs font-semibold text-text/60 uppercase tracking-wider">Email</span>
                      </div>
                      <p className="text-sm text-text font-medium">{userData.email}</p>
                    </div>

                    <div className="bg-gradient-to-br from-background/20 to-primary rounded-lg p-4 border border-background">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={14} className="text-secondary" />
                        <span className="text-xs font-semibold text-text/60 uppercase tracking-wider">Member Since</span>
                      </div>
                      <p className="text-sm text-text font-medium">
                        {new Date(userData.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <button
                    className="w-full py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    onClick={() => setActiveSection("Edit Profile")}
                  >
                    <Edit2 size={16} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* Sign Out Card */}
              <div className="bg-white rounded-lg border border-background shadow-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-center gap-3 p-6 text-text/60 hover:text-red-600 hover:bg-red-50 transition-all duration-300 font-semibold"
                  onClick={() => setLogoutModal(true)}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Account Management */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg border border-background shadow-lg">
                <div className="p-6 border-b border-background bg-gradient-to-r from-background/20 to-primary">
                  <div className="flex items-center gap-2">
                    <Settings size={18} className="text-secondary" />
                    <span className="text-sm font-semibold text-text uppercase tracking-wider">
                      Account Management
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-background/50">
                  {menuItems.map((item, index) => {
                    const content = (
                      <div
                        key={index}
                        className="flex items-center justify-between p-6 hover:bg-background/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => !item.link && setActiveSection(item.text)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-background/30 to-primary text-secondary border border-background">
                            {item.icon}
                          </div>
                          <div>
                            <p className="font-serif font-semibold text-text">{item.text}</p>
                            <p className="text-sm text-text/60 font-light">{item.description}</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-text/40" />
                      </div>
                    );

                    return item.link ? (
                      <Link to={item.link} key={index}>
                        {content}
                      </Link>
                    ) : (
                      content
                    );
                  })}
                </div>
              </div>

              {/* Recently Viewed Section */}
              <div className="bg-white rounded-lg border border-background shadow-lg">
                <div className="p-6 border-b border-background bg-gradient-to-r from-background/20 to-primary">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-secondary" />
                      <span className="text-sm font-semibold text-text uppercase tracking-wider">
                        Recently Viewed
                      </span>
                    </div>
                  </div>
                </div>

                {recentlyViewed.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center mb-6">
                      <Clock size={32} className="text-secondary" />
                    </div>
                    <div className="text-center max-w-md mb-8">
                      <h3 className="text-2xl font-serif font-semibold mb-3 text-text">No Recent Activity</h3>
                      <p className="text-text/70 font-light leading-relaxed">
                        Start browsing our amazing collection to see your recently viewed items here
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/collection')}
                      className="px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-all duration-300 flex items-center gap-2 shadow-lg"
                    >
                      <span>Discover Products</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {recentlyViewed.slice(0, 8).map((item) => (
                        <ProductItem
                          key={item._id}
                          id={item._id}
                          name={item.name}
                          price={item.price}
                          image={item.images}
                        />
                      ))}
                    </div>
                    {recentlyViewed.length > 8 && (
                      <div className="text-center mt-6">
                        <button className="px-6 py-3 border-2 border-background text-text font-semibold rounded-lg hover:bg-background/20 transition-all duration-300">
                          View More
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {activeSection === "Edit Profile" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden border border-background animate-slideUp">
            <div className="px-6 py-4 border-b border-background bg-gradient-to-r from-background/20 to-primary">
              <h2 className="text-xl font-serif font-semibold text-text">Edit Profile</h2>
            </div>
            <form className="p-6 space-y-6" onSubmit={handleEditProfileSubmit}>
              {/* Profile Image */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-background/30 to-primary border-2 border-background overflow-hidden flex items-center justify-center">
                    {editProfile.image ? (
                      <img src={editProfile.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-text/40" />
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 bg-secondary text-white p-2 rounded-full cursor-pointer hover:bg-secondary/90 transition-colors shadow-lg">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-text/60 font-light">Click camera icon to change photo</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-text/60 font-semibold uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-background rounded-lg bg-white focus:outline-none focus:border-secondary transition-colors font-light"
                    value={editProfile.name}
                    onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-text/60 font-semibold uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-background rounded-lg bg-white focus:outline-none focus:border-secondary transition-colors font-light"
                    value={editProfile.email}
                    onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-secondary text-white px-6 py-4 rounded-lg hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="px-6 py-4 border-2 border-background text-text rounded-lg hover:bg-background/20 transition-all duration-300 font-semibold"
                  onClick={() => setActiveSection(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Management Modal */}
      {activeSection === "Delivery Address" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-background animate-slideUp">
            <div className="p-6 border-b border-background bg-gradient-to-r from-background/20 to-primary sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPinHouse size={20} className="text-secondary" />
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-text">Delivery Addresses</h2>
                    <p className="text-text/60 text-sm font-light">Manage your delivery locations</p>
                  </div>
                </div>
                <button
                  onClick={() => setAddressModal({ open: true, address: {}, index: -1 })}
                  className="flex items-center gap-2 bg-secondary text-white px-4 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors shadow-lg"
                >
                  <Plus size={16} />
                  Add New
                </button>
              </div>
            </div>

            <div className="p-6">
              {(!userData.addresses || userData.addresses.length === 0) ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPinHouse size={32} className="text-secondary" />
                  </div>
                  <div className="text-center max-w-md mb-8 mx-auto">
                    <h3 className="text-2xl font-serif font-semibold text-text mb-3">No Addresses Found</h3>
                    <p className="text-text/70 font-light leading-relaxed">Add your first delivery address to get started</p>
                  </div>
                  <button
                    onClick={() => setAddressModal({ open: true, address: {}, index: -1 })}
                    className="px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-colors shadow-lg"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userData.addresses.map((addr, idx) => (
                    <div key={idx} className="border-2 border-background rounded-lg p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-background/10 to-primary">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-serif font-bold text-text mb-2 text-lg flex items-center gap-2">
                            <MapPinHouse size={16} className="text-secondary" />
                            {addr.label || `Address ${idx + 1}`}
                          </div>
                          <div className="text-sm text-text/70 font-light space-y-1">
                            <p>{addr.address}</p>
                            <p>{addr.city}, {addr.state} {addr.zip}</p>
                            <p>{addr.country}</p>
                            {addr.phone && (
                              <p className="flex items-center gap-2 mt-2 text-text/60">
                                <span className="font-semibold">Phone:</span> {addr.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => setAddressModal({ open: true, address: addr, index: idx })}
                            className="p-3 text-text/40 hover:text-secondary hover:bg-background/30 rounded-lg transition-colors border-2 border-transparent hover:border-background"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteAddressModal({ open: true, index: idx })}
                            className="p-3 text-text/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border-2 border-transparent hover:border-red-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-6 pt-6 border-t border-background">
                <button
                  onClick={() => setActiveSection(null)}
                  className="px-6 py-3 border-2 border-background text-text font-semibold rounded-lg hover:bg-background/20 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Form Modal */}
      {addressModal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden border border-background animate-slideUp">
            <div className="p-6 border-b border-background bg-gradient-to-r from-background/20 to-primary">
              <h2 className="text-xl font-serif font-bold text-text">
                {addressModal.index >= 0 ? "Edit Address" : "Add New Address"}
              </h2>
            </div>
            <div className="p-6">
              <AddressForm
                initial={addressModal.address}
                onSave={(addr) => saveAddress(addr, addressModal.index)}
                onCancel={() => setAddressModal({ open: false, address: {}, index: -1 })}
                loading={loading}
              />
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
      `}</style>
    </div>
  );
};

// Address Form Component
function AddressForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    address: initial.address || "",
    city: initial.city || "",
    state: initial.state || "",
    zip: initial.zip || "",
    country: initial.country || "",
    label: initial.label || "",
    phone: initial.phone || "",
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
      className="space-y-5"
    >
      <div>
        <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-2">
          Address Label (Optional)
        </label>
        <input
          className="w-full px-4 py-3 border-2 border-background rounded-lg focus:outline-none focus:border-secondary transition-colors font-light"
          value={form.label}
          onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
          placeholder="e.g., Home, Office"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-2">
          Street Address
        </label>
        <input
          className="w-full px-4 py-3 border-2 border-background rounded-lg focus:outline-none focus:border-secondary transition-colors font-light"
          value={form.address}
          onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          placeholder="Enter your street address"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-2">
            City
          </label>
          <input
            className="w-full px-4 py-3 border-2 border-background rounded-lg focus:outline-none focus:border-secondary transition-colors font-light"
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
            placeholder="City"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-2">
            State
          </label>
          <input
            className="w-full px-4 py-3 border-2 border-background rounded-lg focus:outline-none focus:border-secondary transition-colors font-light"
            value={form.state}
            onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
            placeholder="State"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-2">
            ZIP Code
          </label>
          <input
            className="w-full px-4 py-3 border-2 border-background rounded-lg focus:outline-none focus:border-secondary transition-colors font-light"
            value={form.zip}
            onChange={e => setForm(f => ({ ...f, zip: e.target.value }))}
            placeholder="ZIP"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-2">
            Country
          </label>
          <input
            className="w-full px-4 py-3 border-2 border-background rounded-lg focus:outline-none focus:border-secondary transition-colors font-light"
            value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
            placeholder="Country"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          className="w-full px-4 py-3 border-2 border-background rounded-lg focus:outline-none focus:border-secondary transition-colors font-light"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          placeholder="Enter phone number for this address"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-secondary text-white px-6 py-4 rounded-lg font-semibold hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
        <button
          type="button"
          className="px-6 py-4 border-2 border-background text-text font-semibold rounded-lg hover:bg-background/20 transition-all duration-300"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default MyProfile;