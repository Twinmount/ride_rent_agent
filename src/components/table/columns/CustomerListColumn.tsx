import { ColumnDef } from "@tanstack/react-table";

export const CustomerListColumns = (
  handleViewDetails: (userId: string) => void
): ColumnDef<any>[] => [
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const userId = row.original.userId;

      return (
        <button
          onClick={() => handleViewDetails(userId)}
          className="text-blue-500 hover:underline"
        >
          View Details
        </button>
      );
    },
  },
];
