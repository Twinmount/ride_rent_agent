import { getEndTripData } from "@/api/srm/trips";
import TripEndForm from "@/components/form/srm-form/TripEndForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import { useCompany } from "@/hooks/useCompany";
import { useQuery } from "@tanstack/react-query";
import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function EndTripsPage() {
  const navigate = useNavigate();

  const { bookingId } = useParams<{
    bookingId: string;
  }>();

  // accessing userId, companyId, and isCompanyLoading from useCompany hook
  const { companyId, isCompanyLoading } = useCompany();

  const { data, isLoading: isBookingDataLoading } = useQuery({
    queryKey: ["end-trip", bookingId],
    queryFn: () => getEndTripData(bookingId as string),
    staleTime: 60000,
  });

  const advanceCollected = data?.result.advanceCollected || 0;

  const isLoading = isCompanyLoading || isBookingDataLoading;

  return (
    <section className="container py-6 pb-10 h-auto min-h-screen bg-slate-50">
      <div className="gap-x-4 mb-5 ml-5 flex-center w-fit">
        <button
          onClick={() => navigate(-1)}
          className="border-none transition-colors outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold sm:text-left">End Trip</h1>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <TripEndForm
          type="Add"
          advanceCollected={advanceCollected}
          companyId={companyId as string}
        />
      )}
    </section>
  );
}
