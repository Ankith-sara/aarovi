import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ShoppingBag, User, MapPin, CreditCard, Package2, Filter, Search,
  CheckCircle, Clock, Truck, Package, PackageCheck, AlertCircle, Phone,
  IndianRupee, RefreshCw, TrendingUp, BarChart3, Sparkles, Eye, Download,
  Palette, Ruler, ChevronLeft, ChevronRight, X, QrCode, Check, Copy,
  ChevronDown, ChevronUp, MessageSquare, Image as ImageIcon, Info,
  Mail, Shirt, Tag, Calendar
} from 'lucide-react';
import { backendUrl, currency } from '../App';

// ── Helper ───────────────────────────────────────────────────────────────────
const getAdminToken = (propToken) =>
  propToken || localStorage.getItem('token') || localStorage.getItem('adminToken');

// ── StatusBadge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Order Placed':     { color: 'bg-blue-50 text-blue-700 border-blue-200',     icon: Package,      dotColor: 'bg-blue-500'   },
    'Processing':       { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock,       dotColor: 'bg-yellow-500' },
    'Shipping':         { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Truck,       dotColor: 'bg-purple-500' },
    'Out for delivery': { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: Package2,    dotColor: 'bg-orange-500' },
    'Delivered':        { color: 'bg-green-50 text-green-700 border-green-200',    icon: PackageCheck, dotColor: 'bg-green-500' },
  };
  const config = statusConfig[status] || statusConfig['Order Placed'];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${config.color}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      <Icon size={12} />
      {status}
    </span>
  );
};

// ── ProductionStatusBadge ────────────────────────────────────────────────────
const ProductionStatusBadge = ({ status }) => {
  const statusConfig = {
    DESIGNING: 'bg-blue-50 text-blue-700 border-blue-200',
    CUTTING:   'bg-orange-50 text-orange-700 border-orange-200',
    STITCHING: 'bg-purple-50 text-purple-700 border-purple-200',
    QC:        'bg-yellow-50 text-yellow-700 border-yellow-200',
    READY:     'bg-green-50 text-green-700 border-green-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${statusConfig[status] || statusConfig.DESIGNING}`}>
      {status}
    </span>
  );
};

