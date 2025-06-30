import { Link } from "react-router-dom";
import { Eye, CalendarClock, X } from "lucide-react";

type Props = {
  bookingId: string;
  customerId: string;
  vehicleId: string;
  paymentId: string;
  onExtend: () => void;
};

export const TripActionButtons = ({
  bookingId,
  customerId,
  vehicleId,
  paymentId,
  onExtend,
}: Props) => {
  return (
    <div className="flex gap-x-2 items-center">
      <Link
        to={`/srm/trips/edit/${bookingId}?customerId=${customerId}&vehicleId=${vehicleId}&paymentId=${paymentId}`}
        className="px-3 py-1 text-slate-800 hover:text-white border-slate-800 border hover:bg-slate-800 rounded-md transition-colors flex-center gap-x-2"
      >
        View <Eye size={18} />
      </Link>

      <button
        onClick={onExtend}
        className="px-3 py-1 text-blue-500 hover:text-white border-blue-500 border hover:bg-blue-500 rounded-md transition-colors flex-center gap-x-2"
      >
        Extend <CalendarClock size={16} />
      </button>

      <Link
        to={`/srm/end-trip/${bookingId}`}
        className="px-3 py-1 text-red-500 hover:text-white border-red-500 border hover:bg-red-500 rounded-md transition-colors flex-center gap-x-2"
      >
        End <X size={18} />
      </Link>
    </div>
  );
};
