import PageWrapper from "@/components/PageWrapper";
import CustomerBookingHistory from "@/components/srm/CustomerBookingHistory";
import CustomerDetailsSection from "@/components/srm/CustomerDetailsSection";

export default function CustomerDetailsPage() {
  return (
    <PageWrapper heading="Customer Details">
      {/* Customer Details Section */}
      <CustomerDetailsSection />

      {/* Customer Booking History */}
      <CustomerBookingHistory />
    </PageWrapper>
  );
}
