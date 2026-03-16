import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className="w-full space-y-3 text-sm">
      <div className="flex justify-between text-text/70">
        <span>Subtotal</span>
        <span className="font-medium text-text">{currency}{subtotal.toLocaleString('en-IN')}</span>
      </div>
      <div className="flex justify-between text-text/70">
        <span>Shipping</span>
        <span className="font-medium text-text">
          {subtotal === 0 ? '—' : `${currency}${delivery_fee}`}
        </span>
      </div>
      <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-base">
        <span>Total</span>
        <span className="text-secondary">{currency}{total.toLocaleString('en-IN')}</span>
      </div>
      {subtotal > 0 && (
        <p className="text-xs text-text/40 text-right">Including all taxes</p>
      )}
    </div>
  );
};

export default CartTotal;
