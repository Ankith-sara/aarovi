import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext) ?? {};
  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(79,32,13,0.1)', background: '#FBF7F3' }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(79,32,13,0.1)' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#AF8255' }}>Order Summary</p>
      </div>
      <div className="px-5 py-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="font-light" style={{ color: 'rgba(42,21,6,0.6)' }}>Subtotal</span>
          <span className="font-semibold" style={{ color: '#2A1506' }}>{currency}{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-light" style={{ color: 'rgba(42,21,6,0.6)' }}>Shipping</span>
          <span className="font-semibold" style={{ color: '#2A1506' }}>
            {subtotal === 0 ? '—' : `${currency}${delivery_fee}`}
          </span>
        </div>
        <div className="border-t pt-3 flex justify-between font-semibold text-base" style={{ borderColor: 'rgba(79,32,13,0.1)' }}>
          <span style={{ color: '#2A1506' }}>Total</span>
          <span style={{ color: '#4F200D' }}>{currency}{total.toLocaleString('en-IN')}</span>
        </div>
        {subtotal > 0 && (
          <p className="text-right text-[11px] font-light" style={{ color: 'rgba(42,21,6,0.4)' }}>Including all taxes</p>
        )}
      </div>
    </div>
  );
};

export default CartTotal;
