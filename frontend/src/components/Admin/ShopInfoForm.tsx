import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function ShopInfoForm() {
  const [form, setForm] = useState({
    name: "Tuck Shop",
    tagline: "Your tucktical gear partner",
    phone: "+254 712 345678",
    email: "contuckt@tuckshop.co.ke",
    currency: "KES",
    address: "Nairobi, Kenya",
    logo: null,
  });

  const handleSave = () => {
    toast({ title: "Saved", description: "Shop info updated successfully." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Shop Name</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label>Currency</Label>
            <Select value={form.currency} onValueChange={val => setForm({ ...form, currency: val })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="KES">KES</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Address</Label>
            <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
        </div>

        <div>
          <Label>Logo</Label>
          <div className="flex gap-2 mt-1 items-center">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" /> Upload Logo
            </Button>
            <span className="text-sm text-muted-foreground">No file selected</span>
          </div>
        </div>

        <Button className="w-full" onClick={handleSave}>Save Info</Button>
      </CardContent>
    </Card>
  );
}
