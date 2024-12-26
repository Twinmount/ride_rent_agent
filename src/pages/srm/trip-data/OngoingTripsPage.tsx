import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { SortDropdown } from "@/components/SortDropdown";
import ExtendTripModal from "@/components/modal/srm-modal/ExtendTripModal";
import { fetchOngoingTrips } from "@/api/srm/trips";
import DownloadExcelModal from "@/components/srm/DownloadSRMExcelData";
import { Link } from "react-router-dom";
import Search from "@/components/Search";
import { Plus } from "lucide-react";
import OngoingTrips from "@/components/srm/OngoingTrips";
import { BookingStatus } from "@/types/srm-types";

// Sample data

export default function OngoingTripsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState<10 | 15 | 20 | 30>(10);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedTripBookingId, setSelectedTripBookingId] = useState<
    string | null
  >(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["activeTrips", page, limit, search, sortOrder],
    queryFn: () =>
      fetchOngoingTrips({
        page,
        limit,
        sortOrder,
        search,
        bookingStatus: BookingStatus.ONGOING,
      }),
    staleTime: 0,
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
    <section className="container py-5 !pb-28 mx-auto min-h-screen md:py-7">
      <h1 className="text-center h3-bold max-sm:text-xl sm:text-left">
        Ongoing Trips
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
              <b>brand, registration number, customer name</b>
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
    </section>
  );
}
