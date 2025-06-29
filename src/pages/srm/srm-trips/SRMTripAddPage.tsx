import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lazy, Suspense, useState } from "react";
import LazyLoader from "@/components/loading-skelton/LazyLoader";
import { validateSRMTabAccess } from "@/helpers/form";
import { SRMTabsTypes } from "@/types/types";
import { toast } from "@/components/ui/use-toast";
import PageWrapper from "@/components/PageWrapper";
import { TAB_ITEMS } from "@/data/srm-data";

// Lazy-loaded form components
const SRMVehicleDetailsForm = lazy(
  () => import("@/components/form/srm-form/VehicleDetailsForm")
);
const SRMCustomerDetailsForm = lazy(
  () => import("@/components/form/srm-form/CustomerDetailsForm")
);
const SRMPaymentDetailsForm = lazy(
  () => import("@/components/form/srm-form/PaymentDetailsForm")
);
const SRMCheckListForm = lazy(
  () => import("@/components/form/srm-form/CheckListForm")
);

export default function SRMTripAddPage() {
  const [activeTab, setActiveTab] = useState<SRMTabsTypes>("vehicle");
  const [levelsFilled, setLevelsFilled] = useState<number>(0);

  // Handle tab change based on levelsFilled state
  const handleTabChange = (value: string) => {
    const tab = value as SRMTabsTypes;

    const { canAccess, message } = validateSRMTabAccess({ tab, levelsFilled });

    if (canAccess) {
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
  const handleNextTab = (nextTab: SRMTabsTypes, currentLevel: number) => {
    if (levelsFilled < currentLevel) {
      setLevelsFilled(currentLevel);
    }
    setActiveTab(nextTab);
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
              <SRMVehicleDetailsForm
                type={"Add"}
                onNextTab={() => handleNextTab("customer", 1)}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="customer" className="flex-center  ">
            <Suspense fallback={<LazyLoader />}>
              <SRMCustomerDetailsForm
                type="Add"
                isAddOrIncomplete={true}
                onNextTab={() => handleNextTab("payment", 2)}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="payment" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              <SRMPaymentDetailsForm
                type={"Add"}
                isAddOrIncomplete={true}
                onNextTab={() => handleNextTab("check-list", 3)}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="check-list" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              <SRMCheckListForm type={"Add"} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}
