import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lazy, Suspense, useState } from "react";
import LazyLoader from "@/components/loading-skelton/LazyLoader";
import { validateSRMTabAccess } from "@/helpers/form";
import { SRMTabsTypes } from "@/types/types";
import { toast } from "@/components/ui/use-toast";
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
const SRMCheckListForm = lazy(
  () => import("@/components/form/srm-form/CheckListForm")
);

export default function SRMFormAddPage() {
  const [activeTab, setActiveTab] = useState<SRMTabsTypes>("customer");
  const [levelsFilled, setLevelsFilled] = useState<number>(3);
  const [checkListData, setCheckListData] = useState({
    vehicleId: "",
    bodyType: "",
  });

  // Handle tab change based on levelsFilled state
  const handleTabChange = (value: string) => {
    const tab = value as SRMTabsTypes;
    if (
      tab === "check-list" &&
      (!checkListData.vehicleId || !checkListData.bodyType)
    ) {
      toast({
        title: "Access Restricted",
        description: "Please fill in Vehicle Details first.",
        className: "bg-orange text-white",
      });
      return;
    }

    const { canAccess, message } = validateSRMTabAccess({ tab, levelsFilled });

    if (true) {
      setActiveTab(tab);
    } else {
      toast({
        title: "Access Restricted",
        description: message,
        className: "bg-orange text-white",
      });
    }
  };
  // 1234561234;
  // Handle moving to the next tab and update levelsFilled state
  const handleNextTab = (nextTab: SRMTabsTypes) => {
    setActiveTab(nextTab);

    // Update levelsFilled based on the next tab
    if (nextTab === "vehicle" && levelsFilled < 1) {
      setLevelsFilled(1);
    } else if (nextTab === "payment" && levelsFilled < 2) {
      setLevelsFilled(2);
    }
  };

  return (
    <PageWrapper heading="Trip Details">
      <div>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="gap-x-2 h-20 w-full bg-transparent flex-center max-sm:gap-x-4 max-w-full overflow-x-auto px-6 pl-20">
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
              value="check-list"
              className="flex flex-col justify-center items-center h-10 max-sm:text-sm max-sm:px-4"
            >
              Vehicle
              <span className="text-xs">Check List</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="flex-center  ">
            <Suspense fallback={<LazyLoader />}>
              <SRMCustomerDetailsForm
                type="Add"
                onNextTab={() => handleNextTab("vehicle")}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="vehicle" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              <SRMVehicleDetailsForm
                type={"Add"}
                onNextTab={() => handleNextTab("payment")}
                isAddOrIncomplete={true}
                setCheckListData={setCheckListData}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="payment" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              <SRMPaymentDetailsForm type={"Add"} isAddOrIncomplete={true} />
            </Suspense>
          </TabsContent>

          <TabsContent value="check-list" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              <SRMCheckListForm type={"Add"} checkListData={checkListData} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}
