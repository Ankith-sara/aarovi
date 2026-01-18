import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { 
  Package, User, Calendar, Tag, Palette, Ruler, 
  MessageSquare, Image as ImageIcon, Eye, X, 
  Filter, Search, ChevronDown, ChevronUp, FileText,
  Shirt, CheckCircle2, Clock, AlertCircle, Sparkles
} from 'lucide-react';

const Customizations = ({ token }) => {
  const [customizations, setCustomizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomization, setSelectedCustomization] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const statusOptions = ['All', 'Draft', 'Submitted', 'In Review', 'In Production', 'Ready', 'Delivered'];

  const statusColors = {
    'Draft': 'bg-gray-100 text-gray-700 border-gray-300',
    'Submitted': 'bg-blue-100 text-blue-700 border-blue-300',
    'In Review': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'In Production': 'bg-purple-100 text-purple-700 border-purple-300',
    'Ready': 'bg-green-100 text-green-700 border-green-300',
    'Delivered': 'bg-emerald-100 text-emerald-700 border-emerald-300'
  };

  const statusIcons = {
    'Draft': Clock,
    'Submitted': CheckCircle2,
    'In Review': AlertCircle,
    'In Production': Package,
    'Ready': CheckCircle2,
    'Delivered': CheckCircle2
  };

  useEffect(() => {
    fetchAllCustomizations();
  }, []);

  const fetchAllCustomizations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/customization/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setCustomizations(response.data.customizations);
      }
    } catch (error) {
      console.error('Error fetching customizations:', error);
      toast.error('Failed to load customizations');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (customizationId, newStatus) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/customization/admin/update-status/${customizationId}`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Status updated successfully');
        fetchAllCustomizations();
        if (selectedCustomization?._id === customizationId) {
          setSelectedCustomization({ ...selectedCustomization, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const viewDetails = (customization) => {
    setSelectedCustomization(customization);
    setShowDetailsModal(true);
  };

  const filteredCustomizations = customizations.filter(c => {
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesSearch = !searchTerm || 
      c.dressType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.fabric?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text/60 font-light">Loading customizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-2">
              Customization Orders
            </h1>
            <p className="text-text/50 font-light leading-relaxed">
              Manage all custom design requests from customers
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden mb-6">
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40" />
                  <input
                    type="text"
                    placeholder="Search by dress type, fabric, or customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-colors bg-white font-light"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-colors bg-white font-light appearance-none cursor-pointer"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text/40 pointer-events-none" />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-background/20 rounded-xl">
                  <p className="text-2xl font-bold text-secondary">{customizations.length}</p>
                  <p className="text-xs text-text/60 font-light mt-1">Total Orders</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">
                    {customizations.filter(c => c.status === 'Submitted').length}
                  </p>
                  <p className="text-xs text-text/60 font-light mt-1">Submitted</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">
                    {customizations.filter(c => c.status === 'In Production').length}
                  </p>
                  <p className="text-xs text-text/60 font-light mt-1">In Production</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">
                    {customizations.filter(c => c.status === 'Delivered').length}
                  </p>
                  <p className="text-xs text-text/60 font-light mt-1">Delivered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customizations List */}
          {filteredCustomizations.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-background/50 p-12 text-center">
              <Package size={64} className="mx-auto mb-4 text-text/20" />
              <h3 className="text-xl font-serif font-bold text-text mb-2">No customizations found</h3>
              <p className="text-text/50 font-light">
                {searchTerm || filterStatus !== 'All' 
                  ? 'Try adjusting your filters' 
                  : 'No custom orders yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCustomizations.map((customization) => {
                const StatusIcon = statusIcons[customization.status];
                const isExpanded = expandedId === customization._id;

                return (
                  <div 
                    key={customization._id}
                    className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                            <Shirt size={24} className="text-secondary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-serif font-bold text-text">
                              {customization.gender}'s {customization.dressType}
                            </h3>
                            <p className="text-sm text-text/60 font-light">
                              Order ID: {customization._id.slice(-8)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold flex items-center gap-2 ${statusColors[customization.status]}`}>
                            <StatusIcon size={16} />
                            {customization.status}
                          </span>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : customization._id)}
                            className="p-2 hover:bg-background/30 rounded-lg transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>
                      </div>

                      {/* Quick Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Tag size={16} className="text-text/40" />
                          <div>
                            <p className="text-xs text-text/40">Fabric</p>
                            <p className="text-sm font-semibold text-text">{customization.fabric}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Palette size={16} className="text-text/40" />
                          <div>
                            <p className="text-xs text-text/40">Color</p>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded border border-gray-300" 
                                style={{ backgroundColor: customization.color }}
                              />
                              <p className="text-sm font-semibold text-text">{customization.color}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-text/40" />
                          <div>
                            <p className="text-xs text-text/40">Created</p>
                            <p className="text-sm font-semibold text-text">
                              {new Date(customization.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-text/40" />
                          <div>
                            <p className="text-xs text-text/40">Price</p>
                            <p className="text-sm font-semibold text-secondary">
                              ₹{customization.estimatedPrice?.toLocaleString() || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-background/30">
                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Canvas Design */}
                            {customization.canvasDesign?.svg && (
                              <div className="bg-background/10 rounded-xl p-4">
                                <h4 className="font-semibold text-sm text-text mb-3 flex items-center gap-2">
                                  <Palette size={16} className="text-secondary" />
                                  Canvas Design
                                </h4>
                                <div className="bg-white rounded-lg p-4 mb-3">
                                  <div 
                                    dangerouslySetInnerHTML={{ __html: customization.canvasDesign.svg }}
                                    className="max-w-full"
                                  />
                                </div>
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-text/60">Neck Style:</span>
                                    <span className="font-semibold">{customization.canvasDesign.neckStyle || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-text/60">Sleeve Style:</span>
                                    <span className="font-semibold">{customization.canvasDesign.sleeveStyle || 'N/A'}</span>
                                  </div>
                                  {customization.canvasDesign.embroideryMetadata?.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-background/30">
                                      <p className="text-text/60 mb-2">Embroidery:</p>
                                      {customization.canvasDesign.embroideryMetadata.map((emb, idx) => (
                                        <div key={idx} className="flex justify-between mb-1">
                                          <span className="text-text/60">{emb.zoneName}:</span>
                                          <span className="font-semibold">{emb.type}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Measurements */}
                            {customization.measurements && (
                              <div className="bg-background/10 rounded-xl p-4">
                                <h4 className="font-semibold text-sm text-text mb-3 flex items-center gap-2">
                                  <Ruler size={16} className="text-secondary" />
                                  Measurements
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  {Object.entries(customization.measurements).map(([key, value]) => {
                                    if (key === 'customNotes' || !value) return null;
                                    return (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-text/60 capitalize">
                                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                                        </span>
                                        <span className="font-semibold">{value}"</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                {customization.measurements.customNotes && (
                                  <div className="mt-3 pt-3 border-t border-background/30">
                                    <p className="text-text/60 text-xs mb-1">Notes:</p>
                                    <p className="text-xs">{customization.measurements.customNotes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Design Notes */}
                          {customization.designNotes && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                              <h4 className="font-semibold text-sm text-amber-900 mb-2 flex items-center gap-2">
                                <MessageSquare size={16} />
                                Design Notes
                              </h4>
                              <p className="text-sm text-amber-800">{customization.designNotes}</p>
                            </div>
                          )}

                          {/* AI Prompt */}
                          {customization.aiPrompt && (
                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                              <h4 className="font-semibold text-sm text-purple-900 mb-2 flex items-center gap-2">
                                <Sparkles size={16} />
                                AI Prompt
                              </h4>
                              <p className="text-sm text-purple-800">{customization.aiPrompt}</p>
                            </div>
                          )}

                          {/* Reference Images */}
                          {customization.referenceImages?.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-sm text-text mb-3 flex items-center gap-2">
                                <ImageIcon size={16} className="text-secondary" />
                                Reference Images ({customization.referenceImages.length})
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {customization.referenceImages.map((img, idx) => (
                                  <div key={idx} className="relative group">
                                    <img 
                                      src={img} 
                                      alt={`Reference ${idx + 1}`}
                                      className="w-full h-32 object-cover rounded-lg border-2 border-background/30"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                      <button 
                                        onClick={() => window.open(img, '_blank')}
                                        className="p-2 bg-white rounded-full"
                                      >
                                        <Eye size={20} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-3 pt-4 border-t border-background/30">
                            <button
                              onClick={() => viewDetails(customization)}
                              className="flex-1 px-6 py-3 bg-secondary/10 text-secondary font-semibold rounded-xl hover:bg-secondary/20 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <Eye size={18} />
                              View Full Details
                            </button>
                            
                            <select
                              value={customization.status}
                              onChange={(e) => updateStatus(customization._id, e.target.value)}
                              className="px-6 py-3 border-2 border-secondary text-secondary font-semibold rounded-xl hover:bg-secondary/5 transition-all cursor-pointer"
                            >
                              {statusOptions.filter(s => s !== 'All').map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Full Details Modal */}
      {showDetailsModal && selectedCustomization && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-background/30 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-text">
                Customization Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-background/30 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="bg-background/10 rounded-xl p-6">
                <h3 className="font-serif font-bold text-lg mb-4">Order Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text/60">Order ID:</span>
                    <span className="font-semibold">{selectedCustomization._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/60">Status:</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusColors[selectedCustomization.status]}`}>
                      {selectedCustomization.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/60">Created:</span>
                    <span className="font-semibold">{formatDate(selectedCustomization.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/60">Updated:</span>
                    <span className="font-semibold">{formatDate(selectedCustomization.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/60">Gender:</span>
                    <span className="font-semibold">{selectedCustomization.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/60">Dress Type:</span>
                    <span className="font-semibold">{selectedCustomization.dressType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/60">Fabric:</span>
                    <span className="font-semibold">{selectedCustomization.fabric}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/60">Estimated Price:</span>
                    <span className="font-semibold text-secondary">
                      ₹{selectedCustomization.estimatedPrice?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complete canvas design and other details would go here */}
              {/* This is a comprehensive view - you can expand further based on needs */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customizations;