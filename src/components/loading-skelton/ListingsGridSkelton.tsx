import { Skeleton } from "../ui/skeleton";

export default function ListingsGridSkelton() {
  return Array(7)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        className="overflow-hidden relative w-full h-56 rounded-lg"
      >
        <Skeleton className="w-full h-full bg-gray-300" />
      </div>
    ));
}
