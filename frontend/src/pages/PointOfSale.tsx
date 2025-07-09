'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/contexts/StoreContext";
import { ShoppingCart, Trash2, Plus, Minus, Package, Pause, Receipt, Calculator } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ProductSearch } from "@/components/POS/ProductSearch";
import { PaymentMethods } from "@/components/POS/PaymentMethods";

export default function PointOfSale() {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, completeSale } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital' | 'mpesa_till' | 'mpesa_paybill'>("cash");
  const [discount, setDiscount] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [requiresPinOverride, setRequiresPinOverride] = useState(false);
  const [overridePin, setOverridePin] = useState("");
  const [barcode, setBarcode] = useState("");

  const categories = ["all", ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesCategory && product.active;
  });

  const subtotal = cart.reduce((sum, item) => sum + ((item.priceOverride || item.product.price) * item.quantity) - item.discount, 0);
  const tax = 0;
  const total = subtotal + tax - discount;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({ title: "Cart Empty", description: "Please add items to cart before checkout", variant: "destructive" });
      return;
    }

    const mappedPaymentMethod =
      paymentMethod === "mpesa_till" || paymentMethod === "mpesa_paybill"
        ? "mpesa"
        : paymentMethod;

    const sale = completeSale(mappedPaymentMethod, discount);
    setIsCheckoutOpen(false);
    setDiscount(0);

    toast({ title: "Sale Completed", description: `Receipt #${sale.receiptNumber} – Total: KES ${sale.total.toFixed(2)}` });
  };

  const handleDiscountChange = (value: number) => {
    if (value > 0 && !requiresPinOverride) {
      setRequiresPinOverride(true);
      return;
    }
    setDiscount(value);
  };

  const validatePinOverride = () => {
    if (overridePin === "1234") {
      setRequiresPinOverride(false);
      setOverridePin("");
      return true;
    }
    toast({ title: "Invalid PIN", description: "Manager PIN required for discounts", variant: "destructive" });
    return false;
  };

  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Point of Sale</h1>
          <p className="text-muted-foreground">Quick and efficient sales processing</p>

          <ProductSearch
            products={products}
            onAddToCart={addToCart}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 bg-muted rounded-lg">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.slice(1, 4).map(category => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={selectedCategory} className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 col-span-full">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Products Found</h3>
                    <p className="text-muted-foreground">Try selecting a different category.</p>
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow border-border" onClick={() => addToCart(product)}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm text-foreground">{product.name}</h3>
                          <Badge variant={product.quantity > product.lowStockThreshold ? "secondary" : "destructive"}>{product.quantity}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">SKU: {product.sku}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-tucktical-primary">KES {product.price.toFixed(2)}</span>
                          <Plus className="h-4 w-4 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card className="h-full border-border">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({cart.length})
                </div>
                <Button size="sm" variant="outline"><Pause className="h-4 w-4" /></Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 p-4">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between bg-muted rounded-lg p-2">
                    <div>
                      <div className="font-medium text-sm text-foreground">{item.product.name}</div>
                      <div className="text-xs text-muted-foreground">KES {(item.priceOverride || item.product.price).toFixed(2)} x {item.quantity}</div>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Button size="sm" variant="outline" onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.product.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span><span>KES {subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-tucktical-secondary"><span>Discount:</span><span>-KES {discount.toFixed(2)}</span></div>}
                <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>KES {total.toFixed(2)}</span></div>
              </div>

              <Input
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const product = products.find(p => p.sku === barcode || p.barcode === barcode);
                    if (product) {
                      addToCart(product);
                    } else {
                      toast({ title: "Not Found", description: `No product for: ${barcode}`, variant: "destructive" });
                    }
                    setBarcode("");
                  }
                }}
                placeholder="Scan barcode..."
                className="w-full"
              />
              <div className="flex gap-2">
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as 'cash' | 'mpesa_till' | 'mpesa_paybill')
                  }
                  className="border rounded px-2 py-1"
                >
                  <option value="cash">Cash</option>
                  <option value="mpesa_till">M-Pesa Till</option>
                  <option value="mpesa_paybill">M-Pesa PayBill</option>
                </select>
                <Button variant="destructive">Clear</Button>
              </div>
              <Button className="w-full" onClick={() => setIsCheckoutOpen(true)}><Receipt className="h-4 w-4 mr-2" />Checkout</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
