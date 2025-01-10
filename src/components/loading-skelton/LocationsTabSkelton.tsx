import { Skeleton } from "../ui/skeleton";

export default function LocationsTabSkelton({ count = 4 }: { count: number }) {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-1 cursor-wait">
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="w-20 h-6 overflow-hidden bg-white rounded-lg shadow-md"
          >
            <Skeleton className="w-full h-full bg-gray-300 " />
          </div>
        ))}
    </div>
  );
}
