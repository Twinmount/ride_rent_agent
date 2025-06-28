import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { SortDropdown } from "@/components/SortDropdown";
import { CompletedTripsColumns } from "@/components/table/columns/CompletedTripsColumn";
import CompletedTripsInvoiceDownloadModal from "@/components/modal/srm-modal/CompletedTripsInvoiceDownloadModal";
import { fetchSRMBookings } from "@/api/srm/trips";
import DownloadExcelModal from "@/components/srm/DownloadSRMExcelData";
import Search from "@/components/Search";
import { BookingStatus } from "@/types/srm-types";
import { useCompany } from "@/hooks/useCompany";
import { GenericTable } from "@/components/table/GenericTable";
import LinkButton from "@/components/common/LinkButton";
import PageWrapper from "@/components/PageWrapper";

export default function CompletedTripsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState<10 | 15 | 20 | 30>(10);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [downloadTripId, setDownloadTripId] = useState<string | null>(null);

  const { companyId, isCompanyLoading } = useCompany();

  const { data, isLoading } = useQuery({
    queryKey: ["completedTrips", page, limit, search, sortOrder],
    queryFn: () =>
      fetchSRMBookings({
        page,
        limit,
        sortOrder,
        search,
        bookingStatus: BookingStatus.COMPLETED,
        companyId: "93eb31e6-0ae0-49c3-9bc1-678c54ddc412",
      }),
    staleTime: 0,
    enabled: !!companyId && !isCompanyLoading,
  });

  // const handleDownloadModal = (tripId: string) => {
  //   setDownloadTripId(tripId);
  // };

  const handleCloseModal = () => {
    setDownloadTripId(null);
  };

  const tripData = data?.result?.list || [];

  const totalNumberOfPages = data?.result?.totalNumberOfPages || 0;

  return (
    <PageWrapper heading="Completed Trips">
      <div className="flex flex-wrap gap-x-2 justify-start items-start mt-3 mb-4 w-full max-sm:mt-3">
        {/* search vehicle */}
        <Search
          search={search}
          setSearch={setSearch}
          placeholder="Search Trip..."
          description={
            <p className=" italic text-gray-600">
              You can search with{" "}
              <b>
                brand, registration number, customer name, passport, license and
                phone number
              </b>
            </p>
          }
        />

        <LinkButton label="New Trip" link="/srm/trips/new" />

        <DownloadExcelModal
          title="Excel Data Download"
          onDownload={async () => {}}
          additionalClasses=""
        />
        <SortDropdown
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
      </div>

      <GenericTable
        columns={CompletedTripsColumns()}
        data={tripData}
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

      {totalNumberOfPages > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalNumberOfPages}
        />
      )}
    </PageWrapper>
  );
}
