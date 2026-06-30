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
import { backendUrl, currency } from '../AdminLayout';

// ── Helper ───────────────────────────────────────────────────────────────────
const getAdminToken = (propToken) =>
  propToken || localStorage.getItem('token') || localStorage.getItem('adminToken');

// ── StatusBadge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Order Placed':     { color: 'bg-blue-500/10 text-blue-700 border-blue-500/20',     icon: Package,      dotColor: 'bg-blue-500'   },
    'Processing':       { color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20', icon: Clock,       dotColor: 'bg-yellow-500' },
    'Shipping':         { color: 'bg-purple-500/10 text-purple-700 border-purple-500/20', icon: Truck,       dotColor: 'bg-purple-500' },
    'Out for delivery': { color: 'bg-orange-500/10 text-orange-700 border-orange-500/20', icon: Package2,    dotColor: 'bg-orange-500' },
    'Delivered':        { color: 'bg-green-500/10 text-green-700 border-green-500/20',    icon: PackageCheck, dotColor: 'bg-green-500' },
  };
  const config = statusConfig[status] || statusConfig['Order Placed'];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.color}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <Icon size={10} />
      {status}
    </span>
  );
};

// ── ProductionStatusBadge ────────────────────────────────────────────────────
const ProductionStatusBadge = ({ status }) => {
  const statusConfig = {
    DESIGNING: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    CUTTING:   'bg-orange-500/10 text-orange-700 border-orange-500/20',
    STITCHING: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    QC:        'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    READY:     'bg-green-500/10 text-green-700 border-green-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusConfig[status] || statusConfig.DESIGNING}`}>
      {status}
    </span>
  );
};

// ── PaymentBadge ─────────────────────────────────────────────────────────────
const PaymentBadge = ({ payment, paymentMethod }) => (
  <div className="space-y-1 font-inter">
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${payment ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20'}`}>
      {payment ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
      {payment ? 'Paid' : 'Pending'}
    </span>
    <div className="flex items-center gap-1">
      <p className="text-xs text-text/50 font-semibold">{paymentMethod}</p>
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
    <div className="bg-background/25 rounded-lg p-4 border border-secondary/15 font-inter">
      <h4 className="text-xs font-semibold text-text/70 flex items-center gap-2 mb-2.5 uppercase tracking-wide">
        <QrCode size={14} className="text-green-600" /> Transaction ID
      </h4>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-primary px-3 py-1.5 rounded-lg border border-secondary/10">
          <p className="text-xs font-mono font-semibold text-green-700 break-all">{transactionId}</p>
        </div>
        <button onClick={copyToClipboard} className="p-2 bg-secondary text-primary rounded-full hover:bg-secondary/90 transition-colors" title="Copy">
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <p className="text-[10px] text-green-700 font-semibold uppercase tracking-wide mt-2">✓ Verified via QR</p>
    </div>
  );
};

