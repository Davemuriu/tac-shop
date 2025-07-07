import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function InventoryPreferences() {
  const [category, setCategory] = useState("");
  const [reorderLevel, setReorderLevel] = useState(5);

  const handleSave = () => {
    toast({ title: "Saved", description: "Preferences updated." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Default Category</Label>
          <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Gear" />
        </div>
        <div>
          <Label>Default Reorder Threshold</Label>
          <Input type="number" value={reorderLevel} onChange={e => setReorderLevel(Number(e.target.value))} />
        </div>
        <Button className="w-full" onClick={handleSave}>Save Preferences</Button>
      </CardContent>
    </Card>
  );
}
