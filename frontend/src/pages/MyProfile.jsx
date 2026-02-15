import React, { useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  ChevronRight, Heart, Clock, User, Settings, LogOut, Edit2, Trash2,
  MapPinHouse, X, Camera, Calendar, Plus, ArrowRight, AlertCircle, Package
} from "lucide-react";
import ProductItem from "../components/ProductItem";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import RecentlyViewed from "../components/RecentlyViewed";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [editProfile, setEditProfile] = useState({ name: "", email: "", image: "" });
  const [addressModal, setAddressModal] = useState({ open: false, address: {}, index: -1 });
  const [loading, setLoading] = useState(false);
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
      .get(backendUrl + `/api/user/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
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

  // Profile Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditProfile((prev) => ({
      ...prev,
      imageFile: file,
      image: URL.createObjectURL(file),
    }));
  };

  // Edit Profile Submit
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
            'Authorization': `Bearer ${token}`,
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

  // Address Management
  const saveAddress = async (addressObj, index = -1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${backendUrl}/api/user/address/${userData._id}`,
        { addressObj, index },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
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
        {
          data: { index },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
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
    { icon: <MapPinHouse size={20} />, text: "Delivery Address", description: "Manage your delivery locations" },
    { icon: <Package size={20} />, text: "Order History", link: "/orders", description: "View your past orders" },
    { icon: <Heart size={20} />, text: "Wishlist", link: "/wishlist", description: "Items you've saved for later" },
    { icon: <Settings size={20} />, text: "Account Settings", description: "Notifications, password, privacy" },
  ];

  if (!userData) {
    return (
      <div className="min-h-screen bg-white mt-20">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
                <span className="text-text/60 font-light">Loading your profile...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-20">
      {/* Logout Confirmation Modal */}
      {logoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full my-8">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-text mb-3">Leaving Already?</h3>
              <p className="text-text/60 font-light leading-relaxed text-sm">
                Are you sure you want to log out of your account?
              </p>
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex gap-3">
              <button
                onClick={() => setLogoutModal(false)}
                className="flex-1 py-3 sm:py-3.5 bg-gray-100 text-text font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
              >
                Stay
              </button>
              <button
                onClick={() => { setLogoutModal(false); logout(); }}
                className="flex-1 py-3 sm:py-3.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/30 text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Address Confirmation Modal */}
      {deleteAddressModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full my-8">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-text mb-3">Delete Address</h3>
              <p className="text-text/60 font-light leading-relaxed text-sm">
                This action cannot be undone. Are you sure you want to delete this delivery address?
              </p>
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex gap-3">
              <button
                onClick={() => setDeleteAddressModal({ open: false, index: -1 })}
                className="flex-1 py-3 sm:py-3.5 bg-gray-100 text-text font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAddress}
                disabled={loading}
                className="flex-1 py-3 sm:py-3.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/30 disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full my-8">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-text mb-3">Oops!</h3>
              <p className="text-text/60 font-light leading-relaxed text-sm">
                {errorModal.message}
              </p>
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <button
                onClick={() => setErrorModal({ open: false, message: "" })}
                className="w-full py-3 sm:py-3.5 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-all duration-300 text-sm sm:text-base"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-text mb-2">
              My Profile
            </h1>
            <p className="text-sm sm:text-base text-text/50 font-light flex items-center gap-2">
              <User size={16} />
              Manage your personal information and preferences
            </p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[350px_1fr] xl:grid-cols-[380px_1fr] gap-6 lg:gap-10">
            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-background/50 shadow-lg">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-background/30">
                      <img
                        src={userData.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      className="absolute bottom-0 right-0 w-9 h-9 sm:w-10 sm:h-10 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-secondary/90 transition-all duration-300"
                      onClick={() => setActiveSection("Edit Profile")}
                      title="Edit Photo"
                    >
                      <Camera size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-text mt-4 mb-1 text-center break-words max-w-full">
                    {userData.name}
                  </h3>
                  <p className="text-text/60 text-xs sm:text-sm font-light text-center break-all max-w-full">
                    {userData.email}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="bg-background/20 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={14} className="text-secondary flex-shrink-0" />
                      <span className="text-xs font-semibold text-text/50 uppercase tracking-wider">Member Since</span>
                    </div>
                    <p className="text-xs sm:text-sm text-text font-medium">
                      {new Date(userData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    className="w-full py-3 sm:py-4 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                    onClick={() => setActiveSection("Edit Profile")}
                  >
                    <Edit2 size={16} />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    className="w-full py-3 sm:py-4 bg-background/40 text-text font-semibold rounded-full hover:bg-background/60 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                    onClick={() => setLogoutModal(true)}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-background/50 shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-background/30">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-text">Quick Actions</h3>
                </div>
                <div className="divide-y divide-background/30">
                  {menuItems.map((item, index) => {
                    const content = (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 sm:p-6 hover:bg-background/10 transition-colors duration-300 cursor-pointer group"
                        onClick={() => !item.link && setActiveSection(item.text)}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-background/30 text-secondary flex-shrink-0">
                            {item.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-serif font-semibold text-text text-sm sm:text-base truncate">{item.text}</p>
                            <p className="text-xs sm:text-sm text-text/60 font-light hidden sm:block">{item.description}</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-text/40 group-hover:text-secondary transition-colors flex-shrink-0" />
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

              {/* Recently Viewed */}
              <div className="bg-white rounded-2xl border border-background/50 shadow-lg overflow-hidden">
                <RecentlyViewed />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {activeSection === "Edit Profile" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl my-8">
            <div className="p-4 sm:p-6 border-b border-background/30 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-text">Edit Profile</h2>
              <button
                onClick={() => setActiveSection(null)}
                className="p-2 hover:bg-background/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form className="p-4 sm:p-6 space-y-4 sm:space-y-6" onSubmit={handleEditProfileSubmit}>
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-background/30 overflow-hidden flex items-center justify-center">
                    {editProfile.image ? (
                      <img src={editProfile.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={28} sm:size={32} className="text-text/40" />
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 bg-secondary text-white p-2 rounded-full cursor-pointer hover:bg-secondary/90 transition-colors shadow-lg">
                    <Camera size={14} sm:size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text mb-1">Profile Photo</p>
                  <p className="text-xs text-text/60 font-light">Click camera to change</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-text/60 font-semibold uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-background/50 rounded-xl bg-white focus:outline-none focus:border-secondary transition-colors font-light text-sm sm:text-base"
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
                    className="w-full px-4 py-3 border border-background/50 rounded-xl bg-white focus:outline-none focus:border-secondary transition-colors font-light text-sm sm:text-base"
                    value={editProfile.email}
                    onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-secondary text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-secondary/30 text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="px-4 sm:px-6 py-3 sm:py-4 bg-background/40 text-text rounded-full hover:bg-background/60 transition-all duration-300 font-semibold text-sm sm:text-base"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl my-8">
            <div className="p-4 sm:p-6 border-b border-background/30 sticky top-0 z-10 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPinHouse size={20} sm:size={24} className="text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-text truncate">Delivery Addresses</h2>
                    <p className="text-text/60 text-xs sm:text-sm font-light hidden sm:block">Manage your delivery locations</p>
                  </div>
                </div>
                <button
                  onClick={() => setAddressModal({ open: true, address: {}, index: -1 })}
                  className="flex items-center justify-center gap-2 bg-secondary text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/30 text-sm sm:text-base whitespace-nowrap"
                >
                  <Plus size={16} sm:size={18} />
                  <span className="hidden sm:inline">Add New</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
              {(!userData.addresses || userData.addresses.length === 0) ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-4 sm:mb-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-background/20 rounded-full flex items-center justify-center">
                      <MapPinHouse size={32} sm:size={40} className="text-text/30" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="text-center max-w-md mb-8 sm:mb-10 px-4">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-text mb-2">No Addresses Found</h3>
                    <p className="text-sm sm:text-base text-text/60 font-light leading-relaxed">Add your first delivery address to get started</p>
                  </div>
                  <button
                    onClick={() => setAddressModal({ open: true, address: {}, index: -1 })}
                    className="group px-8 sm:px-10 py-3 sm:py-4 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-xl shadow-secondary/30 text-sm sm:text-base"
                  >
                    <span>Add Address</span>
                    <Plus size={18} sm:size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {userData.addresses.map((addr, idx) => (
                    <div key={idx} className="group bg-white rounded-2xl p-4 sm:p-6 border border-background/50 transition-all duration-300">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <MapPinHouse size={16} sm:size={18} className="text-secondary flex-shrink-0" />
                            <h4 className="font-serif font-bold text-text text-base sm:text-lg truncate">
                              {addr.label || `Address ${idx + 1}`}
                            </h4>
                          </div>
                          <div className="text-xs sm:text-sm text-text/70 font-light space-y-1">
                            <p className="break-words">{addr.address}</p>
                            <p>{addr.city}, {addr.state} {addr.zip}</p>
                            <p>{addr.country}</p>
                            {addr.phone && (
                              <p className="flex items-start gap-2 mt-2">
                                <span className="font-semibold whitespace-nowrap">Phone:</span>
                                <span className="break-all">{addr.phone}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => setAddressModal({ open: true, address: addr, index: idx })}
                            className="p-2 sm:p-2.5 text-text/40 hover:text-secondary hover:bg-background/30 rounded-xl transition-all duration-300"
                          >
                            <Edit2 size={16} sm:size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteAddressModal({ open: true, index: idx })}
                            className="p-2 sm:p-2.5 text-text/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                          >
                            <Trash2 size={16} sm:size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-background/30">
                <button
                  onClick={() => setActiveSection(null)}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 bg-background/40 text-text font-semibold rounded-full hover:bg-background/60 transition-all duration-300 text-sm sm:text-base"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl my-8">
            <div className="p-4 sm:p-6 border-b border-background/30 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-text">
                {addressModal.index >= 0 ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={() => setAddressModal({ open: false, address: {}, index: -1 })}
                className="p-2 hover:bg-background/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
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
      className="space-y-4 sm:space-y-5"
    >
      <div>
        <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-2">
          Address Label (Optional)
        </label>
        <input
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-background/50 rounded-xl focus:outline-none focus:border-secondary transition-colors font-light text-sm sm:text-base"
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
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-background/50 rounded-xl focus:outline-none focus:border-secondary transition-colors font-light text-sm sm:text-base"
          value={form.address}
          onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          placeholder="Enter your street address"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-2">
            City
          </label>
          <input
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-background/50 rounded-xl focus:outline-none focus:border-secondary transition-colors font-light text-sm sm:text-base"
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
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-background/50 rounded-xl focus:outline-none focus:border-secondary transition-colors font-light text-sm sm:text-base"
            value={form.state}
            onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
            placeholder="State"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-2">
            ZIP Code
          </label>
          <input
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-background/50 rounded-xl focus:outline-none focus:border-secondary transition-colors font-light text-sm sm:text-base"
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
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-background/50 rounded-xl focus:outline-none focus:border-secondary transition-colors font-light text-sm sm:text-base"
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
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-background/50 rounded-xl focus:outline-none focus:border-secondary transition-colors font-light text-sm sm:text-base"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          placeholder="Enter phone number for this address"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-secondary text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full font-semibold hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-secondary/30 text-sm sm:text-base"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
        <button
          type="button"
          className="px-4 sm:px-6 py-3 sm:py-4 bg-background/40 text-text font-semibold rounded-full hover:bg-background/60 transition-all duration-300 text-sm sm:text-base"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default MyProfile;