// ── PaymentBadge ─────────────────────────────────────────────────────────────
const PaymentBadge = ({ payment, paymentMethod }) => (
  <div className="space-y-1">
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${payment ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
      {payment ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
      {payment ? 'Paid' : 'Pending'}
    </span>
    <div className="flex items-center gap-1">
      <p className="text-xs text-text/60 font-medium">{paymentMethod}</p>
      {paymentMethod === 'QR' && <QrCode size={12} className="text-green-600" />}
    </div>
  </div>
);

// ── TransactionIdDisplay ─────────────────────────────────────────────────────
const TransactionIdDisplay = ({ transactionId }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
      <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-3">
        <QrCode size={16} className="text-green-600" /> Transaction ID
      </h4>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white px-3 py-2 rounded-lg border border-green-200">
          <p className="text-sm font-mono font-semibold text-green-700 break-all">{transactionId}</p>
        </div>
        <button onClick={copyToClipboard} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" title="Copy">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <p className="text-xs text-green-600 font-medium mt-2">✓ Payment verified via QR code</p>
    </div>
  );
};

// ── CustomizationDetailsPanel ────────────────────────────────────────────────
// Full inline panel shown when "Customization Details" tab is active for a CUSTOM item.
const CustomizationDetailsPanel = ({ item, onDownloadPng, onDownloadSvg }) => {
  const c = item.customization || {};
  const canvas = c.canvasDesign || {};
  const measurements = c.measurements || {};
  const hasMeasurements = Object.values(measurements).some(v => v && v !== '');
  const hasZoneColors = canvas.zoneColors && Object.keys(canvas.zoneColors).length > 0;
  const hasEmbroidery = Array.isArray(canvas.embroideryMetadata) && canvas.embroideryMetadata.length > 0;
  const hasPrints     = Array.isArray(canvas.printMetadata)     && canvas.printMetadata.length > 0;
  const canvasImage   = canvas.pngUrl || canvas.png || item.image;

  return (
    <div className="mt-3 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50/60 to-pink-50/40 overflow-hidden">

      {/* ── Canvas image + downloads ── */}
      {canvasImage ? (
        <div className="p-5 border-b border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-serif font-bold text-sm text-purple-900 flex items-center gap-2">
              <Palette size={15} className="text-purple-500" /> Canvas Preview
            </h5>
            <div className="flex gap-2">
              {canvasImage && (
                <button onClick={onDownloadPng} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-white text-xs font-semibold rounded-lg hover:bg-secondary/90 transition-all">
                  <Download size={12} /> PNG
                </button>
              )}
              {canvas.svg && (
                <button onClick={onDownloadSvg} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-all">
                  <Download size={12} /> SVG
                </button>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-purple-100 flex justify-center">
            <img
              src={canvasImage}
              alt="Canvas Design"
              className="max-h-64 max-w-full object-contain rounded-lg"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      ) : canvas.svg ? (
        <div className="p-5 border-b border-purple-100">
          <h5 className="font-serif font-bold text-sm text-purple-900 flex items-center gap-2 mb-3">
            <Palette size={15} className="text-purple-500" /> Canvas Design (SVG)
          </h5>
          <div className="bg-white rounded-xl p-4 border border-purple-100 flex justify-center">
            <div dangerouslySetInnerHTML={{ __html: canvas.svg }} className="max-h-64 max-w-full overflow-hidden" />
          </div>
        </div>
      ) : null}

      <div className="p-5 grid sm:grid-cols-2 gap-4">

        {/* ── Design details ── */}
        <div className="bg-white rounded-xl border border-purple-100 p-4">
          <h5 className="font-serif font-bold text-sm text-text mb-3 flex items-center gap-2">
            <Shirt size={14} className="text-secondary" /> Design Details
          </h5>
          <div className="space-y-2 text-sm">
            {[
              ['Gender',      c.gender],
              ['Dress Type',  c.dressType],
              ['Fabric',      c.fabric],
              ['Size',        c.size],
              ['Neck Style',  c.neckStyle],
              ['Sleeve Style',c.sleeveStyle],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                <span className="text-text/50 font-light">{label}</span>
                <span className={`font-semibold ${label === 'Size' ? 'px-2 py-0.5 bg-secondary/10 text-secondary rounded text-xs' : 'capitalize'}`}>{value}</span>
              </div>
            ))}
            {c.color && (
              <div className="flex justify-between items-center py-1">
                <span className="text-text/50 font-light">Color</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded border border-gray-200" style={{ backgroundColor: c.color }} />
                  <span className="font-mono text-xs">{c.color}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Measurements ── */}
        {hasMeasurements ? (
          <div className="bg-white rounded-xl border border-green-200 p-4">
            <h5 className="font-serif font-bold text-sm text-green-900 mb-3 flex items-center gap-2">
              <Ruler size={14} className="text-green-600" /> Custom Measurements
            </h5>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Bust / Chest',  measurements.bust],
                ['Waist',         measurements.waist],
                ['Hips',          measurements.hips],
                ['Shoulder',      measurements.shoulder],
                ['Sleeve Length', measurements.sleeveLength],
                ['Length',        measurements.length],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="bg-green-50 border border-green-100 rounded-lg p-2 text-center">
                  <p className="text-xs text-green-600">{label}</p>
                  <p className="font-bold text-green-900 text-sm">{value}"</p>
                </div>
              ))}
            </div>
            {measurements.customNotes && (
              <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-lg text-xs text-green-800">
                <span className="font-semibold">Notes: </span>{measurements.customNotes}
              </div>
            )}
          </div>
        ) : (
          // If no measurements, show zone colours here instead
          hasZoneColors && (
            <div className="bg-white rounded-xl border border-purple-100 p-4">
              <h5 className="font-serif font-bold text-sm text-text mb-3 flex items-center gap-2">
                <Palette size={14} className="text-secondary" /> Zone Colours
              </h5>
              <div className="flex flex-wrap gap-2">
                {Object.entries(canvas.zoneColors).map(([zone, color]) => (
                  <div key={zone} className="flex items-center gap-1.5 bg-background/20 border border-gray-100 rounded-lg px-2.5 py-1.5 text-xs">
                    <div className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="capitalize text-text/70">{zone}</span>
                    <span className="font-mono text-text/40">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* ── Zone colours (only if measurements were already shown above) ── */}
      {hasMeasurements && hasZoneColors && (
        <div className="px-5 pb-4">
          <div className="bg-white rounded-xl border border-purple-100 p-4">
            <h5 className="font-serif font-bold text-sm text-text mb-3 flex items-center gap-2">
              <Palette size={14} className="text-secondary" /> Zone Colours
            </h5>
            <div className="flex flex-wrap gap-2">
              {Object.entries(canvas.zoneColors).map(([zone, color]) => (
                <div key={zone} className="flex items-center gap-1.5 bg-background/20 border border-gray-100 rounded-lg px-2.5 py-1.5 text-xs">
                  <div className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="capitalize text-text/70">{zone}</span>
                  <span className="font-mono text-text/40">{color}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Embroidery ── */}
      {hasEmbroidery && (
        <div className="px-5 pb-4">
          <div className="bg-white rounded-xl border border-purple-100 p-4">
            <h5 className="font-serif font-bold text-sm text-text mb-3">Embroidery Details</h5>
            <div className="space-y-1.5">
              {canvas.embroideryMetadata.map((emb, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
                  <span className="text-text/60">{emb.zoneName}</span>
                  <span className="font-semibold">{emb.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Prints ── */}
      {hasPrints && (
        <div className="px-5 pb-4">
          <div className="bg-white rounded-xl border border-purple-100 p-4">
            <h5 className="font-serif font-bold text-sm text-text mb-3">Print Details</h5>
            <div className="space-y-1.5">
              {canvas.printMetadata.map((print, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm bg-pink-50 border border-pink-100 rounded-lg px-3 py-2">
                  <span className="text-text/60">{print.zoneName}</span>
                  <span className="font-semibold">{print.type || print.fit || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Design Notes / AI Prompt / Special Instructions ── */}
      {(c.designNotes || c.aiPrompt || c.specialInstructions) && (
        <div className="px-5 pb-5 space-y-3">
          {c.designNotes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h5 className="text-xs font-bold text-amber-900 flex items-center gap-2 mb-1.5">
                <MessageSquare size={13} /> Design Notes
              </h5>
              <p className="text-sm text-amber-800 leading-relaxed">{c.designNotes}</p>
            </div>
          )}
          {c.aiPrompt && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h5 className="text-xs font-bold text-purple-900 flex items-center gap-2 mb-1.5">
                <Sparkles size={13} /> AI Prompt
              </h5>
              <p className="text-sm text-purple-800 leading-relaxed">{c.aiPrompt}</p>
            </div>
          )}
          {c.specialInstructions && (
            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4">
              <h5 className="text-xs font-bold text-secondary flex items-center gap-2 mb-1.5">
                <Info size={13} /> Special Instructions
              </h5>
              <p className="text-sm text-text/70 leading-relaxed">{c.specialInstructions}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Reference Images ── */}
      {Array.isArray(c.referenceImages) && c.referenceImages.length > 0 && (
        <div className="px-5 pb-5">
          <div className="bg-white rounded-xl border border-purple-100 p-4">
            <h5 className="font-serif font-bold text-sm text-text mb-3 flex items-center gap-2">
              <ImageIcon size={14} className="text-secondary" />
              Reference Images ({c.referenceImages.length})
            </h5>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {c.referenceImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Ref ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border-2 border-gray-100" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button onClick={() => window.open(img, '_blank')} className="p-1.5 bg-white rounded-full shadow">
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Orders (main component) ──────────────────────────────────────────────────
const Orders = ({ token }) => {
  const [orders, setOrders]               = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [authError, setAuthError]         = useState(false);
  const [currentPage, setCurrentPage]     = useState(1);
  // expandedCustomization: key = `${orderId}-${itemIdx}`, value = bool
  const [expandedCustomization, setExpandedCustomization] = useState({});

  const itemsPerPage = 10;

  const toggleCustomizationPanel = (orderId, itemIdx) => {
    const key = `${orderId}-${itemIdx}`;
    setExpandedCustomization(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchAllOrders = async () => {
    const activeToken = getAdminToken(token);
    if (!activeToken) { toast.error('Authentication token missing. Please log in.'); setAuthError(true); return; }

    setLoading(true);
    setAuthError(false);
    try {
      const response = await axios.get(`${backendUrl}/api/order/list`, {
        headers: { Authorization: `Bearer ${activeToken}`, 'Content-Type': 'application/json' }
      });
      if (response.data.success) {
        const sorted = [...response.data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
        setFilteredOrders(sorted);
      } else {
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) { setAuthError(true); toast.error('Authentication failed. Please log in again.'); }
      else if (error.response?.status === 403) toast.error('Access denied.');
      else if (error.request) toast.error('Network Error: Could not connect to server');
      else toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ── Update order status ─────────────────────────────────────────────────────
  const statusHandler = async (event, orderId) => {
    const activeToken = getAdminToken(token);
    if (!activeToken) { toast.error('Authentication required'); return; }
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${activeToken}` } }
      );
      if (response.data.success) { toast.success('Order status updated'); await fetchAllOrders(); }
      else toast.error(response.data.message || 'Failed to update status');
    } catch (error) {
      if (error.response?.status === 401) toast.error('Authentication failed.');
      else toast.error('Failed to update order status');
    }
  };

  // ── Update production status ────────────────────────────────────────────────
  const updateProductionStatus = async (orderId, itemIndex, productionStatus) => {
    const activeToken = getAdminToken(token);
    if (!activeToken) { toast.error('Authentication required'); return; }
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/update-production`,
        { orderId, itemIndex, productionStatus },
        { headers: { Authorization: `Bearer ${activeToken}` } }
      );
      if (response.data.success) { toast.success('Production status updated'); await fetchAllOrders(); }
      else toast.error(response.data.message || 'Failed to update production status');
    } catch (error) { toast.error('Failed to update production status'); }
  };

  // ── Download helpers ────────────────────────────────────────────────────────
  const downloadPng = (item) => {
    const url = item.customization?.canvasDesign?.pngUrl || item.customization?.canvasDesign?.png || item.image;
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.name.replace(/\s+/g, '_')}_canvas.png`;
    link.click();
  };

  const downloadSvg = (item) => {
    const svgData = item.customization?.canvasDesign?.svg;
    if (!svgData) return;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.name.replace(/\s+/g, '_')}_canvas.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ── Filter ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let filtered = orders;
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order =>
        order.address?.Name?.toLowerCase().includes(s) ||
        order.address?.phone?.includes(searchTerm) ||
        order.items?.some(item => item.name?.toLowerCase().includes(s)) ||
        order.address?.city?.toLowerCase().includes(s) ||
        order.address?.country?.toLowerCase().includes(s)
      );
    }
    if (statusFilter)              filtered = filtered.filter(o => o.status === statusFilter);
    if (paymentFilter === 'paid')  filtered = filtered.filter(o => o.payment);
    if (paymentFilter === 'pending') filtered = filtered.filter(o => !o.payment);
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  useEffect(() => { fetchAllOrders(); }, [token]);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = {
    total:        orders.length,
    pending:      orders.filter(o => o.status === 'Order Placed').length,
    processing:   orders.filter(o => o.status === 'Processing').length,
    delivered:    orders.filter(o => o.status === 'Delivered').length,
    revenue:      orders.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0),
    customOrders: orders.filter(o => o.items?.some(i => i.type === 'CUSTOM')).length,
  };

  // ── Pagination ──────────────────────────────────────────────────────────────
  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginate         = (page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const clearAllFilters  = () => { setSearchTerm(''); setStatusFilter(''); setPaymentFilter(''); setCurrentPage(1); };

  // ── Auth error screen ───────────────────────────────────────────────────────
  if (authError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-background/50 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-600" size={40} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-text mb-2">Authentication Required</h2>
          <p className="text-text/60 font-light mb-6">Your session has expired. Please log in again.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all font-semibold shadow-lg shadow-secondary/30">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-2">Order Management</h1>
            <p className="text-text/50 font-light">Track, manage, and update all customer orders from one dashboard</p>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden mb-6">
            <div className="p-6 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <BarChart3 size={20} className="text-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-text">Order Statistics</h2>
                  <p className="text-sm text-text/50 font-light">Overview of all orders</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Total Orders',  value: stats.total,        icon: ShoppingBag,  bg: 'bg-blue-50',    border: 'border-blue-200',    ibg: 'bg-blue-100',    ic: 'text-blue-600',    vc: 'text-blue-600'    },
                  { label: 'Pending',       value: stats.pending,      icon: Clock,        bg: 'bg-yellow-50',  border: 'border-yellow-200',  ibg: 'bg-yellow-100',  ic: 'text-yellow-600',  vc: 'text-yellow-600'  },
                  { label: 'Processing',    value: stats.processing,   icon: Package,      bg: 'bg-purple-50',  border: 'border-purple-200',  ibg: 'bg-purple-100',  ic: 'text-purple-600',  vc: 'text-purple-600'  },
                  { label: 'Delivered',     value: stats.delivered,    icon: PackageCheck, bg: 'bg-green-50',   border: 'border-green-200',   ibg: 'bg-green-100',   ic: 'text-green-600',   vc: 'text-green-600'   },
                  { label: 'Custom Orders', value: stats.customOrders, icon: Sparkles,     bg: 'bg-pink-50',    border: 'border-pink-200',    ibg: 'bg-pink-100',    ic: 'text-pink-600',    vc: 'text-pink-600'    },
                ].map(({ label, value, icon: Icon, bg, border, ibg, ic, vc }) => (
                  <div key={label} className={`text-center p-4 ${bg} rounded-xl border ${border}`}>
                    <div className={`w-10 h-10 ${ibg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <Icon className={ic} size={20} />
                    </div>
                    <p className="text-xs text-text/60 font-light mb-1">{label}</p>
                    <p className={`text-2xl font-serif font-bold ${vc}`}>{value}</p>
                  </div>
                ))}
                <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="text-emerald-600" size={20} />
                  </div>
                  <p className="text-xs text-text/60 font-light mb-1">Revenue</p>
                  <div className="flex items-center justify-center gap-0.5">
                    <IndianRupee size={14} className="text-emerald-600" />
                    <span className="text-xl font-serif font-bold text-emerald-600">{stats.revenue.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden mb-6">
            <div className="p-6 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Search size={20} className="text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-text">Search & Filter</h2>
                    <p className="text-sm text-text/50 font-light">Find orders quickly</p>
                  </div>
                </div>
                <button onClick={fetchAllOrders} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-xl transition-all disabled:opacity-50 font-semibold">
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-text/70 mb-2">Search Orders</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" size={20} />
                    <input type="text" placeholder="Search by customer, phone, product, or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all font-light" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text/70 mb-2">Order Status</label>
                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" size={20} />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all appearance-none font-light">
                      <option value="">All Status</option>
                      <option value="Order Placed">Order Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text/70 mb-2">Payment Status</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" size={20} />
                    <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-background/40 rounded-xl focus:outline-none focus:border-secondary transition-all appearance-none font-light">
                      <option value="">All Payments</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-background/30">
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-text/60 font-light">
                    Showing {currentItems.length} of {filteredOrders.length} orders
                    {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                  </div>
                  {(searchTerm || statusFilter || paymentFilter) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {searchTerm    && <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">Search: "{searchTerm}"</span>}
                      {statusFilter  && <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">Status: {statusFilter}</span>}
                      {paymentFilter && <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">Payment: {paymentFilter === 'paid' ? 'Paid' : 'Pending'}</span>}
                      <button onClick={clearAllFilters} className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full hover:bg-red-100 transition-colors">Clear All</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-2xl shadow-md border border-background/50 overflow-hidden">
            <div className="p-6 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <ShoppingBag size={20} className="text-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-text">Customer Orders</h2>
                  <p className="text-sm text-text/50 font-light">Complete order details with customization breakdowns</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
                    <span className="text-lg text-text/60 font-light">Loading orders…</span>
                  </div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-background/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="text-text/30" size={40} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-text mb-3">No orders found</h3>
                  <p className="text-text/50 font-light max-w-md mx-auto mb-6">
                    {orders.length === 0 ? "Your store hasn't received any orders yet" : "Try adjusting your search or filters"}
                  </p>
                  {(searchTerm || statusFilter || paymentFilter) && (
                    <button onClick={clearAllFilters} className="px-6 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/30">
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {currentItems.map((order, index) => {
                      const hasCustomItems = order.items?.some(item => item.type === 'CUSTOM');
                      return (
                        <div
                          key={order._id || index}
                          className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden hover:shadow-lg transition-all ${hasCustomItems ? 'border-purple-200' : 'border-background/30'}`}
                        >
                          {/* Order header */}
                          <div className={`p-6 border-b border-background/30 ${hasCustomItems ? 'bg-gradient-to-r from-purple-50 to-pink-50' : 'bg-gradient-to-br from-secondary/5 to-secondary/10'}`}>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasCustomItems ? 'bg-purple-200' : 'bg-secondary/20'}`}>
                                  {hasCustomItems ? <Sparkles size={24} className="text-purple-600" /> : <ShoppingBag size={24} className="text-secondary" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-serif font-bold text-text">Order #{indexOfFirstItem + index + 1}</h3>
                                    {hasCustomItems && <span className="px-2 py-1 bg-secondary text-white rounded-full text-xs font-bold">CUSTOM</span>}
                                  </div>
                                  <p className="text-sm text-text/60 font-light mt-1">
                                    {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                              <StatusBadge status={order.status} />
                            </div>
                          </div>

                          <div className="p-6">
                            {/* Items */}
                            <div className="mb-6">
                              <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-4">
                                <Package size={16} /> Order Items ({order.items.length})
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => {
                                  const panelKey  = `${order._id}-${idx}`;
                                  const isPanelOpen = !!expandedCustomization[panelKey];
                                  const hasCanvas = item.type === 'CUSTOM' && (
                                    item.customization?.canvasDesign?.svg ||
                                    item.customization?.canvasDesign?.pngUrl ||
                                    item.customization?.canvasDesign?.png ||
                                    item.image
                                  );

                                  return (
                                    <div key={idx}>
                                      <div className={`flex items-start gap-4 p-4 rounded-xl border ${item.type === 'CUSTOM' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' : 'bg-background/10 border-background/30'}`}>
                                        {/* Image */}
                                        <div className="flex-shrink-0">
                                          {item.image && (
                                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm" onError={(e) => { e.target.style.display = 'none'; }} />
                                          )}
                                          {!item.image && (
                                            <div className={`w-20 h-20 rounded-lg flex items-center justify-center ${item.type === 'CUSTOM' ? 'bg-gradient-to-br from-purple-200 to-pink-200' : 'bg-background/30'}`}>
                                              {item.type === 'CUSTOM' ? <Palette size={24} className="text-purple-600" /> : <Package size={24} className="text-text/40" />}
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          {item.type === 'CUSTOM' && (
                                            <div className="flex items-center gap-2 mb-2">
                                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-white rounded-full text-xs font-bold">CUSTOM</span>
                                              <ProductionStatusBadge status={item.productionStatus} />
                                            </div>
                                          )}

                                          <p className="font-serif font-bold text-text mb-1">{item.name}</p>

                                          <div className="flex flex-wrap items-center gap-3 text-sm text-text/60 font-light mb-2">
                                            <span>Qty: <span className="font-semibold">{item.quantity}</span></span>
                                            <span>•</span>
                                            <span>Size: <span className="font-semibold">{item.customization?.size || item.size || '—'}</span></span>
                                            <span>•</span>
                                            <div className="flex items-center gap-1 font-semibold text-secondary">
                                              <IndianRupee size={14} />{(item.finalPrice || item.basePrice || 0).toLocaleString()}
                                            </div>
                                          </div>

                                          {/* Regular item style tags */}
                                          {item.type !== 'CUSTOM' && (item.neckStyle || item.sleeveStyle || item.specialInstructions) && (
                                            <div className="mt-2 p-2.5 bg-background/30 border border-background/60 rounded-lg space-y-2">
                                              <div className="flex flex-wrap gap-1.5">
                                                {item.neckStyle && <span className="text-[11px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold capitalize">{item.neckStyle} neck</span>}
                                                {item.sleeveStyle && <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold capitalize">{item.sleeveStyle} sleeve</span>}
                                                {item.specialInstructions && <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">📝 Note</span>}
                                              </div>
                                              {item.specialInstructions && (
                                                <div className="px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 leading-relaxed">
                                                  <span className="font-semibold">Instructions: </span>{item.specialInstructions}
                                                </div>
                                              )}
                                            </div>
                                          )}

                                          {/* Custom item — summary row + production select + toggle button */}
                                          {item.type === 'CUSTOM' && (
                                            <div className="mt-3 space-y-3">
                                              {/* Quick summary tags */}
                                              <div className="flex flex-wrap gap-1.5">
                                                {item.customization?.fabric && <span className="text-[11px] bg-background/40 text-text/70 px-2 py-0.5 rounded-full font-semibold">{item.customization.fabric}</span>}
                                                {item.customization?.neckStyle && <span className="text-[11px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold capitalize">{item.customization.neckStyle} neck</span>}
                                                {item.customization?.sleeveStyle && <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold capitalize">{item.customization.sleeveStyle} sleeve</span>}
                                                {item.customization?.measurements && Object.values(item.customization.measurements).some(v => v) && (
                                                  <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">📐 Custom measurements</span>
                                                )}
                                              </div>

                                              {/* Production status + toggle */}
                                              <div className="flex gap-2">
                                                <select
                                                  value={item.productionStatus}
                                                  onChange={(e) => updateProductionStatus(order._id, idx, e.target.value)}
                                                  className="flex-1 px-3 py-2 text-xs border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 font-light"
                                                >
                                                  <option value="DESIGNING">Designing</option>
                                                  <option value="CUTTING">Cutting</option>
                                                  <option value="STITCHING">Stitching</option>
                                                  <option value="QC">QC</option>
                                                  <option value="READY">Ready</option>
                                                </select>

                                                {/* ↓ Customization Details toggle button */}
                                                <button
                                                  onClick={() => toggleCustomizationPanel(order._id, idx)}
                                                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                                                    isPanelOpen
                                                      ? 'bg-purple-600 text-white border-purple-600'
                                                      : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50'
                                                  }`}
                                                >
                                                  <Sparkles size={12} />
                                                  {isPanelOpen ? 'Hide Details' : 'Customization Details'}
                                                  {isPanelOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* ↓ Inline Customization Details Panel */}
                                      {item.type === 'CUSTOM' && isPanelOpen && (
                                        <CustomizationDetailsPanel
                                          item={item}
                                          onDownloadPng={() => downloadPng(item)}
                                          onDownloadSvg={() => downloadSvg(item)}
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Customer & Address */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                              <div className="bg-background/20 rounded-xl p-4 border border-background/30">
                                <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-3"><User size={16} />Customer Information</h4>
                                <p className="font-serif font-bold text-text">{order.address.Name}</p>
                                <div className="flex items-center gap-2 text-text/60 font-light mt-1">
                                  <Phone size={14} /><span className="text-sm">{order.address.phone}</span>
                                </div>
                              </div>
                              <div className="bg-background/20 rounded-xl p-4 border border-background/30">
                                <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-3"><MapPin size={16} />Delivery Address</h4>
                                <div className="space-y-1 text-sm text-text/60 font-light">
                                  <p>{order.address.street}</p>
                                  <p>{order.address.city}, {order.address.country}</p>
                                  <p className="font-semibold">PIN: {order.address.pincode}</p>
                                </div>
                              </div>
                            </div>

                            {/* Payment / Amount / Status update */}
                            <div className={`grid grid-cols-1 gap-4 ${order.paymentMethod === 'QR' && order.transactionId ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                              <div className="bg-background/20 rounded-xl p-4 border border-background/30">
                                <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-3"><CreditCard size={16} />Payment Status</h4>
                                <PaymentBadge payment={order.payment} paymentMethod={order.paymentMethod} />
                              </div>
                              {order.paymentMethod === 'QR' && order.transactionId && (
                                <TransactionIdDisplay transactionId={order.transactionId} />
                              )}
                              <div className="bg-background/20 rounded-xl p-4 border border-background/30">
                                <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-3"><IndianRupee size={16} />Total Amount</h4>
                                <div className="flex items-center gap-1">
                                  <IndianRupee size={20} className="text-secondary" />
                                  <span className="text-2xl font-serif font-bold text-secondary">{order.amount}</span>
                                </div>
                              </div>
                              <div className="bg-background/20 rounded-xl p-4 border border-background/30">
                                <h4 className="text-sm font-semibold text-text/70 flex items-center gap-2 mb-3"><Package2 size={16} />Update Status</h4>
                                <select onChange={(e) => statusHandler(e, order._id)} value={order.status} className="w-full px-3 py-2 border border-background/40 rounded-lg focus:outline-none focus:border-secondary transition-all text-sm font-light">
                                  <option value="Order Placed">Order Placed</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipping">Shipping</option>
                                  <option value="Out for delivery">Out for delivery</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                      <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-background/40 hover:bg-background/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        <ChevronLeft size={20} />
                      </button>
                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                              <button key={page} onClick={() => paginate(page)} className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === page ? 'bg-secondary text-white shadow-lg shadow-secondary/30' : 'bg-background/20 text-text hover:bg-background/40'}`}>
                                {page}
                              </button>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2 py-2 text-text/40">…</span>;
                          }
                          return null;
                        })}
                      </div>
                      <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-background/40 hover:bg-background/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Orders;