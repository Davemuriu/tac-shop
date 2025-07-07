
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/contexts/StoreContext";
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Smartphone } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function PointOfSale() {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, completeSale } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const categories = ["all", ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.barcode && product.barcode.includes(searchQuery));
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.active;
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
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

  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Point of Sale</h1>
            <p className="text-muted-foreground">Quick and efficient sales processing</p>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, SKU, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                    <Badge variant={product.quantity > product.lowStockThreshold ? "secondary" : "destructive"}>
                      {product.quantity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{product.sku}</p>
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
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                          <div className="font-medium text-sm truncate">{item.product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ${item.product.price.toFixed(2)} each
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
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
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
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (8%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-tactical-secondary">
                        <span>Discount:</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-tactical-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Complete Sale</DialogTitle>
                        <DialogDescription>
                          Review and complete the transaction
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="payment-method">Payment Method</Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">
                                <div className="flex items-center gap-2">
                                  <Banknote className="h-4 w-4" />
                                  Cash
                                </div>
                              </SelectItem>
                              <SelectItem value="card">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  Card
                                </div>
                              </SelectItem>
                              <SelectItem value="digital">
                                <div className="flex items-center gap-2">
                                  <Smartphone className="h-4 w-4" />
                                  Digital
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="discount">Discount ($)</Label>
                          <Input
                            id="discount"
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                            min="0"
                            max={subtotal}
                            step="0.01"
                          />
                        </div>

                        <div className="bg-muted p-4 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span>Items:</span>
                            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-tactical-secondary">
                              <span>Discount:</span>
                              <span>-${discount.toFixed(2)}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>

                        <Button onClick={handleCheckout} className="w-full" size="lg">
                          Complete Sale
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
