export const EVENT_CATEGORIES = [
  "Music",
  "Tech",
  "Art",
  "Food",
  "Sports",
  "Design",
  "Film",
  "Wellness",
  "Community",
  "Culture",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
