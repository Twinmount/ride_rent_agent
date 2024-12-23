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
        "No Image"
      );
    },
  },
  {
    accessorKey: "rentalDetails.day.rentInAED",
    header: "Daily Rent",
    cell: ({ row }) => (
      <span>
        {row.original.rentalDetails?.day?.rentInAED + " AED" || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "rentalDetails.week.rentInAED",
    header: "Weekly Rent",
    cell: ({ row }) => (
      <span>
        {row.original.rentalDetails?.week?.rentInAED + " AED" || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "rentalDetails.month.rentInAED",
    header: "Monthly Rent",
    cell: ({ row }) => (
      <span>
        {row.original.rentalDetails?.month?.rentInAED + " AED" || "N/A"}{" "}
      </span>
    ),
  },
  {
    accessorKey: "rentalDetails.hour.rentInAED",
    header: "Hourly Rent",
    cell: ({ row }) => (
      <span>
        {row.original.rentalDetails?.hour?.rentInAED + " AED" || "N/A"}{" "}
      </span>
    ),
  },
];
