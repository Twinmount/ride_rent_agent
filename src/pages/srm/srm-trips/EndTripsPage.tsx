import { fetchTripByBookingId, getEndTripData } from "@/api/srm/trips";
import TripEndForm, {
  BookingDataType,
} from "@/components/form/srm-form/TripEndForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import PageWrapper from "@/components/PageWrapper";
import { useCompany } from "@/hooks/useCompany";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function EndTripsPage() {
  const { bookingId } = useParams<{
    bookingId: string;
  }>();

  // accessing userId, companyId, and isCompanyLoading from useCompany hook
  const { companyId, isCompanyLoading } = useCompany();

  const { data, isLoading: isEndTripDataLoading } = useQuery({
    queryKey: ["end-trip", bookingId],
    queryFn: () => getEndTripData(bookingId as string),
    staleTime: 60000,
  });

  const { data: bookingData, isLoading: isBookingDataLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchTripByBookingId(bookingId as string),
    staleTime: 60000,
  });

  const bookingStartDate = bookingData?.result.bookingStartDate;
  const bookingEndDate = bookingData?.result.bookingEndDate;

  // data required for the End Trip form for calculating total amount
  const initialFormData = {
    advanceCollected: data?.result.advanceCollected,
    customerName: data?.result.customer.customerName,
    vehicleBrand: data?.result.vehicle.vehicleBrand.brandName,
    rentalDetails: data?.result.vehicle.rentalDetails,
    bookingStartDate,
    bookingEndDate,
  };

  const isLoading =
    isCompanyLoading || isEndTripDataLoading || isBookingDataLoading;

  return (
    <PageWrapper heading="End Trip">
      {isLoading ? (
        <FormSkelton />
      ) : (
        <TripEndForm
          type="Add"
          bookingData={initialFormData as BookingDataType}
          companyId={companyId as string}
        />
      )}
    </PageWrapper>
  );
}
