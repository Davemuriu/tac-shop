
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
import { useAuth } from "@/contexts/AuthContext";
import { Settings, Users, Plus, Edit, Trash2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Admin() {
  const { user } = useAuth();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  
  // Mock users data - in real app this would come from backend
  const [users] = useState([
    { id: '1', name: 'Admin User', email: 'admin@tacshop.com', role: 'admin', active: true },
    { id: '2', name: 'Manager User', email: 'manager@tacshop.com', role: 'manager', active: true },
    { id: '3', name: 'Cashier User', email: 'cashier@tacshop.com', role: 'cashier', active: true },
  ]);

  const [systemSettings, setSystemSettings] = useState({
    shopName: 'Tac Shop',
    address: '123 Main St, City, State',
    phone: '+1 (555) 123-4567',
    email: 'contact@tacshop.com',
    taxRate: 8,
    currency: 'USD',
    receiptFooter: 'Thank you for your business!'
  });

  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully"
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users, roles, and system settings</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Users & Roles</h2>
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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={
                        user.role === 'admin' ? 'destructive' : 
                        user.role === 'manager' ? 'default' : 'secondary'
                      }>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.active ? 'secondary' : 'outline'}>
                        {user.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
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
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    value={systemSettings.shopName}
                    onChange={(e) => setSystemSettings({...systemSettings, shopName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="KES">KES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={systemSettings.address}
                  onChange={(e) => setSystemSettings({...systemSettings, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={systemSettings.phone}
                    onChange={(e) => setSystemSettings({...systemSettings, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={systemSettings.email}
                    onChange={(e) => setSystemSettings({...systemSettings, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.1"
                  value={systemSettings.taxRate}
                  onChange={(e) => setSystemSettings({...systemSettings, taxRate: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="receiptFooter">Receipt Footer</Label>
                <Input
                  id="receiptFooter"
                  value={systemSettings.receiptFooter}
                  onChange={(e) => setSystemSettings({...systemSettings, receiptFooter: e.target.value})}
                />
              </div>

              <div>
                <Label>Shop Logo</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <span className="text-sm text-muted-foreground">No logo uploaded</span>
                </div>
              </div>

              <Button onClick={handleSaveSettings} className="w-full">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserForm({ onSave, user = null }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'cashier',
    pin: user?.pin || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
    toast({
      title: "User Saved",
      description: "User has been successfully saved"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="cashier">Cashier</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="pin">PIN (4 digits)</Label>
        <Input
          id="pin"
          type="password"
          maxLength={4}
          value={formData.pin}
          onChange={(e) => setFormData({...formData, pin: e.target.value})}
          placeholder="****"
        />
      </div>

      <Button type="submit" className="w-full">
        Save User
      </Button>
    </form>
  );
}
