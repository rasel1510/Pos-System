"use client";

import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  dashboardStats,
  weeklySalesData,
  monthlySalesData,
  categorySales,
  topSellingItems,
  orders,
  products,
  businessSettings,
} from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";

const statsCards = [
  {
    title: "Today's Sales",
    value: `${businessSettings.currencySymbol}${dashboardStats.todaySales.toLocaleString()}`,
    trend: dashboardStats.salesTrend,
    icon: DollarSign,
    gradient: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/20",
  },
  {
    title: "Total Orders",
    value: dashboardStats.todayOrders.toString(),
    trend: dashboardStats.ordersTrend,
    icon: ShoppingCart,
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20",
  },
  {
    title: "Total Customers",
    value: dashboardStats.totalCustomers.toString(),
    trend: dashboardStats.customersTrend,
    icon: Users,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
  {
    title: "Avg. Order Value",
    value: `${businessSettings.currencySymbol}${dashboardStats.avgOrderValue.toLocaleString()}`,
    trend: dashboardStats.avgOrderTrend,
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
  },
];

const lowStockProducts = products.filter((p) => p.stock <= p.minStock && p.stock > 0);
const outOfStockProducts = products.filter((p) => p.stock === 0);
const recentOrders = orders.filter((o) => o.status !== "held").slice(0, 8);

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((stat) => (
          <Card
            key={stat.title}
            className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden relative group hover:border-white/[0.1] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.trend >= 0 ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        stat.trend >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {Math.abs(stat.trend)}%
                    </span>
                    <span className="text-xs text-slate-600">vs last week</span>
                  </div>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadow}`}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart */}
        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base text-white">
                  Sales Analytics
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Revenue overview
                </CardDescription>
              </div>
              <Tabs defaultValue="weekly" className="w-auto">
                <TabsList className="h-8 bg-white/[0.04] border border-white/[0.06]">
                  <TabsTrigger
                    value="weekly"
                    className="h-6 px-3 text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
                  >
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger
                    value="monthly"
                    className="h-6 px-3 text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
                  >
                    Monthly
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="weekly" className="mt-4">
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={weeklySalesData}>
                      <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="name"
                        stroke="rgba(255,255,255,0.2)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.2)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#e2e8f0",
                          fontSize: "13px",
                        }}
                        formatter={(value: number) => [`৳${value.toLocaleString()}`, "Sales"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#salesGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="monthly" className="mt-4">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="name"
                        stroke="rgba(255,255,255,0.2)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.2)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#e2e8f0",
                          fontSize: "13px",
                        }}
                        formatter={(value: number) => [`৳${value.toLocaleString()}`, "Sales"]}
                      />
                      <Bar
                        dataKey="sales"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </CardHeader>
        </Card>

        {/* Category Breakdown */}
        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">
              Sales by Category
            </CardTitle>
            <CardDescription className="text-slate-500">
              Revenue distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#e2e8f0",
                    fontSize: "13px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-2">
              {categorySales.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-slate-400">{cat.name}</span>
                  </div>
                  <span className="font-medium text-slate-300">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Selling Items */}
        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white">
              Top Selling Items
            </CardTitle>
            <CardDescription className="text-slate-500">
              Best performers this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topSellingItems.slice(0, 6).map((item) => (
              <div
                key={item.rank}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/[0.03]"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                    item.rank <= 3
                      ? "bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-400"
                      : "bg-white/[0.04] text-slate-500"
                  }`}
                >
                  {item.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.quantity} sold
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-300">
                  ৳{item.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base text-white">
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Latest transactions
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-white/[0.06] text-slate-400 border-0">
                <Clock className="mr-1 h-3 w-3" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                      <ShoppingCart className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.items.length} items •{" "}
                        {new Date(order.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`border-0 text-[10px] font-semibold ${
                        order.status === "completed"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : order.status === "pending"
                          ? "bg-amber-500/15 text-amber-400"
                          : order.status === "cancelled"
                          ? "bg-rose-500/15 text-rose-400"
                          : "bg-blue-500/15 text-blue-400"
                      }`}
                    >
                      {order.status}
                    </Badge>
                    <p className="text-sm font-semibold text-white">
                      ৳{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {lowStockProducts.length > 0 && (
            <Card className="border-amber-500/20 bg-amber-500/[0.03] backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{product.image}</span>
                      <span className="text-sm text-slate-300">
                        {product.name}
                      </span>
                    </div>
                    <Badge className="bg-amber-500/15 text-amber-400 border-0">
                      {product.stock} left
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {outOfStockProducts.length > 0 && (
            <Card className="border-rose-500/20 bg-rose-500/[0.03] backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-rose-400">
                  <Package className="h-4 w-4" />
                  Out of Stock
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {outOfStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{product.image}</span>
                      <span className="text-sm text-slate-300">
                        {product.name}
                      </span>
                    </div>
                    <Badge className="bg-rose-500/15 text-rose-400 border-0">
                      Out of Stock
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
