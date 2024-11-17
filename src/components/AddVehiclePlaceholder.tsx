import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function AddVehiclePlaceholder({ userId }: { userId: string }) {
  return (
    <Link
      to={`/listings/add/${userId}`}
      className="flex overflow-hidden flex-col justify-center items-center h-60 bg-gray-100 rounded-lg border shadow-lg transition-all group hover:bg-gray-200"
    >
      {/* Centered Plus Icon */}
      <div className="flex flex-col justify-center items-center h-full">
        <div className="p-4 bg-yellow-500 rounded-full">
          <Plus className="w-20 h-20 transition-transform text-yellow group-hover:scale-110" />
        </div>
        <span className="mt-4 text-lg font-semibold text-gray-700">
          Add Vehicle
        </span>
      </div>
    </Link>
  );
}
