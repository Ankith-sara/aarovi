import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Camera, ChevronDown, ChevronUp, Minus, Plus, Heart, Share2, Ruler, Package, Truck, Shield, RefreshCw, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Check, Info } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';
import RecentlyViewed from '../components/RecentlyViewed';
import SizeChartModal from '../components/SizeChartModal';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, navigate, addProductToRecentlyViewed, toggleWishlist, isInWishlist, token } = useContext(ShopContext) || {};
  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const modalRef = useRef(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [expandedSection, setExpandedSection] = useState('description');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(productData._id, size, quantity);
    setIsAddedToCart(true);
    setSize('');
    setQuantity(1);
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    const wasAdded = await toggleWishlist(productId);
    if (wasAdded !== undefined) {
      setIsWishlisted(wasAdded);
    }
  };

  const handleShare = () => {
    const shareData = {
      title: productData.name,
      text: `Check out this product: ${productData.name}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((err) => {});
    } else {
      navigator.clipboard.writeText(shareData.url).then(() => {
        alert("Product link copied to clipboard!");
      });
    }
  };

  const zoomIn = () => {
    if (zoomLevel < 1.5) setZoomLevel(zoomLevel + 0.1);
  };

  const zoomOut = () => {
    if (zoomLevel > 0.5) setZoomLevel(zoomLevel - 0.1);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % productData.images.length;
    setCurrentIndex(nextIndex);
    if (isModalOpen) {
      setModalImage(productData.images[nextIndex]);
    }
  };

  const handlePrev = () => {
    const prevIndex = currentIndex === 0 ? productData.images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    if (isModalOpen) {
      setModalImage(productData.images[prevIndex]);
    }
  };

  const openModal = (img) => {
    setModalImage(img);
    setModalOpen(true);
    setZoomLevel(1);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setModalOpen(false);
    setModalImage('');
    setZoomLevel(1);
    document.body.style.overflow = 'unset';
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(productData.images[currentIndex]);
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen && !showSizeChart) return;
      switch (e.key) {
        case 'Escape':
          showSizeChart ? setShowSizeChart(false) : closeModal();
          break;
        case 'ArrowLeft':
          if (isModalOpen) handlePrev();
          break;
        case 'ArrowRight':
          if (isModalOpen) handleNext();
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, showSizeChart, currentIndex, productData]);

  useEffect(() => {
    const product = products?.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      addProductToRecentlyViewed(product);
      setIsWishlisted(isInWishlist(productId));
    }
  }, [productId, products, addProductToRecentlyViewed, isInWishlist]);

  useEffect(() => {
    if (productData?.name) {
      document.title = `${productData.name} | Aarovi`;
    }
  }, [productData?.name]);

  useEffect(() => {
    if (productId) {
      setIsWishlisted(isInWishlist(productId));
    }
  }, [productId, isInWishlist]);

  useEffect(() => {
    setIsAddedToCart(false);
  }, [productId]);

  if (!productData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-background border-t-secondary rounded-full animate-spin mx-auto mb-6"></div>
          <span className="text-text/60 font-light text-lg">Loading product...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-20">
      {/* Product Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group bg-background/20 overflow-hidden cursor-pointer" onClick={handleImageClick}>
                <div className="relative aspect-[3/4]">
                  <img
                    src={productData.images[currentIndex]}
                    alt={productData.name}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Zoom Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 text-text px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    <Camera size={12} />
                    <span>Click to enlarge</span>
                  </div>

                  {/* Navigation */}
                  {productData.images.length > 1 && (
                    <>
                      <button
                        className="absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 bg-white/95 text-text shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 bg-white/95 text-text shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}

                  {/* Counter */}
                  <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-1.5 text-xs font-medium text-text shadow-lg">
                    {currentIndex + 1} / {productData.images.length}
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {productData.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`aspect-square overflow-hidden transition-all duration-300 ${
                      currentIndex === index 
                        ? 'ring-2 ring-secondary shadow-lg' 
                        : 'ring-1 ring-background/50 hover:ring-secondary/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Sticky Product Details */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              {/* Product Header */}
              <div className="border-b border-background/50 pb-6">
                <div className="flex items-start justify-between mb-3">
                  <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text leading-tight pr-4">
                    {productData.name}
                  </h1>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={handleWishlistToggle}
                      className={`w-11 h-11 flex items-center justify-center transition-all duration-300 ${
                        isWishlisted 
                          ? 'bg-secondary text-white' 
                          : 'bg-background/50 text-text hover:bg-secondary hover:text-white'
                      }`}
                      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        size={17}
                        fill={isWishlisted ? 'currentColor' : 'none'}
                        stroke="currentColor"
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-11 h-11 bg-background/50 text-text hover:bg-secondary hover:text-white flex items-center justify-center transition-all duration-300"
                      title="Share"
                    >
                      <Share2 size={17} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-serif font-bold text-secondary">{currency}{productData.price}</span>
                  <span className="text-sm text-text/50 font-light">Incl. GST</span>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-3 text-xs text-text/60">
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} className="text-secondary" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck size={14} className="text-secondary" />
                    <span>Free shipping</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw size={14} className="text-secondary" />
                    <span>Easy returns</span>
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-text uppercase tracking-wider">Select Size</label>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="text-xs text-secondary hover:text-secondary/80 font-medium underline flex items-center gap-1"
                  >
                    <Ruler size={14} />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[...productData.sizes].sort((a, b) => {
                    const sizeOrder = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7 };
                    const aNum = parseInt(a);
                    const bNum = parseInt(b);
                    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
                    const aOrder = sizeOrder[a.toUpperCase()] || 999;
                    const bOrder = sizeOrder[b.toUpperCase()] || 999;
                    return aOrder - bOrder;
                  }).map((s, index) => (
                    <button
                      key={index}
                      onClick={() => setSize(size === s ? '' : s)}
                      className={`min-w-[3rem] px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                        size === s
                          ? 'bg-secondary text-white'
                          : 'bg-background/40 text-text hover:bg-background/60'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-xs font-bold text-text uppercase tracking-wider mb-3 block">Quantity</label>
                <div className="inline-flex items-center border border-background/50">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="w-11 h-11 flex items-center justify-center hover:bg-background/20 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} className={quantity <= 1 ? "text-text/30" : "text-text"} />
                  </button>
                  <input
                    type="number"
                    className="w-16 h-11 text-center focus:outline-none bg-transparent font-semibold text-text"
                    value={quantity}
                    min="1"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value !== "" && value !== "0") {
                        setQuantity(Number(value));
                      }
                    }}
                  />
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="w-11 h-11 flex items-center justify-center hover:bg-background/20 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {!isAddedToCart ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={!size}
                    className="w-full py-4 bg-secondary text-white font-semibold uppercase tracking-wider hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {!size && <Info size={16} />}
                    <span>{!size ? 'Please select a size' : 'Add to Cart'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleViewCart}
                    className="w-full py-4 bg-text text-white font-semibold uppercase tracking-wider hover:bg-text/90 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>View Cart</span>
                  </button>
                )}
                <Link
                  to="/customize"
                  className="w-full py-4 border-2 border-secondary text-secondary font-semibold uppercase tracking-wider hover:bg-secondary hover:text-white transition-all duration-300 flex items-center justify-center"
                >
                  Customize This Product
                </Link>
              </div>

              {/* Product Information */}
              <div className="border-t border-background/50 pt-6">
                <div className="space-y-1">
                  {[
                    { id: 'description', title: 'Product Details', content: productData.description },
                    { 
                      id: 'washcare', 
                      title: 'Care Instructions', 
                      content: (
                        <ul className="space-y-1.5 text-sm">
                          <li>• Dry clean or hand wash with mild detergent</li>
                          <li>• Do not machine wash or soak</li>
                          <li>• Wash separately, dry inside out in shade</li>
                          <li>• Slight irregularities are natural in handcrafted items</li>
                        </ul>
                      )
                    },
                    { 
                      id: 'delivery', 
                      title: 'Shipping & Delivery', 
                      content: (
                        <div className="text-sm space-y-1.5">
                          <p>• Standard: 3-5 business days</p>
                          <p>• Express: 1-2 business days (extra charges)</p>
                        </div>
                      )
                    },
                    { 
                      id: 'returns', 
                      title: 'Returns & Exchanges', 
                      content: (
                        <div className="text-sm space-y-1.5">
                          <p>• 7-day return policy from delivery</p>
                          <p>• Items must be unused in original packaging</p>
                          <p>• Refunds processed in 5-7 business days</p>
                        </div>
                      )
                    }
                  ].map((section) => (
                    <div key={section.id} className="border-b border-background/30 last:border-b-0">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full py-4 flex justify-between items-center text-left font-semibold text-text hover:text-secondary transition-colors"
                      >
                        <span className="text-sm uppercase tracking-wider">{section.title}</span>
                        {expandedSection === section.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {expandedSection === section.id && (
                        <div className="pb-4 text-text/70 font-light leading-relaxed">
                          {typeof section.content === 'string' ? <p className="text-sm">{section.content}</p> : section.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        productName={productData.name}
        category={productData.category}
        subCategory={productData.subCategory}
      />

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalImage}
              alt="Product Detail"
              className="max-w-full max-h-[90vh] object-contain transition-transform duration-200 shadow-2xl"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          {/* Controls */}
          <button
            className="absolute top-6 right-6 w-12 h-12 bg-white/95 text-text flex items-center justify-center hover:bg-white transition-colors shadow-xl"
            onClick={closeModal}
          >
            <X size={20} />
          </button>
          
          <button
            className="absolute top-1/2 left-6 -translate-y-1/2 w-12 h-12 bg-white/95 text-text flex items-center justify-center hover:bg-white transition-colors shadow-xl"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            className="absolute top-1/2 right-6 -translate-y-1/2 w-12 h-12 bg-white/95 text-text flex items-center justify-center hover:bg-white transition-colors shadow-xl"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-6 right-6 flex gap-3">
            <button
              className="w-12 h-12 bg-white/95 text-text flex items-center justify-center hover:bg-white transition-colors shadow-xl"
              onClick={(e) => { e.stopPropagation(); zoomIn(); }}
            >
              <ZoomIn size={20} />
            </button>
            <button
              className="w-12 h-12 bg-white/95 text-text flex items-center justify-center hover:bg-white transition-colors shadow-xl"
              onClick={(e) => { e.stopPropagation(); zoomOut(); }}
            >
              <ZoomOut size={20} />
            </button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 text-text px-6 py-3 text-sm font-semibold shadow-xl">
            {currentIndex + 1} / {productData.images.length}
          </div>
        </div>
      )}

      {/* Related Products */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentProductId={productId} />
      </section>

      {/* Recently Viewed */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <RecentlyViewed />
      </section>

      <style jsx>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default Product;