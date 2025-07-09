import React from "react";
import { Product } from "../types";

interface CartProps {
  cart: Product[];
  onRemove: (sku: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, onRemove, onCheckout }) => {
  const total = cart.reduce(
    (sum, item) => sum + item.Price * item.Quantity,
    0
  );

  return (
    <div>
      <h3>Cart</h3>
      {cart.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.SKU}>
              {item.Name} - KES {item.Price} × {item.Quantity} ={" "}
              <strong>KES {item.Price * item.Quantity}</strong>
              <button onClick={() => onRemove(item.SKU)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <hr />
      <p><strong>Total: KES {total}</strong></p>
      {cart.length > 0 && <button onClick={onCheckout}>Checkout</button>}
    </div>
  );
};

export default Cart;
