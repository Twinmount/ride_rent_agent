import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lazy, Suspense } from "react";
import LazyLoader from "@/components/loading-skelton/LazyLoader";
import { SRMTabsTypes } from "@/types/types";
import { useSRMUpdateForm } from "@/hooks/useSRMUpdateForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import PageWrapper from "@/components/PageWrapper";
import { TAB_ITEMS } from "@/data/srm-data";
import { SRMCustomerDetailsFormType } from "@/types/srm-types";
import useGetSearchParams from "@/hooks/useGetSearchParams";

// Lazy-loaded form components
const SRMVehicleDetailsForm = lazy(
  () => import("@/components/form/srm-form/SRMVehicleDetailsForm")
);
const SRMCustomerDetailsForm = lazy(
  () => import("@/components/form/srm-form/SRMCustomerDetailsForm")
);
const SRMPaymentDetailsForm = lazy(
  () => import("@/components/form/srm-form/PaymentDetailsForm")
);
const SRMCheckListForm = lazy(
  () => import("@/components/form/srm-form/CheckListForm")
);
export default function SRMTripUpdatePage() {
  const { bookingId } = useParams<{
    bookingId: string;
  }>();

  const vehicleId = useGetSearchParams("vehicleId", true);
  sessionStorage.setItem("vehicleId", vehicleId || "");

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
    checkListFormData,
    isCheckListFormDataLoading,

    vehicleIdParam,
  } = useSRMUpdateForm(bookingId);

  // saving rental details to session storage for further use in third form (payment form)
  sessionStorage.setItem(
    "rentalDetails",
    JSON.stringify(vehicleFormData.rentalDetails)
  );

  return (
    <PageWrapper heading="View Trip Record">
      <div>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="gap-x-2 h-20 w-full bg-transparent flex-center max-sm:gap-x-4 max-w-full overflow-x-auto px-6 pl-20">
            {TAB_ITEMS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex flex-col justify-center items-center h-10 max-sm:text-sm max-sm:px-4"
              >
                {tab.label}
                <span className="text-xs">{tab.subLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="vehicle" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isVehicleLoading ? (
                <FormSkelton />
              ) : (
                <SRMVehicleDetailsForm
                  type={"Update"}
                  formData={vehicleFormData}
                />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="customer" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isCustomerLoading ? (
                <FormSkelton />
              ) : (
                <SRMCustomerDetailsForm
                  type={"Update"}
                  formData={customerFormData as SRMCustomerDetailsFormType}
                />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="payment" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isPaymentLoading ? (
                <FormSkelton />
              ) : (
                <SRMPaymentDetailsForm
                  type={"Update"}
                  formData={paymentFormData}
                />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="check-list" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isCheckListFormDataLoading ? (
                <FormSkelton />
              ) : (
                <SRMCheckListForm
                  type={"Update"}
                  formData={checkListFormData}
                  vehicleIdParam={vehicleIdParam}
                />
              )}
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}
