import { Skeleton } from "../ui/skeleton";

export default function LocationSkelton() {
  return Array(8)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        className="overflow-hidden w-full h-44 bg-white rounded-lg shadow-md"
      >
        <Skeleton className="w-full h-full bg-gray-200" />
      </div>
    ));
}
