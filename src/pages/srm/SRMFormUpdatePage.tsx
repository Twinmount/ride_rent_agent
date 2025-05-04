import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lazy, Suspense } from "react";
import LazyLoader from "@/components/loading-skelton/LazyLoader";
import { SRMTabsTypes } from "@/types/types";
import { useSRMUpdateForm } from "@/hooks/useSRMUpdateForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import PageWrapper from "@/components/PageWrapper";

// Lazy-loaded form components
const SRMCustomerDetailsForm = lazy(
  () => import("@/components/form/srm-form/CustomerDetailsForm")
);
const SRMVehicleDetailsForm = lazy(
  () => import("@/components/form/srm-form/VehicleDetailsForm")
);
const SRMPaymentDetailsForm = lazy(
  () => import("@/components/form/srm-form/PaymentDetailsForm")
);

export default function SRMFormUpdatePage() {
  const { bookingId } = useParams<{
    bookingId: string;
  }>();

  // Handle tab change based on levelsFilled state
  const handleTabChange = (value: string) => {
    setActiveTab(value as SRMTabsTypes);
  };

  // Using custom hook
  const {
    activeTab,
    setActiveTab,
    customerFormData,
    isCustomerLoading,
    vehicleFormData,
    isVehicleLoading,
    paymentFormData,
    isPaymentLoading,
    isLevelsFetching,
    refetchLevels,
    isAddOrIncompleteSRMVehicleForm,
    isAddOrIncompleteSRMPaymentForm,
  } = useSRMUpdateForm(bookingId);

  return (
    <PageWrapper heading="Edit Trip Record">
      <div>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="gap-x-2 w-full bg-white flex-center max-sm:gap-x-4">
            <TabsTrigger
              value="customer"
              className="flex flex-col justify-center items-center h-10 max-sm:text-sm max-sm:px-4"
            >
              Customer
              <span className="text-xs">details</span>
            </TabsTrigger>

            <TabsTrigger
              value="vehicle"
              className="flex flex-col justify-center items-center h-10 max-sm:text-sm max-sm:px-4"
            >
              Vehicle
              <span className="text-xs">details</span>
            </TabsTrigger>

            <TabsTrigger
              value="payment"
              className="flex flex-col justify-center items-center h-10 max-sm:text-sm max-sm:px-4"
            >
              Payment
              <span className="text-xs">details</span>
            </TabsTrigger>

            <TabsTrigger
              value="payment"
              className="flex flex-col justify-center items-center h-10 max-sm:text-sm max-sm:px-4"
            >
              Vehicle
              <span className="text-xs">Check List</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isCustomerLoading ? (
                <FormSkelton />
              ) : (
                <SRMCustomerDetailsForm
                  type={"Update"}
                  formData={customerFormData as any}
                />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="vehicle" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isLevelsFetching || isVehicleLoading ? (
                <FormSkelton />
              ) : (
                <SRMVehicleDetailsForm
                  type={"Update"}
                  formData={vehicleFormData}
                  refetchLevels={refetchLevels}
                  isAddOrIncomplete={isAddOrIncompleteSRMVehicleForm}
                />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="payment" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isLevelsFetching || isPaymentLoading ? (
                <FormSkelton />
              ) : (
                <SRMPaymentDetailsForm
                  type={"Update"}
                  formData={paymentFormData}
                  refetchLevels={refetchLevels}
                  isAddOrIncomplete={isAddOrIncompleteSRMPaymentForm}
                />
              )}
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}
