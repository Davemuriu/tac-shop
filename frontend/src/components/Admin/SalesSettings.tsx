import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function SalesSettings() {
  const [tax, setTax] = useState(8);
  const [discount, setDiscount] = useState(0);

  const handleSave = () => {
    toast({ title: "Saved", description: "Sales settings updated." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Tax Percentage (%)</Label>
          <Input type="number" value={tax} onChange={e => setTax(Number(e.target.value))} />
        </div>
        <div>
          <Label>Discount (%)</Label>
          <Input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
        </div>
        <Button className="w-full" onClick={handleSave}>Save Settings</Button>
      </CardContent>
    </Card>
  );
}
