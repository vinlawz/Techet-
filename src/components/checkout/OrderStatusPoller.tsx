"use client";

import { useEffect, useState } from "react";

export function OrderStatusPoller({ orderId, initialStatus }: { orderId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "PENDING") return;
    const timer = setInterval(async () => {
      const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setReason(data.failureReason);
      if (data.status !== "PENDING") {
        setStatus(data.status);
        // Re-render server data (tickets) once paid.
        if (data.status === "PAID") window.location.reload();
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [orderId, status]);

  if (status === "PENDING") {
    return (
      <p className="mt-4 text-muted">
        Check your phone and enter your M-Pesa PIN to complete the payment. This page updates
        automatically.
      </p>
    );
  }
  if (status === "PAID") return null;
  return (
    <p className="mt-4 text-red-400">
      Payment {status === "CANCELLED" ? "was cancelled" : "failed"}
      {reason ? `: ${reason}` : "."} You have not been charged for this order.
    </p>
  );
}
