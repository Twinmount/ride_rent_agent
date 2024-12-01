import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { toast } from "@/components/ui/use-toast";
import { SortDropdown } from "@/components/SortDropdown";
import ExtendTripModal from "@/components/modal/srm-modal/ExtendTripModal";
import { endTrip, fetchOngoingTrips } from "@/api/srm/trips";
import DownloadExcelModal from "@/components/srm/DownloadSRMExcelData";
import { Link } from "react-router-dom";
import {
  Calendar,
  CircleUserRound,
  MapPinned,
  Phone,
  Plane,
  Plus,
} from "lucide-react";
import MotionDiv from "@/components/framer-motion/MotionDiv";
import SearchVehicle from "@/components/SearchVehicle";

interface Trip {
  id: string;
  brandName: string;
  customerName: string;
  bookingStartDate: Date;
  BookingEndDate: Date;
  advancePaid: number;
  amountRemaining: number;
}

// Sample data
const mockData = [
  {
    id: "1",
    brandName: "Toyota",
    vehicleRegistrationNumber: "KL02ME0001",
    passportNumber: "M1234567",
    customerName: "John Doe",
    bookingStartDate: new Date(),
    BookingEndDate: new Date(),
    nationality: "Indian",
    mobileNumber: "+1234567890",
  },
  {
    id: "2",
    brandName: "BMW",
    vehicleRegistrationNumber: "KA05ME7890",
    passportNumber: "P8901234",
    customerName: "Jane Smith",
    bookingStartDate: "2024-02-01",
    BookingEndDate: "2024-02-15",
    nationality: "American",
    mobileNumber: "+9876543210",
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
        <div className="mb-4">
          {/* search vehicle */}
          <SearchVehicle
            search={search}
            setSearch={setSearch}
            placeholder="Search Trip..."
          />
          <p className="-mt-4 italic text-gray-600">
            You can search with <b>brand</b>,<b>registration number</b>,
            <b>customer name</b>
          </p>
        </div>
        <Link
          to="/srm/trips/new"
          className="px-3 h-10 bg-white rounded-lg shadow-lg transition-colors duration-300 ease-in-out flex-center text-yellow hover:bg-yellow hover:text-white"
          aria-label="add new record"
        >
          <span className="flex gap-x-2 items-center">
            <span className="text-gray-800 transition-colors hover:text-white">
              New Trip
            </span>{" "}
            <Plus />
          </span>
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
              <MotionDiv
                key={trip.id}
                className="flex items-center p-4 w-full max-w-3xl bg-white rounded-md border shadow-md"
              >
                {/* Left Section - Image Placeholder */}
                <div className="mr-4 w-1/4 h-36 bg-gray-200 rounded-md max-md:hidden"></div>

                {/* Right Section - Trip Details */}
                <div className="flex flex-col gap-x-2 w-full">
                  <div className="flex flex-col">
                    <div className="flex mb-2 border-b flex-between">
                      <h3 className="text-lg font-bold">{trip.brandName}</h3>
                      <p className="text-sm text-gray-600">
                        {trip.vehicleRegistrationNumber}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full">
                      <dl className="flex gap-x-2 items-center text-sm">
                        <dt>
                          <CircleUserRound />
                        </dt>
                        <dd>{trip.customerName}</dd>
                      </dl>
                      <dl className="flex gap-x-2 items-center text-sm">
                        <dt>
                          <Plane />
                        </dt>
                        <dd>{trip.passportNumber}</dd>
                      </dl>
                      <dl className="flex gap-x-2 items-center text-sm">
                        <dt>
                          <MapPinned />
                        </dt>
                        <dd>{trip.nationality}</dd>
                      </dl>
                      <dl className="flex gap-x-2 items-center text-sm">
                        <dt>
                          <Phone />
                        </dt>
                        <dd>{trip.mobileNumber}</dd>
                      </dl>
                    </div>
                  </div>

                  {/* calendar */}
                  <div className="flex flex-col gap-4 items-start px-2 py-1 my-3 bg-gray-800 rounded-lg md:items-center md:justify-between md:flex-row h-fit">
                    <dl className="flex gap-x-2 items-center px-2 h-full text-sm text-gray-200 rounded-lg">
                      <dt className="flex gap-x-1 items-center">
                        <span className="gap-1 w-[4.5rem] flex items-center">
                          <Calendar /> From
                        </span>
                        :
                      </dt>
                      <dd>
                        {new Date(trip.bookingStartDate).toLocaleDateString()}
                      </dd>
                    </dl>
                    <dl className="flex gap-x-4 items-center px-2 h-full text-sm text-gray-200 rounded-lg">
                      <dt className="flex gap-x-1 justify-between items-center w-16">
                        <span className="flex gap-1 items-center  max-md:min-w-[4.5rem]  w-[4.5rem]">
                          <Calendar /> To
                        </span>
                        :
                      </dt>
                      <dd className="ml-2">
                        {new Date(trip.BookingEndDate).toLocaleDateString()}
                      </dd>
                    </dl>
                  </div>

                  {/* buttons */}
                  <div className="gap-x-3 flex-between md:justify-end">
                    <div className="w-8 h-8 rounded-full bg-slate-300 md:hidden"></div>

                    <div className="flex gap-x-2 items-center">
                      {" "}
                      <button
                        onClick={() => handleOpenModal(trip.id)}
                        className="px-3 py-1 text-white bg-blue-500 rounded-md"
                      >
                        Extend Trip
                      </button>
                      <Link
                        to={`/srm/ongoing-trips/${trip.id}`}
                        onClick={() => handleEndTrip(trip.id)}
                        className="px-3 py-1 text-white bg-red-500 rounded-md"
                      >
                        End Trip
                      </Link>
                    </div>
                  </div>
                </div>
              </MotionDiv>
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
