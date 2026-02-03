import React from 'react';
import { Ruler, Info, TrendingUp } from 'lucide-react';

// Size chart data - Essential charts for customization platform
const sizeCharts = {
  womensKurti: {
    title: "Women's Kurti & Kurti Sets",
    headers: ["Size", "Chest (in)", "Waist (in)", "Hip (in)", "Shoulder (in)", "Pant Length (in)"],
    rows: [
      ["XS", "34", "26", "36", "14", "38"],
      ["S", "36", "28", "38", "14.5", "38"],
      ["M", "38", "30", "40", "15", "38"],
      ["L", "40", "32", "42", "15.5", "38"],
      ["XL", "42", "34", "44", "16", "38"],
      ["XXL", "44", "36", "46", "16.5", "38"],
      ["XXXL", "46", "38", "48", "17", "38"]
    ]
  },
  womensLehenga: {
    title: "Women's Lehenga",
    headers: ["Size", "Blouse Chest (in)", "Waist (in)", "Hip (in)", "Skirt Length (in)"],
    rows: [
      ["XS", "34", "30", "38", "41"],
      ["S", "36", "32", "40", "41"],
      ["M", "38", "34", "42", "42"],
      ["L", "40", "36", "44", "42"],
      ["XL", "42", "38", "46", "43"],
      ["XXL", "44", "40", "48", "43"],
      ["XXXL", "46", "42", "50", "44"]
    ]
  },
  womensAnarkali: {
    title: "Women's Anarkali",
    headers: ["Size", "Chest (in)", "Waist (in)", "Hip (in)", "Length (in)", "Flare (in)"],
    rows: [
      ["XS", "34", "30", "38", "50", "64"],
      ["S", "36", "32", "40", "51", "66"],
      ["M", "38", "34", "42", "52", "68"],
      ["L", "40", "36", "44", "53", "70"],
      ["XL", "42", "38", "46", "54", "72"],
      ["XXL", "44", "40", "48", "55", "74"],
      ["XXXL", "46", "42", "50", "56", "76"]
    ]
  },
  womensSherara: {
    title: "Women's Sherara",
    headers: ["Size", "Top Chest (in)", "Waist (in)", "Hip (in)", "Pant Length (in)"],
    rows: [
      ["XS", "34", "26", "36", "14", "38"],
      ["S", "36", "28", "38", "14.5", "38"],
      ["M", "38", "30", "40", "15", "38"],
      ["L", "40", "32", "42", "15.5", "38"],
      ["XL", "42", "34", "44", "16", "38"],
      ["XXL", "44", "36", "46", "16.5", "38"],
      ["XXXL", "46", "38", "48", "17", "38"]
    ]
  },
  mensKurta: {
    title: "Men's Kurta & Kurta Sets",
    headers: ["Size", "Chest (in)", "Shoulder (in)", "Length (in)", "Sleeve (in)"],
    rows: [
      ["24", "32", "16", "38", "23"],
      ["26", "34", "16.5", "38.5", "23"],
      ["28", "36", "17", "39", "23.5"],
      ["30", "38", "17.5", "39.5", "24"],
      ["32", "40", "18", "40", "24.5"],
      ["34", "42", "18.5", "40.5", "25"],
      ["36", "44", "19", "41", "25.5"],
      ["38", "46", "19.5", "41.5", "26"],
      ["40", "48", "20", "42", "26.5"],
      ["42", "50", "20.5", "42.5", "27"],
      ["44", "52", "21", "43", "27.5"],
      ["46", "54", "21.5", "43.5", "28"]
    ]
  },
  mensSherwani: {
    title: "Men's Sherwani",
    headers: ["Size", "Chest (in)", "Shoulder (in)", "Length (in)", "Sleeve (in)", "Bottom Hem (in)"],
    rows: [
      ["24", "32", "16", "42", "24", "20"],
      ["26", "34", "16.5", "42.5", "24", "21"],
      ["28", "36", "17", "43", "24.5", "22"],
      ["30", "38", "17.5", "43.5", "25", "23"],
      ["32", "40", "18", "44", "25.5", "24"],
      ["34", "42", "18.5", "44.5", "26", "25"],
      ["36", "44", "19", "45", "26.5", "26"],
      ["38", "46", "19.5", "45.5", "27", "27"],
      ["40", "48", "20", "46", "27.5", "28"],
      ["42", "50", "20.5", "46.5", "28", "29"],
      ["44", "52", "21", "47", "28.5", "30"],
      ["46", "54", "21.5", "47.5", "29", "31"]
    ]
  }
};

