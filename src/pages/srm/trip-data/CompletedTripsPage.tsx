import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { SortDropdown } from "@/components/SortDropdown";
import { CompletedTripsTable } from "@/components/table/CompletedTripsTable";
import { CompletedTripsColumns } from "@/components/table/columns/CompletedTripsColumn";
import CompletedTripsInvoiceDownloadModal from "@/components/modal/srm-modal/CompletedTripsInvoiceDownloadModal";
import { fetchSRMBookings } from "@/api/srm/trips";
import DownloadExcelModal from "@/components/srm/DownloadSRMExcelData";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import Search from "@/components/Search";
import { BookingStatus } from "@/types/srm-types";
import { useCompany } from "@/hooks/useCompany";

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
        companyId,
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
    <section className="container py-5 mx-auto min-h-screen md:py-7">
      <h1 className="text-center h3-bold max-sm:text-xl sm:text-left">
        Completed Trips
      </h1>
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

        <Link
          to="/srm/trips/new"
          className="group px-3 h-10 bg-white flex gap-x-2 items-center rounded-lg shadow-lg transition-colors duration-300 ease-in-out flex-center text-yellow hover:bg-yellow hover:text-white"
          aria-label="add new record"
        >
          <span className="text-gray-800 transition-colors group-hover:text-white">
            New Trip
          </span>{" "}
          <Plus />
        </Link>
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

      <CompletedTripsTable
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
    </section>
  );
}
