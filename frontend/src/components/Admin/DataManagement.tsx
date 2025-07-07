import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function DataManagement() {
  const handleExport = () => {
    toast({ title: "Backup Exported", description: "CSV file downloaded." });
  };

  const handleReset = () => {
    toast({ title: "Test Data Reset", description: "All test records cleared." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full" onClick={handleExport}>
          Export Backup (CSV)
        </Button>
        <Button variant="destructive" className="w-full" onClick={handleReset}>
          Reset Test Data
        </Button>
      </CardContent>
    </Card>
  );
}
