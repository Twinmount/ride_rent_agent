import { Skeleton } from "../ui/skeleton";

export default function LinkSkelton() {
  return Array(4)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        className="flex flex-col p-1 mb-2 space-y-3 w-full rounded-xl"
      >
        <Skeleton className="w-full h-12 bg-gray-200 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="w-[70%] h-6 bg-gray-200" />
        </div>
      </div>
    ));
}
