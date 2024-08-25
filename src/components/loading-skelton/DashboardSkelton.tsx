import { Skeleton } from '../ui/skeleton'

export default function DashboardSkelton() {
  return (
    <div className="relative w-full h-24 overflow-hidden rounded-lg ">
      <Skeleton className="w-full h-full bg-gray-300 " />
    </div>
  )
}
