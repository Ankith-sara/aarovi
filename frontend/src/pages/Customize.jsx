import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import DesignCanvas from "../components/DesignCanvas";
import SizeChartModal from "../components/SizeChartModal";
import {
  Save, ShoppingCart, Upload, CheckCircle2, Ruler, Palette,
  Shirt, ArrowRight, IndianRupee, ArrowLeft, Info, PlayCircle
} from "lucide-react";

// Size config
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

// Map dress type → YouTube video ID for "how to measure" reference
const MEASURE_VIDEOS = 'cvxiSk5dH3U'

// Sub-components 
const SizeButton = ({ size, selected, onClick }) => (
  <button
    onClick={() => onClick(size)}
    className={`
      relative px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 select-none
      ${selected
        ? 'bg-secondary text-white border-secondary shadow-md scale-105'
        : 'bg-white text-text/70 border-gray-200 hover:border-secondary hover:text-secondary hover:scale-105'
      }
    `}
  >
    {size}
    {selected && (
      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
        <CheckCircle2 size={10} className="text-white" />
      </span>
    )}
  </button>
);

const VideoModal = ({ videoId, title, onClose }) => (
  <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-secondary/10 rounded-full flex items-center justify-center">
            <PlayCircle size={18} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-text">How to Measure</h2>
            <p className="text-xs text-text/50 font-light">{title}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600 leading-none px-2">×</button>
      </div>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
          title="How to measure"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="px-6 py-3 bg-gray-50 text-center">
        <p className="text-xs text-text/50 font-light">Reference video — your garment will be stitched to your selected size's standard measurements.</p>
      </div>
    </div>
  </div>
);

