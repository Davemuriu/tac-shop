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
import { OfflineBanner } from "@/components/Layout/OfflineBanner";

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
  const tax = 0; // Zero tax
  const total = subtotal + tax - discount;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to cart before checkout",
        variant: "destructive"
      });
      return;
    }

    const mappedPaymentMethod =
      paymentMethod === "mpesa_till" || paymentMethod === "mpesa_paybill"
        ? "mpesa"
        : paymentMethod;

    const sale = completeSale(mappedPaymentMethod, discount);
    setIsCheckoutOpen(false);
    setDiscount(0);

    toast({
      title: "Sale Completed",
      description: `Receipt #${sale.receiptNumber} – Total: KES ${sale.total.toFixed(2)}`
    });
  };

  const handlePaymentMethodChange = (method: typeof paymentMethod) => {
    setPaymentMethod(method);
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
    toast({
      title: "Invalid PIN",
      description: "Manager PIN required for discounts",
      variant: "destructive"
    });
    return false;
  };

  const handleHoldCart = () => toast({ title: "Cart Held", description: "Cart has been saved for later." });
  const clearCart = () => toast({ title: "Cart Cleared", description: "All items removed from cart." });
  const resumeCart = () => toast({ title: "Cart Resumed", description: "Saved cart restored." });

  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left: Products */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Point of Sale</h1>
            <p className="text-muted-foreground">Quick and efficient sales processing</p>
          </div>

          <ProductSearch
            products={products}
            onAddToCart={addToCart}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <style>
              {`
              [role="tab"] {
                color: var(--foreground);
              }
              [role="tab"][data-state="active"] {
                background-color: var(--card);
                color: var(--primary);
                border-bottom: 2px solid var(--primary);
              }
              `}
            </style>

            <TabsList className="grid w-full grid-cols-4 bg-muted rounded-lg">
              <TabsTrigger value="all" className="py-2 px-3">All</TabsTrigger>
              {categories.slice(1, 4).map(category => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="py-2 px-3 text-sm text-foreground"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              <div className="max-h-[500px] overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Products Found</h3>
                    <p className="text-muted-foreground">Try selecting a different category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="cursor-pointer hover:shadow-md transition-shadow border-border"
                        onClick={() => addToCart(product)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-sm leading-tight text-foreground">{product.name}</h3>
                            <div className="flex gap-1">
                              <Badge variant={product.quantity > product.lowStockThreshold ? "secondary" : "destructive"}>
                                {product.quantity}
                              </Badge>
                              {product.quantity <= product.lowStockThreshold && (
                                <Badge variant="destructive" className="text-xs">Low</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">SKU: {product.sku}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-tucktical-primary">
                              KES {product.price.toFixed(2)}
                            </span>
                            <Button size="sm" variant="outline">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Cart */}
        <div className="space-y-4">
          <Card className="h-full border-border">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({cart.length})
                </div>
                <Button size="sm" variant="outline" onClick={handleHoldCart}>
                  <Pause className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 p-4">
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate text-foreground">{item.product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        KES {(item.priceOverride || item.product.price).toFixed(2)} each
                        {item.discount > 0 && (
                          <span className="text-tucktical-secondary ml-1">(-KES {item.discount.toFixed(2)})</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline" onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="h-6 w-6 p-0">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm text-foreground">{item.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="h-6 w-6 p-0">
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.product.id)} className="h-6 w-6 p-0 ml-1">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Subtotal:</span><span>KES {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Tax (0%):</span><span>KES {tax.toFixed(2)}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-tucktical-secondary">
                    <span>Discount:</span><span>-KES {discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span><span className="text-tucktical-primary">KES {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Modal */}
              <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg"><Receipt className="h-4 w-4 mr-2" />Checkout</Button>
                </DialogTrigger>

                <DialogContent className="max-w-md bg-background text-foreground">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Complete Sale</DialogTitle>
                    <DialogDescription className="text-muted-foreground">Review and finalize the transaction.</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground">Payment Method</Label>
                      <PaymentMethods onPaymentSelect={handlePaymentMethodChange} selectedMethod={paymentMethod} />
                    </div>

                    <div>
                      <Label htmlFor="discount" className="text-foreground">Discount (KES)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="discount"
                          type="number"
                          value={discount}
                          onChange={(e) => handleDiscountChange(Number(e.target.value) || 0)}
                          min="0"
                          max={subtotal}
                          step="0.01"
                          disabled={requiresPinOverride}
                          className="bg-background text-foreground"
                        />
                        {requiresPinOverride && (
                          <Button size="sm" variant="outline"><Calculator className="h-4 w-4" /></Button>
                        )}
                      </div>
                    </div>

                    {requiresPinOverride && (
                      <div>
                        <Label htmlFor="pin" className="text-foreground">Manager PIN Required</Label>
                        <div className="flex gap-2">
                          <Input
                            id="pin"
                            type="password"
                            value={overridePin}
                            onChange={(e) => setOverridePin(e.target.value)}
                            placeholder="Enter PIN"
                            maxLength={4}
                            className="bg-background text-foreground"
                          />
                          <Button onClick={validatePinOverride} size="sm">Verify</Button>
                        </div>
                      </div>
                    )}

                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm"><span>Items:</span><span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
                      <div className="flex justify-between text-sm"><span>Subtotal:</span><span>KES {subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between text-sm"><span>Tax (0%):</span><span>KES {tax.toFixed(2)}</span></div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-tucktical-secondary"><span>Discount:</span><span>-KES {discount.toFixed(2)}</span></div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg"><span>Total:</span><span className="text-tucktical-primary">KES {total.toFixed(2)}</span></div>
                    </div>

                    <Button onClick={handleCheckout} className="w-full" size="lg" disabled={requiresPinOverride}>
                      Complete Sale – KES {total.toFixed(2)}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="p-4">
                <div className="flex gap-2 items-center mb-4">
                  <Input
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const product = products.find(p => p.sku === barcode || p.barcode === barcode);
                        if (product) {
                          addToCart(product);
                        } else {
                          toast({
                            title: "Product Not Found",
                            description: `No product found for barcode: ${barcode}`,
                            variant: "destructive"
                          });
                        }
                        setBarcode("");
                      }
                    }}
                    placeholder="Scan barcode..."
                    className="w-full max-w-xs"
                    autoFocus
                  />
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="cash">Cash</option>
                    <option value="mpesa_till">M-Pesa Till</option>
                    <option value="mpesa_paybill">M-Pesa PayBill</option>
                  </select>
                  <Button variant="destructive" onClick={clearCart}>Clear</Button>
                  <Button variant="outline" onClick={resumeCart}>Resume</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
