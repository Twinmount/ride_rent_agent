import { IndividualTrip } from "@/types/srm-api-types";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export const InCompleteTripsColumn = (): ColumnDef<IndividualTrip>[] => [
  {
    accessorKey: "vehicle.vehicleRegistrationNumber",
    header: "Registration No.",
    cell: ({ row }) => {
      const {
        vehicle: { id: vehicleId },
        bookingId,
        customer: { customerId },
        payment: { id: paymentId },
      } = row.original;

      return (
        <Link
          to={`/srm/trips/edit/${bookingId}?customerId=${customerId}&vehicleId=${vehicleId}&paymentId=${paymentId}`}
          className="font-semibold text-blue-600 hover:underline"
        >
          {row.original.vehicle.vehicleRegistrationNumber}
        </Link>
      );
    },
  },
  {
    accessorKey: "vehicle.vehicleBrand.brandName",
    header: "Brand",
    cell: ({ row }) => (
      <span>{row.original.vehicle.vehicleBrand?.brandName || "N/A"}</span>
    ),
  },
  {
    accessorKey: "vehicle.vehiclePhoto",
    header: "Image",
    cell: ({ row }) => {
      const vehiclePhoto = row.original.vehicle.vehiclePhoto;
      return vehiclePhoto ? (
        <div className="w-16 h-16 overflow-hidden rounded-xl bg-slate-300">
          <img
            src={vehiclePhoto}
            alt="Vehicle"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      ) : (
        <div className="w-16 h-16 overflow-hidden rounded-xl flex-center bg-slate-300">
          No Image
        </div>
      );
    },
  },
];
