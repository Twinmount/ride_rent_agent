import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lazy, Suspense, useState } from "react";
import LazyLoader from "@/components/loading-skelton/LazyLoader";
import { validateSRMTabAccess } from "@/helpers/form";
import { SRMTabsTypes } from "@/types/types";
import { toast } from "@/components/ui/use-toast";

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

export default function SRMFormAddPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SRMTabsTypes>("customer");
  const [levelsFilled, setLevelsFilled] = useState<number>(0); // Default starting level

  // Handle tab change based on levelsFilled state
  const handleTabChange = (value: string) => {
    const tab = value as SRMTabsTypes;
    const { message } = validateSRMTabAccess({ tab, levelsFilled });

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
    <section className="container py-10 pb-44 h-auto min-h-screen bg-white">
      <div className="gap-x-4 mb-5 ml-5 flex-center w-fit">
        <button
          onClick={() => navigate(-1)}
          className="border-none transition-colors outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold max-sm:text-xl sm:text-left">
          Add New Record
        </h1>
      </div>

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
          </TabsList>

          <TabsContent value="customer" className="flex-center">
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
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="payment" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              <SRMPaymentDetailsForm type={"Add"} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
