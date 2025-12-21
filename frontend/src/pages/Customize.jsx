import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DesignCanvas from "../components/DesignCanvas";

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
    { value: "Cotton", label: "Cotton" },
    { value: "Silk", label: "Silk" },
    { value: "Linen", label: "Linen" },
    { value: "Velvet", label: "Velvet" },
    { value: "Chanderi", label: "Chanderi" },
    { value: "Banarasi", label: "Banarasi" },
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-6 py-12">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Customize Your Outfit
        </h1>
        <p className="text-center text-gray-600 mb-8">Design your dream outfit in 3 easy steps</p>

        {/* Step Indicator */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center space-x-4">
            {[
              { num: 1, label: "Details" },
              { num: 2, label: "Design" },
              { num: 3, label: "Measurements" }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                      step === s.num
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110"
                        : step > s.num
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-600">{s.label}</span>
                </div>
                {idx < 2 && (
                  <div className={`w-20 h-1 mx-3 rounded ${step > s.num ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold mb-6">Step 1: Basic Information</h2>

            {/* Gender Selection */}
            <div>
              <label className="font-semibold text-lg mb-3 block text-gray-700">
                Select Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                {["Women", "Men"].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => handleGenderChange(gender)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      form.gender === gender
                        ? "border-purple-600 bg-purple-50 shadow-lg scale-105"
                        : "border-gray-300 hover:border-purple-400 hover:shadow-md"
                    }`}
                  >
                    <div className="text-4xl mb-2">{gender === "Women" ? "👩" : "👨"}</div>
                    <div className="font-semibold text-lg">{gender}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dress Type Selection */}
            {form.gender && (
              <div>
                <label className="font-semibold text-lg mb-3 block text-gray-700">
                  Select Dress Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {dressTypes[form.gender].map((dress) => (
                    <button
                      key={dress.value}
                      onClick={() => handleDressTypeChange(dress.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        form.dressType === dress.value
                          ? "border-purple-600 bg-purple-50 shadow-lg scale-105"
                          : "border-gray-300 hover:border-purple-400 hover:shadow-md"
                      }`}
                    >
                      <div className="font-medium text-sm">{dress.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fabric Selection */}
            <div>
              <label className="font-semibold text-lg mb-3 block text-gray-700">
                Select Fabric <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {fabricOptions.map((fabric) => (
                  <button
                    key={fabric.value}
                    onClick={() => handleFabricChange(fabric.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      form.fabric === fabric.value
                        ? "border-purple-600 bg-purple-50 shadow-lg"
                        : "border-gray-300 hover:border-purple-400 hover:shadow-md"
                    }`}
                  >
                    <div className="font-medium text-xs">{fabric.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="font-semibold text-lg mb-3 block text-gray-700">
                Select Color <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-x-2 gap-y-8">
                {colorPalette.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value, color.name)}
                    className={`relative group`}
                    title={color.name}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg border-4 transition-all ${
                        form.color === color.name
                          ? "border-purple-600 scale-110 shadow-lg"
                          : "border-gray-300 hover:border-purple-400 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white px-2 py-1 rounded">
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
              {form.color && (
                <p className="mt-4 text-sm text-gray-600">
                  Selected: <span className="font-semibold text-purple-600">{form.color}</span>
                </p>
              )}
            </div>

            {/* Design Notes */}
            <div>
              <label className="font-semibold text-lg mb-3 block text-gray-700">
                Design Notes / Special Instructions
              </label>
              <textarea
                name="designNotes"
                value={form.designNotes}
                placeholder="E.g., 'Add embroidery on sleeves', 'Prefer simple design', 'Traditional look'..."
                onChange={handleChange}
                className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full h-32 focus:border-purple-500 focus:outline-none transition-colors"
                rows="4"
              />
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => {
                  if (validateForm()) setStep(2);
                }}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold text-lg"
              >
                Next: Design Canvas →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Canvas Design */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Step 2: Design Your Outfit</h2>
            
            <DesignCanvas 
              onDesignChange={handleDesignChange}
              initialDesign={form.canvasDesign}
              dressType={form.dressType}
              selectedColor={colorPalette.find(c => c.name === form.color)?.value || "#000000"}
            />

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
              >
                Next: Measurements →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Measurements & Submit */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Step 3: Measurements & Finalize</h2>

            <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700">Measurements (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide your measurements for a perfect fit. Leave blank if you prefer standard sizing.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
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
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
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
              className="border-2 border-gray-300 rounded-xl px-4 py-3 mt-4 w-full h-24 focus:border-purple-500 focus:outline-none transition-colors"
              rows="3"
            />

            <div className="mt-6">
              <label className="font-semibold text-lg mb-3 block text-gray-700">
                AI Design Prompt (Optional)
              </label>
              <textarea
                name="aiPrompt"
                value={form.aiPrompt}
                placeholder="E.g., 'Royal wedding kurta with minimal embroidery and gold accents', 'Modern lehenga with floral patterns'..."
                onChange={handleChange}
                className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full h-28 focus:border-purple-500 focus:outline-none transition-colors"
                rows="4"
              />
            </div>

            <div className="mt-6">
              <label className="font-semibold text-lg mb-3 block text-gray-700">
                Reference Images (Optional, Max 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block mt-2 w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {form.referenceImages.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {form.referenceImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Reference ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-purple-200"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-10">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold"
              >
                ← Back
              </button>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "💾 Save Draft"}
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "🚀 Submit Customization"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customize;