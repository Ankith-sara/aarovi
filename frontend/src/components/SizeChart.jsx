import React, { useState } from 'react';
import { X, Ruler, Info, TrendingUp } from 'lucide-react';

// Size chart data organized by product type
const sizeCharts = {
    unisexRelaxedPants: {
        title: "Unisex Relaxed Fit Pant",
        subtitle: "(Sudhhvasa, Samatva, Tandav, Kayavritt)",
        headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)", "Length (in)"],
        rows: [
            ["XS", "28", "42", "27", "38"],
            ["S", "30", "44", "28", "39.5"],
            ["M", "32", "46", "29", "41"],
            ["L", "36", "48", "30", "42.5"],
            ["XL", "40", "50", "30.5", "43.5"],
            ["XXL", "44", "52", "31", "45"]
        ]
    },
    mensRegularTrousers: {
        title: "Men's Regular Trouser",
        subtitle: "(Rekha)",
        headers: ["Size", "Alpha", "Waist (in)", "Hip (in)", "Inseam (in)", "Full Length (in)"],
        rows: [
            ["28", "XS", "28", "34", "30", "40"],
            ["30", "S", "30", "36", "30.5", "40.5"],
            ["32", "M", "32", "38", "31", "41"],
            ["34", "L", "34", "40", "31.5", "42"],
            ["36", "XL", "36", "42", "32", "42.5"],
            ["38", "XXL", "38", "44", "32", "43"]
        ]
    },
    looseFitHalfPants: {
        title: "Loose Fit Men's Half Pant",
        subtitle: "(Neelambar)",
        headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)", "Full Length (in)"],
        rows: [
            ["XS", "26", "36", "7", "18"],
            ["S", "28", "38", "7.5", "18.5"],
            ["M", "30", "40", "8", "19"],
            ["L", "32", "42", "8.5", "20"],
            ["XL", "34", "44", "9", "21"],
            ["XXL", "36", "46", "9.5", "21.5"]
        ]
    },
    regularFitHalfPants: {
        title: "Regular Fit Men's Half Pant",
        subtitle: "(Prakriti)",
        headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)", "Full Length (in)"],
        rows: [
            ["XS", "28", "34", "6.5", "18"],
            ["S", "30", "36", "7", "18.5"],
            ["M", "32", "38", "7.5", "19"],
            ["L", "34", "40", "8", "20"],
            ["XL", "36", "44", "8.5", "21"],
            ["XXL", "38", "46", "9", "22"]
        ]
    },
    tennisCollarShirt: {
        title: "Tennis Collar Men's Shirt",
        subtitle: "(Samatva, Prakriti, Neelambar)",
        headers: ["Size", "Chest (in)", "Shoulder (in)", "Shirt Length (in)", "Sleeve Length (in)", "Neck Opening (in)"],
        rows: [
            ["XS", "42", "18.5", "29", "9", "7.25"],
            ["S", "44", "19", "29.5", "9.5", "7.5"],
            ["M", "46", "19.5", "30", "10", "7.75"],
            ["L", "48", "20", "30.5", "10.5", "8"],
            ["XL", "50", "20.5", "31", "11", "8.25"],
            ["XXL", "52", "21", "31.5", "11.5", "8.5"]
        ]
    },
    mensLongKurta: {
        title: "Men's Long Kurta",
        subtitle: "(Chandra)",
        headers: ["Size", "Chest (in)", "Shoulder (in)", "Length (in)", "Bottom Hem (in)", "Sleeve (in)"],
        rows: [
            ["XS", "40", "17.5", "39", "23", "24"],
            ["S", "42", "18", "39.5", "24", "24"],
            ["M", "44", "18.5", "40", "25", "25"],
            ["L", "46", "19", "40.5", "26", "26"],
            ["XL", "48", "19.5", "41", "27", "27"],
            ["XXL", "50", "20", "41.5", "28", "27"]
        ]
    },
    mensShortKurta: {
        title: "Men's Short Kurta",
        subtitle: "(Avikarya, Sangatam)",
        headers: ["Size", "Chest (in)", "Shoulder (in)", "Length (in)", "Bottom Hem (in)", "Sleeve (in)"],
        rows: [
            ["XS", "40", "17.5", "29", "22.5", "24"],
            ["S", "42", "18", "29.5", "23", "24"],
            ["M", "44", "18.5", "30", "23.5", "25"],
            ["L", "46", "19", "30.5", "24", "26"],
            ["XL", "48", "19.5", "31", "24.5", "27"],
            ["XXL", "50", "20", "31.5", "25", "27"]
        ]
    },
    mensOversizeKurta: {
        title: "Men's Oversize Kurta",
        subtitle: "(Parakhya)",
        headers: ["Size", "Chest (in)", "Shoulder (in)", "Length (in)", "Bottom Hem (in)", "Sleeve (in)"],
        rows: [
            ["XS", "42", "19", "29.5", "24", "13"],
            ["S", "44", "19.5", "30", "25", "13.5"],
            ["M", "46", "20", "30.5", "26", "14"],
            ["L", "48", "20.5", "31.5", "27", "14.5"],
            ["XL", "50", "21", "32", "28", "15"],
            ["XXL", "52", "22", "32.5", "29", "15.5"]
        ]
    },
    mensFullSleeveShirt: {
        title: "Men's Full Sleeve Shirt",
        subtitle: "(Achal, Aatma, Avyakta, Kamanam)",
        headers: ["Size", "Chest (in)", "Shoulder (in)", "Length (in)", "Sleeve Length (in)", "Neck (in)"],
        rows: [
            ["XS", "40", "17.5", "28.5", "24.5", "14.5"],
            ["S", "42", "18", "29", "25", "15"],
            ["M", "44", "18.5", "29.5", "25.5", "15.5"],
            ["L", "46", "19", "30", "26", "16"],
            ["XL", "48", "19.5", "30.5", "26.5", "16.5"],
            ["XXL", "50", "20", "31", "27", "17"]
        ]
    },
    mensHalfSleeveShirt: {
        title: "Men's Half Sleeve Shirt",
        subtitle: "(Tusht, Achhedya, Sajjayen, Nitya, Vihay, Vriksha)",
        headers: ["Size", "Chest (in)", "Shoulder (in)", "Length (in)", "Sleeve Length (in)", "Neck (in)"],
        rows: [
            ["XS", "40", "17.5", "28.5", "9", "14.5"],
            ["S", "42", "18", "29", "9.5", "15"],
            ["M", "44", "18.5", "29.5", "10", "15.5"],
            ["L", "46", "19", "30", "10.5", "16"],
            ["XL", "48", "19.5", "30.5", "11", "16.5"],
            ["XXL", "50", "20", "31", "11.5", "17"]
        ]
    },
    mensTunicShirt: {
        title: "Men's Tunic Shirt",
        subtitle: "(Tripundra)",
        headers: ["Size", "Chest (in)", "Shoulder (in)", "Shirt Length (in)", "Sleeve Length (in)"],
        rows: [
            ["XS", "42", "17.5", "27.5", "9"],
            ["S", "44", "18", "28", "9.5"],
            ["M", "46", "18.5", "28.5", "10"],
            ["L", "48", "19", "29", "10.5"],
            ["XL", "50", "19.5", "29.5", "11"],
            ["XXL", "52", "20", "30", "11.5"]
        ]
    },
    mensTandavShirt: {
        title: "Men's Half Sleeve Shirt - Tandav",
        subtitle: "",
        headers: ["Size", "Chest (in)", "Shoulder (in)", "Length (in)", "Sleeve Length (in)"],
        rows: [
            ["XS", "40", "17.5", "25", "10"],
            ["S", "42", "18", "25.5", "10.5"],
            ["M", "44", "18.5", "26", "11"],
            ["L", "46", "19", "26.5", "11.5"],
            ["XL", "48", "19.5", "27", "12"],
            ["XXL", "50", "20", "27.5", "12.5"]
        ]
    }
};