// Helper function to determine which chart to show
const getSizeChartKey = (productName, category, subCategory, gender) => {
  const name = productName?.toLowerCase() || '';
  const cat = category?.toLowerCase() || '';
  const subCat = subCategory?.toLowerCase() || '';
  const genderLower = gender?.toLowerCase() || '';
  
  // Check for women's products
  if (genderLower.includes('women') || cat.includes('women') || subCat.includes('women')) {
    if (subCat.includes('lehenga') || subCat.includes('lehangas') || name.includes('lehenga')) {
      return 'womensLehenga';
    }
    if (subCat.includes('anarkali') || name.includes('anarkali')) {
      return 'womensAnarkali';
    }
    if (subCat.includes('sherara') || name.includes('sherara')) {
      return 'womensSherara';
    }
    return 'womensKurti';
  }
  
  // Check for men's products
  if (genderLower.includes('men') || cat.includes('men') || subCat.includes('men')) {
    if (subCat.includes('sherwani') || name.includes('sherwani')) {
      return 'mensSherwani';
    }
    return 'mensKurta';
  }
  
  // Fallback
  if (cat.includes('women') || subCat.includes('kurti')) return 'womensKurti';
  return 'mensKurta';
};

/**
 * SizeChart Component - Inline size chart display
 * Use this for displaying size charts directly on product pages
 */
const SizeChart = ({ 
  productName, 
  category, 
  subCategory, 
  gender,
  compact = false,
  className = "" 
}) => {
  const chartKey = getSizeChartKey(productName, category, subCategory, gender);
  const chart = sizeCharts[chartKey];
  
  if (!chart) return null;
  
  return (
    <div className={`bg-white rounded-lg ${compact ? 'p-4' : 'p-6'} ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center border border-background">
          <Ruler size={20} className="text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-text">
            {chart.title}
          </h3>
          <p className="text-xs text-text/60 font-light">
            All measurements in inches
          </p>
        </div>
      </div>
      
      {/* Size Table */}
      <div className={`overflow-x-auto rounded-lg border-2 border-background shadow-sm ${compact ? 'mb-3' : 'mb-6'}`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary text-white">
              {chart.headers.map((header, index) => (
                <th 
                  key={index} 
                  className={`${compact ? 'px-2 py-2 text-xs' : 'px-4 py-3 text-sm'} text-left font-semibold uppercase tracking-wider whitespace-nowrap`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`${rowIndex % 2 === 0 ? 'bg-gradient-to-r from-background/10 to-primary' : 'bg-white'} hover:bg-background/20 transition-colors`}
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className={`${compact ? 'px-2 py-2 text-xs' : 'px-4 py-2.5 text-sm'} ${cellIndex === 0 ? 'font-bold text-secondary' : 'text-text/70'} border-b border-background/30 whitespace-nowrap`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Measurement Guide - Only show in non-compact mode */}
      {!compact && (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info size={14} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-serif font-semibold text-text mb-2">📏 How to Measure</p>
                <ul className="text-xs text-text/70 space-y-1.5 font-light">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong className="text-text">Chest/Bust:</strong> Around fullest part, tape parallel to floor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong className="text-text">Waist:</strong> Around natural waistline (narrowest part)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong className="text-text">Hip:</strong> Around fullest part of hips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong className="text-text">Shoulder:</strong> From one shoulder point to other across back</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong className="text-text">Length:</strong> From shoulder seam to desired length</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-4 border-l-4 border-amber-500">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp size={14} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-text/70 font-light leading-relaxed">
                  <span className="font-serif font-semibold text-text">💡 Pro Tips:</span> Measure over undergarments, keep tape snug but not tight, size up if between sizes. 
                  Handcrafted garments may vary by ±0.5".
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeChart;