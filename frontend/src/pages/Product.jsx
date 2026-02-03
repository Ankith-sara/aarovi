import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Camera, ChevronDown, ChevronUp, Minus, Plus, Heart, Share2, Ruler, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Check, Info, ShoppingCart } from 'lucide-react';
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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [expandedSection, setExpandedSection] = useState('description');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const minSwipeDistance = 50;
  const stickyBarRef = useRef(null);

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
    if (!size) {
      // Scroll to size selection on mobile
      const sizeSection = document.getElementById('size-selection');
      if (sizeSection) {
        sizeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a shake animation to highlight size selection
        sizeSection.classList.add('animate-shake');
        setTimeout(() => sizeSection.classList.remove('animate-shake'), 500);
      }
      return;
    }
    addToCart(productData._id, size, quantity);
    setIsAddedToCart(true);
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

  const handleShare = async () => {
    const shareData = {
      title: productData.name,
      text: `Check out ${productData.name} at Aasvi`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackCopyLink();
        }
      }
    } else {
      fallbackCopyLink();
    }
  };

  const fallbackCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      // Show toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-24 left-1/2 -translate-x-1/2 bg-text text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideDown';
      toast.textContent = 'Link copied to clipboard!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    });
  };

  const zoomIn = () => {
    if (zoomLevel < 2) setZoomLevel(zoomLevel + 0.2);
  };

  const zoomOut = () => {
    if (zoomLevel > 0.5) setZoomLevel(zoomLevel - 0.2);
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

  // Touch handlers for swiping
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

    if (isLeftSwipe && currentIndex < productData.images.length - 1) {
      handleNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      handlePrev();
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

  // Improved size sorting function
  const sortSizes = (sizes) => {
    return [...sizes].sort((a, b) => {
      const sizeOrder = { 'XS': 0, 'S': 1, 'M': 2, 'L': 3, 'XL': 4, 'XXL': 5, 'XXXL': 6, 'XXXXL': 7, '2XL': 5, '3XL': 6, };

      const aUpper = a.toString().toUpperCase().trim();
      const bUpper = b.toString().toUpperCase().trim();

      // Check if both are numeric sizes
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      const aIsNum = !isNaN(aNum) && aNum.toString() === a.toString().trim();
      const bIsNum = !isNaN(bNum) && bNum.toString() === b.toString().trim();

      if (aIsNum && bIsNum) {
        return aNum - bNum;
      }

      if (aIsNum && !bIsNum) return -1;
      if (!aIsNum && bIsNum) return 1;

      const aOrder = sizeOrder[aUpper];
      const bOrder = sizeOrder[bUpper];

      if (aOrder !== undefined && bOrder !== undefined) {
        return aOrder - bOrder;
      }

      if (aOrder !== undefined) return -1;
      if (bOrder !== undefined) return 1;

      return aUpper.localeCompare(bUpper);
    });
  };

  // Sticky bar scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const detailsSection = document.getElementById('product-details');
      if (detailsSection) {
        const rect = detailsSection.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      document.title = `${productData.name} | Aasvi`;
    }
  }, [productData?.name]);

  useEffect(() => {
    if (productId) {
      setIsWishlisted(isInWishlist(productId));
    }
  }, [productId, isInWishlist]);

  useEffect(() => {
    setIsAddedToCart(false);
    setSize('');
    setQuantity(1);
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

  // FIXED: Parse description into bullet points
  const descriptionPoints = productData.description
    ? productData.description.split('\n').filter(point => point.trim())
    : ['Premium quality ethnic wear', 'Comfortable fabric', 'Perfect for all occasions'];

  return (
    <div className="min-h-screen bg-white mt-16 sm:mt-20 pb-20 sm:pb-0">
      {/* Product Section */}
      <section className="py-0 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-0 sm:gap-6 lg:gap-12">
            <div className="space-y-3 sm:space-y-4 sm:px-6">
              {/* Main Image */}
              <div
                className="relative group overflow-hidden bg-gray-50"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onClick={handleImageClick}
              >
                <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                  <img
                    src={productData.images[currentIndex]}
                    alt={productData.name}
                    className="w-full h-full object-contain select-none"
                    style={{
                      imageRendering: '-webkit-optimize-contrast',
                    }}
                    draggable="false"
                    loading="eager"
                  />

                  <div className="hidden sm:flex absolute top-4 right-4 bg-white/95 text-text px-3 py-1.5 text-xs font-medium items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg pointer-events-none">
                    <Camera size={12} />
                    <span>Click to enlarge</span>
                  </div>

                  {productData.images.length > 1 && (
                    <>
                      <button
                        className="hidden sm:flex absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 bg-white/95 text-text shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        className="hidden sm:flex absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 bg-white/95 text-text shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}

                  {/* Image Counter & Swipe Indicator */}
                  <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between px-3">
                    <div className="bg-white/95 px-3 py-1.5 text-xs font-medium text-text shadow-lg">
                      {currentIndex + 1} / {productData.images.length}
                    </div>
                    {productData.images.length > 1 && (
                      <div className="sm:hidden bg-white/95 px-3 py-1.5 text-xs font-medium text-text shadow-lg flex items-center gap-1">
                        <ChevronLeft size={12} />
                        <span>Swipe</span>
                        <ChevronRight size={12} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="overflow-x-auto scrollbar-hide px-4 sm:px-0 -mx-4 sm:mx-0">
                <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 bg-primary p-2 min-w-min sm:min-w-0">
                  {productData.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`flex-shrink-0 w-20 h-24 sm:w-auto sm:h-auto sm:aspect-[4/5] overflow-hidden transition-all duration-300 ${currentIndex === index
                        ? 'ring-2 ring-secondary shadow-lg'
                        : 'ring-1 ring-background/50 active:ring-secondary/50'
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
            </div>

            {/* Product Details */}
            <div id="product-details" className="lg:sticky lg:top-24 lg:self-start space-y-5 sm:space-y-6 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-0">
              {/* Header */}
              <div className="border-b border-background/50 pb-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-text leading-tight flex-1">
                    {productData.name}
                  </h1>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={handleWishlistToggle}
                      className={`w-11 h-11 flex items-center justify-center transition-all duration-300 active:scale-95 ${isWishlisted
                        ? 'bg-secondary text-white'
                        : 'bg-background/50 text-text'
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
                      className="w-11 h-11 bg-background/50 text-text flex items-center justify-center transition-all duration-300 active:scale-95"
                      title="Share"
                    >
                      <Share2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-4xl font-serif font-bold text-secondary">{currency}{productData.price}</span>
                  <span className="text-sm text-text/50 font-light">Incl. GST</span>
                </div>
              </div>

              {/* Size Selection */}
              <div id="size-selection" className="scroll-mt-24">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-text uppercase tracking-wider">Select Size</label>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="text-xs text-secondary font-medium underline flex items-center gap-1 active:scale-95"
                  >
                    <Ruler size={14} />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sortSizes(productData.sizes).map((s, index) => (
                    <button
                      key={index}
                      onClick={() => setSize(size === s ? '' : s)}
                      className={`min-w-[3.5rem] px-4 py-3 text-sm font-semibold transition-all duration-200 active:scale-95 ${size === s
                        ? 'bg-secondary text-white'
                        : 'bg-background/40 text-text'
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
                    className="w-12 h-12 flex items-center justify-center active:bg-background/40 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} className={quantity <= 1 ? "text-text/30" : "text-text"} />
                  </button>
                  <input
                    type="number"
                    className="w-16 h-12 text-center focus:outline-none bg-transparent font-semibold text-text"
                    value={quantity}
                    min="1"
                    readOnly
                  />
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="w-12 h-12 flex items-center justify-center active:bg-background/40 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden sm:block space-y-3 pt-2">
                {!isAddedToCart ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-secondary text-white font-semibold uppercase tracking-wider hover:bg-secondary/90 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {!size ? (
                      <>
                        <Info size={16} />
                        <span>Please select a size</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleViewCart}
                    className="w-full py-4 bg-text text-white font-semibold uppercase tracking-wider hover:bg-text/90 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    <span>View Cart</span>
                  </button>
                )}
              </div>

              {/* Product Information */}
              <div className="border-t border-background/50 pt-5">
                <div className="space-y-1">
                  {[
                    {
                      id: 'description',
                      title: 'Product Details',
                      content: (
                        <ul className="list-disc pl-5 space-y-2">
                          {descriptionPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      )
                    },
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
                          <p>• Standard: 7-9 business days</p>
                          <p>• Express: 4-5 business days (extra charges)</p>
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
                        className="w-full py-4 flex justify-between items-center text-left font-semibold text-text active:text-secondary transition-colors"
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

      {/* Mobile Sticky Bottom Bar */}
      <div
        ref={stickyBarRef}
        className={`sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-background/50 p-4 transition-transform duration-300 z-40 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="text-xs text-text/50 font-medium mb-1">Price</div>
            <div className="text-xl font-serif font-bold text-secondary">{currency}{productData.price}</div>
          </div>
          {!isAddedToCart ? (
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 bg-secondary text-white font-semibold uppercase tracking-wider active:bg-secondary/90 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingCart size={18} />
              <span className="text-sm">Add to Cart</span>
            </button>
          ) : (
            <button
              onClick={handleViewCart}
              className="flex-1 py-3 bg-text text-white font-semibold uppercase tracking-wider active:bg-text/90 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="text-sm">View Cart</span>
            </button>
          )}
        </div>
      </div>

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
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={closeModal}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalImage}
              alt="Product Detail"
              className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
              style={{
                transform: `scale(${zoomLevel})`,
                imageRendering: '-webkit-optimize-contrast',
              }}
              draggable="false"
            />
          </div>

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 w-11 h-11 bg-white/95 text-text flex items-center justify-center active:bg-white transition-colors shadow-xl z-10"
            onClick={closeModal}
          >
            <X size={20} />
          </button>

          {/* Desktop Navigation */}
          <button
            className="hidden sm:flex absolute top-1/2 left-6 -translate-y-1/2 w-12 h-12 bg-white/95 text-text items-center justify-center active:bg-white transition-colors shadow-xl"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            className="hidden sm:flex absolute top-1/2 right-6 -translate-y-1/2 w-12 h-12 bg-white/95 text-text items-center justify-center active:bg-white transition-colors shadow-xl"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Zoom Controls - Desktop only */}
          <div className="hidden sm:flex absolute bottom-6 right-6 gap-3">
            <button
              className="w-12 h-12 bg-white/95 text-text flex items-center justify-center active:bg-white transition-colors shadow-xl"
              onClick={(e) => { e.stopPropagation(); zoomIn(); }}
            >
              <ZoomIn size={20} />
            </button>
            <button
              className="w-12 h-12 bg-white/95 text-text flex items-center justify-center active:bg-white transition-colors shadow-xl"
              onClick={(e) => { e.stopPropagation(); zoomOut(); }}
            >
              <ZoomOut size={20} />
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 text-text px-4 py-2 text-sm font-semibold shadow-xl">
            {currentIndex + 1} / {productData.images.length}
          </div>

          {/* Mobile Swipe Indicator */}
          {productData.images.length > 1 && (
            <div className="sm:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 text-text px-4 py-2 text-xs font-medium shadow-xl flex items-center gap-1">
              <ChevronLeft size={12} />
              <span>Swipe</span>
              <ChevronRight size={12} />
            </div>
          )}
        </div>
      )}

      {/* Related Products */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 pt-8">
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentProductId={productId} />
      </section>

      {/* Recently Viewed */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <RecentlyViewed />
      </section>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        /* Prevent pull-to-refresh on mobile */
        body {
          overscroll-behavior-y: contain;
        }

        /* Better touch targets */
        @media (hover: none) {
          button, a {
            min-height: 44px;
            min-width: 44px;
          }
        }

        /* Improve image quality */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
};

export default Product;