import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { OngoingTripsTable } from "@/components/table/OngoingTripsTable";
import { OngoingTripsColumns } from "@/components/table/columns/OngoingTripsColumn";

import { toast } from "@/components/ui/use-toast";
import { SortDropdown } from "@/components/SortDropdown";
import { LimitDropdown } from "@/components/LimitDropdown";
import TripEndModal from "@/components/modal/srm-modal/TripEndModal";
import { endTrip, fetchOngoingTrips } from "@/api/srm/trips";
import { CustomerStatus } from "@/types/types";
import DownloadExcelModal from "@/components/srm/DownloadSRMExcelData";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface Trip {
  id: string;
  brandName: string;
  customerName: string;
  advancePaid: number;
  amountRemaining: number;
}

const mockData = [
  {
    id: "1",
    brandName: "Tesla",
    customerName: "John Doe",
    bookingStartDate: "2024-01-10",
    BookingEndDate: "2024-01-20",
    advancePaid: 2000,
    amountRemaining: 1500,
  },
  {
    id: "2",
    brandName: "BMW",
    customerName: "Jane Smith",
    bookingStartDate: "2024-02-01",
    BookingEndDate: "2024-02-15",
    advancePaid: 3000,
    amountRemaining: 1200,
  },
  {
    id: "3",
    brandName: "Mercedes",
    customerName: "Alice Johnson",
    bookingStartDate: "2024-03-05",
    BookingEndDate: "2024-03-25",
    advancePaid: 5000,
    amountRemaining: 1000,
  },
];

export default function OngoingTripsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["activeTrips", page, limit],
    queryFn: () =>
      fetchOngoingTrips({
        page,
        limit,
        sortOrder,
      }),
    staleTime: 0,
  });

  const handleOpenModal = (trip: any) => {
    setSelectedTrip({
      id: trip.id,
      brandName: trip.brandName,
      customerName: trip.customerName,
      advancePaid: trip.advancePaid,
      amountRemaining: trip.amountRemaining,
    });
  };

  const handleCloseModal = () => {
    setSelectedTrip(null);
  };

  const handleEndTrip = async (values: {
    fineAmount?: number;
    totalAmountCollected: number;
    customerStatus: CustomerStatus;
  }) => {
    if (selectedTrip) {
      try {
        // Call the API with necessary details
        await endTrip({
          tripId: selectedTrip.id,
        });

        queryClient.invalidateQueries({ queryKey: ["activeTrips"] });

        toast({
          title: "Trip ended successfully",
          className: "bg-green-500 text-white",
        });

        handleCloseModal();
      } catch (error) {
        console.error("Failed to end trip:", error);
        toast({
          variant: "destructive",
          title: "Failed to end trip",
          description: "Something went wrong while ending the trip.",
        });
      }
    }
  };

  return (
    <section className="container py-5 mx-auto min-h-screen md:py-7">
      <h1 className="text-center h3-bold max-sm:text-xl sm:text-left">
        Ongoing Trips
      </h1>
      <div className="flex gap-x-2 justify-end mb-4 w-full max-sm:mt-3">
        <DownloadExcelModal
          title="Excel Data Download"
          onDownload={async () => {}}
        />
        <SortDropdown
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
        <LimitDropdown
          limit={limit}
          setLimit={setLimit}
          isLoading={isLoading}
        />
      </div>

      <OngoingTripsTable
        columns={OngoingTripsColumns(handleOpenModal)}
        data={mockData}
        loading={false}
      />

      {data?.result && data?.result.totalNumberOfPages > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages}
        />
      )}

      {selectedTrip && (
        <TripEndModal
          brandName={selectedTrip.brandName}
          customerName={selectedTrip.customerName}
          advancePaid={selectedTrip.advancePaid}
          amountRemaining={selectedTrip.amountRemaining}
          isOpen={!!selectedTrip}
          onClose={handleCloseModal}
          onSubmit={handleEndTrip}
        />
      )}

      <Link
        to="/srm/trips/new"
        className="fixed right-10 bottom-10 px-6 py-3 text-white rounded-full shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 bg-yellow"
        aria-label="add new record"
      >
        <span className="flex gap-x-2 items-center">
          Add Trip <Plus />
        </span>
      </Link>
    </section>
  );
}
