import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CompletedTripsColumns = (
  handleDownloadModal: (tripId: string) => void
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
    accessorKey: "tripStarted",
    header: "Trip Started",
  },
  {
    accessorKey: "tripEnded",
    header: "Trip Ended",
  },
  {
    accessorKey: "amountCollected",
    header: "Amount Collected",
  },
  {
    accessorKey: "amountPending",
    header: "Amount Pending",
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const trip = row.original;

      return (
        <div className="flex space-x-2">
          {/* View as Link */}
          <Link
            to={`/completed-trips/${trip.id}`}
            className="text-blue-500 underline hover:text-blue-700"
          >
            View
          </Link>

          {/* Download Button */}
          <Button
            onClick={() => handleDownloadModal(trip.id)}
            className="text-white bg-green-500 hover:bg-green-600"
          >
            Download
          </Button>
        </div>
      );
    },
  },
];
