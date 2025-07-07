import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface UserFormProps {
  onSave: (data: any) => void;
  user?: {
    id?: string;
    name: string;
    email: string;
    role: string;
    pin?: string;
  };
}

export default function AdminUserForm({ onSave, user }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "cashier",
    pin: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "cashier",
        pin: user.pin || "",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: "User Saved",
      description: user ? "User updated successfully." : "New user created successfully.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
        >
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
          onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
          placeholder="****"
        />
      </div>

      <Button type="submit" className="w-full">
        {user ? "Update User" : "Create User"}
      </Button>
    </form>
  );
}