// Helper function to determine which chart to show based on product details
const getSizeChartKey = (productName, category, subCategory) => {
    const name = productName?.toLowerCase() || '';
    const cat = category?.toLowerCase() || '';
    const subCat = subCategory?.toLowerCase() || '';

    // Product name matching
    const productNames = {
        'sudhhvasa': 'unisexRelaxedPants',
        'samatva': 'unisexRelaxedPants',
        'tandav': 'unisexRelaxedPants',
        'kayavritt': 'unisexRelaxedPants',
        'rekha': 'mensRegularTrousers',
        'neelambar': 'looseFitHalfPants',
        'prakriti': 'regularFitHalfPants',
        'chandra': 'mensLongKurta',
        'avikarya': 'mensShortKurta',
        'sangatam': 'mensShortKurta',
        'parakhya': 'mensOversizeKurta',
        'achal': 'mensFullSleeveShirt',
        'aatma': 'mensFullSleeveShirt',
        'avyakta': 'mensFullSleeveShirt',
        'kamanam': 'mensFullSleeveShirt',
        'tusht': 'mensHalfSleeveShirt',
        'achhedya': 'mensHalfSleeveShirt',
        'sajjayen': 'mensHalfSleeveShirt',
        'nitya': 'mensHalfSleeveShirt',
        'vihay': 'mensHalfSleeveShirt',
        'vriksha': 'mensHalfSleeveShirt',
        'tripundra': 'mensTunicShirt'
    };

    // Check product name first
    for (const [key, value] of Object.entries(productNames)) {
        if (name.includes(key)) {
            return value;
        }
    }

    // Category-based fallback
    if (cat.includes('kurta') || subCat.includes('kurta')) {
        if (name.includes('long') || subCat.includes('long')) return 'mensLongKurta';
        if (name.includes('oversize') || subCat.includes('oversize')) return 'mensOversizeKurta';
        return 'mensShortKurta';
    }

    if (cat.includes('shirt') || subCat.includes('shirt')) {
        if (name.includes('full sleeve') || subCat.includes('full sleeve')) return 'mensFullSleeveShirt';
        if (name.includes('tunic') || subCat.includes('tunic')) return 'mensTunicShirt';
        if (name.includes('tennis') || subCat.includes('tennis')) return 'tennisCollarShirt';
        return 'mensHalfSleeveShirt';
    }

    if (cat.includes('trouser') || subCat.includes('trouser')) {
        return 'mensRegularTrousers';
    }

    if (cat.includes('shorts') || subCat.includes('shorts') || cat.includes('half pant')) {
        if (name.includes('loose') || subCat.includes('loose')) return 'looseFitHalfPants';
        return 'regularFitHalfPants';
    }

    if (cat.includes('pant') || cat.includes('bottom')) {
        return 'unisexRelaxedPants';
    }

    // Default
    return 'mensHalfSleeveShirt';
};

