import { ColumnDef } from "@tanstack/react-table";

export const VehicleListColumns: ColumnDef<any>[] = [
  {
    accessorKey: "vehicleCategory.name",
    header: "Category",
    cell: ({ row }) => (
      <span>{row.original.vehicleCategory?.name || "N/A"}</span>
    ),
  },
  {
    accessorKey: "vehicleBrand.brandName",
    header: "Brand",
    cell: ({ row }) => (
      <span>{row.original.vehicleBrand?.brandName || "N/A"}</span>
    ),
  },
  {
    accessorKey: "vehiclePhoto",
    header: "Photo",
    cell: ({ row }) => {
      const vehiclePhoto = row.original.vehiclePhoto;
      return vehiclePhoto ? (
        <div className="w-16 h-16 overflow-hidden rounded-md bg-slate-300">
          <img
            src={vehiclePhoto}
            alt="Vehicle"
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="w-16 h-16 overflow-hidden rounded-md flex-center text-[0.6rem] text-gray-600 bg-slate-300">
          No Image
        </div>
      );
    },
  },
  {
    accessorKey: "vehicleRegistrationNumber",
    header: "Registration No.",
    cell: ({ row }) => (
      <span>{row.original.vehicleRegistrationNumber || "N/A"}</span>
    ),
  },
  {
    accessorKey: "rentalDetails",
    header: "Rental Details",
    cell: ({ row }) => (
      <div className="flex flex-col justify-center gap-y-1">
        <span>
          Day :{" "}
          <span className="font-semibold">
            {row.original.rentalDetails?.day?.rentInAED + " AED" || "N/A"}
          </span>
        </span>
        <span>
          Week :{" "}
          <span className="font-semibold">
            {row.original.rentalDetails?.week?.rentInAED + " AED" || "N/A"}
          </span>
        </span>
        <span>
          Month :
          <span className="font-semibold">
            {row.original.rentalDetails?.month?.rentInAED + " AED" || "N/A"}
          </span>
        </span>
        <span>
          Hour :{" "}
          <span className="font-semibold">
            {row.original.rentalDetails?.hour?.rentInAED + " AED" || "N/A"}
          </span>
        </span>
      </div>
    ),
  },
];