// Main Component 
const Customize = () => {
  const { saveCustomization, addCustomizationToCart, token, navigate } = useContext(ShopContext);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    gender: "",
    dressType: "",
    fabric: "",
    color: "#ffffff",
    size: "",       
    neckStyle: "",       
    sleeveStyle: "",     
    designNotes: "",
    aiPrompt: "",
    referenceImages: [],
    canvasDesign: {
      json: "", svg: "", png: "", backgroundImage: "",
      neckStyle: "", sleeveStyle: "", embroideryMetadata: []
    },
    aiGeneratedDesign: null
  });

  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Modals
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Pricing 
  const PRICING_MATRIX = {
    "Kurti": { "Cotton": [700, 1000], "Silk": [800, 1200], "Georgette": [700, 1000], "Kota": [800, 1200], "Chiffon": [900, 1400], "Crape": [800, 1200], "Lenin": [900, 1400], "Chanderi": [900, 1600], "Banarasi": [1400, 1800] },
    "Short Kurti": { "Cotton": [700, 1000], "Silk": [800, 1200], "Georgette": [700, 1000], "Kota": [800, 1200], "Chiffon": [900, 1400], "Crape": [800, 1200], "Lenin": [900, 1400], "Chanderi": [900, 1600], "Banarasi": [1400, 1800] },
    "Kurti Sets": { "Cotton": [1000, 1300], "Silk": [1000, 1200], "Georgette": [1000, 1400], "Kota": [1000, 1500], "Chiffon": [1300, 1700], "Crape": [1000, 1500], "Lenin": [1300, 1700], "Chanderi": [1400, 1900], "Banarasi": [1800, 2500] },
    "Kurta": { "Cotton": [700, 1000], "Raw Silk": [800, 1200], "Lenin": [900, 1400], "Velvet": [800, 1200], "Banarasi": [1400, 1800] },
    "Short Kurta": { "Cotton": [700, 1000], "Raw Silk": [800, 1200], "Lenin": [900, 1400], "Velvet": [800, 1200], "Banarasi": [1400, 1800] },
    "Kurta Sets": { "Cotton": [1000, 1300], "Raw Silk": [1000, 1200], "Lenin": [1300, 1700], "Velvet": [1000, 1500], "Banarasi": [1800, 2500] },
    "Lehenga": { "Banarasi": [5000, 7000], "Georgette": [3000, 4500], "Chiffon": [2800, 4000], "Crape": [3000, 4600], "Tissue": [2900, 4000], "Pattu": [4900, 10000] },
    "Anarkali": { "Georgette": [3500, 4800], "Chiffon": [2300, 3600], "Crape": [1800, 2500], "Tissue": [1800, 3000], "Pattu": [3900, 5000], "Banarasi": [3800, 5000], "Cotton": [2300, 3500] },
    "Sherwani": { "Raw Silk": [1000, 2500], "Velvet": [2500, 4000], "Banarasi": [4500, 6800] },
    "Sheraras": { "Georgette": [2000, 3000], "Banarasi": [4000, 5000], "Silk": [2200, 3400], "Chiffon": [2000, 4000], "Crape": [2500, 3600] },
  };

  // Returns [min, max] or null
  const calculatePrice = () => {
    if (!form.dressType || !form.fabric) return null;
    return PRICING_MATRIX[form.dressType]?.[form.fabric] || null;
  };

  const formatRange = (range) => {
    if (!range) return '';
    return '₹' + range[0].toLocaleString() + ' – ₹' + range[1].toLocaleString();
  };

  // Dress / Fabric options
  const dressTypes = {
    Women: [
      { value: "Kurti", label: "Kurti" },
      { value: "Short Kurti", label: "Short Kurti" },
      { value: "Kurti Sets", label: "Kurti Sets" },
      { value: "Lehenga", label: "Lehenga" },
      { value: "Sheraras", label: "Sheraras" },
      { value: "Anarkali", label: "Anarkali" }
    ],
    Men: [
      { value: "Kurta", label: "Kurta" },
      { value: "Short Kurta", label: "Short Kurta" },
      { value: "Kurta Sets", label: "Kurta Sets" },
      { value: "Sherwani", label: "Sherwani" }
    ]
  };

  const fabricOptions = {
    "Kurti": [{ value: "Cotton", label: "Cotton" }, { value: "Silk", label: "Silk" }, { value: "Georgette", label: "Georgette" }, { value: "Kota", label: "Kota"}, { value: "Chiffon", label: "Chiffon"}, { value: "Crape", label: "Crape"}, { value: "Lenin", label: "Lenin" }, { value: "Chanderi", label: "Chanderi" }, { value: "Banarasi", label: "Banarasi"}],
    "Short Kurti": [{ value: "Cotton", label: "Cotton" }, { value: "Silk", label: "Silk" }, { value: "Georgette", label: "Georgette" }, { value: "Kota", label: "Kota"}, { value: "Chiffon", label: "Chiffon"}, { value: "Crape", label: "Crape"}, { value: "Lenin", label: "Lenin" }, { value: "Chanderi", label: "Chanderi" }, { value: "Banarasi", label: "Banarasi"}],
    "Kurti Sets": [{ value: "Cotton", label: "Cotton" }, { value: "Silk", label: "Silk" }, { value: "Georgette", label: "Georgette" }, { value: "Kota", label: "Kota"}, { value: "Chiffon", label: "Chiffon"}, { value: "Crape", label: "Crape"}, { value: "Lenin", label: "Lenin" }, { value: "Chanderi", label: "Chanderi" }, { value: "Banarasi", label: "Banarasi"}],
    "Sheraras": [{ value: "Georgette", label: "Georgette" }, { value: "Banarasi", label: "Banaras" }, { value: "Silk", label: "Silk" }, { value: "Chiffon", label: "Chiffon"}, { value: "Crape", label: "Crape"}],
    "Lehenga": [{ value: "Banarasi", label: "Banaras" }, { value: "Georgette", label: "Georgette", }, { value: "Chiffon", label: "Chiffon" }, { value: "Crape", label: "Crape"}, { value: "Tissue", label: "Tissue"}, { value: "Pattu", label: "Pattu" }],
    "Anarkali": [{ value: "Georgette", label: "Georgette" }, { value: "Chiffon", label: "Chiffon" }, { value: "Crape", label: "Crape" }, { value: "Tissue", label: "Tissue"}, { value: "Pattu", label: "Pattu"}, { value: "Banarasi", label: "Banarasi" }, { value: "Cotton", label: "Cotton" }],
    "Kurta": [{ value: "Cotton", label: "Cotton" }, { value: "Raw Silk", label: "Raw Silk" }, { value: "Lenin", label: "Lenin" }, { value: "Velvet", label: "Velvet"}, { value: "Banarasi", label: "Banarasi"}],
    "Short Kurta": [{ value: "Cotton", label: "Cotton" }, { value: "Raw Silk", label: "Raw Silk" }, { value: "Lenin", label: "Lenin" }, { value: "Velvet", label: "Velvet"}, { value: "Banarasi", label: "Banarasi"}],
    "Kurta Sets": [{ value: "Cotton", label: "Cotton" }, { value: "Raw Silk", label: "Raw Silk" }, { value: "Lenin", label: "Lenin" }, { value: "Velvet", label: "Velvet"}, { value: "Banarasi", label: "Banarasi"}],
    "Sherwani": [{ value: "Raw Silk", label: "Raw Silk" }, { value: "Velvet", label: "Velvet" }, { value: "Banarasi", label: "Banarasi" }]
  };

  const getAvailableFabrics = () => fabricOptions[form.dressType] || [];

  // Touch swipe 
  const minSwipeDistance = 50;
  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => { setTouchEnd(e.targetTouches[0].clientX); };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && step < 3 && validateStep(step)) setStep(step + 1);
    if (distance < -minSwipeDistance && step > 1) setStep(step - 1);
  };

  // Handlers
  const handleDesignChange = (designData) => {
    setForm({
      ...form,
      canvasDesign: designData,
      color: designData.color,
      neckStyle: designData.neckStyle || form.neckStyle || '',
      sleeveStyle: designData.sleeveStyle || form.sleeveStyle || '',
    });
  };

  const handleGenderChange = (gender) => {
    setForm({ ...form, gender, dressType: "", fabric: "", size: "" });
  };

  const handleDressTypeChange = (dressType) => {
    setForm({ ...form, dressType, fabric: "", size: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) { toast.error("Maximum 5 images allowed"); return; }
    try {
      const base64Images = await Promise.all(
        files.map(file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }))
      );
      setForm({ ...form, referenceImages: base64Images });
      toast.success(`${files.length} image(s) uploaded`);
    } catch (err) {
      toast.error("Failed to upload images");
    }
  };

  const handleAIGenerate = async () => {
    if (!form.aiPrompt.trim()) { toast.error("Please enter a design description"); return; }
    try {
      setAiGenerating(true);
      toast.info("AI is generating your design...");
      const response = await fetch("/api/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: form.aiPrompt, dressType: form.dressType, fabric: form.fabric, gender: form.gender }),
      });
      if (response.ok) {
        const data = await response.json();
        const design = JSON.parse(data.structuredDesign || '{}');
        if (design.colorPalette?.[0]) setForm(prev => ({ ...prev, color: design.colorPalette[0] }));
        setForm(prev => ({ ...prev, designNotes: design.tailorNotes || form.aiPrompt, aiGeneratedDesign: design }));
        toast.success("AI design generated successfully");
      } else {
        throw new Error("AI generation failed");
      }
    } catch (err) {
      setForm(prev => ({ ...prev, designNotes: form.aiPrompt }));
      toast.info("Design description added to notes");
    } finally {
      setAiGenerating(false);
    }
  };

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      if (!form.gender) { toast.error("Please select gender"); return false; }
      if (!form.dressType) { toast.error("Please select dress type"); return false; }
      if (!form.fabric) { toast.error("Please select fabric"); return false; }
      return true;
    }
    if (stepNum === 2) {
      if (!form.color) { toast.error("Please select a color"); return false; }
      return true;
    }
    return true;
  };

  const validateSize = () => {
    if (!form.size) { toast.error("Please select a size to add to cart"); return false; }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!token) { toast.error("Please login to save"); navigate("/login"); return; }
    try {
      setLoading(true);
      const result = await saveCustomization({ ...form, estimatedPrice: (() => { const r = calculatePrice(); return r ? r[0] : 0; })() });
      if (result) toast.success("Customization saved as draft");
    } catch (err) {
      toast.error("Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) { toast.error("Please login to add to cart"); navigate("/login"); return; }
    if (!validateSize()) return;
    try {
      setLoading(true);
      const customizationData = { ...form, estimatedPrice: (() => { const r = calculatePrice(); return r ? r[0] : 0; })(), status: "Ready for Cart" };
      const result = await saveCustomization(customizationData);
      if (result?._id) {
        const added = await addCustomizationToCart(result);
        if (added) { toast.success("Custom design added to cart"); navigate("/cart"); }
      }
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const estimatedPrice = calculatePrice();
  const videoId = MEASURE_VIDEOS;

  // ── Render 

  return (
    <div className="mt-12 sm:mt-16 min-h-screen bg-gradient-to-b from-white via-background/5 to-white pb-8">
      {/* Hero */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-4 leading-tight">
            Design Your Custom Outfit
          </h1>
          <p className="text-base sm:text-lg text-text/60 font-light leading-relaxed max-w-2xl mx-auto">
            Create a personalised piece that reflects your style with expert craftsmanship
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Step indicator */}
        <div className="mb-8 sm:mb-12 bg-white rounded-xl shadow-md border border-background/20 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Basic Details", icon: Shirt },
              { num: 2, label: "Design & Colors", icon: Palette },
              { num: 3, label: "Size & Notes", icon: Ruler }
            ].map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isCompleted = step > s.num;
              return (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${isActive ? "bg-secondary text-white shadow-lg" : isCompleted ? "bg-green-500 text-white shadow-md" : "bg-gray-100 text-gray-400 border-2 border-gray-200"}`}>
                      {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                    </div>
                    <span className={`text-xs sm:text-sm mt-3 font-semibold text-center transition-colors ${step >= s.num ? "text-text" : "text-text/40"}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className="hidden sm:block flex-1 h-0.5 mx-4 transition-all duration-300" style={{ backgroundColor: step > s.num ? '#10b981' : step === s.num ? 'var(--secondary)' : '#e5e7eb' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-lg border border-background/20 overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* ── STEP 1: Basic Details ── */}
          {step === 1 && (
            <div className="p-6 sm:p-10 lg:p-12 space-y-8 sm:space-y-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Step 1 of 3</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-3">Select Your Preferences</h2>
                <p className="text-sm sm:text-base text-text/60 font-light max-w-2xl mx-auto">Choose your style essentials to begin customisation</p>
              </div>

              {/* Gender */}
              <div>
                <label className="flex items-center gap-3 font-bold text-base sm:text-lg mb-5 text-text">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center"><span className="text-secondary font-bold text-sm">1</span></div>
                  Select Gender <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                  {["Women", "Men"].map((gender) => (
                    <button key={gender} onClick={() => handleGenderChange(gender)}
                      className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${form.gender === gender ? "border-secondary bg-background/20 shadow-md" : "border-gray-200 hover:border-secondary/40 hover:shadow-sm"}`}>
                      <div className="text-center">
                        <div className="font-bold text-lg sm:text-xl text-text">{gender}</div>
                      </div>
                      {form.gender === gender && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-md">
                          <CheckCircle2 size={16} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dress Type */}
              {form.gender && (
                <div className="animate-fadeIn">
                  <label className="flex items-center gap-3 font-bold text-base sm:text-lg mb-5 text-text">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center"><span className="text-secondary font-bold text-sm">2</span></div>
                    Select Dress Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {dressTypes[form.gender].map((dress) => (
                      <button key={dress.value} onClick={() => handleDressTypeChange(dress.value)}
                        className={`p-4 flex flex-row gap-2 justify-center items-center rounded-xl border-2 transition-all duration-300 ${form.dressType === dress.value ? "border-secondary bg-background/20 shadow-md" : "border-gray-200 hover:border-secondary/40 hover:shadow-sm"}`}>
                        {form.dressType === dress.value && <CheckCircle2 size={16} className="text-secondary" />}
                        <div className="font-semibold text-sm text-text text-center">{dress.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fabric */}
              {form.dressType && (
                <div className="animate-fadeIn">
                  <label className="flex items-center gap-3 font-bold text-base sm:text-lg mb-5 text-text">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center"><span className="text-secondary font-bold text-sm">3</span></div>
                    Select Fabric <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {getAvailableFabrics().map((fabric) => {
                      const priceRange = PRICING_MATRIX[form.dressType]?.[fabric.value] || null;
                      return (
                        <button key={fabric.value} onClick={() => setForm({ ...form, fabric: fabric.value })}
                          className={`p-5 rounded-xl border-2 transition-all duration-300 text-left ${form.fabric === fabric.value ? "border-secondary bg-background/20 shadow-md" : "border-gray-200 hover:border-secondary/40 hover:shadow-sm"}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="font-bold text-base text-text">{fabric.label}</div>
                            </div>
                            {form.fabric === fabric.value && <CheckCircle2 size={18} className="text-secondary flex-shrink-0 ml-2" />}
                          </div>
                          {priceRange && (
                            <div className="pt-1 text-secondary font-bold text-sm">
                              {formatRange(priceRange)}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end items-center pt-8 border-t border-gray-200">
                <button onClick={() => { if (validateStep(1)) setStep(2); }}
                  disabled={!form.gender || !form.dressType || !form.fabric}
                  className="group px-8 sm:px-10 py-3 sm:py-4 bg-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                  <span>Continue to Design</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Design & Colors ── */}
          {step === 2 && (
            <div className="p-6 sm:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Step 2 of 3</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-3">Customise Your Design</h2>
                <p className="text-sm sm:text-base text-text/60 font-light max-w-2xl mx-auto">Choose colours and add patterns to different zones of your garment</p>
              </div>

              <DesignCanvas
                onDesignChange={handleDesignChange}
                initialDesign={form.canvasDesign}
                dressType={form.dressType}
                selectedColor={form.color}
                gender={form.gender}
                fabric={form.fabric}
                aiPrompt={form.aiPrompt}
                onAIPromptChange={(value) => setForm({ ...form, aiPrompt: value })}
                onAIGenerate={handleAIGenerate}
                aiGenerating={aiGenerating}
              />

              {form.aiGeneratedDesign && (
                <div className="mt-8 bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-200">
                  <h4 className="font-bold text-base text-purple-900 mb-4 flex items-center gap-2">
                    <Info size={18} className="text-purple-500" />AI Design Suggestions
                  </h4>
                  {form.aiGeneratedDesign.colorPalette && (
                    <div className="mb-4 bg-white rounded-lg p-4 border border-purple-100">
                      <p className="text-sm text-purple-700 font-semibold mb-3">Recommended Colour Palette</p>
                      <div className="flex gap-3">
                        {form.aiGeneratedDesign.colorPalette.map((color, i) => (
                          <button key={i} onClick={() => setForm(prev => ({ ...prev, color }))}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </div>
                  )}
                  {form.aiGeneratedDesign.tailorNotes && (
                    <div className="text-sm text-purple-700 bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <strong className="block mb-1">Tailor Notes:</strong>{form.aiGeneratedDesign.tailorNotes}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button onClick={() => setStep(1)} className="px-6 sm:px-8 py-3 border-2 border-secondary text-secondary rounded-lg hover:bg-secondary/5 transition-all font-semibold flex items-center gap-2">
                  <ArrowLeft size={18} /><span>Back</span>
                </button>
                <button onClick={() => { if (validateStep(2)) setStep(3); }}
                  className="group px-8 sm:px-10 py-3 bg-secondary text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold">
                  <span>Continue</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Size & Notes ── */}
          {step === 3 && (
            <div className="p-6 sm:p-10 lg:p-12 space-y-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Step 3 of 3</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-3">Size & Final Details</h2>
                <p className="text-sm sm:text-base text-text/60 font-light max-w-2xl mx-auto">
                  Pick your size, add reference images and any design notes
                </p>
              </div>

              {/* ── SIZE SELECTOR ── */}
              <div className="rounded-2xl border-2 border-secondary/20 bg-gradient-to-br from-background/10 to-white p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Ruler size={20} className="text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-text">
                        Select Size <span className="text-red-500 text-sm">*</span>
                      </h3>
                      <p className="text-xs text-text/50 font-light">Required to add to cart</p>
                    </div>
                  </div>

                  {/* Help buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setShowSizeChart(true)}
                      className="flex items-center gap-2 text-sm font-semibold text-secondary border-2 border-secondary rounded-lg px-4 py-2 hover:bg-secondary/10 transition-all"
                    >
                      <Info size={15} />
                      Size Chart
                    </button>
                    {form.dressType && (
                      <button
                        onClick={() => setShowVideo(true)}
                        className="flex items-center gap-2 text-sm font-semibold text-white bg-secondary rounded-lg px-4 py-2 hover:bg-secondary/80 transition-all shadow-sm"
                      >
                        <PlayCircle size={15} />
                        How to measure
                      </button>
                    )}
                  </div>
                </div>

                {/* Size pills */}
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-4">
                  {SIZE_ORDER.map(size => (
                    <SizeButton
                      key={size}
                      size={size}
                      selected={form.size === size}
                      onClick={(s) => setForm({ ...form, size: form.size === s ? '' : s })}
                    />
                  ))}
                </div>

                {form.size ? (
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                    <span>Size <strong>{form.size}</strong> selected — your garment will be stitched to our standard {form.size} measurements.</span>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    <Info size={16} className="text-amber-600 flex-shrink-0" />
                    <span>Not sure of your size? Click <strong>Size Chart</strong> or watch the <strong>How to measure</strong> video above.</span>
                  </div>
                )}
              </div>

              {/* ── REFERENCE IMAGES ── */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <label className="flex items-center gap-3 font-bold text-base mb-4 text-text">
                  <Upload size={20} className="text-secondary" />
                  <span>Reference Images</span>
                  <span className="text-sm text-text/50 font-normal">(Optional, Max 5)</span>
                </label>
                <p className="text-sm text-text/60 mb-4">Upload images of designs you like for inspiration</p>
                <input type="file" multiple accept="image/*" onChange={handleImageChange}
                  className="block w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 focus:border-secondary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-secondary file:text-white file:font-semibold hover:file:bg-secondary/90 cursor-pointer text-sm bg-white" />
                {form.referenceImages.length > 0 && (
                  <div className="mt-5 grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {form.referenceImages.map((img, idx) => (
                      <div key={idx} className="group relative">
                        <img src={img} alt={`Reference ${idx + 1}`} className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200 group-hover:shadow-md transition-shadow" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── DESIGN NOTES ── */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <label className="flex items-center gap-3 font-bold text-base mb-4 text-text">
                  <Info size={20} className="text-secondary" />
                  <span>Design Notes & Special Instructions</span>
                  <span className="text-sm text-text/50 font-normal">(Optional)</span>
                </label>
                <textarea name="designNotes" value={form.designNotes}
                  placeholder="Share your vision: embroidery preferences, colour combinations, traditional or modern look, special occasions, or any specific requirements"
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 h-32 focus:border-secondary focus:outline-none transition-all resize-none text-sm"
                  rows="4" />
              </div>

              {/* ── PRICE ESTIMATE ── */}
              {estimatedPrice && (
                <div className="rounded-xl p-6 border-2 border-secondary/30 bg-gradient-to-br from-background/10 to-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <IndianRupee size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-text">Price Estimate</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-text/60 mb-2">Based on your selections</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-semibold">{form.dressType}</span>
                        <span className="px-3 py-1 bg-gray-100 text-text rounded-full text-sm font-semibold">{form.fabric}</span>
                        {form.size && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Size {form.size}</span>}
                        {form.neckStyle && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold capitalize">{form.neckStyle} neck</span>}
                        {form.sleeveStyle && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">{form.sleeveStyle} sleeve</span>}
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-3xl sm:text-4xl font-bold text-secondary">{formatRange(estimatedPrice)}</p>
                      <p className="text-xs text-text/50 mt-1">Final price may vary based on customisations</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── ACTIONS ── */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-gray-200">
                <button onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-8 py-3 border-2 border-secondary text-secondary rounded-lg hover:bg-secondary/5 transition-all font-semibold flex items-center justify-center gap-2">
                  <ArrowLeft size={18} /><span>Back</span>
                </button>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleSaveDraft} disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 border-2 border-secondary text-secondary rounded-lg hover:bg-secondary/5 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                    <Save size={18} /><span>{loading ? "Saving..." : "Save Draft"}</span>
                  </button>
                  <button onClick={handleAddToCart} disabled={loading}
                    className="group w-full sm:w-auto px-10 py-3 bg-secondary text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold disabled:opacity-50">
                    <ShoppingCart size={18} /><span>{loading ? "Adding..." : "Add to Cart"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Size Chart Modal (reuses existing component) ── */}
      {showSizeChart && (
        <SizeChartModal
          isOpen={showSizeChart}
          onClose={() => setShowSizeChart(false)}
          productName={form.dressType}
          category={form.gender === 'Women' ? 'Women' : 'Men'}
          subCategory={form.dressType}
          gender={form.gender}
        />
      )}

      {/* ── Reference Video Modal ── */}
      {showVideo && form.dressType && (
        <VideoModal
          videoId={videoId}
          title={`${form.gender}'s ${form.dressType} — size guide`}
          onClose={() => setShowVideo(false)}
        />
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default Customize;