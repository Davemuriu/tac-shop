
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Users, KeyRound } from "lucide-react";

interface UserSwitcherProps {
  onClose: () => void;
}

export function UserSwitcher({ onClose }: UserSwitcherProps) {
  const { switchUser } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const users = [
    { id: '1', name: 'Admin User', role: 'admin' },
    { id: '2', name: 'Manager User', role: 'manager' },
    { id: '3', name: 'Cashier User', role: 'cashier' }
  ];

  const handleSwitch = async () => {
    if (!selectedUserId || !pin) {
      toast({
        title: "Missing Information",
        description: "Please select a user and enter PIN",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const success = await switchUser(selectedUserId, pin);
    
    if (success) {
      toast({
        title: "User Switched",
        description: "Successfully switched to new user",
      });
      onClose();
    } else {
      toast({
        title: "Switch Failed",
        description: "Invalid PIN or user selection",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Switch User
          </DialogTitle>
          <DialogDescription>
            Switch to a different user account without logging out
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="user-select">Select User</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose user..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({user.role})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="pin">PIN</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="pl-10"
                maxLength={4}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSwitch} 
              disabled={isLoading || !selectedUserId || !pin}
              className="flex-1"
            >
              {isLoading ? "Switching..." : "Switch User"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
