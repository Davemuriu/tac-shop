import { useEffect, useState } from "react";
import { loadProductsFromExcel } from "../utils/excelReader";
import { exportSalesToExcel } from "../utils/excelWriter";
import { Product, SaleEntry } from "../types";
import Cart from "./Cart";

const POS = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    loadProductsFromExcel("/products.xlsx").then((data) => {
      setProducts(data);
    });
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.SKU === product.SKU);
      if (existing) {
        return prevCart.map((item) =>
          item.SKU === product.SKU
            ? { ...item, Quantity: item.Quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, Quantity: 1 }];
    });
  };

  const removeFromCart = (sku: string) => {
    setCart((prev) => prev.filter((item) => item.SKU !== sku));
  };

  const handleCheckout = () => {
    const salesData: SaleEntry[] = cart.map((item) => ({
      dateTime: new Date().toLocaleString(),
      SKU: item.SKU,
      productName: item.Name,
      quantity: item.Quantity,
      price: item.Price,
      total: item.Price * item.Quantity,
    }));

    exportSalesToExcel(salesData);
    alert("Sale saved. Excel file downloaded.");
    setCart([]);
  };

  return (
    <div>
      <h2>Point of Sale</h2>
      <div>
        {products.map((p) => (
          <div key={p.SKU}>
            {p.Name} - KES {p.Price}
            <button onClick={() => addToCart(p)}>Add</button>
          </div>
        ))}
      </div>

      <Cart cart={cart} onRemove={removeFromCart} onCheckout={handleCheckout} />
    </div>
  );
};

export default POS;
