import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export const CustomerListColumns = (
  handleViewDetails: (userId: string) => void
): ColumnDef<any>[] => [
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => {
      const userId = row.original.id; // Unique user identifier
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
    accessorKey: "nationality",
    header: "Nationality",
    cell: ({ row }) => <span>{row.original.nationality}</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      const phoneNumber = row.original.phoneNumber;
      const countryCode = row.original.countryCode;
      return <span>{`+${countryCode} ${phoneNumber}`}</span>;
    },
  },
  {
    accessorKey: "passportNumber",
    header: "Passport Number",
    cell: ({ row }) => <span>{row.original.passportNumber}</span>,
  },
  {
    accessorKey: "drivingLicenseNumber",
    header: "Driving License Number",
    cell: ({ row }) => <span>{row.original.drivingLicenseNumber}</span>,
  },

  {
    accessorKey: "id",
    header: "Customer ID",
    cell: ({ row }) => {
      const userId = row.original.id;
      return <span>{userId}</span>;
    },
  },
];
