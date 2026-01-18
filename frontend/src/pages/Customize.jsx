import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import DesignCanvas from "../components/DesignCanvas";
import { 
  Save, ShoppingCart, Upload, CheckCircle2, Ruler, Palette, 
  Shirt, ArrowRight, Sparkles, IndianRupee, ArrowLeft, Info, Star, Zap
} from "lucide-react";

const Customize = () => {
  const { saveCustomization, addCustomizationToCart, token, navigate } = useContext(ShopContext);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    gender: "",
    dressType: "",
    fabric: "",
    color: "#ffffff",
    designNotes: "",
    measurements: {
      bust: "",
      waist: "",
      hips: "",
      shoulder: "",
      sleeveLength: "",
      length: "",
      customNotes: "",
    },
    aiPrompt: "",
    referenceImages: [],
    canvasDesign: {
      json: "",
      svg: "",
      png: "",
      backgroundImage: "",
      neckStyle: "",
      sleeveStyle: "",
      embroideryMetadata: []
    },
    aiGeneratedDesign: null
  });

  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const PRICING_MATRIX = {
    "Kurti": { "Cotton": 1500, "Silk": 2800, "Georgette": 2200, "Kota": 1800, "Chiffon": 2400, "Crape": 2000, "Lenin": 2500, "Chanderi": 3200, "Banarasi": 4500 },
    "Kurti Sets": { "Cotton": 2500, "Silk": 4200, "Georgette": 3500, "Kota": 2800, "Chiffon": 3800, "Crape": 3200, "Lenin": 3800, "Chanderi": 4800, "Banarasi": 6500 },
    "Kurta": { "Cotton": 1800, "Raw Silk": 3200, "Lenin": 2500, "Velvet": 3800, "Banarasi": 4800 },
    "Kurta Sets": { "Cotton": 3000, "Raw Silk": 4800, "Lenin": 3800, "Velvet": 5200, "Banarasi": 6800 },
    "Lehenga": { "Banarasi": 8500, "Georgette": 5500, "Chiffon": 6200, "Crape": 5800, "Tissue": 7200, "Pattu": 9500 },
    "Anarkali": { "Georgette": 4200, "Chiffon": 4500, "Crape": 3800, "Tissue": 5200, "Pattu": 6500, "Banarasi": 7200, "Cotton": 2800 },
    "Sherwani": { "Raw Silk": 6500, "Velvet": 8200, "Banarasi": 9500 },
    "Sheraras": { "Georgette": 5800, "Banarasi": 8200, "Silk": 6800, "Chiffon": 6200, "Crape": 5500 }
  };

  const calculatePrice = () => {
    if (!form.dressType || !form.fabric) return 0;
    return PRICING_MATRIX[form.dressType]?.[form.fabric] || 0;
  };

  const dressTypes = {
    Women: [
      { value: "Kurti", label: "Kurti" },
      { value: "Kurti Sets", label: "Kurti Sets"},
      { value: "Lehenga", label: "Lehenga"},
      { value: "Sheraras", label: "Sheraras"},
      { value: "Anarkali", label: "Anarkali" }
    ],
    Men: [
      { value: "Kurta", label: "Kurta" },
      { value: "Kurta Sets", label: "Kurta Sets"},
      { value: "Sherwani", label: "Sherwani" }
    ]
  };

  const fabricOptions = {
    "Kurti": [
      { value: "Cotton", label: "Cotton", description: "Breathable & Comfortable" },
      { value: "Silk", label: "Silk", description: "Luxurious & Elegant" },
      { value: "Georgette", label: "Georgette", description: "Lightweight & Flowy" },
      { value: "Kota", label: "Kota", description: "Traditional & Airy" },
      { value: "Chiffon", label: "Chiffon", description: "Delicate & Sheer" },
      { value: "Crape", label: "Crape", description: "Textured & Stylish" },
      { value: "Lenin", label: "Lenin", description: "Crisp & Natural" },
      { value: "Chanderi", label: "Chanderi", description: "Premium Handloom" },
      { value: "Banarasi", label: "Banarasi", description: "Regal & Ornate" }
    ],
    "Kurti Sets": [
      { value: "Cotton", label: "Cotton", description: "Breathable & Comfortable" },
      { value: "Silk", label: "Silk", description: "Luxurious & Elegant" },
      { value: "Georgette", label: "Georgette", description: "Lightweight & Flowy" },
      { value: "Kota", label: "Kota", description: "Traditional & Airy" },
      { value: "Chiffon", label: "Chiffon", description: "Delicate & Sheer" },
      { value: "Crape", label: "Crape", description: "Textured & Stylish" },
      { value: "Lenin", label: "Lenin", description: "Crisp & Natural" },
      { value: "Chanderi", label: "Chanderi", description: "Premium Handloom" },
      { value: "Banarasi", label: "Banarasi", description: "Regal & Ornate" }
    ],
    "Sheraras": [
      { value: "Georgette", label: "Georgette", description: "Lightweight & Flowy" },
      { value: "Banarasi", label: "Banarasi", description: "Regal & Ornate" },
      { value: "Silk", label: "Silk", description: "Luxurious & Elegant" },
      { value: "Chiffon", label: "Chiffon", description: "Delicate & Sheer" },
      { value: "Crape", label: "Crape", description: "Textured & Stylish" }
    ],
    "Lehenga": [
      { value: "Banarasi", label: "Banarasi", description: "Regal & Ornate" },
      { value: "Georgette", label: "Georgette", description: "Lightweight & Flowy" },
      { value: "Chiffon", label: "Chiffon", description: "Delicate & Sheer" },
      { value: "Crape", label: "Crape", description: "Textured & Stylish" },
      { value: "Tissue", label: "Tissue", description: "Shimmering & Festive" },
      { value: "Pattu", label: "Pattu", description: "Rich Silk Tradition" }
    ],
    "Anarkali": [
      { value: "Georgette", label: "Georgette", description: "Lightweight & Flowy" },
      { value: "Chiffon", label: "Chiffon", description: "Delicate & Sheer" },
      { value: "Crape", label: "Crape", description: "Textured & Stylish" },
      { value: "Tissue", label: "Tissue", description: "Shimmering & Festive" },
      { value: "Pattu", label: "Pattu", description: "Rich Silk Tradition" },
      { value: "Banarasi", label: "Banarasi", description: "Regal & Ornate" },
      { value: "Cotton", label: "Cotton", description: "Breathable & Comfortable" }
    ],
    "Kurta": [
      { value: "Cotton", label: "Cotton", description: "Breathable & Comfortable" },
      { value: "Raw Silk", label: "Raw Silk", description: "Natural Elegance" },
      { value: "Lenin", label: "Lenin", description: "Crisp & Natural" },
      { value: "Velvet", label: "Velvet", description: "Luxe & Sophisticated" },
      { value: "Banarasi", label: "Banarasi", description: "Regal & Ornate" }
    ],
    "Kurta Sets": [
      { value: "Cotton", label: "Cotton", description: "Breathable & Comfortable" },
      { value: "Raw Silk", label: "Raw Silk", description: "Natural Elegance" },
      { value: "Lenin", label: "Lenin", description: "Crisp & Natural" },
      { value: "Velvet", label: "Velvet", description: "Luxe & Sophisticated" },
      { value: "Banarasi", label: "Banarasi", description: "Regal & Ornate" }
    ],
    "Sherwani": [
      { value: "Raw Silk", label: "Raw Silk", description: "Natural Elegance" },
      { value: "Velvet", label: "Velvet", description: "Luxe & Sophisticated" },
      { value: "Banarasi", label: "Banarasi", description: "Regal & Ornate" }
    ]
  };

  const getAvailableFabrics = () => fabricOptions[form.dressType] || [];

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && step < 3) {
      if (validateStep(step)) {
        setStep(step + 1);
      }
    }
    if (isRightSwipe && step > 1) {
      setStep(step - 1);
    }
  };

  const handleDesignChange = (designData) => {
    setForm({ ...form, canvasDesign: designData, color: designData.color });
  };

  const handleGenderChange = (gender) => {
    setForm({ ...form, gender, dressType: "", fabric: "" });
  };

  const handleDressTypeChange = (dressType) => {
    setForm({ ...form, dressType, fabric: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMeasurementChange = (e) => {
    setForm({
      ...form,
      measurements: { ...form.measurements, [e.target.name]: e.target.value }
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

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
      console.error("Image upload error:", err);
      toast.error("Failed to upload images");
    }
  };

  const handleAIGenerate = async () => {
    if (!form.aiPrompt.trim()) {
      toast.error("Please enter a design description");
      return;
    }

    try {
      setAiGenerating(true);
      toast.info("AI is generating your design...");

      const response = await fetch("/api/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: form.aiPrompt,
          dressType: form.dressType,
          fabric: form.fabric,
          gender: form.gender,
          systemPrompt: `Generate structured garment customization instructions.
Dress type: ${form.dressType}
Fabric: ${form.fabric}
Gender: ${form.gender}

Return JSON only:
{
  "zonesToDecorate": ["zone_id_1", "zone_id_2"],
  "embroidery": {
    "type": "maggam|machineEmbroidery",
    "zones": ["zone_id"],
    "density": "light|medium|heavy"
  },
  "fabricPrint": "blockPrint|floral|shibori|kalamkari|painting|bagruPrint",
  "printZones": ["zone_id"],
  "colorPalette": ["#hex1", "#hex2"],
  "tailorNotes": "specific instructions for tailor"
}`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const design = JSON.parse(data.structuredDesign || '{}');
        
        if (design.colorPalette && design.colorPalette[0]) {
          setForm(prev => ({ ...prev, color: design.colorPalette[0] }));
        }
        
        setForm(prev => ({ 
          ...prev, 
          designNotes: design.tailorNotes || form.aiPrompt,
          aiGeneratedDesign: design
        }));
        
        toast.success("AI design generated! Review and apply suggestions");
      } else {
        throw new Error("AI generation failed");
      }
    } catch (err) {
      console.error("AI generation error:", err);
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

  const handleSaveDraft = async () => {
    if (!token) {
      toast.error("Please login to save customization");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const result = await saveCustomization({ ...form, estimatedPrice: calculatePrice() });
      if (result) toast.success("Customization saved as draft");
    } catch (err) {
      console.error("Save draft error:", err);
      toast.error("Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const customizationData = { ...form, estimatedPrice: calculatePrice(), status: "Ready for Cart" };
      const result = await saveCustomization(customizationData);

      if (result && result._id) {
        const added = await addCustomizationToCart(result);
        if (added) {
          toast.success("Custom design added to cart! 🎉");
          navigate("/cart");
        }
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const estimatedPrice = calculatePrice();

  return (
    <div className="mt-12 sm:mt-16 min-h-screen bg-gradient-to-b from-white via-background/10 to-white pb-6">
      {/* Hero Section */}
      <section className="relative py-8 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-primary/10 to-background/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif font-bold text-text mb-4 sm:mb-6 leading-tight">
              Design Your Dream Outfit
            </h1>
            <p className="text-base sm:text-xl text-text/70 font-light leading-relaxed max-w-2xl mx-auto">
              Create a unique, personalized piece that reflects your style with AI assistance and expert craftsmanship
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Progress Steps */}
        <div className="mb-8 sm:mb-12 bg-white rounded-2xl shadow-lg border border-background/30 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto pb-2">
            {[
              { num: 1, label: "Basic Details", shortLabel: "Details", icon: Shirt },
              { num: 2, label: "Design & Colors", shortLabel: "Design", icon: Palette },
              { num: 3, label: "Final Details", shortLabel: "Final", icon: Ruler }
            ].map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isCompleted = step > s.num;
              
              return (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col p-5 items-center min-w-fit flex-1">
                    <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-bold text-base sm:text-lg transition-all duration-500 ${
                        isActive ? "bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-2xl shadow-secondary/40 scale-105" :
                        isCompleted ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl shadow-green-500/30" : 
                        "bg-background/30 text-text/40 border-2 border-background/50"
                      }`}>
                      {isCompleted ? (
                        <CheckCircle2 size={window.innerWidth < 640 ? 24 : 32} className="animate-bounce" />
                      ) : (
                        <Icon size={window.innerWidth < 640 ? 24 : 32} className={isActive ? "animate-pulse" : ""} />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 rounded-2xl bg-secondary/20 animate-ping"></div>
                      )}
                    </div>
                    <span className={`text-[10px] sm:text-sm mt-2 sm:mt-3 font-semibold transition-colors whitespace-nowrap ${
                      step >= s.num ? "text-text" : "text-text/40"
                    }`}>
                      <span className="hidden sm:inline">{s.label}</span>
                      <span className="sm:hidden">{s.shortLabel}</span>
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className="flex-1 h-1 rounded-full transition-all duration-500 mx-2 sm:mx-4" style={{
                      background: step > s.num 
                        ? 'linear-gradient(to right, #10b981, #059669)' 
                        : step === s.num
                        ? 'linear-gradient(to right, var(--secondary), rgba(var(--secondary-rgb), 0.3))'
                        : '#f3f4f6'
                    }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content Card */}
        <div 
          className="bg-white rounded-3xl shadow-2xl border border-background/30 overflow-hidden backdrop-blur-sm"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div className="p-4 sm:p-10 lg:p-14 space-y-8 sm:space-y-12">
              <div className="text-center mb-6 sm:mb-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary/10 to-primary/10 text-secondary px-4 py-2 rounded-full mb-4">
                  <Star size={16} className="fill-current" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Step 1 of 3</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text mb-3">Tell Us Your Preferences</h2>
                <p className="text-sm sm:text-lg text-text/60 font-light max-w-2xl mx-auto">
                  Select your style essentials to get started with your custom design journey
                </p>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="flex items-center gap-2 font-bold text-lg sm:text-xl mb-5 sm:mb-6 text-text">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-secondary font-bold">1</span>
                  </div>
                  Select Gender <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {["Women", "Men"].map((gender) => (
                    <button key={gender} onClick={() => handleGenderChange(gender)}
                      className={`group relative p-3 sm:p-5 rounded-2xl border-3 transition-all duration-500 overflow-hidden ${
                        form.gender === gender 
                          ? "border-secondary bg-background/30 scale-105" 
                          : "border-background/40 hover:border-secondary/40 hover:shadow-xl hover:scale-102 active:scale-95"
                      }`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <div className="text-3xl sm:text-4xl mb-3">{gender === "Women"}</div>
                        <div className="font-bold text-xl sm:text-3xl text-text mb-2">{gender}</div>
                        <div className="text-xs sm:text-sm text-text/60 font-light">For {gender.toLowerCase()}</div>
                      </div>
                      {form.gender === gender && (
                        <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                            <CheckCircle2 size={window.innerWidth < 640 ? 20 : 24} className="text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dress Type Selection */}
              {form.gender && (
                <div className="animate-slideDown">
                  <label className="flex items-center gap-2 font-bold text-lg sm:text-xl mb-5 sm:mb-6 text-text">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="text-secondary font-bold">2</span>
                    </div>
                    Select Dress Type <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {dressTypes[form.gender].map((dress) => (
                      <button key={dress.value} onClick={() => handleDressTypeChange(dress.value)}
                        className={`group relative p-5 sm:p-7 rounded-xl border-3 transition-all duration-500 overflow-hidden ${
                          form.dressType === dress.value 
                            ? "border-secondary bg-background/30 scale-105" 
                            : "border-background/40 hover:border-secondary/40 hover:shadow-lg hover:scale-105 active:scale-95"
                        }`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                          <div className="font-bold text-sm sm:text-base text-text">{dress.label}</div>
                        </div>
                        {form.dressType === dress.value && (
                          <div className="absolute top-3 right-3">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                              <CheckCircle2 size={16} className="text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fabric Selection */}
              {form.dressType && (
                <div className="animate-slideDown">
                  <label className="flex items-center gap-2 font-bold text-lg sm:text-xl mb-5 sm:mb-6 text-text">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="text-secondary font-bold">3</span>
                    </div>
                    Select Fabric <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {getAvailableFabrics().map((fabric) => {
                      const price = PRICING_MATRIX[form.dressType]?.[fabric.value] || 0;
                      return (
                        <button key={fabric.value} onClick={() => setForm({ ...form, fabric: fabric.value })}
                          className={`group relative p-5 sm:p-6 rounded-2xl border-3 transition-all duration-500 text-left overflow-hidden ${
                            form.fabric === fabric.value 
                              ? "border-secondary bg-background/30 scale-105" 
                              : "border-background/40 hover:border-secondary/40 hover:shadow-xl hover:scale-102 active:scale-95"
                          }`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="font-bold text-base sm:text-lg text-text mb-1">{fabric.label}</div>
                                <div className="text-xs sm:text-sm text-text/60 font-light">{fabric.description}</div>
                              </div>
                              {form.fabric === fabric.value && (
                                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-lg flex-shrink-0">
                                  <CheckCircle2 size={14} className="text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-background/30">
                              <div className="flex items-center gap-1 text-secondary font-bold text-lg sm:text-xl">
                                <IndianRupee size={18} />
                                <span>{price.toLocaleString()}</span>
                              </div>
                              <span className="text-xs text-text/50 font-medium">Base Price</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-8 sm:pt-10 border-t border-background/30 gap-4">
                <div className="hidden sm:flex items-center gap-2 text-sm text-text/50 font-light">
                  <Info size={16} />
                  <span>Swipe left or click next to continue</span>
                </div>
                <button onClick={() => { if (validateStep(1)) setStep(2); }}
                  disabled={!form.gender || !form.dressType || !form.fabric}
                  className="group w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-secondary to-secondary/90 text-white rounded-2xl hover:shadow-2xl hover:shadow-secondary/40 transition-all duration-500 flex items-center justify-center gap-3 font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-95">
                  <span>Continue to Design</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Design & Colors */}
          {step === 2 && (
            <div className="p-3 sm:p-10">
              <div className="text-center mb-6 sm:mb-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary/10 to-primary/10 text-secondary px-4 py-2 rounded-full mb-4">
                  <Palette size={16} className="fill-current" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Step 2 of 3</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text mb-3">Customize Your Design</h2>
                <p className="text-sm sm:text-lg text-text/60 font-light max-w-2xl mx-auto">
                  Choose colors and add patterns to different zones of your garment
                </p>
              </div>

              <DesignCanvas
                onDesignChange={handleDesignChange}
                initialDesign={form.canvasDesign}
                dressType={form.dressType}
                selectedColor={form.color}
                gender={form.gender}
                aiPrompt={form.aiPrompt}
                onAIPromptChange={(value) => setForm({ ...form, aiPrompt: value })}
                onAIGenerate={handleAIGenerate}
                aiGenerating={aiGenerating}
              />

              {/* AI Design Suggestions */}
              {form.aiGeneratedDesign && (
                <div className="mt-8 bg-gradient-to-br from-purple-50 via-white to-purple-50/50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <Zap size={20} className="text-white" />
                    </div>
                    <h4 className="font-bold text-base sm:text-lg text-purple-900 flex items-center gap-2">
                      AI Design Suggestions
                    </h4>
                  </div>
                  
                  {form.aiGeneratedDesign.colorPalette && (
                    <div className="mb-4 bg-white rounded-xl p-4 border border-purple-100">
                      <p className="text-xs sm:text-sm text-purple-700 font-semibold mb-3">Recommended Color Palette:</p>
                      <div className="flex gap-3">
                        {form.aiGeneratedDesign.colorPalette.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => setForm(prev => ({ ...prev, color }))}
                            className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-3 border-white shadow-lg hover:scale-125 transition-all duration-300"
                            style={{ backgroundColor: color }}
                          >
                            <div className="absolute inset-0 rounded-xl bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {form.aiGeneratedDesign.embroidery && (
                      <div className="flex items-start gap-3 text-xs sm:text-sm text-purple-800 bg-white rounded-lg p-3 border border-purple-100">
                        <Sparkles size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Embroidery:</strong> {form.aiGeneratedDesign.embroidery.type} on {form.aiGeneratedDesign.embroidery.zones.join(', ')}</span>
                      </div>
                    )}
                    
                    {form.aiGeneratedDesign.fabricPrint && (
                      <div className="flex items-start gap-3 text-xs sm:text-sm text-purple-800 bg-white rounded-lg p-3 border border-purple-100">
                        <Sparkles size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Print:</strong> {form.aiGeneratedDesign.fabricPrint} on {form.aiGeneratedDesign.printZones?.join(', ') || 'selected zones'}</span>
                      </div>
                    )}
                    
                    {form.aiGeneratedDesign.tailorNotes && (
                      <div className="text-xs sm:text-sm text-purple-700 bg-purple-50 rounded-lg p-4 border border-purple-200 mt-3">
                        <strong className="block mb-1">Tailor Notes:</strong>
                        {form.aiGeneratedDesign.tailorNotes}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-background/30 gap-3 sm:gap-4">
                <button onClick={() => setStep(1)}
                  className="px-6 sm:px-10 py-3 sm:py-4 border-3 border-secondary text-secondary rounded-2xl hover:bg-secondary/5 hover:shadow-xl transition-all duration-300 font-bold flex items-center gap-2 text-sm sm:text-base active:scale-95">
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                <button onClick={() => { if (validateStep(2)) setStep(3); }}
                  className="group px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-secondary to-secondary/90 text-white rounded-2xl hover:shadow-2xl hover:shadow-secondary/40 transition-all duration-500 flex items-center gap-3 font-bold text-sm sm:text-base active:scale-95">
                  <span>Continue to Final Details</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Final Details */}
          {step === 3 && (
            <div className="p-4 sm:p-10 lg:p-14 space-y-8 sm:space-y-10">
              <div className="text-center mb-6 sm:mb-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary/10 to-primary/10 text-secondary px-4 py-2 rounded-full mb-4">
                  <Ruler size={16} />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Step 3 of 3</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text mb-3">Final Touches</h2>
                <p className="text-sm sm:text-lg text-text/60 font-light max-w-2xl mx-auto">
                  Add notes, measurements, and reference images for the perfect fit
                </p>
              </div>

              {/* Design Notes */}
              <div className="bg-gradient-to-br from-white to-background/20 rounded-2xl p-6 sm:p-8 border-2 border-background/50 shadow-lg">
                <label className="flex items-center gap-3 font-bold text-lg sm:text-xl mb-4 text-text">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-secondary" />
                  </div>
                  <span className="text-base sm:text-lg">Design Notes & Special Instructions</span>
                </label>
                <textarea name="designNotes" value={form.designNotes}
                  placeholder="Share your vision: embroidery preferences, color combinations, traditional or modern look, special occasions, or any specific requirements..."
                  onChange={handleChange}
                  className="w-full border-2 border-background/50 rounded-xl px-4 sm:px-5 py-3 sm:py-4 h-32 sm:h-36 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all resize-none font-light text-sm sm:text-base"
                  rows="4" />
              </div>

              {/* Measurements */}
              <div className="bg-gradient-to-br from-white to-background/20 rounded-2xl p-6 sm:p-8 border-2 border-background/50 shadow-lg">
                <label className="flex items-center gap-3 font-bold text-lg sm:text-xl mb-4 text-text">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                    <Ruler size={20} className="text-secondary" />
                  </div>
                  <span className="text-base sm:text-lg">Measurements</span>
                </label>
                <p className="text-xs sm:text-sm text-text/60 mb-5 sm:mb-6 font-light">
                  Provide your measurements in inches for a perfect fit. Leave blank if you prefer standard sizing.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {[
                    { key: "bust", label: "Bust", placeholder: "e.g., 36" },
                    { key: "waist", label: "Waist", placeholder: "e.g., 28" },
                    { key: "hips", label: "Hips", placeholder: "e.g., 38" },
                    { key: "shoulder", label: "Shoulder", placeholder: "e.g., 15" },
                    { key: "sleeveLength", label: "Sleeve Length", placeholder: "e.g., 18" },
                    { key: "length", label: "Length", placeholder: "e.g., 42" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} className="relative">
                      <label className="block text-xs sm:text-sm font-semibold text-text/70 mb-2 uppercase tracking-wide">
                        {label}
                      </label>
                      <input name={key} value={form.measurements[key]}
                        placeholder={placeholder} onChange={handleMeasurementChange}
                        className="w-full border-2 border-background/50 rounded-xl px-4 py-3 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-light text-sm sm:text-base"
                        type="number" step="0.5" />
                      <span className="absolute right-4 top-9 text-text/40 text-xs font-medium">inches</span>
                    </div>
                  ))}
                </div>
                <textarea name="customNotes" value={form.measurements.customNotes}
                  placeholder="Additional measurement notes, fitting preferences, or body type considerations..."
                  onChange={handleMeasurementChange}
                  className="w-full border-2 border-background/50 rounded-xl px-4 sm:px-5 py-3 sm:py-4 mt-5 h-24 sm:h-28 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all resize-none font-light text-sm sm:text-base"
                  rows="3" />
              </div>

              {/* Price Estimate */}
              {estimatedPrice > 0 && (
                <div className="relative rounded-2xl p-6 sm:p-8 border-3 border-secondary/30 bg-gradient-to-br from-secondary/5 via-white to-primary/5 shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg">
                        <IndianRupee size={24} className="text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-text">Price Estimate</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                      <div>
                        <p className="text-xs sm:text-sm text-text/60 font-medium mb-2">Based on your selections:</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs sm:text-sm font-semibold">
                            {form.dressType}
                          </span>
                          <span className="px-3 py-1 bg-primary/10 text-text rounded-full text-xs sm:text-sm font-semibold">
                            {form.fabric}
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">
                          ₹{estimatedPrice.toLocaleString()}
                        </p>
                        <p className="text-[10px] sm:text-xs text-text/50 mt-1 font-medium">
                          *Final price may vary based on customizations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reference Images */}
              <div className="bg-gradient-to-br from-white to-background/20 rounded-2xl p-6 sm:p-8 border-2 border-background/50 shadow-lg">
                <label className="flex items-center gap-3 font-bold text-lg sm:text-xl mb-4 text-text">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                    <Upload size={20} className="text-secondary" />
                  </div>
                  <span className="text-base sm:text-lg">Reference Images</span>
                  <span className="text-xs text-text/50 font-normal">(Optional, Max 5)</span>
                </label>
                <p className="text-xs sm:text-sm text-text/60 mb-4 font-light">
                  Upload images of designs you like for inspiration
                </p>
                <input type="file" multiple accept="image/*" onChange={handleImageChange}
                  className="block w-full border-2 border-dashed border-background/50 rounded-xl px-4 sm:px-5 py-4 sm:py-6 focus:border-secondary transition-all file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-secondary file:to-secondary/90 file:text-white file:font-semibold file:shadow-lg hover:file:shadow-xl cursor-pointer font-light text-xs sm:text-base bg-white" />
                {form.referenceImages.length > 0 && (
                  <div className="mt-5 sm:mt-6 grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                    {form.referenceImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Reference ${idx + 1}`}
                          className="w-full aspect-square object-cover rounded-xl border-2 border-background/50 shadow-md group-hover:shadow-xl transition-all" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end justify-center pb-2">
                          <span className="text-white text-xs font-bold">Image {idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 pt-8 border-t border-background/30">
                <button onClick={() => setStep(2)}
                  className="w-full sm:w-auto order-2 sm:order-1 px-8 sm:px-10 py-3 sm:py-4 border-3 border-secondary text-secondary rounded-2xl hover:bg-secondary/5 hover:shadow-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95">
                  <ArrowLeft size={18} />
                  <span>Back to Design</span>
                </button>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 order-1 sm:order-2">
                  <button onClick={handleSaveDraft} disabled={loading}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-3 border-secondary text-secondary rounded-2xl hover:bg-secondary/5 hover:shadow-xl transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95">
                    <Save size={20} />
                    <span>{loading ? "Saving..." : "Save Draft"}</span>
                  </button>

                  <button onClick={handleAddToCart} disabled={loading}
                    className="group w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-5 bg-gradient-to-r from-secondary to-secondary/90 text-white rounded-2xl hover:shadow-2xl hover:shadow-secondary/40 transition-all duration-500 flex items-center justify-center gap-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base active:scale-95">
                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                    <span>{loading ? "Adding to Cart..." : "Add to Cart"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { 
          animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1); 
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .scale-102 {
          transform: scale(1.02);
        }

        /* Hide scrollbar for mobile swipe indicator */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Custom gradient text */
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default Customize;