const SizeChartModal = ({ isOpen, onClose, productName, category, subCategory }) => {
    if (!isOpen) return null;

    const chartKey = getSizeChartKey(productName, category, subCategory);
    const chart = sizeCharts[chartKey];

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto border border-background animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-background/20 to-primary border-b border-background px-6 py-5 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center border border-background">
                            <Ruler size={20} className="text-secondary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold text-text">
                                {chart.title}
                            </h3>
                            {chart.subtitle && (
                                <p className="text-sm text-text/60 font-light mt-0.5">{chart.subtitle}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} className="text-text/60" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Size Table */}
                    <div className="overflow-x-auto rounded-lg border-2 border-background shadow-sm">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-secondary text-white">
                                    {chart.headers.map((header, index) => (
                                        <th key={index} className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">
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
                                                className={`px-4 py-3 text-sm ${cellIndex === 0 ? 'font-semibold text-text' : 'text-text/70'} border-b border-background/30`}
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Measurement Guide */}
                    <div className="mt-6 space-y-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-5 border-l-4 border-blue-500">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Info size={16} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-serif font-semibold text-text mb-3">📏 How to Measure</p>
                                    <ul className="text-sm text-text/70 space-y-2 font-light">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span><strong className="text-text">Chest:</strong> Measure around the fullest part of your chest</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span><strong className="text-text">Waist:</strong> Measure around your natural waistline</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span><strong className="text-text">Hip:</strong> Measure around the fullest part of your hips</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span><strong className="text-text">Shoulder:</strong> Measure from one shoulder point to the other across your back</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span><strong className="text-text">Sleeve:</strong> Measure from shoulder to wrist with arm slightly bent</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-5 border-l-4 border-amber-500">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <TrendingUp size={16} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-text/70 font-light leading-relaxed">
                                        <span className="font-serif font-semibold text-text">💡 Sizing Tip:</span> If you're between sizes, we recommend sizing up for a more comfortable fit.
                                        All measurements are in inches and may vary slightly due to the handcrafted nature of our products.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-lg"
                        >
                            Got It
                        </button>
                    </div>
                </div>
              </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

// Demo component to test the size chart
const SizeChartDemo = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({
        name: 'Chandra Long Kurta',
        category: 'Men',
        subCategory: 'Kurta'
    });

    const demoProducts = [
        { name: 'Chandra Long Kurta', category: 'Men', subCategory: 'Long Kurta' },
        { name: 'Rekha Trouser', category: 'Men', subCategory: 'Trousers' },
        { name: 'Neelambar Shorts', category: 'Men', subCategory: 'Shorts' },
        { name: 'Achal Shirt', category: 'Men', subCategory: 'Full Sleeve Shirt' },
        { name: 'Tripundra Tunic', category: 'Men', subCategory: 'Tunic' },
        { name: 'Prakriti Half Pant', category: 'Men', subCategory: 'Shorts' },
        { name: 'Sudhhvasa Pant', category: 'Unisex', subCategory: 'Relaxed Pant' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background/20 to-primary p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-2xl p-8 mb-8 border border-background">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center">
                            <Ruler size={24} className="text-secondary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-text">Dynamic Size Chart System</h1>
                            <p className="text-text/60 font-light">
                                Select a product to view its specific size chart
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {demoProducts.map((product, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setModalOpen(true);
                                }}
                                className="p-5 border-2 border-background rounded-lg hover:border-secondary hover:shadow-lg transition-all text-left group bg-gradient-to-br from-background/10 to-primary"
                            >
                                <h3 className="font-serif font-semibold text-lg text-text group-hover:text-secondary transition-colors">{product.name}</h3>
                                <p className="text-sm text-text/60 font-light mb-3">{product.category} • {product.subCategory}</p>
                                <div className="flex items-center gap-2 text-sm text-text/60 group-hover:text-secondary font-semibold">
                                    <Ruler size={16} />
                                    <span>View Size Chart</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-2xl p-8 border border-background">
                    <h2 className="text-2xl font-serif font-bold text-text mb-6">Integration Instructions</h2>
                    <div className="space-y-4 text-sm">
                        <div className="p-5 bg-gradient-to-br from-background/10 to-primary rounded-lg border-l-4 border-secondary">
                            <h3 className="font-semibold text-text mb-2">1. Import the Component</h3>
                            <code className="text-xs bg-white/80 p-3 block rounded font-mono text-text/70">
                                import SizeChartModal from './components/SizeChartModal';
                            </code>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-background/10 to-primary rounded-lg border-l-4 border-secondary">
                            <h3 className="font-semibold text-text mb-2">2. Add State Management</h3>
                            <code className="text-xs bg-white/80 p-3 block rounded font-mono text-text/70">
                                const [showSizeChart, setShowSizeChart] = useState(false);
                            </code>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-background/10 to-primary rounded-lg border-l-4 border-secondary">
                            <h3 className="font-semibold text-text mb-2">3. Add the Modal</h3>
                            <code className="text-xs bg-white/80 p-3 block rounded font-mono text-text/70 whitespace-pre-wrap">
                                {`<SizeChartModal
  isOpen={showSizeChart}
  onClose={() => setShowSizeChart(false)}
  productName={productData.name}
  category={productData.category}
  subCategory={productData.subCategory}
/>`}
                            </code>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-background/10 to-primary rounded-lg border-l-4 border-secondary">
                            <h3 className="font-semibold text-text mb-2">4. Add Trigger Button</h3>
                            <code className="text-xs bg-white/80 p-3 block rounded font-mono text-text/70">
                                {`<button onClick={() => setShowSizeChart(true)}>Size Guide</button>`}
                            </code>
                        </div>
                    </div>
                </div>
            </div>

            <SizeChartModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                productName={selectedProduct.name}
                category={selectedProduct.category}
                subCategory={selectedProduct.subCategory}
            />
        </div>
    );
};

export default SizeChartDemo;