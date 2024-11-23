import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export const ActiveTripsColumns = (
  handleOpenModal: (trip: any) => void // Replace `any` with your trip type
): ColumnDef<any>[] => [
  {
    accessorKey: "brandName",
    header: "Brand Name",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "bookingStartDate",
    header: "Trip Starts",
  },
  {
    accessorKey: "BookingEndDate",
    header: "Trip Ends",
  },
  {
    header: "End Trip",
    cell: ({ row }) => {
      const trip = row.original;

      return (
        <Button
          onClick={() => handleOpenModal(trip)}
          className="text-white bg-blue-500 hover:bg-blue-600"
        >
          End Trip
        </Button>
      );
    },
  },
];
