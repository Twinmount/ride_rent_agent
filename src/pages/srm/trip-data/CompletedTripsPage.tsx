import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { toast } from "@/components/ui/use-toast";
import { SortDropdown } from "@/components/SortDropdown";
import { LimitDropdown } from "@/components/LimitDropdown";
import {
  CompletedTripDetails,
  downloadCompletedTrip,
  fetchCompletedTrips,
  updateCompletedTrip,
} from "@/api/srm/trips";
import { CompletedTripsTable } from "@/components/table/CompletedTripsTable";
import { CompletedTripsColumns } from "@/components/table/columns/CompletedTripsColumn";
import ViewCompletedTripModal from "@/components/modal/srm-modal/ViewCompletedTripModal";
import DownloadCompletedTripModal from "@/components/modal/srm-modal/DownloadCompletedTripModal";

interface Trip {
  id: string;
  brandName: string;
  customerName: string;
  tripStarted: string;
  tripEnded: string;
  amountCollected: number;
  amountPending: number;
}

export default function CompletedTripsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [viewTrip, setViewTrip] = useState<CompletedTripDetails | null>(null);
  const [downloadTripId, setDownloadTripId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["completedTrips", page, limit],
    queryFn: () =>
      fetchCompletedTrips({
        page,
        limit,
        sortOrder,
      }),
    staleTime: 0,
  });

  const handleViewTrip = (trip: CompletedTripDetails) => {
    setViewTrip(trip);
  };

  const handleCloseViewModal = () => {
    setViewTrip(null);
  };

  const handleDownloadTrip = async (tripId: string) => {
    try {
      await downloadCompletedTrip({ tripId });
      toast({
        title: "Download started",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Something went wrong while downloading the trip.",
      });
    }
  };

  const handleUpdateTrip = async (updatedDetails: CompletedTripDetails) => {
    if (viewTrip) {
      try {
        await updateCompletedTrip({ ...viewTrip, ...updatedDetails });
        queryClient.invalidateQueries({ queryKey: ["completedTrips"] });
        toast({
          title: "Trip updated successfully",
          className: "bg-green-500 text-white",
        });
        handleCloseViewModal();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to update trip",
          description: "Something went wrong while updating the trip.",
        });
      }
    }
  };

  return (
    <section className="container py-5 mx-auto min-h-screen md:py-7">
      <h1 className="text-center h3-bold max-sm:text-xl sm:text-left">
        Completed Trips
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

      <CompletedTripsTable
        columns={CompletedTripsColumns(handleViewTrip, handleDownloadTrip)}
        data={data?.result?.list || [{}]}
        loading={isLoading}
      />

      {data?.result && data?.result.totalNumberOfPages > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages}
        />
      )}

      {viewTrip && (
        <ViewCompletedTripModal
          tripDetails={viewTrip}
          isOpen={!!viewTrip}
          onClose={handleCloseViewModal}
          onSubmit={handleUpdateTrip}
        />
      )}

      {downloadTripId && (
        <DownloadCompletedTripModal
          isOpen={!!downloadTripId}
          onClose={() => setDownloadTripId(null)}
          onDownload={() => handleDownloadTrip(downloadTripId)}
        />
      )}
    </section>
  );
}
