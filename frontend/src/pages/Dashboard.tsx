import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle,
  BarChart3,
  Users,
  Calendar
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { dashboardStats, products, sales } = useStore();
  const { user } = useAuth();

  const weeklyData = dashboardStats.weeklyRevenue.map((val, idx) => ({
    name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx],
    sales: val
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your store overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-tucktical-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-tucktical-primary">
              KES {dashboardStats.todaySales.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Based on POS transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-tucktical-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-tucktical-primary">
              {dashboardStats.todayTransactions}
            </div>
            <p className="text-xs text-muted-foreground">Processed today</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Products</CardTitle>
            <Package className="h-4 w-4 text-tucktical-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-tucktical-primary">
              {products.length}
            </div>
            <p className="text-xs text-muted-foreground">Items in stock</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {dashboardStats.lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="h-5 w-5 text-tucktical-accent" />
              Weekly Sales
            </CardTitle>
            <CardDescription>Past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardStats.weeklyRevenue.every(val => val === 0) ? (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No sales data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--tucktical-primary))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-tucktical-accent" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Revenue trend will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales + Top Products */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5 text-tucktical-accent" />
              Recent Sales
            </CardTitle>
            <CardDescription>Last 5 transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No sales recorded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sales.slice(0, 5).map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center p-2 rounded bg-muted/50">
                    <div>
                      <div className="font-medium text-sm text-foreground">#{sale.receiptNumber}</div>
                      <div className="text-xs text-muted-foreground">{new Date(sale.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-tucktical-primary">
                        KES {sale.total.toFixed(2)}
                      </div>
                      <Badge variant="secondary" className="text-xs">{sale.paymentMethod}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5 text-tucktical-accent" />
              Top Products
            </CardTitle>
            <CardDescription>Best sellers</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardStats.topProducts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No top products yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardStats.topProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-2 rounded bg-muted/50">
                    <div>
                      <div className="font-medium text-sm text-foreground">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.sales} sold</div>
                    </div>
                    <div className="text-right font-medium text-tucktical-primary">
                      KES {product.revenue.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
