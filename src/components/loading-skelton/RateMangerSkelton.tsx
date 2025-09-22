import { Skeleton } from "../ui/skeleton";

const DAYS = [
  { label: "Mo", value: "Mo" },
  { label: "Tu", value: "Tu" },
  { label: "We", value: "We" },
  { label: "Th", value: "Th" },
  { label: "Fr", value: "Fr" },
  { label: "Sa", value: "Sa" },
  { label: "Su", value: "Su" },
];

export default function BulkDiscountSkeleton() {
  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Skeleton className="flex-1 h-40 rounded-2xl border-2" />
        <Skeleton className="flex-1 h-40 rounded-2xl border-2" />
        <Skeleton className="flex-1 h-40 rounded-2xl border-2" />
      </div>

      <div className="mb-6">
        <Skeleton className="h-5 w-1/3 mb-3" />
        <div className="flex gap-3 mb-2">
          {DAYS.map((day) => (
            <Skeleton key={day.value} className="w-10 h-10 rounded-full" />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}
