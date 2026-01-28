import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import DesignCanvas from "../components/DesignCanvas";
import { 
  Save, ShoppingCart, Upload, CheckCircle2, Ruler, Palette, 
  Shirt, ArrowRight, IndianRupee, ArrowLeft, Info, ChevronRight
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
        
        toast.success("AI design generated successfully");
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

  // NEW: Validate measurements before adding to cart
  const validateMeasurements = () => {
    const { bust, waist, hips, shoulder, sleeveLength, length } = form.measurements;
    
    // Check if at least the primary measurements are provided
    if (!bust || !waist || !hips) {
      toast.error("Please provide Bust, Waist, and Hips measurements");
      return false;
    }

    if (!length) {
      toast.error("Please provide Length measurement");
      return false;
    }

    // Validate that measurements are reasonable numbers
    const measurements = [bust, waist, hips, length];
    for (const measurement of measurements) {
      const num = parseFloat(measurement);
      if (isNaN(num) || num <= 0 || num > 100) {
        toast.error("Please provide valid measurements (between 1-100 inches)");
        return false;
      }
    }

    // Optional measurements validation if provided
    if (shoulder && (parseFloat(shoulder) <= 0 || parseFloat(shoulder) > 30)) {
      toast.error("Shoulder measurement should be between 1-30 inches");
      return false;
    }

    if (sleeveLength && (parseFloat(sleeveLength) <= 0 || parseFloat(sleeveLength) > 40)) {
      toast.error("Sleeve length should be between 1-40 inches");
      return false;
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

    // Validate measurements before adding to cart
    if (!validateMeasurements()) {
      return;
    }

    try {
      setLoading(true);
      const customizationData = { ...form, estimatedPrice: calculatePrice(), status: "Ready for Cart" };
      const result = await saveCustomization(customizationData);

      if (result && result._id) {
        const added = await addCustomizationToCart(result);
        if (added) {
          toast.success("Custom design added to cart");
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
    <div className="mt-12 sm:mt-16 min-h-screen bg-gradient-to-b from-white via-background/5 to-white pb-8">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-primary/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-4 leading-tight">
              Design Your Custom Outfit
            </h1>
            <p className="text-base sm:text-lg text-text/60 font-light leading-relaxed max-w-2xl mx-auto">
              Create a personalized piece that reflects your style with expert craftsmanship
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Progress Steps */}
        <div className="mb-8 sm:mb-12 bg-white rounded-xl shadow-md border border-background/20 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Basic Details", icon: Shirt },
              { num: 2, label: "Design & Colors", icon: Palette },
              { num: 3, label: "Final Details", icon: Ruler }
            ].map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isCompleted = step > s.num;
              
              return (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        isActive ? "bg-secondary text-white shadow-lg" :
                        isCompleted ? "bg-green-500 text-white shadow-md" : 
                        "bg-gray-100 text-gray-400 border-2 border-gray-200"
                      }`}>
                      {isCompleted ? (
                        <CheckCircle2 size={24} />
                      ) : (
                        <Icon size={24} />
                      )}
                    </div>
                    <span className={`text-xs sm:text-sm mt-3 font-semibold text-center transition-colors ${
                      step >= s.num ? "text-text" : "text-text/40"
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className="hidden sm:block flex-1 h-0.5 mx-4 transition-all duration-300" style={{
                      backgroundColor: step > s.num ? '#10b981' : step === s.num ? 'var(--secondary)' : '#e5e7eb'
                    }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content Card */}
        <div 
          className="bg-white rounded-2xl shadow-lg border border-background/20 overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div className="p-6 sm:p-10 lg:p-12 space-y-8 sm:space-y-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Step 1 of 3</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-3">Select Your Preferences</h2>
                <p className="text-sm sm:text-base text-text/60 font-light max-w-2xl mx-auto">
                  Choose your style essentials to begin customization
                </p>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="flex items-center gap-3 font-bold text-base sm:text-lg mb-5 text-text">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-secondary font-bold text-sm">1</span>
                  </div>
                  Select Gender
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                  {["Women", "Men"].map((gender) => (
                    <button key={gender} onClick={() => handleGenderChange(gender)}
                      className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                        form.gender === gender 
                          ? "border-secondary bg-background/20 shadow-md" 
                          : "border-gray-200 hover:border-secondary/40 hover:shadow-sm"
                      }`}>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl mb-2">{gender === "Women"}</div>
                        <div className="font-bold text-lg sm:text-xl text-text">{gender}</div>
                      </div>
                      {form.gender === gender && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-md">
                            <CheckCircle2 size={16} className="text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dress Type Selection */}
              {form.gender && (
                <div className="animate-fadeIn">
                  <label className="flex items-center gap-3 font-bold text-base sm:text-lg mb-5 text-text">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="text-secondary font-bold text-sm">2</span>
                    </div>
                    Select Dress Type
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {dressTypes[form.gender].map((dress) => (
                      <button key={dress.value} onClick={() => handleDressTypeChange(dress.value)}
                        className={`p-4 flex flex-row gap-2 justify-center items-center rounded-xl border-2 transition-all duration-300 ${
                          form.dressType === dress.value 
                            ? "border-secondary bg-background/20 shadow-md" 
                            : "border-gray-200 hover:border-secondary/40 hover:shadow-sm"
                        }`}>
                          {form.dressType === dress.value && (
                          <div className="flex justify-center">
                            <CheckCircle2 size={16} className="text-secondary" />
                          </div>
                        )}
                        <div className="font-semibold text-sm text-text text-center">{dress.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fabric Selection */}
              {form.dressType && (
                <div className="animate-fadeIn">
                  <label className="flex items-center gap-3 font-bold text-base sm:text-lg mb-5 text-text">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="text-secondary font-bold text-sm">3</span>
                    </div>
                    Select Fabric
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getAvailableFabrics().map((fabric) => {
                      const price = PRICING_MATRIX[form.dressType]?.[fabric.value] || 0;
                      return (
                        <button key={fabric.value} onClick={() => setForm({ ...form, fabric: fabric.value })}
                          className={`p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                            form.fabric === fabric.value 
                              ? "border-secondary bg-background/20 shadow-md" 
                              : "border-gray-200 hover:border-secondary/40 hover:shadow-sm"
                          }`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="font-bold text-base text-text mb-1">{fabric.label}</div>
                              <div className="text-xs text-text/60">{fabric.description}</div>
                            </div>
                            {form.fabric === fabric.value && (
                              <CheckCircle2 size={18} className="text-secondary flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-1 text-secondary font-bold text-lg">
                              <IndianRupee size={16} />
                              <span>{price.toLocaleString()}</span>
                            </div>
                            <span className="text-xs text-text/50">Base Price</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-end items-center pt-8 border-t border-gray-200">
                <button onClick={() => { if (validateStep(1)) setStep(2); }}
                  disabled={!form.gender || !form.dressType || !form.fabric}
                  className="group px-8 sm:px-10 py-3 sm:py-4 bg-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none">
                  <span>Continue to Design</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Design & Colors */}
          {step === 2 && (
            <div className="p-6 sm:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Step 2 of 3</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-3">Customize Your Design</h2>
                <p className="text-sm sm:text-base text-text/60 font-light max-w-2xl mx-auto">
                  Choose colors and add patterns to different zones of your garment
                </p>
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

              {/* AI Design Suggestions */}
              {form.aiGeneratedDesign && (
                <div className="mt-8 bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                      <Info size={20} className="text-white" />
                    </div>
                    <h4 className="font-bold text-base text-purple-900">AI Design Suggestions</h4>
                  </div>
                  
                  {form.aiGeneratedDesign.colorPalette && (
                    <div className="mb-4 bg-white rounded-lg p-4 border border-purple-100">
                      <p className="text-sm text-purple-700 font-semibold mb-3">Recommended Color Palette</p>
                      <div className="flex gap-3">
                        {form.aiGeneratedDesign.colorPalette.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => setForm(prev => ({ ...prev, color }))}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {form.aiGeneratedDesign.embroidery && (
                      <div className="text-sm text-purple-800 bg-white rounded-lg p-3 border border-purple-100">
                        <strong>Embroidery:</strong> {form.aiGeneratedDesign.embroidery.type} on {form.aiGeneratedDesign.embroidery.zones.join(', ')}
                      </div>
                    )}
                    
                    {form.aiGeneratedDesign.fabricPrint && (
                      <div className="text-sm text-purple-800 bg-white rounded-lg p-3 border border-purple-100">
                        <strong>Print:</strong> {form.aiGeneratedDesign.fabricPrint} on {form.aiGeneratedDesign.printZones?.join(', ') || 'selected zones'}
                      </div>
                    )}
                    
                    {form.aiGeneratedDesign.tailorNotes && (
                      <div className="text-sm text-purple-700 bg-purple-50 rounded-lg p-4 border border-purple-200 mt-3">
                        <strong className="block mb-1">Tailor Notes:</strong>
                        {form.aiGeneratedDesign.tailorNotes}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button onClick={() => setStep(1)}
                  className="px-6 sm:px-8 py-3 border-2 border-secondary text-secondary rounded-lg hover:bg-secondary/5 transition-all font-semibold flex items-center gap-2">
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                <button onClick={() => { if (validateStep(2)) setStep(3); }}
                  className="group px-8 sm:px-10 py-3 bg-secondary text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold">
                  <span>Continue</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Final Details */}
          {step === 3 && (
            <div className="p-6 sm:p-10 lg:p-12 space-y-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Step 3 of 3</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-3">Final Details</h2>
                <p className="text-sm sm:text-base text-text/60 font-light max-w-2xl mx-auto">
                  Add measurements, notes, and reference images for the perfect fit
                </p>
              </div>

              {/* Design Notes */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <label className="flex items-center gap-3 font-bold text-base mb-4 text-text">
                  <Info size={20} className="text-secondary" />
                  <span>Design Notes & Special Instructions</span>
                </label>
                <textarea name="designNotes" value={form.designNotes}
                  placeholder="Share your vision: embroidery preferences, color combinations, traditional or modern look, special occasions, or any specific requirements"
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 h-32 focus:border-secondary focus:outline-none transition-all resize-none text-sm"
                  rows="4" />
              </div>

              {/* Measurements - NOW REQUIRED */}
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border-2 border-amber-300">
                <label className="flex items-center gap-3 font-bold text-base mb-2 text-text">
                  <Ruler size={20} className="text-secondary" />
                  <span>Measurements</span>
                  <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Required for Cart</span>
                </label>
                <p className="text-sm text-text/60 mb-5">
                  Provide your measurements in inches for a perfect fit. All measurements marked with * are required to add to cart.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: "bust", label: "Bust", placeholder: "e.g., 36", required: true },
                    { key: "waist", label: "Waist", placeholder: "e.g., 28", required: true },
                    { key: "hips", label: "Hips", placeholder: "e.g., 38", required: true },
                    { key: "shoulder", label: "Shoulder", placeholder: "e.g., 15", required: false },
                    { key: "sleeveLength", label: "Sleeve Length", placeholder: "e.g., 18", required: false },
                    { key: "length", label: "Length", placeholder: "e.g., 42", required: true },
                  ].map(({ key, label, placeholder, required }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-text/70 mb-2 uppercase tracking-wide">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        <input 
                          name={key} 
                          value={form.measurements[key]}
                          placeholder={placeholder} 
                          onChange={handleMeasurementChange}
                          className={`w-full border-2 rounded-lg px-4 py-3 pr-16 focus:outline-none transition-all text-sm ${
                            required 
                              ? 'border-amber-300 focus:border-amber-500 bg-amber-50/50' 
                              : 'border-gray-200 focus:border-secondary bg-white'
                          }`}
                          type="number" 
                          step="0.5"
                          required={required}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 text-xs">inches</span>
                      </div>
                    </div>
                  ))}
                </div>
                <textarea name="customNotes" value={form.measurements.customNotes}
                  placeholder="Additional measurement notes or fitting preferences"
                  onChange={handleMeasurementChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mt-5 h-24 focus:border-secondary focus:outline-none transition-all resize-none text-sm"
                  rows="3" />
                  
                {/* Measurements Help */}
                <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-800 font-semibold mb-2">📏 Measurement Guide:</p>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>• <strong>Bust:</strong> Measure around the fullest part of your chest</li>
                    <li>• <strong>Waist:</strong> Measure around your natural waistline</li>
                    <li>• <strong>Hips:</strong> Measure around the fullest part of your hips</li>
                    <li>• <strong>Length:</strong> Measure from shoulder to desired hem length</li>
                  </ul>
                </div>
              </div>

              {/* Price Estimate */}
              {estimatedPrice > 0 && (
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
                        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-semibold">
                          {form.dressType}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-text rounded-full text-sm font-semibold">
                          {form.fabric}
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-3xl sm:text-4xl font-bold text-secondary">
                        ₹{estimatedPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-text/50 mt-1">
                        Final price may vary based on customizations
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reference Images */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <label className="flex items-center gap-3 font-bold text-base mb-4 text-text">
                  <Upload size={20} className="text-secondary" />
                  <span>Reference Images</span>
                  <span className="text-sm text-text/50 font-normal">(Optional, Max 5)</span>
                </label>
                <p className="text-sm text-text/60 mb-4">
                  Upload images of designs you like for inspiration
                </p>
                <input type="file" multiple accept="image/*" onChange={handleImageChange}
                  className="block w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 focus:border-secondary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-secondary file:text-white file:font-semibold hover:file:bg-secondary/90 cursor-pointer text-sm bg-white" />
                {form.referenceImages.length > 0 && (
                  <div className="mt-5 grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {form.referenceImages.map((img, idx) => (
                      <div key={idx} className="group relative">
                        <img src={img} alt={`Reference ${idx + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200 group-hover:shadow-md transition-shadow" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center pb-2">
                          <span className="text-white text-xs font-semibold">Image {idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-gray-200">
                <button onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-8 py-3 border-2 border-secondary text-secondary rounded-lg hover:bg-secondary/5 transition-all font-semibold flex items-center justify-center gap-2">
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleSaveDraft} disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 border-2 border-secondary text-secondary rounded-lg hover:bg-secondary/5 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <Save size={18} />
                    <span>{loading ? "Saving..." : "Save Draft"}</span>
                  </button>

                  <button onClick={handleAddToCart} disabled={loading}
                    className="group w-full sm:w-auto px-10 py-3 bg-secondary text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                    <ShoppingCart size={18} />
                    <span>{loading ? "Adding..." : "Add to Cart"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { 
          animation: fadeIn 0.4s ease-out; 
        }
      `}</style>
    </div>
  );
};

export default Customize;