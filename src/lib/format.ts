const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-KE", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("en-KE", {
  hour: "numeric",
  minute: "2-digit",
});

export function formatPrice(amount: number | string): string {
  return currencyFormatter.format(Number(amount));
}

export function formatEventDate(date: Date): string {
  return dateFormatter.format(date);
}

export function formatEventTime(date: Date): string {
  return timeFormatter.format(date);
}
