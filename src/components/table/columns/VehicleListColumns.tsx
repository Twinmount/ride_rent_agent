import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

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
      <Link
        to={`/srm/manage-vehicles/edit/${row.original.id}`}
        className="text-blue-500 hover:underline"
      >
        {row.original.vehicleBrand?.brandName || "N/A"}
      </Link>
    ),
  },
  {
    accessorKey: "vehiclePhoto",
    header: "Photo",
    cell: ({ row }) => {
      const vehiclePhoto = row.original.vehiclePhoto;
      return vehiclePhoto ? (
        <Link to={`/srm/manage-vehicles/edit/${row.original.id}`}>
          <div className="w-24 h-16 overflow-hidden rounded-md border hover:outline-2 hover:outline-blue-400 bg-slate-300">
            <img
              src={vehiclePhoto}
              alt="Vehicle"
              className="object-cover w-full h-full"
            />
          </div>
        </Link>
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
      <Link
        to={`/srm/manage-vehicles/edit/${row.original.id}`}
        className="text-blue-500 hover:underline"
      >
        {row.original.vehicleRegistrationNumber || "N/A"}
      </Link>
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
