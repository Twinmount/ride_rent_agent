import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const OngoingTripsColumns = (
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
    header: "Extend Trip",
    cell: ({ row }) => {
      const trip = row.original;

      return (
        <Button
          onClick={() => handleOpenModal(trip)}
          className="text-white bg-blue-500 hover:bg-blue-600"
        >
          Extend Trip
        </Button>
      );
    },
  },
  {
    header: "End Trip",
    cell: ({ row }) => {
      const trip = row.original;

      return (
        <Link
          to={`/active-trips/extend/${trip.id}`}
          className="text-blue-500 hover:underline"
        >
          End Trip
        </Link>
      );
    },
  },
];
