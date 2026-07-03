"use client";

import { useState } from "react";
import {
  BarChart3,
  Calendar,
  Download,
  DollarSign,
  ShoppingCart,
  Percent,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  weeklySalesData,
  monthlySalesData,
  categorySales,
  topSellingItems,
  businessSettings,
} from "@/lib/mock-data";
import {
  AreaChart,
  Area,
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
  Legend,
} from "recharts";

const paymentShareData = [
  { name: "Cash Sales", value: 45, color: "#10b981" },
  { name: "Card Sales", value: 35, color: "#3b82f6" },
  { name: "Mobile Banking", value: 20, color: "#8b5cf6" },
];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("7days");

  const salesData = timeRange === "year" ? monthlySalesData : weeklySalesData;
  const totalRevenue = salesData.reduce((sum, d) => sum + d.sales, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  const averageBill = totalRevenue / (totalOrders || 1);

  return (
    <div className="space-y-6">
      {/* Filters Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-blue-400" />
          <div className="w-48">
            <Select value={timeRange} onValueChange={(val) => setTimeRange(val || "7days")}>
              <SelectTrigger className="h-10 rounded-xl border-white/[0.06] bg-[#0f1322] text-slate-300">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-[#0f1623] text-slate-300">
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" className="border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Reports Metrics Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Report Revenue
              </p>
              <p className="text-2xl font-bold text-white">
                {businessSettings.currencySymbol}
                {totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <span>+8% compared to last period</span>
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/5">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-white">{totalOrders}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <span>+4% compared to last period</span>
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/5">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Average Basket Value
              </p>
              <p className="text-2xl font-bold text-white">
                {businessSettings.currencySymbol}
                {averageBill.toFixed(0)}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <span>+2.5% compared to last period</span>
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 shadow-lg shadow-violet-500/5">
              <Percent className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Sales Trend Chart */}
        <Card className="border-white/[0.06] bg-white/[0.02] lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-white">Sales Performance Trend</CardTitle>
            <CardDescription className="text-slate-500">
              Visual analytics representation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="reportSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.2)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.2)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1624",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#f8fafc",
                  }}
                  formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#reportSalesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Shares Pie Chart */}
        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-base text-white">Payment Method Distribution</CardTitle>
            <CardDescription className="text-slate-500">
              Receipt type break down
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={paymentShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {paymentShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1624",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#f8fafc",
                  }}
                  formatter={(value: any) => [`${value}%`, "Distribution Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full mt-4 space-y-2">
              {paymentShareData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-400">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-300">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Rankings and Category share */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Product Chart */}
        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-base text-white">Top 5 Performing Items</CardTitle>
            <CardDescription className="text-slate-500">
              Ranked by quantity sold this cycle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topSellingItems.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1624",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#f8fafc",
                  }}
                  formatter={(value: any) => [value, "Qty Sold"]}
                />
                <Bar dataKey="quantity" fill="#8b5cf6" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Share List with detail progress bar */}
        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-base text-white">Category Performance Analysis</CardTitle>
            <CardDescription className="text-slate-500">
              Product lines contribution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categorySales.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">{cat.name} Category</span>
                  <span className="text-white font-semibold">{cat.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.value}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
