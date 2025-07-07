
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/contexts/StoreContext";
import { ShoppingCart, Trash2, Plus, Minus, Package, Hold, Receipt, Calculator } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ProductSearch } from "@/components/POS/ProductSearch";
import { PaymentMethods } from "@/components/POS/PaymentMethods";

export default function PointOfSale() {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, completeSale } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital' | 'mpesa'>("cash");
  const [discount, setDiscount] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [requiresPinOverride, setRequiresPinOverride] = useState(false);
  const [overridePin, setOverridePin] = useState("");

  const categories = ["all", ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesCategory && product.active;
  });

  const subtotal = cart.reduce((sum, item) => sum + ((item.priceOverride || item.product.price) * item.quantity) - item.discount, 0);
  const tax = subtotal * 0.08; // 8% tax
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

    const sale = completeSale(paymentMethod, discount);
    setIsCheckoutOpen(false);
    setDiscount(0);
    
    toast({
      title: "Sale Completed",
      description: `Receipt #${sale.receiptNumber} - Total: $${sale.total.toFixed(2)}`,
    });
  };

  const handlePaymentMethodChange = (method: 'cash' | 'card' | 'digital' | 'mpesa') => {
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
    if (overridePin === "1234") { // Manager PIN
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

  const handleHoldCart = () => {
    // Implementation for holding cart
    toast({
      title: "Cart Held",
      description: "Cart has been saved for later",
    });
  };

  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Point of Sale</h1>
            <p className="text-muted-foreground">Quick and efficient sales processing</p>
          </div>

          {/* Search */}
          <ProductSearch
            products={products}
            onAddToCart={addToCart}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.slice(1, 4).map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              <div className="max-h-[500px] overflow-y-auto">
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Products Available</h3>
                    <p className="text-muted-foreground">Connect to your inventory system to load products.</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
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
                                <Badge variant="destructive" className="text-xs">
                                  Low
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">SKU: {product.sku}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-tactical-primary">
                              ${product.price.toFixed(2)}
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

        {/* Cart Section */}
        <div className="space-y-4">
          <Card className="h-full border-border">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({cart.length})
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleHoldCart}>
                    <Hold className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate text-foreground">{item.product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ${(item.priceOverride || item.product.price).toFixed(2)} each
                            {item.discount > 0 && (
                              <span className="text-tactical-secondary ml-1">
                                (-${item.discount.toFixed(2)})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm text-foreground">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.product.id)}
                            className="h-6 w-6 p-0 ml-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%):</span>
                      <span className="text-foreground">${tax.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-tactical-secondary">
                        <span>Discount:</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-foreground">Total:</span>
                      <span className="text-tactical-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        <Receipt className="h-4 w-4 mr-2" />
                        Checkout
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Complete Sale</DialogTitle>
                        <DialogDescription>
                          Review and complete the transaction
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Payment Method</Label>
                          <PaymentMethods 
                            onPaymentSelect={handlePaymentMethodChange}
                            selectedMethod={paymentMethod}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="discount">Discount ($)</Label>
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
                            />
                            {requiresPinOverride && (
                              <Button size="sm" variant="outline">
                                <Calculator className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {requiresPinOverride && (
                          <div>
                            <Label htmlFor="pin">Manager PIN Required</Label>
                            <div className="flex gap-2">
                              <Input
                                id="pin"
                                type="password"
                                value={overridePin}
                                onChange={(e) => setOverridePin(e.target.value)}
                                placeholder="Enter PIN"
                                maxLength={4}
                              />
                              <Button onClick={validatePinOverride} size="sm">
                                Verify
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="bg-muted p-4 rounded-lg space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Items:</span>
                            <span className="text-foreground">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="text-foreground">${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax:</span>
                            <span className="text-foreground">${tax.toFixed(2)}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-sm text-tactical-secondary">
                              <span>Discount:</span>
                              <span>-${discount.toFixed(2)}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between font-bold text-lg">
                            <span className="text-foreground">Total:</span>
                            <span className="text-tactical-primary">${total.toFixed(2)}</span>
                          </div>
                        </div>

                        <Button 
                          onClick={handleCheckout} 
                          className="w-full" 
                          size="lg"
                          disabled={requiresPinOverride}
                        >
                          Complete Sale - ${total.toFixed(2)}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
