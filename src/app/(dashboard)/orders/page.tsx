"use client";

import { useState } from "react";
import {
  ClipboardList,
  Search,
  Eye,
  Calendar,
  CreditCard,
  Smartphone,
  Banknote,
  Printer,
  ChevronRight,
  User,
  ArrowLeftRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  orders as initialOrders,
  customers,
  businessSettings,
} from "@/lib/mock-data";
import { Order, OrderStatus } from "@/lib/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]">Completed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-400 border-0 text-[10px]">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-rose-500/10 text-rose-500 border-0 text-[10px]">Cancelled</Badge>;
      case "refunded":
        return <Badge className="bg-blue-500/10 text-blue-400 border-0 text-[10px]">Refunded</Badge>;
      case "held":
        return <Badge className="bg-slate-500/10 text-slate-400 border-0 text-[10px]">Held</Badge>;
    }
  };

  const getPaymentIcon = (method: Order["paymentMethod"]) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4 text-emerald-400" />;
      case "card":
        return <CreditCard className="h-4 w-4 text-blue-400" />;
      case "mobile":
        return <Smartphone className="h-4 w-4 text-violet-400" />;
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Filters
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerId &&
        customers
          .find((c) => c.id === o.customerId)
          ?.name.toLowerCase()
          .includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate order items count helper
  const getItemsCount = (order: Order) => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search Order # or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-xl border-white/[0.06] bg-white/[0.04] pl-10 text-sm text-slate-300 placeholder:text-slate-600 focus:border-blue-500/50"
            />
          </div>

          <div className="w-48">
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
              <SelectTrigger className="h-10 rounded-xl border-white/[0.06] bg-[#0f1322] text-slate-300">
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-[#0f1623] text-slate-300">
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="held">Held</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Orders List Table */}
      <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-white/[0.06]">
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-slate-500">Order #</TableHead>
                  <TableHead className="text-slate-500">Date & Time</TableHead>
                  <TableHead className="text-slate-500">Customer</TableHead>
                  <TableHead className="text-center text-slate-500">Items Count</TableHead>
                  <TableHead className="text-right text-slate-500">Total Amount</TableHead>
                  <TableHead className="text-center text-slate-500">Payment</TableHead>
                  <TableHead className="text-slate-500">Status</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-40 text-center text-slate-600">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const customer = customers.find((c) => c.id === order.customerId);
                    return (
                      <TableRow
                        key={order.id}
                        className="border-white/[0.04] hover:bg-white/[0.02] text-slate-300"
                      >
                        <TableCell className="font-semibold text-white">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(order.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </TableCell>
                        <TableCell className="font-medium text-slate-200">
                          {customer ? customer.name : "Walk-in Customer"}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {getItemsCount(order)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-white">
                          {businessSettings.currencySymbol}
                          {order.total.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5 capitalize text-xs text-slate-400">
                            {getPaymentIcon(order.paymentMethod)}
                            <span>{order.paymentMethod}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Sheet Side-panel */}
      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <SheetContent className="w-full sm:max-w-md border-l border-white/[0.08] bg-[#0c111a] text-slate-300">
          {selectedOrder && (
            <div className="flex h-full flex-col space-y-6">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-white text-lg">
                    Order details
                  </SheetTitle>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <SheetDescription className="text-slate-500">
                  {selectedOrder.orderNumber} —{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </SheetDescription>
              </SheetHeader>

              {/* Customer summary */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-4 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Customer Info
                </h4>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {customers.find((c) => c.id === selectedOrder.customerId)?.name ||
                        "Walk-in Customer"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {customers.find((c) => c.id === selectedOrder.customerId)?.phone ||
                        "No phone provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ordered Items
                </h4>
                <div className="space-y-2.5">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start text-sm"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <p className="truncate font-medium text-slate-200">
                          {item.productName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.quantity}x @ {businessSettings.currencySymbol}
                          {item.price}
                        </p>
                      </div>
                      <span className="font-semibold text-white shrink-0">
                        {businessSettings.currencySymbol}
                        {item.total.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/[0.06]" />

              {/* Invoice calculation summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>
                    {businessSettings.currencySymbol}
                    {selectedOrder.subtotal.toLocaleString()}
                  </span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>
                      -{businessSettings.currencySymbol}
                      {selectedOrder.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Tax ({selectedOrder.taxRate}%)</span>
                  <span>
                    {businessSettings.currencySymbol}
                    {selectedOrder.tax.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/[0.06]">
                  <span>Total</span>
                  <span>
                    {businessSettings.currencySymbol}
                    {selectedOrder.total.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Payment Detail */}
              <div className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 text-sm">
                <div className="flex items-center gap-2">
                  {getPaymentIcon(selectedOrder.paymentMethod)}
                  <span className="capitalize text-slate-300">
                    Paid via {selectedOrder.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Demo Status changer dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Order Action (Demo Mode)
                </label>
                <div className="flex gap-2">
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(val: any) =>
                      handleUpdateStatus(selectedOrder.id, val as OrderStatus)
                    }
                  >
                    <SelectTrigger className="flex-1 h-10 border-white/[0.06] bg-white/[0.04] text-slate-300">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="border-white/[0.08] bg-[#0f1623] text-slate-300">
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="held">Held</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-white/[0.08] hover:bg-white/[0.04]">
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
