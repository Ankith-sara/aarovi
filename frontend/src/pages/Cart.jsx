import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Trash2, Plus, Minus, ShoppingBag, Truck, ArrowLeft, ShieldCheck, RefreshCcw, Headset, CreditCard, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import ProgressiveImage from '../components/ProgressiveImage';

const C = { primary: '#4F200D', gold: '#AF8255', bg: '#FBF7F3', text: '#2A1506' };

const Tag = ({ children, color = 'rgba(79,32,13,0.08)', textColor = '#4F200D' }) => (
  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: color, color: textColor }}>{children}</span>
);

const Cart = () => {
  const { products, cartItems, currency, updateQuantity, removeFromCart,
    updateCustomizationQuantity, removeCustomizationFromCart,
    getCartAmount, navigate, delivery_fee } = useContext(ShopContext) ?? {};

  const [cartProducts, setCartProducts] = useState([]);
  const [customizationItems, setCustomizationItems] = useState([]);

  const getEntryQuantity = entry => {
    if (entry === null || entry === undefined) return 0;
    if (typeof entry === 'object') return entry.quantity || 0;
    return entry;
  };

  useEffect(() => {
    if (!cartItems) return;
    const tempProducts = [];
    for (const itemId in cartItems) {
      if (itemId === 'customizations') continue;
      const product = products.find(p => p._id === itemId);
      if (!product) continue;
      for (const size in cartItems[itemId]) {
        const entry = cartItems[itemId][size];
        const quantity = getEntryQuantity(entry);
        if (quantity <= 0) continue;
        tempProducts.push({
          _id: itemId, size, quantity,
          neckStyle: typeof entry === 'object' ? (entry.neckStyle || null) : null,
          sleeveStyle: typeof entry === 'object' ? (entry.sleeveStyle || null) : null,
          specialInstructions: typeof entry === 'object' ? (entry.specialInstructions || null) : null,
          ...product,
        });
      }
    }
    setCartProducts(tempProducts);

    const tempCustomizations = [];
    if (cartItems.customizations) {
      for (const customId in cartItems.customizations) {
        const customItem = cartItems.customizations[customId];
        if (customItem && customItem.quantity > 0) tempCustomizations.push({ _id: customId, ...customItem });
      }
    }
    setCustomizationItems(tempCustomizations);
  }, [cartItems, products]);

  const handleUpdateQuantity = (itemId, size, delta) => {
    const entry = cartItems[itemId]?.[size];
    const newQty = Math.max(0, getEntryQuantity(entry) + delta);
    updateQuantity(itemId, size, newQty);
  };
  const handleUpdateCustomQuantity = (customId, delta) => {
    const newQty = Math.max(0, (cartItems.customizations?.[customId]?.quantity || 0) + delta);
    updateCustomizationQuantity(customId, newQty);
  };
  const handleRemoveItem = (itemId, size) => removeFromCart(itemId, size);
  const handleRemoveCustom = (customId) => { removeCustomizationFromCart(customId); toast.info('Custom design removed'); };

  const cartAmount = getCartAmount();
  const totalAmount = cartAmount + delivery_fee;
  const totalItems = cartProducts.reduce((s, i) => s + i.quantity, 0) + customizationItems.reduce((s, i) => s + i.quantity, 0);

  const QtyControl = ({ qty, onMinus, onPlus, bg = '#f0ece8' }) => (
    <div className="flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: bg }}>
      <button onClick={onMinus} className="p-0.5 transition-opacity hover:opacity-60"><Minus size={13} style={{ color: C.text }} /></button>
      <span className="text-sm font-semibold w-6 text-center" style={{ color: C.text }}>{qty}</span>
      <button onClick={onPlus} className="p-0.5 transition-opacity hover:opacity-60"><Plus size={13} style={{ color: C.text }} /></button>
    </div>
  );

  if (cartProducts.length === 0 && customizationItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: C.bg }}>
        <div className="text-center max-w-md">
          <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8" style={{ background: 'rgba(79,32,13,0.07)' }}>
            <ShoppingBag size={52} style={{ color: 'rgba(79,32,13,0.25)' }} />
          </div>
          <h2 className="text-3xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond',serif", color: C.text }}>Your Cart is Empty</h2>
          <p className="text-sm font-light mb-8" style={{ color: 'rgba(42,21,6,0.5)' }}>Discover our handcrafted collection and find your perfect piece.</p>
          <button onClick={() => navigate('/shop/collection')}
                  className="px-8 py-3.5 text-white rounded-full font-semibold text-sm tracking-wide hover:-translate-y-0.5 transition-all duration-300"
                  style={{ background: C.primary, boxShadow: '0 6px 24px rgba(79,32,13,0.22)' }}>
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 mt-4" style={{ background: C.bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/shop/collection')}
                  className="flex items-center gap-2 text-sm font-medium mb-5 transition-colors hover:opacity-70"
                  style={{ color: 'rgba(42,21,6,0.55)' }}>
            <ArrowLeft size={15} /> Continue Shopping
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight" style={{ fontFamily: "'Cormorant Garamond',serif", color: C.text }}>Shopping Cart</h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(79,32,13,0.07)', color: C.primary }}>
              <Package size={15} /> {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Items */}
          <div className="lg:col-span-2 space-y-4">

            {cartProducts.map((item, idx) => (
              <div key={`${item._id}-${item.size}-${idx}`}
                   className="bg-white rounded-2xl overflow-hidden border transition-shadow duration-300 hover:shadow-lg"
                   style={{ borderColor: 'rgba(79,32,13,0.08)' }}>
                <div className="p-4 sm:p-6 flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden" style={{ background: '#f5f2ef' }}>
                    <div className="relative w-full h-full">
                      <ProgressiveImage src={item.images?.[0]} alt={item.name} width={300} className="object-cover object-top" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 pr-2" style={{ color: C.text }}>{item.name}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <Tag>Size: {item.size}</Tag>
                      {item.neckStyle && <Tag color="rgba(124,58,237,0.08)" textColor="#7c3aed">{item.neckStyle} neck</Tag>}
                      {item.sleeveStyle && <Tag color="rgba(37,99,235,0.08)" textColor="#2563eb">{item.sleeveStyle} sleeve</Tag>}
                    </div>
                    {item.specialInstructions && (
                      <div className="mb-3 px-3 py-2 rounded-lg text-xs leading-relaxed" style={{ background: 'rgba(217,119,6,0.07)', color: '#92400e', border: '1px solid rgba(217,119,6,0.2)' }}>
                        <span className="font-semibold">Note: </span>{item.specialInstructions}
                      </div>
                    )}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="text-xl font-bold" style={{ color: C.primary }}>{currency}{(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-xs" style={{ color: 'rgba(42,21,6,0.4)' }}>{currency}{item.price?.toLocaleString()} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <QtyControl qty={item.quantity}
                          onMinus={() => handleUpdateQuantity(item._id, item.size, -1)}
                          onPlus={() => handleUpdateQuantity(item._id, item.size, 1)} />
                        <button onClick={() => handleRemoveItem(item._id, item.size)}
                                className="p-2 rounded-full transition-all hover:bg-red-50"
                                style={{ color: 'rgba(42,21,6,0.35)' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(42,21,6,0.35)'}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {customizationItems.map((item, idx) => {
              const snap = item.snapshot || {};
              return (
                <div key={`custom-${item._id}-${idx}`}
                     className="bg-white rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                     style={{ border: `2px solid rgba(79,32,13,0.15)` }}>
                  <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                       style={{ background: 'rgba(79,32,13,0.05)', color: C.gold, borderBottom: '1px solid rgba(79,32,13,0.08)' }}>
                    ✦ Custom Design
                  </div>
                  <div className="p-4 sm:p-6 flex gap-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden border" style={{ background: '#f5f2ef', borderColor: 'rgba(79,32,13,0.15)' }}>
                      <div className="relative w-full h-full">
                        <ProgressiveImage src={item.image || snap.canvasDesign?.pngUrl} alt="Custom design" width={300} className="object-contain" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base mb-2" style={{ color: C.text }}>Custom {snap.dressType || 'Design'}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {snap.size && <Tag>Size {snap.size}</Tag>}
                        {snap.neckStyle && <Tag color="rgba(124,58,237,0.08)" textColor="#7c3aed">{snap.neckStyle} neck</Tag>}
                        {snap.sleeveStyle && <Tag color="rgba(37,99,235,0.08)" textColor="#2563eb">{snap.sleeveStyle} sleeve</Tag>}
                        {snap.fabric && <Tag color="rgba(175,130,85,0.1)" textColor="#7a5c2e">{snap.fabric}</Tag>}
                      </div>
                      {snap.specialInstructions && (
                        <div className="mb-3 px-3 py-2 rounded-lg text-xs leading-relaxed" style={{ background: 'rgba(217,119,6,0.07)', color: '#92400e', border: '1px solid rgba(217,119,6,0.2)' }}>
                          <span className="font-semibold">Note: </span>{snap.specialInstructions}
                        </div>
                      )}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <p className="text-xl font-bold" style={{ color: C.primary }}>{currency}{(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-xs" style={{ color: 'rgba(42,21,6,0.4)' }}>{currency}{item.price?.toLocaleString()} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <QtyControl qty={item.quantity}
                            onMinus={() => handleUpdateCustomQuantity(item._id, -1)}
                            onPlus={() => handleUpdateCustomQuantity(item._id, 1)} />
                          <button onClick={() => handleRemoveCustom(item._id)}
                                  className="p-2 rounded-full transition-all hover:bg-red-50"
                                  style={{ color: 'rgba(42,21,6,0.35)' }}
                                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(42,21,6,0.35)'}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl overflow-hidden border lg:sticky lg:top-24" style={{ borderColor: 'rgba(79,32,13,0.08)' }}>
              <div className="px-6 py-4 border-b" style={{ background: C.bg, borderColor: 'rgba(79,32,13,0.08)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: C.gold }}>Order Summary</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-light" style={{ color: 'rgba(42,21,6,0.6)' }}>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold" style={{ color: C.text }}>{currency}{cartAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-light" style={{ color: 'rgba(42,21,6,0.6)' }}><Truck size={13} /> Delivery</span>
                    <span className="font-semibold" style={{ color: C.text }}>{currency}{delivery_fee}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center" style={{ borderColor: 'rgba(79,32,13,0.08)' }}>
                    <span className="font-semibold" style={{ color: C.text }}>Total</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: C.primary }}>{currency}{totalAmount.toLocaleString()}</p>
                      <p className="text-[11px]" style={{ color: 'rgba(42,21,6,0.4)' }}>Including taxes</p>
                    </div>
                  </div>
                </div>

                <button onClick={() => navigate('/place-order')}
                        className="w-full py-4 text-white rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-300"
                        style={{ background: C.primary, boxShadow: '0 6px 24px rgba(79,32,13,0.22)' }}>
                  <CreditCard size={17} /> Proceed to Checkout
                </button>

                <div className="space-y-2.5 pt-2 border-t" style={{ borderColor: 'rgba(79,32,13,0.06)' }}>
                  {[
                    { icon: ShieldCheck, label: 'Secure checkout' },
                    { icon: RefreshCcw, label: 'Free returns within 30 days' },
                    { icon: Headset, label: 'Customer support 24/7' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 text-xs" style={{ color: 'rgba(42,21,6,0.5)' }}>
                      <Icon size={13} style={{ color: '#16a34a', flexShrink: 0 }} /> {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
