import CustomerBookingHistory from "@/components/srm/CustomerBookingHistory";
import CustomerDetailsSection from "@/components/srm/CustomerDetailsSection";

export default function CustomerDetailsPage() {
  return (
    <section className="bg-white h-screen">
      {/* Customer Details Section */}
      <CustomerDetailsSection />

      {/* Customer Booking History */}
      <CustomerBookingHistory />
    </section>
  );
}