// ── CustomizationDetailsPanel ────────────────────────────────────────────────
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
    <div className="mt-4 rounded-lg border border-purple-300/30 bg-purple-500/5 overflow-hidden p-5 space-y-5 font-inter">

      {/* ── Canvas image + downloads ── */}
      {canvasImage ? (
        <div className="pb-5 border-b border-purple-300/20">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-polysans tracking-tight font-bold text-sm text-purple-900 flex items-center gap-2">
              <Palette size={14} className="text-purple-500" /> Canvas Preview
            </h5>
            <div className="flex gap-2">
              {canvasImage && (
                <button onClick={onDownloadPng} className="flex items-center gap-1.5 px-3 py-1 bg-secondary text-primary text-xs font-semibold rounded-full hover:bg-secondary/95 transition-all shadow-sm">
                  <Download size={11} /> PNG
                </button>
              )}
              {canvas.svg && (
                <button onClick={onDownloadSvg} className="flex items-center gap-1.5 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full hover:bg-green-700 transition-all shadow-sm">
                  <Download size={11} /> SVG
                </button>
              )}
            </div>
          </div>
          <div className="bg-primary rounded-lg p-4 border border-purple-300/20 flex justify-center">
            <img
              src={canvasImage}
              alt="Canvas Design"
              className="max-h-64 max-w-full object-contain rounded-lg"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      ) : canvas.svg ? (
        <div className="pb-5 border-b border-purple-300/20">
          <h5 className="font-polysans tracking-tight font-bold text-sm text-purple-900 flex items-center gap-2 mb-3">
            <Palette size={14} className="text-purple-500" /> Canvas Design (SVG)
          </h5>
          <div className="bg-primary rounded-lg p-4 border border-purple-300/20 flex justify-center">
            <div dangerouslySetInnerHTML={{ __html: canvas.svg }} className="max-h-64 max-w-full overflow-hidden" />
          </div>
        </div>
      ) : null}

      <div className="grid sm:grid-cols-2 gap-4">

        {/* ── Design details ── */}
        <div className="bg-primary rounded-lg border border-purple-300/20 p-4">
          <h5 className="font-polysans tracking-tight font-bold text-sm text-text mb-3 flex items-center gap-2">
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
              <div key={label} className="flex justify-between items-center py-1.5 border-b border-purple-300/10 last:border-0">
                <span className="text-xs text-text/50 font-light">{label}</span>
                <span className={`text-xs font-semibold ${label === 'Size' ? 'px-2 py-0.5 bg-secondary/10 text-secondary rounded text-xs' : 'capitalize'}`}>{value}</span>
              </div>
            ))}
            {c.color && (
              <div className="flex justify-between items-center py-1.5">
                <span className="text-xs text-text/50 font-light">Color</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded border border-secondary/10" style={{ backgroundColor: c.color }} />
                  <span className="font-mono text-xs text-text/70">{c.color}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Measurements ── */}
        {hasMeasurements ? (
          <div className="bg-primary rounded-lg border border-green-500/20 p-4">
            <h5 className="font-polysans tracking-tight font-bold text-sm text-green-900 mb-3 flex items-center gap-2">
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
                <div key={label} className="bg-green-500/10 border border-green-500/15 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-green-700 uppercase font-semibold tracking-wide">{label}</p>
                  <p className="font-polysans font-bold text-green-800 text-sm">{value}"</p>
                </div>
              ))}
            </div>
            {measurements.customNotes && (
              <div className="mt-2.5 p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-800">
                <span className="font-semibold">Notes: </span>{measurements.customNotes}
              </div>
            )}
          </div>
        ) : (
          hasZoneColors && (
            <div className="bg-primary rounded-lg border border-purple-300/20 p-4">
              <h5 className="font-polysans tracking-tight font-bold text-sm text-text mb-3 flex items-center gap-2">
                <Palette size={14} className="text-secondary" /> Zone Colors
              </h5>
              <div className="flex flex-wrap gap-2">
                {Object.entries(canvas.zoneColors).map(([zone, color]) => (
                  <div key={zone} className="flex items-center gap-1.5 bg-primary border border-secondary/10 rounded-full px-2.5 py-1 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full border border-secondary/10 flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="capitalize text-text/75 font-semibold text-[11px]">{zone}</span>
                    <span className="font-mono text-text/40 text-[10px]">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* ── Zone colors (only if measurements were already shown above) ── */}
      {hasMeasurements && hasZoneColors && (
        <div className="bg-primary rounded-lg border border-purple-300/20 p-4">
          <h5 className="font-polysans tracking-tight font-bold text-sm text-text mb-3 flex items-center gap-2">
            <Palette size={14} className="text-secondary" /> Zone Colors
          </h5>
          <div className="flex flex-wrap gap-2">
            {Object.entries(canvas.zoneColors).map(([zone, color]) => (
              <div key={zone} className="flex items-center gap-1.5 bg-primary border border-secondary/10 rounded-full px-2.5 py-1 text-xs">
                <div className="w-2.5 h-2.5 rounded-full border border-secondary/10 flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="capitalize text-text/75 font-semibold text-[11px]">{zone}</span>
                <span className="font-mono text-text/40 text-[10px]">{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Embroidery ── */}
      {hasEmbroidery && (
        <div className="bg-primary rounded-lg border border-purple-300/20 p-4">
          <h5 className="font-polysans tracking-tight font-bold text-sm text-text mb-3">Embroidery Details</h5>
          <div className="space-y-1.5">
            {canvas.embroideryMetadata.map((emb, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs bg-purple-500/10 border border-purple-500/15 rounded-lg px-3 py-2">
                <span className="text-text/60 font-semibold">{emb.zoneName}</span>
                <span className="font-bold text-purple-800">{emb.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Prints ── */}
      {hasPrints && (
        <div className="bg-primary rounded-lg border border-purple-300/20 p-4">
          <h5 className="font-polysans tracking-tight font-bold text-sm text-text mb-3">Print Details</h5>
          <div className="space-y-1.5">
            {canvas.printMetadata.map((print, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs bg-pink-500/10 border border-pink-500/15 rounded-lg px-3 py-2">
                <span className="text-text/60 font-semibold">{print.zoneName}</span>
                <span className="font-bold text-pink-800">{print.type || print.fit || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Design Notes / AI Prompt / Special Instructions ── */}
      {(c.designNotes || c.aiPrompt || c.specialInstructions) && (
        <div className="space-y-3">
          {c.designNotes && (
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-4 text-xs">
              <h5 className="text-[10px] font-bold text-amber-900 flex items-center gap-2 mb-1.5 uppercase tracking-wider">
                <MessageSquare size={12} /> Design Notes
              </h5>
              <p className="text-sm text-amber-800 leading-relaxed font-light">{c.designNotes}</p>
            </div>
          )}
          {c.aiPrompt && (
            <div className="bg-purple-500/5 border border-purple-500/15 rounded-lg p-4 text-xs">
              <h5 className="text-[10px] font-bold text-purple-900 flex items-center gap-2 mb-1.5 uppercase tracking-wider">
                <Sparkles size={12} /> AI Prompt
              </h5>
              <p className="text-sm text-purple-800 leading-relaxed font-light">{c.aiPrompt}</p>
            </div>
          )}
          {c.specialInstructions && (
            <div className="bg-secondary/5 border border-secondary/15 rounded-lg p-4 text-xs">
              <h5 className="text-[10px] font-bold text-secondary flex items-center gap-2 mb-1.5 uppercase tracking-wider">
                <Info size={12} /> Special Instructions
              </h5>
              <p className="text-sm text-text/70 leading-relaxed font-light">{c.specialInstructions}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Reference Images ── */}
      {Array.isArray(c.referenceImages) && c.referenceImages.length > 0 && (
        <div className="bg-primary rounded-lg border border-purple-300/20 p-4">
          <h5 className="font-polysans tracking-tight font-bold text-sm text-text mb-3 flex items-center gap-2">
            <ImageIcon size={14} className="text-secondary" />
            Reference Images ({c.referenceImages.length})
          </h5>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {c.referenceImages.map((img, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-secondary/10">
                <img src={img} alt={`Ref ${idx + 1}`} className="w-full h-24 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => window.open(img, '_blank')} className="p-1.5 bg-white rounded-full shadow-sm text-text hover:text-secondary transition-colors">
                    <Eye size={12} />
                  </button>
                </div>
              </div>
            ))}
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
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        setAuthError(true);
        toast.error('Authentication failed. Please log in again.');
      }
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-primary rounded-lg border border-secondary/25 p-8 max-w-md w-full text-center shadow-lg font-inter">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-polysans tracking-tight font-bold text-text mb-2">Authentication Required</h2>
          <p className="text-sm text-text/60 font-light mb-6">Your session has expired. Please log in again.</p>
          <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('adminToken'); window.location.reload(); }} className="px-6 py-2.5 bg-secondary text-primary rounded-full hover:bg-secondary/95 transition-all font-semibold shadow-sm">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 px-4 sm:px-6 lg:px-8 font-inter">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-polysans tracking-tight font-bold text-text mb-2">Order Management</h1>
            <p className="text-text/50 font-light text-sm">Track, manage, and update all customer orders from one dashboard</p>
          </div>

          {/* Stats */}
          <div className="bg-primary rounded-lg border border-secondary/15 shadow-sm mb-6">
            <div className="p-6 border-b border-secondary/10 bg-background/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <BarChart3 size={18} className="text-secondary" />
                </div>
                <div>
                  <h2 className="text-lg font-polysans tracking-tight font-bold text-text">Order Statistics</h2>
                  <p className="text-xs text-text/50 font-light">Overview of all orders</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Total Orders',  value: stats.total,        icon: ShoppingBag,  bg: 'bg-secondary/5',    border: 'border-secondary/10',    ibg: 'bg-secondary/10',    ic: 'text-text',    vc: 'text-text'    },
                  { label: 'Pending',       value: stats.pending,      icon: Clock,        bg: 'bg-yellow-500/5',  border: 'border-yellow-500/10',  ibg: 'bg-yellow-500/10',  ic: 'text-yellow-700',  vc: 'text-yellow-700'  },
                  { label: 'Processing',    value: stats.processing,   icon: Package,      bg: 'bg-blue-500/5',  border: 'border-blue-500/10',  ibg: 'bg-blue-500/10',  ic: 'text-blue-700',  vc: 'text-blue-700'  },
                  { label: 'Delivered',     value: stats.delivered,    icon: PackageCheck, bg: 'bg-green-500/5',   border: 'border-green-500/10',   ibg: 'bg-green-500/10',   ic: 'text-green-700',   vc: 'text-green-700'   },
                  { label: 'Custom Orders', value: stats.customOrders, icon: Sparkles,     bg: 'bg-purple-500/5',    border: 'border-purple-500/10',    ibg: 'bg-purple-500/10',    ic: 'text-purple-700',    vc: 'text-purple-700'    },
                ].map(({ label, value, icon: Icon, bg, border, ibg, ic, vc }) => (
                  <div key={label} className={`text-center p-4 ${bg} rounded-lg border ${border}`}>
                    <div className={`w-9 h-9 ${ibg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <Icon className={ic} size={16} />
                    </div>
                    <p className="text-xs text-text/60 font-light mb-1">{label}</p>
                    <p className={`text-xl font-polysans tracking-tight font-bold ${vc}`}>{value}</p>
                  </div>
                ))}
                <div className="text-center p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/15">
                  <div className="w-9 h-9 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="text-emerald-700" size={16} />
                  </div>
                  <p className="text-xs text-text/60 font-light mb-1">Revenue</p>
                  <div className="flex items-center justify-center gap-0.5">
                    <IndianRupee size={12} className="text-emerald-700" />
                    <span className="text-lg font-polysans tracking-tight font-bold text-emerald-700">{stats.revenue.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-primary rounded-lg border border-secondary/15 shadow-sm mb-6">
            <div className="p-6 border-b border-secondary/10 bg-background/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Search size={18} className="text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-polysans tracking-tight font-bold text-text">Search & Filter</h2>
                    <p className="text-xs text-text/50 font-light">Find orders quickly</p>
                  </div>
                </div>
                <button onClick={fetchAllOrders} disabled={loading} className="flex items-center gap-1.5 px-4 py-1.5 bg-secondary/10 text-text border border-secondary/15 rounded-full hover:bg-secondary/20 transition-all disabled:opacity-50 font-semibold text-xs">
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-text/70 mb-2 uppercase tracking-wide">Search Orders</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={16} />
                    <input type="text" placeholder="Search by customer, phone, product, or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-secondary bg-primary text-sm text-text font-light" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text/70 mb-2 uppercase tracking-wide">Order Status</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={16} />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-secondary bg-primary text-sm text-text cursor-pointer appearance-none font-semibold">
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
                  <label className="block text-xs font-semibold text-text/70 mb-2 uppercase tracking-wide">Payment Status</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={16} />
                    <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-secondary bg-primary text-sm text-text cursor-pointer appearance-none font-semibold">
                      <option value="">All Payments</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-secondary/10">
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-text/60 font-light">
                    Showing {currentItems.length} of {filteredOrders.length} orders
                    {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                  </div>
                  {(searchTerm || statusFilter || paymentFilter) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {searchTerm    && <span className="px-3 py-1 bg-secondary/10 text-text border border-secondary/15 text-xs font-semibold rounded-full">Search: "{searchTerm}"</span>}
                      {statusFilter  && <span className="px-3 py-1 bg-secondary/10 text-text border border-secondary/15 text-xs font-semibold rounded-full">Status: {statusFilter}</span>}
                      {paymentFilter && <span className="px-3 py-1 bg-secondary/10 text-text border border-secondary/15 text-xs font-semibold rounded-full">Payment: {paymentFilter === 'paid' ? 'Paid' : 'Pending'}</span>}
                      <button onClick={clearAllFilters} className="px-3 py-1 bg-red-500/10 text-red-600 border border-red-500/20 text-xs font-semibold rounded-full hover:bg-red-500/20 transition-colors">Clear All</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-primary rounded-lg border border-secondary/15 shadow-sm">
            <div className="p-6 border-b border-secondary/10 bg-background/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <ShoppingBag size={18} className="text-secondary" />
                </div>
                <div>
                  <h2 className="text-lg font-polysans tracking-tight font-bold text-text">Customer Orders</h2>
                  <p className="text-xs text-text/50 font-light">Complete order details with customization breakdowns</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-text/60 font-light">Loading orders…</span>
                  </div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="text-text/30" size={32} />
                  </div>
                  <h3 className="text-xl font-polysans tracking-tight font-bold text-text mb-2">No orders found</h3>
                  <p className="text-sm text-text/50 font-light max-w-md mx-auto mb-6">
                    {orders.length === 0 ? "Your store hasn't received any orders yet" : "Try adjusting your search or filters"}
                  </p>
                  {(searchTerm || statusFilter || paymentFilter) && (
                    <button onClick={clearAllFilters} className="px-6 py-2.5 bg-secondary text-primary font-semibold rounded-full hover:bg-secondary/95 shadow-sm text-xs">
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
                          className={`bg-primary rounded-lg border overflow-hidden hover:border-secondary/35 transition-all shadow-sm ${hasCustomItems ? 'border-purple-300/40 hover:border-purple-400' : 'border-secondary/15'}`}
                        >
                          {/* Order header */}
                          <div className={`p-6 border-b border-secondary/10 ${hasCustomItems ? 'bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-b border-purple-300/10' : 'bg-background/25'}`}>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasCustomItems ? 'bg-purple-500/10' : 'bg-secondary/10'}`}>
                                  {hasCustomItems ? <Sparkles size={20} className="text-purple-600" /> : <ShoppingBag size={20} className="text-secondary" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-polysans tracking-tight font-bold text-text">Order #{indexOfFirstItem + index + 1}</h3>
                                    {hasCustomItems && <span className="px-2 py-0.5 bg-secondary text-primary rounded-full text-[10px] font-bold tracking-wider">CUSTOM</span>}
                                  </div>
                                  <p className="text-xs text-text/50 font-light mt-1">
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
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-text/60 flex items-center gap-2 mb-4">
                                <Package size={14} /> Order Items ({order.items.length})
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => {
                                  const panelKey  = `${order._id}-${idx}`;
                                  const isPanelOpen = !!expandedCustomization[panelKey];

                                  return (
                                    <div key={idx}>
                                      <div className={`flex items-start gap-4 p-4 rounded-lg border ${item.type === 'CUSTOM' ? 'bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-300/15' : 'bg-background/20 border-secondary/10'}`}>
                                        {/* Image */}
                                        <div className="flex-shrink-0 bg-primary border border-secondary/10 p-1 rounded-lg w-20 h-20 flex items-center justify-center">
                                          {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain rounded-md" onError={(e) => { e.target.style.display = 'none'; }} />
                                          ) : (
                                            <div className="w-full h-full rounded-md flex items-center justify-center bg-background/30 text-text/40">
                                              {item.type === 'CUSTOM' ? <Palette size={20} className="text-purple-600" /> : <Package size={20} className="" />}
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          {item.type === 'CUSTOM' && (
                                            <div className="flex items-center gap-2 mb-2">
                                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-primary rounded-full text-[9px] font-bold tracking-wider">CUSTOM</span>
                                              <ProductionStatusBadge status={item.productionStatus} />
                                            </div>
                                          )}

                                          <p className="font-polysans tracking-tight font-bold text-text text-sm mb-1">{item.name}</p>

                                          <div className="flex flex-wrap items-center gap-3 text-xs text-text/50 font-light mb-2">
                                            <span>Qty: <span className="font-semibold text-text">{item.quantity}</span></span>
                                            <span>•</span>
                                            <span>Size: <span className="font-semibold text-text">{item.customization?.size || item.size || '—'}</span></span>
                                            <span>•</span>
                                            <div className="flex items-center gap-0.5 font-semibold text-secondary">
                                              <IndianRupee size={12} />{(item.finalPrice || item.basePrice || 0).toLocaleString()}
                                            </div>
                                          </div>

                                          {/* Regular item style tags */}
                                          {item.type !== 'CUSTOM' && (item.neckStyle || item.sleeveStyle || item.specialInstructions) && (
                                            <div className="mt-2 p-2.5 bg-background/30 border border-secondary/10 rounded-lg space-y-2">
                                              <div className="flex flex-wrap gap-1.5">
                                                {item.neckStyle && <span className="text-[10px] bg-purple-500/10 text-purple-700 px-2 py-0.5 rounded-full font-semibold capitalize">{item.neckStyle} neck</span>}
                                                {item.sleeveStyle && <span className="text-[10px] bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded-full font-semibold capitalize">{item.sleeveStyle} sleeve</span>}
                                                {item.specialInstructions && <span className="text-[10px] bg-amber-500/10 text-amber-800 px-2 py-0.5 rounded-full font-semibold">📝 Note</span>}
                                              </div>
                                              {item.specialInstructions && (
                                                <div className="px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-800 leading-relaxed font-light">
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
                                                {item.customization?.fabric && <span className="text-[10px] bg-background/40 text-text/75 px-2 py-0.5 rounded-full font-semibold">{item.customization.fabric}</span>}
                                                {item.customization?.neckStyle && <span className="text-[10px] bg-purple-500/10 text-purple-700 px-2 py-0.5 rounded-full font-semibold capitalize">{item.customization.neckStyle} neck</span>}
                                                {item.customization?.sleeveStyle && <span className="text-[10px] bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded-full font-semibold capitalize">{item.customization.sleeveStyle} sleeve</span>}
                                                {item.customization?.measurements && Object.values(item.customization.measurements).some(v => v) && (
                                                  <span className="text-[10px] bg-green-500/10 text-green-700 px-2 py-0.5 rounded-full font-semibold">📐 Custom measurements</span>
                                                )}
                                              </div>

                                              {/* Production status + toggle */}
                                              <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                  <select
                                                    value={item.productionStatus}
                                                    onChange={(e) => updateProductionStatus(order._id, idx, e.target.value)}
                                                    className="w-full px-3 py-1.5 text-xs border border-purple-300/30 rounded-lg focus:outline-none focus:border-purple-500 bg-primary font-semibold text-text appearance-none cursor-pointer"
                                                  >
                                                    <option value="DESIGNING">Designing</option>
                                                    <option value="CUTTING">Cutting</option>
                                                    <option value="STITCHING">Stitching</option>
                                                    <option value="QC">QC</option>
                                                    <option value="READY">Ready</option>
                                                  </select>
                                                </div>

                                                <button
                                                  onClick={() => toggleCustomizationPanel(order._id, idx)}
                                                  className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                                                    isPanelOpen
                                                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                                      : 'bg-primary text-purple-700 border-purple-300/30 hover:bg-purple-500/5'
                                                  }`}
                                                >
                                                  <Sparkles size={11} />
                                                  {isPanelOpen ? 'Hide Details' : 'Customization Details'}
                                                  {isPanelOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
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
                              <div className="bg-background/25 rounded-lg p-4 border border-secondary/10">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-text/60 flex items-center gap-2 mb-2.5"><User size={14} />Customer Information</h4>
                                <p className="font-polysans font-bold text-text text-sm">{order.address.Name}</p>
                                <div className="flex items-center gap-2 text-text/60 font-light mt-1 text-xs">
                                  <Phone size={12} /><span>{order.address.phone}</span>
                                </div>
                              </div>
                              <div className="bg-background/25 rounded-lg p-4 border border-secondary/10">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-text/60 flex items-center gap-2 mb-2.5"><MapPin size={14} />Delivery Address</h4>
                                <div className="space-y-0.5 text-xs text-text/60 font-light">
                                  <p>{order.address.street}</p>
                                  <p>{order.address.city}, {order.address.country}</p>
                                  <p className="font-semibold text-text mt-1">PIN: {order.address.pincode}</p>
                                </div>
                              </div>
                            </div>

                            {/* Payment / Amount / Status update */}
                            <div className={`grid grid-cols-1 gap-4 ${order.paymentMethod === 'QR' && order.transactionId ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                              <div className="bg-background/25 rounded-lg p-4 border border-secondary/10">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-text/60 flex items-center gap-2 mb-2.5"><CreditCard size={14} />Payment Status</h4>
                                <PaymentBadge payment={order.payment} paymentMethod={order.paymentMethod} />
                              </div>
                              {order.paymentMethod === 'QR' && order.transactionId && (
                                <TransactionIdDisplay transactionId={order.transactionId} />
                              )}
                              <div className="bg-background/25 rounded-lg p-4 border border-secondary/10">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-text/60 flex items-center gap-2 mb-2.5"><IndianRupee size={14} />Total Amount</h4>
                                <div className="flex items-center gap-0.5">
                                  <IndianRupee size={18} className="text-secondary" />
                                  <span className="text-2xl font-polysans tracking-tight font-bold text-secondary">{order.amount}</span>
                                </div>
                              </div>
                              <div className="bg-background/25 rounded-lg p-4 border border-secondary/10">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-text/60 flex items-center gap-2 mb-2.5"><Package2 size={14} />Update Status</h4>
                                <div className="relative">
                                  <select onChange={(e) => statusHandler(e, order._id)} value={order.status} className="w-full px-3 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:border-secondary bg-primary text-sm font-semibold text-text appearance-none cursor-pointer">
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
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                      <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-full border border-secondary/15 hover:bg-background/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        <ChevronLeft size={16} />
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