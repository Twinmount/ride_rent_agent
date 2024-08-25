import { Skeleton } from '../ui/skeleton'

export default function LocationSkelton() {
  return Array(8)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        className="w-full overflow-hidden bg-white rounded-lg shadow-md h-44"
      >
        <Skeleton className="w-full h-full bg-gray-200 " />
      </div>
    ))
}
