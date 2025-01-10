import { Skeleton } from "../ui/skeleton";

export default function AdsSkelton() {
  return Array(4)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        className="overflow-hidden relative w-full h-72 rounded-lg"
      >
        <Skeleton className="w-full h-full bg-gray-300" />
      </div>
    ));
}
