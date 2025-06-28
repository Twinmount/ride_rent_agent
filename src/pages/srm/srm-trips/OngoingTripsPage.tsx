import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { SortDropdown } from "@/components/SortDropdown";
import ExtendTripModal from "@/components/modal/srm-modal/ExtendTripModal";
import { fetchSRMBookings } from "@/api/srm/trips";
import DownloadExcelModal from "@/components/srm/DownloadSRMExcelData";
import Search from "@/components/Search";
import OngoingTrips from "@/components/srm/OngoingTrips";
import { BookingStatus } from "@/types/srm-types";
import { useCompany } from "@/hooks/useCompany";
import LinkButton from "@/components/common/LinkButton";
import PageWrapper from "@/components/PageWrapper";

// Sample data

export default function OngoingTripsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState<10 | 15 | 20 | 30>(10);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedTripBookingId, setSelectedTripBookingId] = useState<
    string | null
  >(null);

  const { companyId, isCompanyLoading } = useCompany();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["activeTrips", page, limit, search, sortOrder],
    queryFn: () =>
      fetchSRMBookings({
        page,
        limit,
        sortOrder,
        search,
        bookingStatus: BookingStatus.ONGOING,
        companyId,
      }),
    staleTime: 0,
    enabled: !!companyId && !isCompanyLoading,
  });

  const handleOpenModal = (id: string) => {
    setSelectedTripBookingId(id);
  };

  const handleCloseModal = () => {
    setSelectedTripBookingId(null);
  };

  const ongoingTrips = data?.result.list || [];

  const totalNumberOfPages = data?.result.totalNumberOfPages || 0;

  return (
    <PageWrapper heading="Ongoing Trips">
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
                brand, registration number, customer name, license,passport and
                phone number.
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

      <OngoingTrips
        data={ongoingTrips}
        handleOpenModal={handleOpenModal}
        isLoading={isLoading || isFetching}
      />

      {totalNumberOfPages > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalNumberOfPages}
        />
      )}

      {/* ExtendTripModal */}
      {selectedTripBookingId && (
        <ExtendTripModal
          bookingId={selectedTripBookingId}
          onClose={handleCloseModal}
        />
      )}
    </PageWrapper>
  );
}
