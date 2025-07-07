
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useStore } from "@/contexts/StoreContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Download, FileText, Calendar, Filter, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Reports() {
  const { sales } = useStore();
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState("all");

  // Mock data for charts
  const salesData = [
    { name: 'Mon', sales: 1200 },
    { name: 'Tue', sales: 1900 },
    { name: 'Wed', sales: 800 },
    { name: 'Thu', sales: 2400 },
    { name: 'Fri', sales: 3200 },
    { name: 'Sat', sales: 2800 },
    { name: 'Sun', sales: 1600 }
  ];

  const paymentMethodData = [
    { name: 'Cash', value: 45, color: '#10b981' },
    { name: 'Card', value: 30, color: '#3b82f6' },
    { name: 'M-Pesa', value: 20, color: '#22c55e' },
    { name: 'Digital', value: 5, color: '#8b5cf6' }
  ];

  const topProducts = [
    { name: 'Product A', sales: 45, revenue: 2250 },
    { name: 'Product B', sales: 32, revenue: 1920 },
    { name: 'Product C', sales: 28, revenue: 1680 },
    { name: 'Product D', sales: 24, revenue: 1440 },
    { name: 'Product E', sales: 18, revenue: 1080 }
  ];

  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalTransactions = sales.length;
  const avgTransaction = totalSales / Math.max(totalTransactions, 1);

  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description: "Your PDF report is being generated..."
    });
  };

  const handleExportCSV = () => {
    const csv = [
      ['Date', 'Receipt #', 'Total', 'Payment Method', 'Cashier'],
      ...sales.map(sale => [
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
    
    toast({
      title: "Export Complete",
      description: "Sales report exported to CSV file"
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sales Reports</h1>
        <p className="text-muted-foreground">Analyze your sales performance and trends</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
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
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
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
                <SelectTrigger>
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
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
              <Button onClick={handleExportPDF} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button onClick={handleExportCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">${totalSales.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Transaction</p>
                <p className="text-2xl font-bold">${avgTransaction.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tax Collected</p>
                <p className="text-2xl font-bold">${(totalSales * 0.08).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{product.sales} sold</div>
                  <div className="text-sm text-muted-foreground">${product.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
