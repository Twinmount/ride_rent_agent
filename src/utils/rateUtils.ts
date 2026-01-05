export function parseWeekdays(weekdayInput: any): string[] {
  if (!weekdayInput) return [];

  const input = String(weekdayInput).trim().toLowerCase();

  if (!input || input === "none" || input === "0") return [];
  if (input === "all") return ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  if (input === "weekdays") return ["Mo", "Tu", "We", "Th", "Fr"];
  if (input === "weekends") return ["Sa", "Su"];

  const dayMap: Record<string, string> = {
    mo: "Mo",
    mon: "Mo",
    monday: "Mo",
    tu: "Tu",
    tue: "Tu",
    tuesday: "Tu",
    we: "We",
    wed: "We",
    wednesday: "We",
    th: "Th",
    thu: "Th",
    thursday: "Th",
    fr: "Fr",
    fri: "Fr",
    friday: "Fr",
    sa: "Sa",
    sat: "Sa",
    saturday: "Sa",
    su: "Su",
    sun: "Su",
    sunday: "Su",
  };

  const days = input
    .split(",")
    .map((day) => day.trim())
    .map((day) => dayMap[day])
    .filter(Boolean);

  return [...new Set(days)];
}

export function normalizeRecurring(value: any): boolean {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(v)) return true;
    if (["false", "0", "no"].includes(v)) return false;
  }

  if (typeof value === "number") return value === 1;

  return false;
}
