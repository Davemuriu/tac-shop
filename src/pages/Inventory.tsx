
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/contexts/StoreContext";
import { Package, Plus, Edit, Download, Upload, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Inventory() {
  const { products, addProduct, updateProduct } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = ["all", ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(p => p.quantity <= p.lowStockThreshold);

  const handleExportCSV = () => {
    const csv = [
      ['Name', 'SKU', 'Category', 'Price', 'Cost', 'Quantity', 'Low Stock Threshold'],
      ...products.map(p => [p.name, p.sku, p.category, p.price, p.cost, p.quantity, p.lowStockThreshold])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    
    toast({
      title: "Export Complete",
      description: "Inventory exported to CSV file"
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-muted-foreground">Manage your product catalog and stock levels</p>
      </div>

      {/* Alert for low stock */}
      {lowStockProducts.length > 0 && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="font-medium">Low Stock Alert:</span>
              <span>{lowStockProducts.length} items need restocking</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
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
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm onSave={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-muted-foreground">{product.description}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{product.quantity}</span>
                    {product.quantity <= product.lowStockThreshold && (
                      <Badge variant="destructive" className="text-xs">Low</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={product.active ? "secondary" : "outline"}>
                    {product.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function ProductForm({ onSave, product = null }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    price: product?.price || 0,
    cost: product?.cost || 0,
    quantity: product?.quantity || 0,
    category: product?.category || '',
    description: product?.description || '',
    lowStockThreshold: product?.lowStockThreshold || 10,
    reorderLevel: product?.reorderLevel || 20,
    active: product?.active ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would call addProduct or updateProduct
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
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({...formData, sku: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) => setFormData({...formData, barcode: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
            required
          />
        </div>
        <div>
          <Label htmlFor="cost">Cost ($)</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
          />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
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
            onChange={(e) => setFormData({...formData, lowStockThreshold: parseInt(e.target.value) || 0})}
          />
        </div>
        <div>
          <Label htmlFor="reorder">Reorder Level</Label>
          <Input
            id="reorder"
            type="number"
            value={formData.reorderLevel}
            onChange={(e) => setFormData({...formData, reorderLevel: parseInt(e.target.value) || 0})}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({...formData, active: checked})}
        />
        <Label htmlFor="active">Active Product</Label>
      </div>

      <Button type="submit" className="w-full">
        Save Product
      </Button>
    </form>
  );
}
