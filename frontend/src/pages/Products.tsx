// src/pages/Products.tsx
import React, { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';

interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  stock_quantity: number;
  reorder_level: number;
  active: boolean;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'tucktical Vest',
    sku: 'TV-001',
    barcode: '1234567890',
    price: 1200,
    stock_quantity: 3,
    reorder_level: 5,
    active: true,
  },
  // Add more mock products
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(mockProducts); // Replace with API call later
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Product Inventory</h2>
      <ProductForm onSubmit={(newProduct) => setProducts([...products, newProduct])} />

      <div className="overflow-x-auto mt-6">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Barcode</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={product.stock_quantity <= product.reorder_level ? 'bg-yellow-100' : ''}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.barcode}</td>
                <td>KES {product.price}</td>
                <td>
                  {product.stock_quantity}
                  {product.stock_quantity <= product.reorder_level && (
                    <span className="badge badge-warning ml-2">Low</span>
                  )}
                </td>
                <td>
                  {product.active ? (
                    <span className="badge badge-success">Active</span>
                  ) : (
                    <span className="badge badge-secondary">Inactive</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
