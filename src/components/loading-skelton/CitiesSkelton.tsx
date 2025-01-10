import { Skeleton } from "../ui/skeleton";


export default function CitiesSkelton({ count = 4 }: { count: number }) {
  return (
    <div className="flex-wrap gap-2 flex-center">
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="overflow-hidden w-12 h-6 bg-white rounded-lg shadow-md"
          >
            <Skeleton className="w-full h-full bg-gray-200" />
          </div>
        ))}
    </div>
  );
}
