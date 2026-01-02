import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import DesignCanvas from "../components/DesignCanvas";
import { 
  Save, ShoppingCart, Upload, CheckCircle2, Ruler, Palette, 
  Shirt, ArrowRight, Sparkles, IndianRupee, ArrowLeft, ChevronLeft, ChevronRight 
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
      { value: "Kurti Sets", label: "Kurti Sets" },
      { value: "Lehenga", label: "Lehenga" },
      { value: "Sheraras", label: "Sheraras" },
      { value: "Anarkali", label: "Anarkali" }
    ],
    Men: [
      { value: "Kurta", label: "Kurta" },
      { value: "Kurta Sets", label: "Kurta Sets" },
      { value: "Sherwani", label: "Sherwani" }
    ]
  };

  const fabricOptions = {
    "Kurti": [{ value: "Cotton", label: "Cotton" }, { value: "Silk", label: "Silk" }, { value: "Georgette", label: "Georgette" }, { value: "Kota", label: "Kota" }, { value: "Chiffon", label: "Chiffon" }, { value: "Crape", label: "Crape" }, { value: "Lenin", label: "Lenin" }, { value: "Chanderi", label: "Chanderi" }, { value: "Banarasi", label: "Banarasi" }],
    "Kurti Sets": [{ value: "Cotton", label: "Cotton" }, { value: "Silk", label: "Silk" }, { value: "Georgette", label: "Georgette" }, { value: "Kota", label: "Kota" }, { value: "Chiffon", label: "Chiffon" }, { value: "Crape", label: "Crape" }, { value: "Lenin", label: "Lenin" }, { value: "Chanderi", label: "Chanderi" }, { value: "Banarasi", label: "Banarasi" }],
    "Sheraras": [{ value: "Georgette", label: "Georgette" }, { value: "Banarasi", label: "Banarasi" }, { value: "Silk", label: "Silk" }, { value: "Chiffon", label: "Chiffon" }, { value: "Crape", label: "Crape" }],
    "Lehenga": [{ value: "Banarasi", label: "Banarasi" }, { value: "Georgette", label: "Georgette" }, { value: "Chiffon", label: "Chiffon" }, { value: "Crape", label: "Crape" }, { value: "Tissue", label: "Tissue" }, { value: "Pattu", label: "Pattu" }],
    "Anarkali": [{ value: "Georgette", label: "Georgette" }, { value: "Chiffon", label: "Chiffon" }, { value: "Crape", label: "Crape" }, { value: "Tissue", label: "Tissue" }, { value: "Pattu", label: "Pattu" }, { value: "Banarasi", label: "Banarasi" }, { value: "Cotton", label: "Cotton" }],
    "Kurta": [{ value: "Cotton", label: "Cotton" }, { value: "Raw Silk", label: "Raw Silk" }, { value: "Lenin", label: "Lenin" }, { value: "Velvet", label: "Velvet" }, { value: "Banarasi", label: "Banarasi" }],
    "Kurta Sets": [{ value: "Cotton", label: "Cotton" }, { value: "Raw Silk", label: "Raw Silk" }, { value: "Lenin", label: "Lenin" }, { value: "Velvet", label: "Velvet" }, { value: "Banarasi", label: "Banarasi" }],
    "Sherwani": [{ value: "Raw Silk", label: "Raw Silk" }, { value: "Velvet", label: "Velvet" }, { value: "Banarasi", label: "Banarasi" }]
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
        
        toast.success("AI design generated! Review and apply suggestions ✨");
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
    <div className="mt-12 sm:mt-16 min-h-screen pb-6">
      <section className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif font-bold text-text mb-3 sm:mb-4">
              Design Your Dream Outfit
            </h1>
            <p className="text-sm sm:text-lg text-text/60 font-light">
              Create a unique, personalized piece that reflects your style in just 3 simple steps
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
            {[
              { num: 1, label: "Basic Details", shortLabel: "Details", icon: Shirt },
              { num: 2, label: "Design & Colors", shortLabel: "Design", icon: Palette },
              { num: 3, label: "Final Details", shortLabel: "Final", icon: Ruler }
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center min-w-fit">
                    <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-base sm:text-lg transition-all duration-300 ${
                        step === s.num ? "bg-secondary text-white shadow-xl shadow-secondary/30 scale-105 sm:scale-110" :
                        step > s.num ? "bg-green-500 text-white shadow-lg" : "bg-background/30 text-text/40"
                      }`}>
                      {step > s.num ? <CheckCircle2 size={window.innerWidth < 640 ? 20 : 28} /> : <Icon size={window.innerWidth < 640 ? 20 : 28} />}
                    </div>
                    <span className={`text-[10px] sm:text-xs mt-2 sm:mt-3 font-medium transition-colors whitespace-nowrap ${step >= s.num ? "text-text" : "text-text/40"}`}>
                      <span className="hidden sm:inline">{s.label}</span>
                      <span className="sm:hidden">{s.shortLabel}</span>
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className={`w-12 sm:w-24 h-0.5 sm:h-1 rounded-full transition-colors duration-300 ${step > s.num ? "bg-green-500" : "bg-background/30"}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div 
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-background/50 overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {step === 1 && (
            <div className="p-4 sm:p-8 lg:p-12 space-y-6 sm:space-y-10">
              <div className="text-center mb-4 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-2">Tell Us Your Preferences</h2>
                <p className="text-sm sm:text-base text-text/60 font-light">Select your style essentials to get started</p>
              </div>

              <div>
                <label className="flex items-center gap-2 font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-text">
                  Select Gender <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {["Women", "Men"].map((gender) => (
                    <button key={gender} onClick={() => handleGenderChange(gender)}
                      className={`group relative p-4 sm:p-8 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                        form.gender === gender ? "border-secondary bg-secondary/5 shadow-xl shadow-secondary/20 scale-105" :
                        "border-background/50 hover:border-secondary/50 hover:shadow-lg active:scale-95"
                      }`}>
                      <div className="font-semibold text-lg sm:text-2xl text-text mb-1 sm:mb-2">{gender}</div>
                      <div className="text-xs sm:text-sm text-text/60 font-light">Select {gender.toLowerCase()}'s wear</div>
                      {form.gender === gender && (
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                          <CheckCircle2 size={window.innerWidth < 640 ? 20 : 24} className="text-secondary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {form.gender && (
                <div className="animate-slideDown">
                  <label className="flex items-center gap-2 font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-text">
                    Select Dress Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                    {dressTypes[form.gender].map((dress) => (
                      <button key={dress.value} onClick={() => handleDressTypeChange(dress.value)}
                        className={`group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                          form.dressType === dress.value ? "border-secondary bg-secondary/5 shadow-xl shadow-secondary/20 scale-105" :
                          "border-background/50 hover:border-secondary/50 hover:shadow-lg active:scale-95"
                        }`}>
                        <div className="font-semibold text-sm sm:text-base text-text">{dress.label}</div>
                        {form.dressType === dress.value && (
                          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                            <CheckCircle2 size={window.innerWidth < 640 ? 16 : 20} className="text-secondary" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {form.dressType && (
                <div className="animate-slideDown">
                  <label className="flex items-center gap-2 font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-text">
                    Select Fabric <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                    {getAvailableFabrics().map((fabric) => {
                      const price = PRICING_MATRIX[form.dressType]?.[fabric.value] || 0;
                      return (
                        <button key={fabric.value} onClick={() => setForm({ ...form, fabric: fabric.value })}
                          className={`group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-left ${
                            form.fabric === fabric.value ? "border-secondary bg-secondary/5 shadow-xl shadow-secondary/20 scale-105" :
                            "border-background/50 hover:border-secondary/50 hover:shadow-lg active:scale-95"
                          }`}>
                          <div className="font-semibold text-sm sm:text-base text-text mb-1">{fabric.label}</div>
                          <div className="text-xs sm:text-sm text-text font-bold">₹{price.toLocaleString()}</div>
                          {form.fabric === fabric.value && (
                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                              <CheckCircle2 size={window.innerWidth < 640 ? 16 : 20} className="text-secondary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 sm:pt-6 border-t border-background/30 gap-3">
                <div className="text-xs sm:text-sm text-text/50 font-light">
                  Swipe left to continue →
                </div>
                <button onClick={() => { if (validateStep(1)) setStep(2); }}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 hover:-translate-y-0.5 font-semibold text-sm sm:text-base active:scale-95">
                  <span className="hidden sm:inline">Next: Design & Colors</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-3 sm:p-8">
              <div className="text-center mb-4 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-2">Customize Your Design</h2>
                <p className="text-sm sm:text-base text-text/60 font-light">Select your color and customize patterns on different zones</p>
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

              {form.aiGeneratedDesign && (
                <div className="mt-6 bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border-2 border-purple-200">
                  <h4 className="font-bold text-sm text-purple-900 mb-3 flex items-center gap-2">
                    <Sparkles size={16} />
                    AI Design Suggestions
                  </h4>
                  
                  {form.aiGeneratedDesign.colorPalette && (
                    <div className="mb-3">
                      <p className="text-xs text-purple-700 mb-2">Recommended Colors:</p>
                      <div className="flex gap-2">
                        {form.aiGeneratedDesign.colorPalette.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => setForm(prev => ({ ...prev, color }))}
                            className="w-10 h-10 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {form.aiGeneratedDesign.embroidery && (
                    <div className="text-xs text-purple-800 mb-2">
                      • Embroidery: {form.aiGeneratedDesign.embroidery.type} on {form.aiGeneratedDesign.embroidery.zones.join(', ')}
                    </div>
                  )}
                  
                  {form.aiGeneratedDesign.fabricPrint && (
                    <div className="text-xs text-purple-800 mb-2">
                      • Print: {form.aiGeneratedDesign.fabricPrint} on {form.aiGeneratedDesign.printZones?.join(', ') || 'selected zones'}
                    </div>
                  )}
                  
                  {form.aiGeneratedDesign.tailorNotes && (
                    <div className="text-xs text-purple-700 mt-2 p-2 bg-purple-100 rounded">
                      {form.aiGeneratedDesign.tailorNotes}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-background/30 gap-2 sm:gap-4">
                <button onClick={() => setStep(1)}
                  className="px-4 sm:px-8 py-2 sm:py-3 border-2 border-secondary text-secondary rounded-full hover:bg-secondary/5 transition-all duration-300 font-semibold flex items-center gap-2 text-sm sm:text-base active:scale-95">
                  <ArrowLeft size={16} className="sm:hidden" />
                  <span>Back</span>
                </button>
                <button onClick={() => { if (validateStep(2)) setStep(3); }}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 hover:-translate-y-0.5 font-semibold text-sm sm:text-base active:scale-95">
                  <span className="hidden sm:inline">Next: Final Details</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-4 sm:p-8 lg:p-12 space-y-6 sm:space-y-8">
              <div className="text-center mb-4 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text mb-2">Final Touches</h2>
                <p className="text-sm sm:text-base text-text/60 font-light">Add notes, measurements, and reference images for perfect fit</p>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-background/50">
                <label className="flex items-center gap-2 font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-text">
                  <Sparkles size={18} className="text-secondary flex-shrink-0" />
                  <span className="text-sm sm:text-base">Design Notes / Special Instructions</span>
                </label>
                <textarea name="designNotes" value={form.designNotes}
                  placeholder="E.g., 'Add embroidery on sleeves', 'Prefer simple design', 'Traditional look'..."
                  onChange={handleChange}
                  className="w-full border-2 border-background/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 h-28 sm:h-32 focus:border-secondary focus:outline-none transition-colors resize-none font-light text-sm sm:text-base"
                  rows="4" />
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-background/50">
                <h3 className="flex items-center gap-2 text-lg sm:text-xl font-serif font-semibold mb-3 sm:mb-4 text-text">
                  <Ruler size={20} className="text-secondary flex-shrink-0" />
                  <span className="text-base sm:text-xl">Measurements (Optional)</span>
                </h3>
                <p className="text-xs sm:text-sm text-text/60 mb-4 sm:mb-6 font-light">
                  Provide your measurements for a perfect fit. Leave blank if you prefer standard sizing.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { key: "bust", label: "Bust (inches)" },
                    { key: "waist", label: "Waist (inches)" },
                    { key: "hips", label: "Hips (inches)" },
                    { key: "shoulder", label: "Shoulder (inches)" },
                    { key: "sleeveLength", label: "Sleeve Length (inches)" },
                    { key: "length", label: "Length (inches)" },
                  ].map(({ key, label }) => (
                    <input key={key} name={key} value={form.measurements[key]}
                      placeholder={label} onChange={handleMeasurementChange}
                      className="border-2 border-background/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-secondary focus:outline-none transition-colors font-light text-sm sm:text-base"
                      type="number" step="0.5" />
                  ))}
                </div>
                <textarea name="customNotes" value={form.measurements.customNotes}
                  placeholder="Additional measurement notes or fitting preferences..."
                  onChange={handleMeasurementChange}
                  className="w-full border-2 border-background/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 mt-3 sm:mt-4 h-20 sm:h-24 focus:border-secondary focus:outline-none transition-colors resize-none font-light text-sm sm:text-base"
                  rows="3" />
              </div>

              {estimatedPrice > 0 && (
                <div className="bg-gradient-to-br from-secondary/5 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2xl border-2 border-secondary/20 shadow-lg">
                  <h3 className="flex items-center gap-2 text-lg sm:text-xl font-serif font-semibold mb-3 sm:mb-4 text-text">
                    <IndianRupee size={20} className="text-secondary flex-shrink-0" />
                    <span className="text-base sm:text-xl">Price Estimate</span>
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs sm:text-sm text-text/60 font-light mb-1">Based on your selections:</p>
                      <p className="text-text/70 text-xs sm:text-sm">{form.dressType} • {form.fabric}</p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <p className="text-3xl sm:text-4xl font-bold text-secondary">₹{estimatedPrice.toLocaleString()}</p>
                      <p className="text-[10px] sm:text-xs text-text/50 mt-1 font-light">Final price may vary</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-background/50">
                <label className="flex items-center gap-2 font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-text">
                  <Upload size={18} className="text-secondary flex-shrink-0" />
                  <span className="text-sm sm:text-base">Reference Images (Optional, Max 5)</span>
                </label>
                <input type="file" multiple accept="image/*" onChange={handleImageChange}
                  className="block w-full border-2 border-background/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-secondary transition-colors file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:bg-secondary/10 file:text-secondary file:font-semibold hover:file:bg-secondary/20 cursor-pointer font-light text-xs sm:text-base" />
                {form.referenceImages.length > 0 && (
                  <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3 flex-wrap">
                    {form.referenceImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Reference ${idx + 1}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg sm:rounded-xl border-2 border-background/50 shadow-lg" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg sm:rounded-xl flex items-center justify-center">
                          <span className="text-white text-xs font-semibold"># {idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-background/30">
                <button onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-secondary text-secondary rounded-full hover:bg-secondary/5 transition-all duration-300 font-semibold flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95">
                  <ArrowLeft size={16} />
                  <span>Back to Design</span>
                </button>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button onClick={handleSaveDraft} disabled={loading}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-secondary text-secondary rounded-full hover:bg-secondary/5 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95">
                    <Save size={18} />
                    <span>{loading ? "Saving..." : "Save Draft"}</span>
                  </button>

                  <button onClick={handleAddToCart} disabled={loading}
                    className="w-full sm:w-auto group px-8 sm:px-10 py-3 sm:py-4 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 hover:-translate-y-0.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base active:scale-95">
                    <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                    <span>{loading ? "Adding..." : "Add to Cart"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.4s ease-out; }

        /* Hide scrollbar for mobile swipe indicator */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Customize;