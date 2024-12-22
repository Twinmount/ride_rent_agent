import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { SortDropdown } from "@/components/SortDropdown";
import { LimitDropdown } from "@/components/LimitDropdown";
import { CompletedTripsTable } from "@/components/table/CompletedTripsTable";
import { CompletedTripsColumns } from "@/components/table/columns/CompletedTripsColumn";
import CompletedTripsInvoiceDownloadModal from "@/components/modal/srm-modal/CompletedTripsInvoiceDownloadModal";
import { fetchCompletedTrips } from "@/api/srm/trips";

const mockData = [
  {
    id: "1",
    brandName: "Toyota",
    customerName: "John Doe",
    tripStarted: "2023-12-01",
    tripEnded: "2023-12-10",
    amountCollected: 5000,
    amountPending: 0,
  },
  {
    id: "2",
    brandName: "BMW",
    customerName: "Jane Smith",
    tripStarted: "2023-11-20",
    tripEnded: "2023-11-30",
    amountCollected: 7000,
    amountPending: 200,
  },
];

export default function CompletedTripsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [downloadTripId, setDownloadTripId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["completedTrips", page, limit],
    queryFn: () =>
      fetchCompletedTrips({
        page,
        limit,
        sortOrder,
      }), // Use mockData instead of API call for now
    staleTime: 0,
  });

  const handleDownloadModal = (tripId: string) => {
    setDownloadTripId(tripId);
  };

  const handleCloseModal = () => {
    setDownloadTripId(null);
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
        columns={CompletedTripsColumns(handleDownloadModal)}
        data={data?.result?.list || mockData}
        loading={isLoading}
      />

      {downloadTripId && (
        <CompletedTripsInvoiceDownloadModal
          isOpen={!!downloadTripId}
          onClose={handleCloseModal}
          onDownload={() => {
            handleCloseModal();
          }}
        />
      )}

      {data?.result && data?.result.totalNumberOfPages > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages}
        />
      )}
    </section>
  );
}
