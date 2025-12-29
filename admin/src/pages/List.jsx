import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { Package, Edit3, Trash2, Search, Filter, Star, Image as ImageIcon, Upload, X, Save, CheckCircle2, IndianRupee, Grid, List as ListIcon, Tag, Building2, Plus, AlertCircle } from 'lucide-react';

const ImageUpload = ({ id, image, currentImage, setImage, index, onRemove }) => (
  <div className="relative group">
    <label
      htmlFor={id}
      className="w-28 h-28 bg-white border-2 border-background/30 hover:border-secondary flex items-center justify-center rounded-xl cursor-pointer overflow-hidden transition-all duration-300"
    >
      {image ? (
        <>
          <img src={URL.createObjectURL(image)} alt={`Upload ${id}`} className="object-cover w-full h-full rounded-xl" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded-xl">
            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
          </div>
        </>
      ) : currentImage ? (
        <>
          <img src={currentImage} alt={`Current ${id}`} className="object-cover w-full h-full rounded-xl" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded-xl">
            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-text/40">
          <Upload size={20} className="mb-1" />
          <span className="text-xs font-medium">Add Image</span>
        </div>
      )}
    </label>
    {(image || currentImage) && (
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
      >
        <Trash2 size={12} />
      </button>
    )}
    <input
      type="file"
      id={id}
      hidden
      onChange={(e) => setImage(e.target.files[0])}
      accept="image/*"
    />
  </div>
);

