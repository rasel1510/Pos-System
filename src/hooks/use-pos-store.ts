"use client";

import { useState, useCallback } from "react";
import { Product, CartItem, Order, OrderItem } from "@/lib/types";
import { orders as mockOrders, businessSettings } from "@/lib/mock-data";

let orderCounter = mockOrders.length + 1;

export function usePosStore() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("fixed");
  const [heldOrders, setHeldOrders] = useState<Order[]>(
    mockOrders.filter((o) => o.status === "held")
  );
  const [completedOrders, setCompletedOrders] = useState<Order[]>(
    mockOrders.filter((o) => o.status !== "held")
  );

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscount(0);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount =
    discountType === "percentage"
      ? (subtotal * discount) / 100
      : discount;

  const taxAmount = ((subtotal - discountAmount) * businessSettings.taxRate) / 100;
  const total = subtotal - discountAmount + taxAmount;

  const holdOrder = useCallback(() => {
    if (cart.length === 0) return;
    orderCounter++;
    const order: Order = {
      id: `hold-${Date.now()}`,
      orderNumber: `ORD-2026-${String(orderCounter).padStart(4, "0")}`,
      items: cart.map(
        (item): OrderItem => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        })
      ),
      subtotal,
      tax: taxAmount,
      taxRate: businessSettings.taxRate,
      discount: discountAmount,
      discountType,
      total,
      paymentMethod: "cash",
      status: "held",
      createdAt: new Date().toISOString(),
      note: "Held from POS",
    };
    setHeldOrders((prev) => [...prev, order]);
    clearCart();
  }, [cart, subtotal, taxAmount, discountAmount, discountType, total, clearCart]);

  const resumeOrder = useCallback(
    (orderId: string) => {
      const order = heldOrders.find((o) => o.id === orderId);
      if (!order) return;
      // We can't perfectly restore product references, but for the demo we reconstruct cart items
      // In a real app, you'd look up products by ID
      setHeldOrders((prev) => prev.filter((o) => o.id !== orderId));
      // For demo, we just clear cart — the order detail is shown in the held orders panel
      clearCart();
    },
    [heldOrders, clearCart]
  );

  const completeOrder = useCallback(
    (paymentMethod: "cash" | "card" | "mobile") => {
      if (cart.length === 0) return null;
      orderCounter++;
      const order: Order = {
        id: `order-${Date.now()}`,
        orderNumber: `ORD-2026-${String(orderCounter).padStart(4, "0")}`,
        items: cart.map(
          (item): OrderItem => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            total: item.product.price * item.quantity,
          })
        ),
        subtotal,
        tax: taxAmount,
        taxRate: businessSettings.taxRate,
        discount: discountAmount,
        discountType,
        total,
        paymentMethod,
        status: "completed",
        createdAt: new Date().toISOString(),
      };
      setCompletedOrders((prev) => [order, ...prev]);
      clearCart();
      return order;
    },
    [cart, subtotal, taxAmount, discountAmount, discountType, total, clearCart]
  );

  return {
    cart,
    discount,
    discountType,
    subtotal,
    discountAmount,
    taxAmount,
    total,
    heldOrders,
    completedOrders,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setDiscount,
    setDiscountType,
    holdOrder,
    resumeOrder,
    completeOrder,
  };
}
