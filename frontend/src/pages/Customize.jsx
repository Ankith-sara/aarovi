import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DesignCanvas from "../components/DesignCanvas";
import { Save, Sparkles, Upload, CheckCircle2, Ruler, Palette, Shirt, Package } from "lucide-react";

const Customize = () => {
  const { saveCustomization, submitCustomization, token } = useContext(ShopContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    gender: "",
    dressType: "",
    fabric: "",
    color: "",
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
      backgroundImage: ""
    }
  });

  const [loading, setLoading] = useState(false);

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

  // Fabric options
  const fabricOptions = [
    { value: "Cotton", label: "Cotton", desc: "Breathable & Soft" },
    { value: "Silk", label: "Silk", desc: "Luxurious Shine" },
    { value: "Linen", label: "Linen", desc: "Light & Airy" },
    { value: "Velvet", label: "Velvet", desc: "Rich Texture" },
    { value: "Chanderi", label: "Chanderi", desc: "Traditional Elegance" },
    { value: "Banarasi", label: "Banarasi", desc: "Royal Heritage" },
  ];

  // Color palette
  const colorPalette = [
    { value: "#FF6B6B", label: "Red", name: "Red" },
    { value: "#4ECDC4", label: "Turquoise", name: "Turquoise" },
    { value: "#FFE66D", label: "Yellow", name: "Yellow" },
    { value: "#95E1D3", label: "Mint", name: "Mint" },
    { value: "#F38181", label: "Pink", name: "Pink" },
    { value: "#AA96DA", label: "Purple", name: "Purple" },
    { value: "#FCBAD3", label: "Light Pink", name: "Light Pink" },
    { value: "#A8E6CF", label: "Sea Green", name: "Sea Green" },
    { value: "#FFD93D", label: "Golden", name: "Golden" },
    { value: "#6BCB77", label: "Green", name: "Green" },
    { value: "#4D96FF", label: "Blue", name: "Blue" },
    { value: "#FF8C42", label: "Orange", name: "Orange" },
    { value: "#C70039", label: "Maroon", name: "Maroon" },
    { value: "#581845", label: "Deep Purple", name: "Deep Purple" },
    { value: "#000000", label: "Black", name: "Black" },
    { value: "#FFFFFF", label: "White", name: "White" },
    { value: "#D4A373", label: "Beige", name: "Beige" },
    { value: "#8B4513", label: "Brown", name: "Brown" }
  ];

  // Handle canvas design changes
  const handleDesignChange = (designData) => {
    setForm({ ...form, canvasDesign: designData });
  };

  const handleGenderChange = (gender) => {
    setForm({
      ...form,
      gender,
      dressType: "" // Reset dress type when gender changes
    });
  };

  const handleDressTypeChange = (dressType) => {
    setForm({ ...form, dressType });
  };

  const handleFabricChange = (fabric) => {
    setForm({ ...form, fabric });
  };

  const handleColorChange = (color, colorName) => {
    setForm({ ...form, color: colorName });
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

  const validateForm = () => {
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
    if (!form.color) {
      toast.error("Please select a color");
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

    if (!validateForm()) return;

    try {
      setLoading(true);
      const customizationData = {
        ...form,
        estimatedPrice: 0, // Will be calculated by admin
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

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Please login to submit customization");
      navigate("/login");
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);
      const customizationData = {
        ...form,
        estimatedPrice: 0
      };

      const result = await saveCustomization(customizationData);

      if (result && result._id) {
        const submitted = await submitCustomization(result._id);
        if (submitted) {
          toast.success("Customization submitted successfully! 🎉");
          navigate("/my-customizations");
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit customization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/10 to-white mt-16">
      {/* Header Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
              <Sparkles size={16} className="text-secondary" />
              <span className="text-sm font-semibold text-secondary">Custom Design Studio</span>
            </div>
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
              { num: 2, label: "Design Canvas", icon: Palette },
              { num: 3, label: "Final Touches", icon: Ruler }
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step === s.num
                        ? "bg-secondary text-white shadow-lg shadow-secondary/30 scale-110"
                        : step > s.num
                          ? "bg-green-500 text-white shadow-md"
                          : "bg-background/30 text-text/40"
                        }`}
                    >
                      {step > s.num ? (
                        <CheckCircle2 size={28} />
                      ) : (
                        <Icon size={28} />
                      )}
                    </div>
                    <span className={`text-xs mt-3 font-medium transition-colors ${step >= s.num ? "text-text" : "text-text/40"
                      }`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className={`w-24 h-1 rounded-full transition-colors duration-300 ${step > s.num ? "bg-green-500" : "bg-background/30"
                      }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-background/50 overflow-hidden">
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
                  <Shirt size={20} className="text-secondary" />
                  Select Gender <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["Women", "Men"].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => handleGenderChange(gender)}
                      className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 ${form.gender === gender
                        ? "border-secondary bg-secondary/5 shadow-lg shadow-secondary/20 scale-105"
                        : "border-background/50 hover:border-secondary/50 hover:shadow-md"
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
                    <Package size={20} className="text-secondary" />
                    Select Dress Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {dressTypes[form.gender].map((dress) => (
                      <button
                        key={dress.value}
                        onClick={() => handleDressTypeChange(dress.value)}
                        className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${form.dressType === dress.value
                          ? "border-secondary bg-secondary/5 shadow-lg shadow-secondary/20 scale-105"
                          : "border-background/50 hover:border-secondary/50 hover:shadow-md"
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
              <div className="animate-slideDown">
                <label className="flex items-center gap-2 font-semibold text-lg mb-4 text-text">
                  <Sparkles size={20} className="text-secondary" />
                  Select Fabric <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {fabricOptions.map((fabric) => (
                    <button
                      key={fabric.value}
                      onClick={() => handleFabricChange(fabric.value)}
                      className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${form.fabric === fabric.value
                        ? "border-secondary bg-secondary/5 shadow-lg shadow-secondary/20"
                        : "border-background/50 hover:border-secondary/50 hover:shadow-md"
                        }`}
                    >
                      <div className="font-semibold text-text mb-1">{fabric.label}</div>
                      <div className="text-xs text-text/60">{fabric.desc}</div>
                      {form.fabric === fabric.value && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle2 size={20} className="text-secondary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="animate-slideDown">
                <label className="flex items-center gap-2 font-semibold text-lg mb-4 text-text">
                  <Palette size={20} className="text-secondary" />
                  Select Base Color <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-12 gap-3">
                  {colorPalette.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleColorChange(color.value, color.name)}
                      className={`group relative aspect-square rounded-xl border-4 transition-all duration-300 hover:scale-110 ${form.color === color.name
                        ? "border-secondary scale-110 shadow-lg"
                        : "border-background/30 hover:border-secondary/50"
                        }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {form.color === color.name && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle2 size={20} className="text-white drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {form.color && (
                  <p className="mt-4 text-sm text-text/60 bg-background/20 px-4 py-2 rounded-lg inline-block">
                    Selected: <span className="font-semibold text-secondary">{form.color}</span>
                  </p>
                )}
              </div>

              {/* Design Notes */}
              <div className="animate-slideDown">
                <label className="font-semibold text-lg mb-4 block text-text">
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

              <div className="flex justify-end pt-6">
                <button
                  onClick={() => {
                    if (validateForm()) setStep(2);
                  }}
                  className="group px-8 py-4 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center gap-3 shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 hover:-translate-y-0.5 font-semibold"
                >
                  <span>Next: Design Canvas</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Canvas Design */}
          {step === 2 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-text mb-2">
                  Customize Your Design
                </h2>
                <p className="text-text/60 font-light">
                  Click on zones to add patterns, colors, and personal touches
                </p>
              </div>

              <DesignCanvas
                onDesignChange={handleDesignChange}
                initialDesign={form.canvasDesign}
                dressType={form.dressType}
                selectedColor={colorPalette.find(c => c.name === form.color)?.value || "#000000"}
              />

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="group px-8 py-3 border-2 border-secondary text-secondary rounded-full hover:bg-secondary/5 transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="group px-8 py-4 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center gap-3 shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 hover:-translate-y-0.5 font-semibold"
                >
                  <span>Next: Final Details</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Measurements & Submit */}
          {step === 3 && (
            <div className="p-8 sm:p-12 space-y-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-text mb-2">
                  Final Touches
                </h2>
                <p className="text-text/60 font-light">
                  Add measurements and reference images for perfect fit
                </p>
              </div>

              {/* Measurements */}
              <div className="bg-gradient-to-br from-background/10 to-white rounded-2xl p-8 border border-background/30">
                <h3 className="flex items-center gap-2 text-xl font-serif font-semibold mb-6 text-text">
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

              {/* AI Prompt */}
              <div className="bg-gradient-to-br from-secondary/5 to-white rounded-2xl p-8 border border-secondary/20">
                <label className="flex items-center gap-2 font-semibold text-lg mb-4 text-text">
                  <Sparkles size={20} className="text-secondary" />
                  AI Design Prompt (Optional)
                </label>
                <textarea
                  name="aiPrompt"
                  value={form.aiPrompt}
                  placeholder="E.g., 'Royal wedding kurta with minimal embroidery and gold accents', 'Modern lehenga with floral patterns'..."
                  onChange={handleChange}
                  className="w-full border-2 border-secondary/30 rounded-xl px-4 py-3 h-28 focus:border-secondary focus:outline-none transition-colors resize-none font-light"
                  rows="4"
                />
              </div>

              {/* Reference Images */}
              <div className="bg-gradient-to-br from-background/10 to-white rounded-2xl p-8 border border-background/30">
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
                          className="w-24 h-24 object-cover rounded-xl border-2 border-background/50 shadow-md"
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
                  className="group px-8 py-3 border-2 border-secondary text-secondary rounded-full hover:bg-secondary/5 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
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
                    onClick={handleSubmit}
                    disabled={loading}
                    className="group px-10 py-4 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-300 flex items-center gap-3 shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 hover:-translate-y-0.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{loading ? "Submitting..." : "Submit Design"}</span>
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
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