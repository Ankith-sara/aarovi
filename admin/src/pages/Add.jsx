import React, { useState, useRef } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { 
  Upload, Package, Tag, Star, AlertCircle, 
  CheckCircle2, X, Plus, Sparkles, Image, ArrowRight, Droplet
} from 'lucide-react';

const Add = ({ token }) => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Women');
  const [subCategory, setSubCategory] = useState('');
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [washCare, setWashCare] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const categoryData = {
    Women: {
      subCategories: ["", "Kurtis", "Kurti Sets", "Lehangas", "Anarkalis", "Sheraras"],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    },
    Men: {
      subCategories: ["", "Kurtas", "Kurta Sets", "Sherwanis"],
      sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46']
    }
  };

  const currentCategoryData = categoryData[category] || { subCategories: [], sizes: [] };

  const defaultWashCareInstructions = [
    "Dry clean or hand wash with mild detergent",
    "Do not machine wash or soak",
    "Wash separately, dry inside out in shade",
    "Slight irregularities are natural in handcrafted items"
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      
      if (images.length + newFiles.length > 6) {
        toast.error('Maximum 6 images allowed');
        return;
      }
      
      setImages(prev => [...prev, ...newFiles].slice(0, 6));
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      if (images.length + newFiles.length > 6) {
        toast.error('Maximum 6 images allowed');
        return;
      }
      
      setImages(prev => [...prev, ...newFiles].slice(0, 6));
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUseDefaultWashCare = () => {
    setWashCare(defaultWashCareInstructions.join('\n'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !subCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('washCare', washCare);

      images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image);
      });

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error("Error while submitting the product:", error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.message || 'Failed to add product');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Women');
    setSubCategory('');
    setBestseller(false);
    setSizes([]);
    setImages([]);
    setWashCare('');
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-2">
              Add New Product
            </h1>
            <p className="text-text/50 font-light leading-relaxed">
              Create a new product listing with images, details, and pricing
            </p>
          </div>

          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden">
              <div className="p-6 border-b border-background/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Image size={20} className="text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-text">Product Images</h2>
                      <p className="text-sm text-text/50 font-light">{images.length}/6 images uploaded</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Drag & Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer ${
                    dragActive
                      ? 'border-secondary bg-secondary/5 scale-[1.01]'
                      : 'border-background/40 hover:border-secondary/50 hover:bg-background/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Upload size={36} className="text-secondary" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-text mb-3">
                      {dragActive ? 'Drop images here' : 'Upload Product Images'}
                    </h3>
                    <p className="text-text/50 font-light mb-6">
                      Drag & drop images here, or click to browse
                    </p>
                    <div className="flex items-center justify-center gap-3 text-sm text-text/40">
                      <span className="px-3 py-1 bg-background/30 rounded-full">JPG, PNG, GIF</span>
                      <span>•</span>
                      <span className="px-3 py-1 bg-background/30 rounded-full">Max 6 images</span>
                    </div>
                  </div>
                </div>

                {/* Image Preview Grid */}
                {images.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="border-2 border-background/30 bg-white">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        >
                          <X size={14} />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-secondary text-white px-2 py-1 rounded-lg text-xs font-semibold">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {images.length === 0 && (
                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800 mb-1">No images uploaded</p>
                        <p className="text-xs text-amber-700 font-light">Please upload at least one product image to continue</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Product Information */}
              <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden">
                <div className="p-6 border-b border-background/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Package size={20} className="text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-text">Product Details</h2>
                      <p className="text-sm text-text/50 font-light">Basic information</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-text/70 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      className="w-full px-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-colors bg-white font-light"
                      type="text"
                      placeholder="e.g., Elegant Cotton Kurti Set"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text/70 mb-2">
                      Product Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      className="w-full px-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-colors resize-none bg-white font-light"
                      rows={5}
                      placeholder="Describe your product in detail..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden">
                <div className="p-6 border-b border-background/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Tag size={20} className="text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-text">Category & Pricing</h2>
                      <p className="text-sm text-text/50 font-light">Classification details</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text/70 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        onChange={(e) => { setCategory(e.target.value); setSubCategory(""); setSizes([]); }}
                        value={category}
                        className="w-full px-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-colors bg-white font-light"
                      >
                        {Object.keys(categoryData).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text/70 mb-2">
                        Sub-Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        onChange={(e) => setSubCategory(e.target.value)}
                        value={subCategory}
                        className="w-full px-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-colors bg-white font-light"
                        required
                      >
                        {currentCategoryData.subCategories.map((subCat, index) => (
                          <option key={index} value={subCat}>{subCat || "Select..."}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text/70 mb-2">
                      Price ({currency}) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/40 font-semibold">₹</span>
                      <input
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        className="w-full pl-9 pr-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-colors bg-white font-light"
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wash Care Instructions */}
            <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden">
              <div className="p-6 border-b border-background/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Droplet size={20} className="text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-text">Wash Care Instructions</h2>
                      <p className="text-sm text-text/50 font-light">Care and maintenance guidelines</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseDefaultWashCare}
                    className="px-4 py-2 text-sm bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg font-semibold transition-colors"
                  >
                    Use Default
                  </button>
                </div>
              </div>

              <div className="p-6">
                <textarea
                  onChange={(e) => setWashCare(e.target.value)}
                  value={washCare}
                  className="w-full px-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-colors resize-none bg-white font-light"
                  rows={6}
                  placeholder="Enter wash care instructions, each on a new line...&#10;Example:&#10;Dry clean or hand wash with mild detergent&#10;Do not machine wash or soak&#10;Wash separately, dry inside out in shade"
                />
              </div>
            </div>

            {/* Sizes */}
            {currentCategoryData.sizes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden">
                <div className="p-6 border-b border-background/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Package size={20} className="text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-text">Available Sizes</h2>
                      <p className="text-sm text-text/50 font-light">Select all applicable sizes</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {currentCategoryData.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                          sizes.includes(size)
                            ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
                            : 'bg-background/30 text-text hover:bg-background/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {sizes.length > 0 && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        <span className="text-sm font-semibold text-green-700">
                          {sizes.length} size{sizes.length !== 1 ? 's' : ''} selected
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bestseller */}
            <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden">
              <div className="p-6">
                <label className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl cursor-pointer hover:bg-yellow-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={bestseller}
                    onChange={() => setBestseller(prev => !prev)}
                    className="w-5 h-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
                  />
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500" size={20} fill="currentColor" />
                    <span className="font-serif font-bold text-text">Mark as Bestseller</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden sticky bottom-4 z-10">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-4 bg-background/40 text-text font-semibold rounded-xl hover:bg-background/60 transition-all duration-300"
                    disabled={loading}
                  >
                    Reset Form
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-8 py-4 bg-secondary text-white font-semibold rounded-xl transition-all duration-300 hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-secondary/30"
                    type="button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding Product...</span>
                      </>
                    ) : (
                      <>
                        <span>Add Product</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Add;