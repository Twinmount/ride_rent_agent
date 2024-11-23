import { ColumnDef } from "@tanstack/react-table";

export const VehicleListColumns: ColumnDef<any>[] = [
  {
    accessorKey: "brandName",
    header: "Brand Name",
  },
  {
    accessorKey: "vehicleRegistrationNumber",
    header: "Registration No",
  },
  {
    accessorKey: "totalTrips",
    header: "Total Trips",
  },
  {
    accessorKey: "amountGenerated",
    header: "Amount Generated",
  },
];
