import { Skeleton } from '../ui/skeleton'

export default function AdsSkelton() {
  return Array(4)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        className="relative w-full overflow-hidden rounded-lg h-72 "
      >
        <Skeleton className="w-full h-full bg-gray-300 " />
      </div>
    ))
}
