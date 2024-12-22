import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export const CustomerListColumns = (
  handleViewDetails: (userId: string) => void
): ColumnDef<any>[] => [
  {
    accessorKey: "customerName",
    header: "Customer Name",

    cell: ({ row }) => {
      const userId = row.original.id; // Assuming `id` is the unique user identifier
      const customerName = row.original.customerName;

      return (
        <Link
          to={`/customerDetails/${userId}`} // Link to customer details
          className="text-blue-500 underline hover:text-blue-700"
        >
          {customerName}
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "passportNumber",
    header: "Passport Number",
  },
  {
    accessorKey: "drivingLicenseNumber",
    header: "Driving License Number",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    header: "View Details",
    cell: ({ row }) => {
      const userId = row.original.id;

      return (
        <button
          onClick={() => handleViewDetails(userId)}
          className="text-blue-500 underline hover:text-blue-700"
        >
          View Details
        </button>
      );
    },
  },
];
