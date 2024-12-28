import { Skeleton } from "../ui/skeleton";

export default function ListingsGridSkelton() {
  return Array(7)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        className="overflow-hidden relative w-full h-40 rounded-lg bg-white"
      >
        <Skeleton className="w-full h-24 bg-gray-300" />

        <Skeleton className="w-4/5 mt-4 ml-1 h-4 bg-gray-300" />

        <Skeleton className="w-3/5 mt-2 ml-1 h-3 bg-gray-300" />
      </div>
    ));
}
