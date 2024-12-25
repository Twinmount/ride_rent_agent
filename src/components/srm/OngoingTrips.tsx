import { Trip } from "@/types/srm-types";
import OngoingTripsCard from "./OngoingTripsCard";

type OngoingTripsProps = {
  data: Trip[];
  handleOpenModal: (id: string) => void;
  isLoading: boolean;
};

export default function OngoingTrips({
  data,
  handleOpenModal,
  isLoading,
}: OngoingTripsProps) {
  if (isLoading) {
    return (
      <div className="flex-center h-56 text-lg italic font-semibold text-slate-500">
        Loading...
      </div>
    );
  }
  return (
    <div className="">
      {data.length > 0 ? (
        <div className="flex flex-col gap-y-4 items-center">
          {data.map((trip) => (
            <OngoingTripsCard
              key={trip.id}
              trip={trip}
              onOpenModal={handleOpenModal}
            />
          ))}
        </div>
      ) : (
        <div className="flex-center h-56 text-lg italic font-semibold text-slate-400">
          No Trips Found :/
        </div>
      )}
    </div>
  );
}