const ProductCard = ({ item, index, onEdit, onRemove, currency }) => (
  <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="relative h-80">
      <img
        src={item.images?.[0] || '/api/placeholder/300/200'}
        alt={item.name}
        className="w-full h-full object-contain"
        onError={(e) => {
          e.target.src = '/api/placeholder/300/200';
        }}
      />
      {item.bestseller && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
          <Star size={14} fill="white" />
          BESTSELLER
        </div>
      )}
      <div className="absolute top-3 right-3 bg-secondary text-white rounded-xl px-3 py-1.5 shadow-lg">
        <span className="text-xs font-bold">#{index + 1}</span>
      </div>
    </div>

    <div className="p-5">
      <h3 className="font-serif font-bold text-text mb-2 line-clamp-2 text-lg">{item.name}</h3>

      <div className="flex items-center gap-2 mb-3">
        <Tag size={14} className="text-text/40" />
        <span className="text-sm text-text/70 font-medium">{item.category}</span>
        {item.subCategory && (
          <>
            <span className="text-text/30">•</span>
            <span className="text-sm text-text/60 font-light">{item.subCategory}</span>
          </>
        )}
      </div>

      {item.company && item.company !== 'Aharyas' && (
        <div className="flex items-center gap-2 mb-3 bg-blue-50 px-3 py-1.5 rounded-lg">
          <Building2 size={14} className="text-blue-500" />
          <span className="text-sm text-blue-600 font-semibold">{item.company}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-background/30">
        <div className="flex items-center gap-1">
          <IndianRupee size={18} className="text-secondary" />
          <span className="font-bold text-secondary text-xl">{item.price}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2.5 text-secondary bg-secondary/10 hover:bg-secondary/20 rounded-xl transition-all duration-300"
            title="Edit Product"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${item.name}"?\n\nThis action cannot be undone.`)) {
                onRemove(item._id);
              }
            }}
            className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-300"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [images, setImages] = useState([null, null, null, null, null, null]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');

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

  const currentCategoryData = editedProduct ? (categoryData[editedProduct.category] || { subCategories: [], sizes: [] }) : { subCategories: [], sizes: [] };

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendUrl + '/api/product/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        const products = response.data.products || [];
        setList(products);
        setFilteredList(products);
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error while fetching the product list:', error);
      toast.error('Error fetching products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(backendUrl + `/api/product/remove/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Product removed successfully.');
        await fetchList();
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error('Error removing product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async () => {
    if (!editedProduct.name || !editedProduct.description || !editedProduct.price || !editedProduct.subCategory) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editedProduct.name);
      formData.append('description', editedProduct.description);
      formData.append('price', editedProduct.price);
      formData.append('category', editedProduct.category);
      formData.append('subCategory', editedProduct.subCategory);
      formData.append('bestseller', editedProduct.bestseller);
      formData.append('sizes', JSON.stringify(editedProduct.sizes || []));

      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
      });

      const response = await axios.put(
        backendUrl + `/api/product/edit/${editedProduct._id}`,
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Product updated successfully.');
        await fetchList();
        closeEditModal();
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response) {
        toast.error(`Server Error: ${error.response.data?.message || 'Unable to process your request.'}`);
      } else if (error.request) {
        toast.error('Network Error: Could not connect to the server. Please check your internet connection.');
      } else {
        toast.error(`Unexpected Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSize = (size) => {
    setEditedProduct(prev => ({
      ...prev,
      sizes: prev.sizes?.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...(prev.sizes || []), size]
    }));
  };

  const removeImage = (index) => {
    setImages(prev => prev.map((img, i) => i === index ? null : img));
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setEditedProduct(null);
    setImages([null, null, null, null, null, null]);
  };

  const openEditModal = (product) => {
    setEditedProduct({
      ...product,
      company: product.company || '',
      sizes: product.sizes || []
    });
    setImages([null, null, null, null, null, null]);
    setIsEditing(true);
  };

  const uploadedImagesCount = images.filter(img => img !== null).length;

  useEffect(() => {
    let filtered = list;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.subCategory?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredList(filtered);
  }, [list, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchList();
  }, [token]);

  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-2">
              Product Inventory
            </h1>
            <p className="text-text/50 font-light leading-relaxed">
              Manage your product catalog, update listings, and track inventory
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden mb-6">
            <div className="p-6 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Search size={20} className="text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-text">Search & Filter</h2>
                    <p className="text-sm text-text/50 font-light">Find products quickly</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-serif font-bold text-secondary">{filteredList.length}</div>
                  <div className="text-sm text-text/50 font-light">Products Found</div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-text/70 mb-2">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40" size={20} />
                    <input
                      type="text"
                      placeholder="Search by name, category, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all duration-300 bg-white font-light"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-text/70 mb-2">Filter by Category</label>
                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40" size={20} />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all duration-300 appearance-none bg-white font-light"
                    >
                      <option value="">All Categories</option>
                      {Object.keys(categoryData).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-background/30">
                <div className="text-sm text-text/60 font-light">
                  Showing {filteredList.length} of {list.length} products
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategory && ` in ${selectedCategory}`}
                </div>
                <div className="flex bg-background/30 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 font-semibold ${
                      viewMode === 'grid' 
                        ? 'bg-secondary text-white shadow-lg shadow-secondary/30' 
                        : 'text-text/60 hover:bg-background/50'
                    }`}
                    title="Grid View"
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 font-semibold ${
                      viewMode === 'list' 
                        ? 'bg-secondary text-white shadow-lg shadow-secondary/30' 
                        : 'text-text/60 hover:bg-background/50'
                    }`}
                    title="List View"
                  >
                    <ListIcon size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Display */}
          <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden">
            <div className="p-6 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Package size={20} className="text-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-text">Product Collection</h2>
                  <p className="text-sm text-text/50 font-light">Your complete inventory</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-3 border-secondary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-lg text-text/60 font-light">Loading products...</span>
                  </div>
                </div>
              ) : filteredList.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-background/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="text-text/30" size={40} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-text mb-3">
                    {list.length === 0 ? "No products found" : "No matching products"}
                  </h3>
                  <p className="text-text/50 font-light max-w-md mx-auto mb-6">
                    {list.length === 0
                      ? "Start building your product catalog by adding your first product"
                      : "Try adjusting your search terms or filters to find what you're looking for"
                    }
                  </p>
                  {searchTerm || selectedCategory ? (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                      }}
                      className="px-6 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-all duration-300 shadow-lg shadow-secondary/30"
                    >
                      Clear Filters
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                  {viewMode === 'grid' ? (
                    filteredList.map((item, index) => (
                      <ProductCard
                        key={item._id}
                        item={item}
                        index={index}
                        onEdit={openEditModal}
                        onRemove={removeProduct}
                        currency={currency}
                      />
                    ))
                  ) : (
                    <div className="bg-background/20 rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-secondary to-secondary/90 text-white">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-serif font-bold">#</th>
                              <th className="px-6 py-4 text-left text-sm font-serif font-bold">Image</th>
                              <th className="px-6 py-4 text-left text-sm font-serif font-bold">Product Details</th>
                              <th className="px-6 py-4 text-left text-sm font-serif font-bold">Category</th>
                              <th className="px-6 py-4 text-left text-sm font-serif font-bold">Company</th>
                              <th className="px-6 py-4 text-left text-sm font-serif font-bold">Price</th>
                              <th className="px-6 py-4 text-center text-sm font-serif font-bold">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-background/30">
                            {filteredList.map((item, index) => (
                              <tr key={item._id} className="hover:bg-background/10 transition-colors">
                                <td className="px-6 py-4 font-bold text-text/60">#{index + 1}</td>
                                <td className="px-6 py-4">
                                  <div className="relative w-16 h-16">
                                    <img
                                      src={item.images?.[0] || '/api/placeholder/100/100'}
                                      alt={item.name}
                                      className="w-16 h-16 object-cover rounded-xl border-2 border-background/30"
                                      onError={(e) => {
                                        e.target.src = '/api/placeholder/100/100';
                                      }}
                                    />
                                    {item.bestseller && (
                                      <Star className="absolute -top-1 -right-1 text-yellow-500 fill-yellow-500" size={16} />
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <h3 className="font-serif font-bold text-text mb-1">{item.name}</h3>
                                  <p className="text-sm text-text/60 font-light line-clamp-2">{item.description}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-semibold text-text">{item.category}</div>
                                  {item.subCategory && (
                                    <div className="text-sm text-text/60 font-light">{item.subCategory}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <Building2 size={14} className="text-blue-500" />
                                    <span className="text-sm text-blue-600 font-semibold">
                                      {item.company || 'Aharyas'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-1 font-bold text-secondary">
                                    <IndianRupee size={16} />
                                    {item.price}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      onClick={() => openEditModal(item)}
                                      className="p-2.5 text-secondary bg-secondary/10 hover:bg-secondary/20 rounded-xl transition-all duration-300"
                                      title="Edit Product"
                                    >
                                      <Edit3 size={16} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete "${item.name}"?\n\nThis action cannot be undone.`)) {
                                          removeProduct(item._id);
                                        }
                                      }}
                                      className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-300"
                                      title="Delete Product"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Edit Product Modal */}
          {isEditing && editedProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="p-6 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10 flex items-center justify-between sticky top-0 z-10 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Edit3 size={20} className="text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-text">Edit Product</h2>
                      <p className="text-sm text-text/50 font-light">Update product information</p>
                    </div>
                  </div>
                  <button
                    onClick={closeEditModal}
                    className="p-2 text-text/40 hover:text-text hover:bg-background/30 rounded-xl transition-all duration-300"
                    disabled={loading}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); editProduct(); }} className="p-6 space-y-6">
                  {/* Product Images */}
                  <div className="bg-background/20 rounded-2xl p-6 border border-background/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                        <ImageIcon size={20} className="text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-text">Product Images ({uploadedImagesCount}/6)</h3>
                        <p className="text-sm text-text/50 font-light">Upload new images to replace existing ones</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      {images.map((image, index) => (
                        <ImageUpload
                          key={index}
                          id={`edit-image-${index}`}
                          image={image}
                          currentImage={editedProduct.images?.[index]}
                          setImage={(img) => setImages(prev => prev.map((val, i) => i === index ? img : val))}
                          index={index}
                          onRemove={removeImage}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Product Information */}
                    <div className="bg-background/20 rounded-2xl p-6 border border-background/30">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                          <Package size={20} className="text-secondary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-serif font-bold text-text">Product Details</h3>
                          <p className="text-sm text-text/50 font-light">Basic information</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-text/70 mb-2">Product Name *</label>
                          <input
                            value={editedProduct.name}
                            onChange={(e) => setEditedProduct(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all duration-300 bg-white font-light"
                            type="text"
                            placeholder="Enter product name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-text/70 mb-2">Description *</label>
                          <textarea
                            value={editedProduct.description}
                            onChange={(e) => setEditedProduct(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all duration-300 resize-none bg-white font-light"
                            rows="5"
                            placeholder="Enter product description"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category & Pricing */}
                    <div className="bg-background/20 rounded-2xl p-6 border border-background/30">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                          <Tag size={20} className="text-secondary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-serif font-bold text-text">Category & Pricing</h3>
                          <p className="text-sm text-text/50 font-light">Classification details</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-text/70 mb-2">Category *</label>
                          <select
                            value={editedProduct.category}
                            onChange={(e) => setEditedProduct(prev => ({
                              ...prev,
                              category: e.target.value,
                              subCategory: "",
                              sizes: []
                            }))}
                            className="w-full px-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all duration-300 bg-white font-light"
                          >
                            {Object.keys(categoryData).map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-text/70 mb-2">Sub-Category *</label>
                          <select
                            value={editedProduct.subCategory}
                            onChange={(e) => setEditedProduct(prev => ({ ...prev, subCategory: e.target.value }))}
                            className="w-full px-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all duration-300 bg-white font-light"
                            required
                          >
                            {currentCategoryData.subCategories.map((subCat, index) => (
                              <option key={index} value={subCat}>{subCat || "Select Sub-Category"}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-text/70 mb-2">Price ({currency}) *</label>
                          <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40" size={18} />
                            <input
                              value={editedProduct.price}
                              onChange={(e) => setEditedProduct(prev => ({ ...prev, price: e.target.value }))}
                              className="w-full pl-12 pr-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all duration-300 bg-white font-light"
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

                  {/* Sizes */}
                  {currentCategoryData.sizes.length > 0 && (
                    <div className="bg-background/20 rounded-2xl p-6 border border-background/30">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                          <Package size={20} className="text-secondary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-serif font-bold text-text">Available Sizes</h3>
                          <p className="text-sm text-text/50 font-light">Select all applicable sizes</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {currentCategoryData.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                              editedProduct.sizes?.includes(size)
                                ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
                                : 'bg-background/30 text-text hover:bg-background/50'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>

                      {editedProduct.sizes?.length > 0 && (
                        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-600" />
                            <span className="text-sm font-semibold text-green-700">
                              {editedProduct.sizes.length} size{editedProduct.sizes.length !== 1 ? 's' : ''} selected
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bestseller */}
                  <div className="bg-background/20 rounded-2xl p-6 border border-background/30">
                    <label className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl cursor-pointer hover:bg-yellow-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={editedProduct.bestseller}
                        onChange={() => setEditedProduct(prev => ({ ...prev, bestseller: !prev.bestseller }))}
                        className="w-5 h-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
                      />
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-500" size={20} fill="currentColor" />
                        <span className="font-serif font-bold text-text">Mark as Bestseller</span>
                      </div>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-background/30 sticky bottom-0 bg-white">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-6 py-3 bg-background/40 text-text font-semibold rounded-xl hover:bg-background/60 transition-all duration-300"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-secondary text-white font-semibold rounded-xl transition-all duration-300 hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px] shadow-lg shadow-secondary/30"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default List;