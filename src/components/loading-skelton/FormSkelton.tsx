import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

export default function FormSkelton() {
  return (
    <div className="flex flex-col py-8 w-full gap-5 max-w-[700px] mx-auto px-2 bg-white rounded-2xl p-2">
      <div className="space-y-2">
        <Skeleton className="w-full h-8 bg-gray-300" />
        <Skeleton className="h-8 bg-gray-200 w-60" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-full h-8 bg-gray-300" />
        <Skeleton className="h-8 bg-gray-200 w-60" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-full h-8 bg-gray-300" />
        <Skeleton className="h-8 bg-gray-200 w-60" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-full h-8 bg-gray-300" />
        <Skeleton className="h-8 bg-gray-200 w-60" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-full h-8 bg-gray-300" />
        <Skeleton className="h-8 bg-gray-200 w-60" />
      </div>

      <Button
        size="lg"
        disabled={true}
        className="w-full col-span-2 mt-3 text-gray-900 bg-gray-300 button !text-lg !font-semibold"
      ></Button>
    </div>
  )
}
