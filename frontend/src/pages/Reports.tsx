import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useStore } from "@/contexts/StoreContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileText, Calendar, Filter, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Reports() {
  const { sales } = useStore();
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState("all");

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      const inDateRange = saleDate >= dateRange.from && saleDate <= dateRange.to;
      const matchesUser = selectedUser === "all" || sale.cashierId === selectedUser;
      const matchesMethod = selectedMethod === "all" || sale.paymentMethod.toLowerCase() === selectedMethod;
      return inDateRange && matchesUser && matchesMethod;
    });
  }, [sales, dateRange, selectedUser, selectedMethod]);

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = filteredSales.length;
  const avgTransaction = totalSales / Math.max(totalTransactions, 1);

  const dailySalesData = useMemo(() => {
    const daysMap: { [key: string]: number } = {};
    filteredSales.forEach(sale => {
      const day = new Date(sale.createdAt).toLocaleDateString("en-KE", { weekday: "short" });
      daysMap[day] = (daysMap[day] || 0) + sale.total;
    });
    return Object.entries(daysMap).map(([name, sales]) => ({ name, sales }));
  }, [filteredSales]);

  const handleExportCSV = () => {
    const csv = [
      ['Date', 'Receipt #', 'Total', 'Payment Method', 'Cashier'],
      ...filteredSales.map(sale => [
        new Date(sale.createdAt).toLocaleDateString(),
        sale.receiptNumber,
        sale.total.toFixed(2),
        sale.paymentMethod,
        sale.cashierId
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales-report.csv';
    a.click();

    toast({ title: "Export Complete", description: "Sales report exported to CSV file" });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sales Reports</h1>
        <p className="text-muted-foreground">Analyze your sales performance and trends</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            <div>
              <label className="text-sm font-medium">User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger><SelectValue placeholder="All Users" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                <SelectTrigger><SelectValue placeholder="All Methods" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" /> CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center"><div><p className="text-sm font-medium text-muted-foreground">Total Sales</p><p className="text-2xl font-bold">KES {totalSales.toLocaleString()}</p></div><TrendingUp className="h-8 w-8 text-green-600 ml-auto" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center"><div><p className="text-sm font-medium text-muted-foreground">Transactions</p><p className="text-2xl font-bold">{totalTransactions}</p></div><Calendar className="h-8 w-8 text-blue-600 ml-auto" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center"><div><p className="text-sm font-medium text-muted-foreground">Avg Transaction</p><p className="text-2xl font-bold">KES {avgTransaction.toFixed(2)}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center"><div><p className="text-sm font-medium text-muted-foreground">Tax Collected</p><p className="text-2xl font-bold">KES {(totalSales * 0.08).toFixed(2)}</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Daily Sales</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`KES ${value}`, 'Sales']} />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
