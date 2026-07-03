"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  DollarSign,
  ShoppingBag,
  Clock,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { customers as initialCustomers, businessSettings } from "@/lib/mock-data";
import { Customer } from "@/lib/types";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog/Sheet states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form States for Add/Edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    loyaltyPoints: "0",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const openAddDialog = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      loyaltyPoints: "0",
    });
    setIsAddOpen(true);
  };

  const handleAddCustomer = () => {
    const newCustomer: Customer = {
      id: `c-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: parseInt(formData.loyaltyPoints) || 0,
      lastVisit: "-",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setProducts(newCustomer);
    setCustomers((prev) => [newCustomer, ...prev]);
    setIsAddOpen(false);
  };

  // Quick state patcher
  const setProducts = (customer: Customer) => {};

  const openEditDialog = (e: React.MouseEvent, customer: Customer) => {
    e.stopPropagation();
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      loyaltyPoints: customer.loyaltyPoints.toString(),
    });
    setIsEditOpen(true);
  };

  const handleEditCustomer = () => {
    if (!selectedCustomer) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === selectedCustomer.id
          ? {
              ...c,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              loyaltyPoints: parseInt(formData.loyaltyPoints) || 0,
            }
          : c
      )
    );
    setIsEditOpen(false);
    setSelectedCustomer(null);
  };

  // Filters
  const filteredCustomers = customers.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.email.toLowerCase().includes(query)
    );
  });

  const totalPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Overview stats grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Customers
              </p>
              <p className="text-2xl font-bold text-white mt-1">{customers.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Loyalty Points
              </p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{totalPoints.toLocaleString()}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Customer Sales
              </p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                {businessSettings.currencySymbol}
                {totalSpentAll.toLocaleString()}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-xl border-white/[0.06] bg-white/[0.04] pl-10 text-sm text-slate-300 placeholder:text-slate-600 focus:border-blue-500/50"
          />
        </div>

        <Button
          onClick={openAddDialog}
          className="h-10 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 font-semibold text-white hover:from-blue-600 hover:to-violet-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Customer
        </Button>
      </div>

      {/* Customer List */}
      <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-white/[0.06]">
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-slate-500">Name</TableHead>
                  <TableHead className="text-slate-500">Contact</TableHead>
                  <TableHead className="text-center text-slate-500">Total Orders</TableHead>
                  <TableHead className="text-right text-slate-500">Total Spent</TableHead>
                  <TableHead className="text-center text-slate-500">Loyalty Points</TableHead>
                  <TableHead className="text-slate-500">Last Visit</TableHead>
                  <TableHead className="w-16 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center text-slate-600">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className="border-white/[0.04] hover:bg-white/[0.02] cursor-pointer text-slate-300"
                    >
                      <TableCell className="font-semibold text-white">
                        {customer.name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-slate-600" />
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-slate-600" />
                            <span>{customer.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {customer.totalOrders}
                      </TableCell>
                      <TableCell className="text-right font-bold text-white">
                        {businessSettings.currencySymbol}
                        {customer.totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-amber-500/10 text-amber-400 border-0 text-[10px] font-semibold">
                          ⭐ {customer.loyaltyPoints}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400">{customer.lastVisit}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => openEditDialog(e, customer)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Customer Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="border-white/[0.08] bg-[#0f1623] text-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">New Customer Profile</DialogTitle>
            <DialogDescription className="text-slate-500">
              Register a new client for loyalty incentives.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Shakib Al Hasan"
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+880 17XX-XXXXXX"
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@mail.com"
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Mirpur-10, Dhaka"
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loyaltyPoints">Starting Loyalty Points</Label>
              <Input
                id="loyaltyPoints"
                type="number"
                value={formData.loyaltyPoints}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsAddOpen(false)}
              className="text-slate-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomer}
              className="bg-gradient-to-r from-blue-500 to-violet-600 text-white"
              disabled={!formData.name || !formData.phone}
            >
              Register Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="border-white/[0.08] bg-[#0f1623] text-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Customer Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loyaltyPoints">Loyalty Points</Label>
              <Input
                id="loyaltyPoints"
                type="number"
                value={formData.loyaltyPoints}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsEditOpen(false)}
              className="text-slate-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditCustomer}
              className="bg-gradient-to-r from-blue-500 to-violet-600 text-white"
            >
              Save Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Info Sheet details drawer */}
      <Sheet
        open={!!selectedCustomer && !isEditOpen}
        onOpenChange={() => setSelectedCustomer(null)}
      >
        <SheetContent className="w-full sm:max-w-md border-l border-white/[0.08] bg-[#0c111a] text-slate-300">
          {selectedCustomer && (
            <div className="flex h-full flex-col space-y-6">
              <SheetHeader>
                <SheetTitle className="text-white text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Customer Profile
                </SheetTitle>
                <SheetDescription className="text-slate-500">
                  Registered {selectedCustomer.createdAt}
                </SheetDescription>
              </SheetHeader>

              {/* Avatar + Main name header */}
              <div className="flex flex-col items-center justify-center text-center space-y-2 py-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 text-2xl font-bold text-blue-400 shadow-inner">
                  {selectedCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedCustomer.name}</h3>
                  <Badge className="bg-amber-500/10 text-amber-400 border-0 mt-1">
                    ⭐ Loyalty Tier: Gold
                  </Badge>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-4 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contact Details
                </h4>
                <div className="space-y-2.5 text-sm text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{selectedCustomer.address}</span>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 text-center space-y-1">
                  <ShoppingBag className="h-4 w-4 text-violet-400 mx-auto" />
                  <p className="text-[10px] text-slate-500 uppercase">Orders</p>
                  <p className="text-base font-bold text-white">{selectedCustomer.totalOrders}</p>
                </div>
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 text-center space-y-1">
                  <DollarSign className="h-4 w-4 text-emerald-400 mx-auto" />
                  <p className="text-[10px] text-slate-500 uppercase">Spent</p>
                  <p className="text-base font-bold text-white">
                    {businessSettings.currencySymbol}
                    {selectedCustomer.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 text-center space-y-1">
                  <Clock className="h-4 w-4 text-amber-400 mx-auto" />
                  <p className="text-[10px] text-slate-500 uppercase">Last Visit</p>
                  <p className="text-[11px] font-semibold text-white truncate pt-1">
                    {selectedCustomer.lastVisit}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
