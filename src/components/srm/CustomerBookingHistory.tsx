import { fetchSRMBookings } from "@/api/srm/trips";
import { useCompany } from "@/hooks/useCompany";
import { BookingStatus } from "@/types/srm-types";
import Pagination from "../Pagination";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CompletedTripsColumns } from "../table/columns/CompletedTripsColumn";
import { GenericTable } from "../table/GenericTable";

export default function CustomerBookingHistory() {
  const [page, setPage] = useState(1);
  // const [downloadTripId, setDownloadTripId] = useState<string | null>(null);
  const { companyId, isCompanyLoading } = useCompany();

  const { data, isLoading } = useQuery({
    queryKey: ["bookings-per-customer"],
    queryFn: () =>
      fetchSRMBookings({
        page: 1,
        limit: 10,
        sortOrder: "DESC",
        bookingStatus: BookingStatus.COMPLETED,
        companyId: companyId as string,
      }),
    staleTime: 0,
    enabled: !!companyId && !isCompanyLoading,
  });

  // const handleDownloadModal = (tripId: string) => {
  //   setDownloadTripId(tripId);
  // };

  // const handleCloseModal = () => {
  //   setDownloadTripId(null);
  // };

  const tripData = [];

  const totalNumberOfPages = data?.result?.totalNumberOfPages || 0;

  return (
    <div className="container py-5 mx-auto min-h-screen md:py-7">
      <h2 className="text-center font-semibold text-lg mb-4">
        Completed Trips
      </h2>
      <GenericTable
        columns={CompletedTripsColumns()}
        data={tripData}
        loading={isLoading}
      />
      {totalNumberOfPages > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalNumberOfPages}
        />
      )}
    </div>
  );
}
