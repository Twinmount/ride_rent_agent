import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AddVehiclePlaceholder({ userId }: { userId: string }) {
  return (
    <Link
      to={`/listings/add/${userId}`}
      className="flex flex-col items-center justify-center overflow-hidden transition-all bg-gray-100 border rounded-lg shadow-lg h-72 group hover:bg-gray-200"
    >
      {/* Centered Plus Icon */}
      <div className="flex flex-col items-center justify-center h-full">
        <div className="p-4 bg-yellow-500 rounded-full">
          <Plus className="w-20 h-20 transition-transform text-yellow group-hover:scale-110" />
        </div>
        <span className="mt-4 text-lg font-semibold text-gray-700">
          Add Vehicle
        </span>
      </div>
    </Link>
  )
}
