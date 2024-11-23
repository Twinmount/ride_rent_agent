import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export const CompletedTripsColumns = (
  handleViewTrip: (trip: any) => void, // Replace `any` with your trip type
  handleDownloadTrip: (tripId: string) => void
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
          <Button
            onClick={() => handleViewTrip(trip)}
            className="text-white bg-blue-500 hover:bg-blue-600"
          >
            View
          </Button>
          <Button
            onClick={() => handleDownloadTrip(trip.tripId)}
            className="text-white bg-green-500 hover:bg-green-600"
          >
            Download
          </Button>
        </div>
      );
    },
  },
];
