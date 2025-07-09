import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Plus, Edit, Trash2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Admin() {
  const user = { role: 'admin' };
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const [users] = useState([
    { id: '1', name: 'Admin', email: 'admin@tuckshop.com', role: 'admin', active: true },
    { id: '2', name: 'Cashier', email: 'cashier@tuckshop.com', role: 'cashier', active: true },
  ]);

  const [shopInfo, setShopInfo] = useState({
    shopName: 'Tuck Shop',
    address: 'School Grounds',
    phone: '+254700000000',
    email: 'info@tuckshop.com',
    currency: 'KES',
    receiptFooter: 'Thank you for your support!',
  });

  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveSettings = () => {
    toast({
      title: "Shop Info Saved",
      description: "Shop details updated successfully",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Settings</h1>
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="settings">Shop Info</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Users</h2>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <UserForm onSave={() => setIsAddUserOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'admin' ? 'destructive' : 'secondary'}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.active ? 'secondary' : 'outline'}>
                        {u.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle><Settings className="h-5 w-5 mr-2" /> Shop Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Shop Name" value={shopInfo.shopName} onChange={(v) => setShopInfo({ ...shopInfo, shopName: v })} />
              <InputField label="Address" value={shopInfo.address} onChange={(v) => setShopInfo({ ...shopInfo, address: v })} />
              <InputField label="Phone" value={shopInfo.phone} onChange={(v) => setShopInfo({ ...shopInfo, phone: v })} />
              <InputField label="Email" type="email" value={shopInfo.email} onChange={(v) => setShopInfo({ ...shopInfo, email: v })} />
              <InputField label="Receipt Footer" value={shopInfo.receiptFooter} onChange={(v) => setShopInfo({ ...shopInfo, receiptFooter: v })} />
              <div className="text-right">
                <Button onClick={handleSaveSettings}>Save Info</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function UserForm({ onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier',
    pin: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
    toast({ title: "User Added", description: "User was successfully added" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField label="Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} />
      <InputField label="Email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
      <div>
        <Label>Role</Label>
        <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="cashier">Cashier</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <InputField label="PIN (4-digit)" value={formData.pin} onChange={(v) => setFormData({ ...formData, pin: v })} type="password" />
      <Button type="submit" className="w-full">Save User</Button>
    </form>
  );
}
