
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Scan, Plus } from "lucide-react";
import { Product } from "@/types";

interface ProductSearchProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ProductSearch({ products, onAddToCart, searchQuery, onSearchChange }: ProductSearchProps) {
  const [showScanner, setShowScanner] = useState(false);

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      (product.barcode && product.barcode.includes(query))
    ) && product.active;
  });

  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      onAddToCart(product);
      onSearchChange("");
    }
    setShowScanner(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, or barcode..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowScanner(true)}
          title="Scan Barcode"
        >
          <Scan className="h-4 w-4" />
        </Button>
      </div>

      {searchQuery && filteredProducts.length > 0 && (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredProducts.slice(0, 5).map((product) => (
            <Card 
              key={product.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onAddToCart(product)}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      {product.quantity <= product.lowStockThreshold && (
                        <Badge variant="destructive" className="text-xs">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      SKU: {product.sku} | Stock: {product.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-tucktical-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showScanner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Scan Barcode</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Point your camera at a barcode to scan it.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setShowScanner(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={() => handleBarcodeScanned("123456789")} 
                className="flex-1"
              >
                Demo Scan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
