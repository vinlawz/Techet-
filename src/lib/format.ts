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

// Formats a Date as a "YYYY-MM-DDTHH:mm" value for a <input type="datetime-local">.
export function toLocalInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export function formatEventDate(date: Date): string {
  return dateFormatter.format(date);
}

export function formatEventTime(date: Date): string {
  return timeFormatter.format(date);
}
