import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import DesignCanvas from "../components/DesignCanvas";
import { Save, ShoppingCart, Upload, CheckCircle2, Ruler, Palette, Shirt, Package, ArrowRight, Sparkles } from "lucide-react";

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
      sleeveStyle: ""
    }
  });

  const [loading, setLoading] = useState(false);

  // PRICING MATRIX - Based on dress type and fabric
  const PRICING_MATRIX = {
    "Kurti": {
      "Cotton": 1500,
      "Silk": 2800,
      "Georgette": 2200,
      "Kota": 1800,
      "Chiffon": 2400,
      "Crape": 2000,
      "Lenin": 2500,
      "Chanderi": 3200,
      "Banarasi": 4500
    },
    "Kurti Sets": {
      "Cotton": 2500,
      "Silk": 4200,
      "Georgette": 3500,
      "Kota": 2800,
      "Chiffon": 3800,
      "Crape": 3200,
      "Lenin": 3800,
      "Chanderi": 4800,
      "Banarasi": 6500
    },
    "Kurta": {
      "Cotton": 1800,
      "Raw Silk": 3200,
      "Lenin": 2500,
      "Velvet": 3800,
      "Banarasi": 4800
    },
    "Kurta Sets": {
      "Cotton": 3000,
      "Raw Silk": 4800,
      "Lenin": 3800,
      "Velvet": 5200,
      "Banarasi": 6800
    },
    "Lehenga": {
      "Banarasi": 8500,
      "Georgette": 5500,
      "Chiffon": 6200,
      "Crape": 5800,
      "Tissue": 7200,
      "Pattu": 9500
    },
    "Anarkali": {
      "Georgette": 4200,
      "Chiffon": 4500,
      "Crape": 3800,
      "Tissue": 5200,
      "Pattu": 6500,
      "Banarasi": 7200,
      "Cotton": 2800
    },
    "Sherwani": {
      "Raw Silk": 6500,
      "Velvet": 8200,
      "Banarasi": 9500
    },
    "Sheraras": {
      "Georgette": 5800,
      "Banarasi": 8200,
      "Silk": 6800,
      "Chiffon": 6200,
      "Crape": 5500
    }
  };

  // Calculate estimated price
  const calculatePrice = () => {
    if (!form.dressType || !form.fabric) return 0;
    return PRICING_MATRIX[form.dressType]?.[form.fabric] || 0;
  };

  // Gender-specific dress types
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

  // Fabric options based on dress type
  const fabricOptions = {
    "Kurti": [
      { value: "Cotton", label: "Cotton" },
      { value: "Silk", label: "Silk" },
      { value: "Georgette", label: "Georgette" },
      { value: "Kota", label: "Kota" },
      { value: "Chiffon", label: "Chiffon" },
      { value: "Crape", label: "Crape" },
      { value: "Lenin", label: "Lenin" },
      { value: "Chanderi", label: "Chanderi" },
      { value: "Banarasi", label: "Banarasi" }
    ],
    "Kurti Sets": [
      { value: "Cotton", label: "Cotton" },
      { value: "Silk", label: "Silk" },
      { value: "Georgette", label: "Georgette" },
      { value: "Kota", label: "Kota" },
      { value: "Chiffon", label: "Chiffon" },
      { value: "Crape", label: "Crape" },
      { value: "Lenin", label: "Lenin" },
      { value: "Chanderi", label: "Chanderi" },
      { value: "Banarasi", label: "Banarasi" }
    ],
    "Sheraras": [
      { value: "Georgette", label: "Georgette" },
      { value: "Banarasi", label: "Banarasi" },
      { value: "Silk", label: "Silk" },
      { value: "Chiffon", label: "Chiffon" },
      { value: "Crape", label: "Crape" }
    ],
    "Lehenga": [
      { value: "Banarasi", label: "Banarasi" },
      { value: "Georgette", label: "Georgette" },
      { value: "Chiffon", label: "Chiffon" },
      { value: "Crape", label: "Crape" },
      { value: "Tissue", label: "Tissue" },
      { value: "Pattu", label: "Pattu" }
    ],
    "Anarkali": [
      { value: "Georgette", label: "Georgette" },
      { value: "Chiffon", label: "Chiffon" },
      { value: "Crape", label: "Crape" },
      { value: "Tissue", label: "Tissue" },
      { value: "Pattu", label: "Pattu" },
      { value: "Banarasi", label: "Banarasi" },
      { value: "Cotton", label: "Cotton" }
    ],
    "Kurta": [
      { value: "Cotton", label: "Cotton" },
      { value: "Raw Silk", label: "Raw Silk" },
      { value: "Lenin", label: "Lenin" },
      { value: "Velvet", label: "Velvet" },
      { value: "Banarasi", label: "Banarasi" }
    ],
    "Kurta Sets": [
      { value: "Cotton", label: "Cotton" },
      { value: "Raw Silk", label: "Raw Silk" },
      { value: "Lenin", label: "Lenin" },
      { value: "Velvet", label: "Velvet" },
      { value: "Banarasi", label: "Banarasi" }
    ],
    "Sherwani": [
      { value: "Raw Silk", label: "Raw Silk" },
      { value: "Velvet", label: "Velvet" },
      { value: "Banarasi", label: "Banarasi" }
    ]
  };

  const getAvailableFabrics = () => {
    return fabricOptions[form.dressType] || [];
  };

  const handleDesignChange = (designData) => {
    setForm({ 
      ...form, 
      canvasDesign: designData,
      color: designData.color // Update color when changed in DesignCanvas
    });
  };

  const handleGenderChange = (gender) => {
    setForm({
      ...form,
      gender,
      dressType: "",
      fabric: ""
    });
  };

  const handleDressTypeChange = (dressType) => {
    setForm({
      ...form,
      dressType,
      fabric: ""
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMeasurementChange = (e) => {
    setForm({
      ...form,
      measurements: {
        ...form.measurements,
        [e.target.name]: e.target.value,
      },
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
        files.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      setForm({ ...form, referenceImages: base64Images });
      toast.success(`${files.length} image(s) uploaded`);
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Failed to upload images");
    }
  };

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      if (!form.gender) {
        toast.error("Please select gender");
        return false;
      }
      if (!form.dressType) {
        toast.error("Please select dress type");
        return false;
      }
      if (!form.fabric) {
        toast.error("Please select fabric");
        return false;
      }
      return true;
    }
    if (stepNum === 2) {
      if (!form.color) {
        toast.error("Please select a color");
        return false;
      }
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
      const estimatedPrice = calculatePrice();
      
      const customizationData = {
        ...form,
        estimatedPrice,
      };

      const result = await saveCustomization(customizationData);
      if (result) {
        toast.success("Customization saved as draft");
      }
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
      const estimatedPrice = calculatePrice();
      
      const customizationData = {
        ...form,
        estimatedPrice,
        status: "Ready for Cart"
      };

      // First save the customization
      const result = await saveCustomization(customizationData);

      if (result && result._id) {
        // Then add to cart
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
    <div className="mt-16 min-h-screen">
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">
              Design Your Dream Outfit
            </h1>
            <p className="text-text/60 font-light text-lg">
              Create a unique, personalized piece that reflects your style in just 3 simple steps
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: "Basic Details", icon: Shirt },
              { num: 2, label: "Design & Colors", icon: Palette },
              { num: 3, label: "Final Details", icon: Ruler }
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        step === s.num
                          ? "bg-secondary text-white shadow-xl shadow-secondary/30 scale-110"
                          : step > s.num
                          ? "bg-green-500 text-white shadow-lg"
                          : "bg-background/30 text-text/40"
                      }`}
                    >
                      {step > s.num ? (
                        <CheckCircle2 size={28} />
                      ) : (
                        <Icon size={28} />
                      )}
                    </div>
                    <span className={`text-xs mt-3 font-medium transition-colors ${
                      step >= s.num ? "text-text" : "text-text/40"
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className={`w-24 h-1 rounded-full transition-colors duration-300 ${
                      step > s.num ? "bg-green-500" : "bg-background/30"
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Price Display */}
        {estimatedPrice > 0 && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl px-8 py-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Estimated Price</p>
                <p className="text-3xl font-bold text-text">₹{estimatedPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl border border-background/50 overflow-hidden">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="p-8 sm:p-12 space-y-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-text mb-2">
                  Tell Us Your Preferences
                </h2>
                <p className="text-text/60 font-light">
                  Select your style essentials to get started
                </p>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="flex items-center gap-2 font-semibold text-lg mb-4 text-text">
                  Select Gender <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["Women", "Men"].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => handleGenderChange(gender)}
                      className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                        form.gender === gender
                          ? "border-secondary bg-secondary/5 shadow-xl shadow-secondary/20 scale-105"
                          : "border-background/50 hover:border-secondary/50 hover:shadow-lg"
                      }`}
                    >
                      <div className="font-semibold text-2xl text-text mb-2">{gender}</div>
                      <div className="text-sm text-text/60 font-light">Select {gender.toLowerCase()}'s wear</div>
                      {form.gender === gender && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle2 size={24} className="text-secondary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dress Type Selection */}
              {form.gender && (
                <div className="animate-slideDown">
                  <label className="flex items-center gap-2 font-semibold text-lg mb-4 text-text">
                    Select Dress Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {dressTypes[form.gender].map((dress) => (
                      <button
                        key={dress.value}
                        onClick={() => handleDressTypeChange(dress.value)}
                        className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                          form.dressType === dress.value
                            ? "border-secondary bg-secondary/5 shadow-xl shadow-secondary/20 scale-105"
                            : "border-background/50 hover:border-secondary/50 hover:shadow-lg"
                        }`}
                      >
                        <div className="font-semibold text-text">{dress.label}</div>
                        {form.dressType === dress.value && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 size={20} className="text-secondary" />
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
                  <label className="flex items-center gap-2 font-semibold text-lg mb-4 text-text">
                    Select Fabric <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getAvailableFabrics().map((fabric) => {
                      const price = PRICING_MATRIX[form.dressType]?.[fabric.value] || 0;
                      return (
                        <button
                          key={fabric.value}
                          onClick={() => setForm({ ...form, fabric: fabric.value })}
                          className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                            form.fabric === fabric.value
                              ? "border-secondary bg-secondary/5 shadow-xl shadow-secondary/20 scale-105"
                              : "border-background/50 hover:border-secondary/50 hover:shadow-lg"
                          }`}
                        >
                          <div className="font-semibold text-text mb-1">{fabric.label}</div>
                          <div className="text-sm text-text font-bold">₹{price.toLocaleString()}</div>
                          {form.fabric === fabric.value && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle2 size={20} className="text-secondary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-background/30">
                <button
                  onClick={() => {
                    if (validateStep(1)) setStep(2);
                  }}
                  className="group px-8 py-4 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center gap-3 shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 hover:-translate-y-0.5 font-semibold"
                >
                  <span>Next: Design & Colors</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Canvas Design & Color Picker */}
          {step === 2 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-text mb-2">
                  Customize Your Design
                </h2>
                <p className="text-text/60 font-light">
                  Select your color and customize patterns on different zones
                </p>
              </div>

              {/* Design Canvas (color picker is now inside the Styles tab) */}
              <DesignCanvas
                onDesignChange={handleDesignChange}
                initialDesign={form.canvasDesign}
                dressType={form.dressType}
                selectedColor={form.color}
                gender={form.gender}
              />

              <div className="flex justify-between mt-8 pt-6 border-t border-background/30">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-3 border-2 border-secondary text-secondary rounded-full hover:bg-secondary/5 transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  <span>Back</span>
                </button>
                <button
                  onClick={() => {
                    if (validateStep(2)) setStep(3);
                  }}
                  className="group px-8 py-4 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center gap-3 shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 hover:-translate-y-0.5 font-semibold"
                >
                  <span>Next: Final Details</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Notes, Measurements & Images */}
          {step === 3 && (
            <div className="p-8 sm:p-12 space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-text mb-2">
                  Final Touches
                </h2>
                <p className="text-text/60 font-light">
                  Add notes, measurements, and reference images for perfect fit
                </p>
              </div>

              {/* Design Notes */}
              <div className="bg-white rounded-2xl p-6 border border-background/50">
                <label className="flex items-center gap-2 font-semibold text-lg mb-4 text-text">
                  <Sparkles size={20} className="text-secondary" />
                  Design Notes / Special Instructions
                </label>
                <textarea
                  name="designNotes"
                  value={form.designNotes}
                  placeholder="E.g., 'Add embroidery on sleeves', 'Prefer simple design', 'Traditional look'..."
                  onChange={handleChange}
                  className="w-full border-2 border-background/50 rounded-xl px-4 py-3 h-32 focus:border-secondary focus:outline-none transition-colors resize-none font-light"
                  rows="4"
                />
              </div>

              {/* Measurements */}
              <div className="bg-gradient-to-br from-background/10 to-white rounded-2xl p-6 border border-background/50">
                <h3 className="flex items-center gap-2 text-xl font-serif font-semibold mb-4 text-text">
                  <Ruler size={22} className="text-secondary" />
                  Measurements (Optional)
                </h3>
                <p className="text-sm text-text/60 mb-6 font-light">
                  Provide your measurements for a perfect fit. Leave blank if you prefer standard sizing.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: "bust", label: "Bust (inches)" },
                    { key: "waist", label: "Waist (inches)" },
                    { key: "hips", label: "Hips (inches)" },
                    { key: "shoulder", label: "Shoulder (inches)" },
                    { key: "sleeveLength", label: "Sleeve Length (inches)" },
                    { key: "length", label: "Length (inches)" },
                  ].map(({ key, label }) => (
                    <input
                      key={key}
                      name={key}
                      value={form.measurements[key]}
                      placeholder={label}
                      onChange={handleMeasurementChange}
                      className="border-2 border-background/50 rounded-xl px-4 py-3 focus:border-secondary focus:outline-none transition-colors font-light"
                      type="number"
                      step="0.5"
                    />
                  ))}
                </div>

                <textarea
                  name="customNotes"
                  value={form.measurements.customNotes}
                  placeholder="Additional measurement notes or fitting preferences..."
                  onChange={handleMeasurementChange}
                  className="w-full border-2 border-background/50 rounded-xl px-4 py-3 mt-4 h-24 focus:border-secondary focus:outline-none transition-colors resize-none font-light"
                  rows="3"
                />
              </div>

              {/* Reference Images */}
              <div className="bg-white rounded-2xl p-6 border border-background/50">
                <label className="flex items-center gap-2 font-semibold text-lg mb-4 text-text">
                  <Upload size={20} className="text-secondary" />
                  Reference Images (Optional, Max 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full border-2 border-background/50 rounded-xl px-4 py-3 focus:border-secondary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-secondary/10 file:text-secondary file:font-semibold hover:file:bg-secondary/20 cursor-pointer font-light"
                />
                {form.referenceImages.length > 0 && (
                  <div className="mt-4 flex gap-3 flex-wrap">
                    {form.referenceImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Reference ${idx + 1}`}
                          className="w-24 h-24 object-cover rounded-xl border-2 border-background/50 shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <span className="text-white text-xs font-semibold"># {idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-background/30">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3 border-2 border-secondary text-secondary rounded-full hover:bg-secondary/5 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <span>Back to Design</span>
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={handleSaveDraft}
                    disabled={loading}
                    className="px-8 py-3 border-2 border-secondary text-secondary rounded-full hover:bg-secondary/5 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Save size={20} />
                    <span>{loading ? "Saving..." : "Save Draft"}</span>
                  </button>

                  <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="group px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-0.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                    <span>{loading ? "Adding..." : "Add to Cart"}</span>
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Customize;