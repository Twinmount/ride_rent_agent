import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { toast } from "@/components/ui/use-toast";
import { SortDropdown } from "@/components/SortDropdown";
import ExtendTripModal from "@/components/modal/srm-modal/ExtendTripModal";
import { endTrip, fetchOngoingTrips } from "@/api/srm/trips";
import DownloadExcelModal from "@/components/srm/DownloadSRMExcelData";
import { Link } from "react-router-dom";
import Search from "@/components/Search";
import OngoingTripsCard from "@/components/srm/OngoingTripsCard";

import { Plus } from "lucide-react";
import { Trip } from "@/types/srm-types";

// Sample data
const mockData: Trip[] = [
  {
    id: "1",
    brandName: "Toyota",
    vehicleRegistrationNumber: "KL02ME0001",
    passportNumber: "M1234567",
    customerName: "John Doe",
    bookingStartDate: new Date(), // This will use the current date and time
    BookingEndDate: new Date(), // This will use the current date and time
    nationality: "Indian",
    mobileNumber: "+1234567890",
    advancePaid: 1000, // Added example advance paid
    amountRemaining: 2000, // Added example remaining amount
  },
  {
    id: "2",
    brandName: "BMW",
    vehicleRegistrationNumber: "KA05ME7890",
    passportNumber: "P8901234",
    customerName: "Jane Smith",
    bookingStartDate: new Date("2024-02-01"), // Example future date
    BookingEndDate: new Date("2024-02-15"), // Example future date
    nationality: "American",
    mobileNumber: "+9876543210",
    advancePaid: 500, // Added example advance paid
    amountRemaining: 1500, // Added example remaining amount
  },
];

export default function OngoingTripsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

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

  const handleOpenModal = (id: string) => {
    setSelectedTripId(id);
  };

  const handleCloseModal = () => {
    setSelectedTripId(null);
  };

  const handleEndTrip = async (tripId: string) => {
    try {
      // Call the API with necessary details
      await endTrip({ tripId });

      // Invalidate the query to refresh the list of active trips
      queryClient.invalidateQueries({ queryKey: ["activeTrips"] });

      // Display a success toast notification
      toast({
        title: "Trip ended successfully",
        className: "bg-green-500 text-white",
      });

      // Optionally reset the selected trip ID if needed
      setSelectedTripId(null);
    } catch (error) {
      console.error("Failed to end trip:", error);
      toast({
        variant: "destructive",
        title: "Failed to end trip",
        description: "Something went wrong while ending the trip.",
      });
    }
  };

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

      <div className="">
        {mockData.length > 0 ? (
          <div className="flex flex-col gap-y-4 items-center">
            {mockData.map((trip) => (
              <OngoingTripsCard
                key={trip.id}
                trip={trip}
                onOpenModal={handleOpenModal}
                onEndTrip={handleEndTrip}
              />
            ))}
          </div>
        ) : (
          "no active trips"
        )}
      </div>

      {data?.result && data?.result.totalNumberOfPages > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages}
        />
      )}

      {/* ExtendTripModal */}
      {selectedTripId && (
        <ExtendTripModal tripId={selectedTripId} onClose={handleCloseModal} />
      )}
    </section>
  );
}
