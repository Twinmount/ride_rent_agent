import { ColumnDef } from "@tanstack/react-table";

export const InCompleteTripsColumn = (): ColumnDef<any>[] => [
  {
    accessorKey: "vehicle.vehicleRegistrationNumber",
    header: "Registration No.",
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
