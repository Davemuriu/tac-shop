import { useState as reactUseState } from "react";
import { toast as sonnerToast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

function ProductForm({ onSave, product = null }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    barcode: product?.barcode || '',
    price: product?.price || '',
    cost: product?.cost || '',
    quantity: product?.quantity || '',
    category: product?.category || '',
    description: product?.description || '',
    lowStockThreshold: product?.lowStockThreshold || 10,
    reorderLevel: product?.reorderLevel || 20,
    active: product?.active ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      toast({ title: "Missing Fields", description: "Name and category are required", variant: "destructive" });
      return;
    }

    if (parseFloat(formData.price) <= 0 || parseFloat(formData.cost) <= 0) {
      toast({
        title: "Invalid Price/Cost",
        description: "Price and cost must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    // Normally call addProduct(formData) or updateProduct(formData) here

    onSave();
    toast({
      title: "Product Saved",
      description: "Product has been successfully saved"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price (KES)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="cost">Cost (KES)</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lowStock">Low Stock Threshold</Label>
          <Input
            id="lowStock"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="reorder">Reorder Level</Label>
          <Input
            id="reorder"
            type="number"
            value={formData.reorderLevel}
            onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
        />
        <Label htmlFor="active">Active Product</Label>
      </div>

      <Button type="submit" className="w-full">
        Save Product
      </Button>
    </form>
  );
}
const useState = reactUseState;
function toast({ title, description, variant }: { title: string; description: string; variant?: string }) {
  sonnerToast(title, {
    description,
    className: variant === "destructive" ? "bg-red-500 text-white" : "",
  });
}

