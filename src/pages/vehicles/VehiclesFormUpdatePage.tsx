import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lazy, Suspense, useEffect, useState } from "react";
import LazyLoader from "@/components/loading-skelton/LazyLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import { getLevelsFilled, getPrimaryDetailsFormData } from "@/api/vehicle";
import { mapGetPrimaryFormToPrimaryFormType } from "@/helpers/form";
import { save, StorageKeys } from "@/utils/storage";

// Lazy-loaded components
const PrimaryDetailsForm = lazy(
  () => import("@/components/form/main-form/PrimaryDetailsForm")
);
const SpecificationsForm = lazy(
  () => import("@/components/form/main-form/SpecificationsForm")
);
const FeaturesForm = lazy(
  () => import("@/components/form/main-form/FeaturesForm")
);

type TabsTypes = "primary" | "specifications" | "features";

export default function VehiclesFormUpdatePage() {
  const navigate = useNavigate();
  const { vehicleId } = useParams<{
    vehicleId: string;
  }>();
  const [activeTab, setActiveTab] = useState<TabsTypes>("primary");

  const queryClient = useQueryClient();

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabsTypes);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["primary-details-form", vehicleId],
    queryFn: () => getPrimaryDetailsFormData(vehicleId as string),
    staleTime: 60000,
  });

  // Fetch levelsFilled only if the type is "Update"
  const {
    data: levelsData,
    refetch: refetchLevels,
    isFetching: isLevelsFetching,
  } = useQuery({
    queryKey: ["getLevelsFilled", vehicleId],
    queryFn: () => getLevelsFilled(vehicleId as string),
    enabled: !!vehicleId,
  });

  const levelsFilled = levelsData
    ? parseInt(levelsData.result.levelsFilled, 10)
    : 1;

  const isAddOrIncompleteSpecifications = levelsFilled < 2; // true if only level 1 is filled
  const isAddOrIncompleteFeatures = levelsFilled < 3;

  const formData = data
    ? mapGetPrimaryFormToPrimaryFormType(data.result)
    : null;

  const vehicleCategoryId = data?.result?.vehicleCategoryId;
  const vehicleTypeId = data?.result?.vehicleTypeId;

  // Store vehicleCategoryId in localStorage if levelsFilled < 3
  useEffect(() => {
    if (levelsFilled < 3 && vehicleCategoryId && vehicleTypeId) {
      save(StorageKeys.CATEGORY_ID, vehicleCategoryId);
      save(StorageKeys.VEHICLE_TYPE_ID, vehicleTypeId);
    }
  }, [levelsFilled, vehicleCategoryId]);

  // prefetching levels filled
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["getLevelsFilled", vehicleId],
      queryFn: () => getLevelsFilled(vehicleId as string),
    });
  }, [vehicleId]);

  return (
    <section className="container pb-10 h-auto min-h-screen bg-white">
      <div className="gap-x-4 mb-5 ml-5 flex-center w-fit">
        <button
          onClick={() => navigate(-1)}
          className="border-none transition-colors outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold sm:text-left">Vehicle Details</h1>
      </div>

      <div>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="gap-x-2 bg-white flex-center">
            <TabsTrigger
              value="primary"
              className="h-9 max-sm:text-sm max-sm:px-2"
            >
              Primary Details
            </TabsTrigger>
            <TabsTrigger
              disabled={isLoading || isLevelsFetching}
              value="specifications"
              className="max-sm:px-2"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="features"
              disabled={
                isLoading || isLevelsFetching || isAddOrIncompleteSpecifications
              }
              className={`max-sm:px-2`}
            >
              Features
            </TabsTrigger>
          </TabsList>
          <TabsContent value="primary" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isLoading ? (
                <FormSkelton />
              ) : (
                <PrimaryDetailsForm
                  type="Update"
                  formData={formData}
                  levelsFilled={levelsFilled}
                />
              )}
            </Suspense>
          </TabsContent>
          <TabsContent value="specifications" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isLevelsFetching ? (
                <FormSkelton />
              ) : (
                <SpecificationsForm
                  type="Update"
                  refetchLevels={refetchLevels}
                  isAddOrIncomplete={isAddOrIncompleteSpecifications}
                />
              )}
            </Suspense>
          </TabsContent>
          <TabsContent value="features" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isLevelsFetching ? (
                <FormSkelton />
              ) : (
                <FeaturesForm
                  type="Update"
                  refetchLevels={refetchLevels}
                  isAddOrIncomplete={isAddOrIncompleteFeatures}
                />
              )}
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
