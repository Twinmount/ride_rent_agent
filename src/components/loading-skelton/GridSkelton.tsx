import { Skeleton } from '../ui/skeleton'

export default function GridSkelton({ type }: { type: 'brand' | 'category' }) {
  return Array(12)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        className={`flex flex-col w-32 ${
          type === 'brand' && 'h-32'
        } space-y-3 `}
      >
        <Skeleton
          className={`w-full bg-gray-200 ${
            type === 'brand' ? 'h-28' : 'h-32'
          } rounded-xl `}
        />
        <div className="space-y-2">
          <Skeleton className="w-full h-4 bg-gray-200" />
        </div>
      </div>
    ))
}
