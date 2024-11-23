import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { ActiveTripsTable } from "@/components/table/ActiveTripsTable";
import { ActiveTripsColumns } from "@/components/table/columns/ActiveTripsColumn";

import { toast } from "@/components/ui/use-toast";
import { SortDropdown } from "@/components/SortDropdown";
import { LimitDropdown } from "@/components/LimitDropdown";
import TripEndModal from "@/components/modal/srm-modal/TripEndModal";
import { endTrip, fetchActiveTrips } from "@/api/srm/trips";
import { CustomerStatus } from "@/types/types"; // Import the enum

interface Trip {
  id: string;
  brandName: string;
  customerName: string;
  advancePaid: number;
  amountRemaining: number;
}

export default function ActiveTripsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["activeTrips", page, limit],
    queryFn: () =>
      fetchActiveTrips({
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
        Active Trips
      </h1>
      <div className="flex gap-x-2 justify-end mb-4 w-full max-sm:mt-3">
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

      <ActiveTripsTable
        columns={ActiveTripsColumns(handleOpenModal)}
        data={data?.result?.list || []}
        loading={isLoading}
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
    </section>
  );
}
