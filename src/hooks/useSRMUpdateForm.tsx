import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSRMLevelsFilled,
  getSRMCustomerFormDetails,
  getSRMVehicleFormDetails,
  getSRMPaymentFormDetails,
  getSRMCheckListFormData,
} from "@/api/srm";
import { SRMTabsTypes } from "@/types/types";
import { useSearchParams } from "react-router-dom";
import { mapToSRMPaymentForm, mapToSRMVehicleForm } from "@/helpers/srm-form";

export type TabsTypes = "primary" | "specifications" | "features";

export const useSRMUpdateForm = (bookingId: string | undefined) => {
  const [activeTab, setActiveTab] = useState<SRMTabsTypes>("vehicle");
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();

  const customerId = searchParams.get("customerId");
  const vehicleId = searchParams.get("vehicleId");

  // Fetch primary form data
  const { data: customerFormResult, isLoading: isCustomerLoading } = useQuery({
    queryKey: ["srm-customer-details-form", customerId],
    queryFn: () => getSRMCustomerFormDetails(customerId as string),
    staleTime: 60000,
    enabled: !!customerId,
  });

  // Fetch primary form data
  const { data: vehicleFormResult, isLoading: isVehicleLoading } = useQuery({
    queryKey: ["srm-vehicle-details-form", vehicleId],
    queryFn: () => getSRMVehicleFormDetails(vehicleId as string),
    staleTime: 60000,
    enabled: !!vehicleId && activeTab === "vehicle",
  });

  // Fetch primary form data
  const { data: paymentFormResult, isLoading: isPaymentLoading } = useQuery({
    queryKey: ["srm-payment-details-form", bookingId],
    queryFn: () => getSRMPaymentFormDetails(bookingId as string),
    staleTime: 60000,
    enabled: !!bookingId && activeTab === "payment",
  });

  const { data: checkListResult, isLoading: isCheckListFormDataLoading } =
    useQuery({
      queryKey: ["srm-check-list", vehicleId],
      queryFn: () => getSRMCheckListFormData(vehicleId as string),
      staleTime: 60000,
      enabled: !!vehicleId,
    });

  // Fetch levelsFilled
  const {
    data: levelsData,
    refetch: refetchLevels,
    isFetching: isLevelsFetching,
  } = useQuery({
    queryKey: ["getSRMLevelsFilled", bookingId],
    queryFn: () => getSRMLevelsFilled(bookingId as string),
    enabled: !!bookingId,
  });

  // Calculate levels filled
  const levelsFilled = levelsData
    ? parseInt(levelsData.result.levelsFilled, 10)
    : 1;

  // Determine form states based on levels
  const isAddOrIncompleteSRMCustomerForm = levelsFilled < 2;
  const isAddOrIncompleteSRMPaymentForm = levelsFilled < 3;

  // Prefetch levelsFilled data
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["getSRMLevelsFilled", bookingId],
      queryFn: () => getSRMLevelsFilled(bookingId as string),
    });
  }, [bookingId, queryClient]);

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as SRMTabsTypes);
  };

  // FORM DATA to be pre filled
  const customerFormData = {
    ...customerFormResult?.result,
    customerProfilePic: customerFormResult?.result?.customerProfilePicPath,
  };
  const vehicleFormData = mapToSRMVehicleForm(vehicleFormResult?.result);
  const paymentFormData = mapToSRMPaymentForm(paymentFormResult?.result);

  const vehicleRentalDetails =
    paymentFormResult?.result?.vehicle?.rentalDetails;

  const checkListFormData = checkListResult?.result;

  // saving to session storage
  useEffect(() => {
    if (!vehicleRentalDetails) return;
    sessionStorage.setItem(
      "rentalDetails",
      JSON.stringify(vehicleRentalDetails)
    );
  }, [vehicleRentalDetails]);

  return {
    activeTab,
    setActiveTab: handleTabChange,
    customerFormData,
    isCustomerLoading,
    vehicleFormData,
    isVehicleLoading,
    paymentFormData,
    isPaymentLoading: isPaymentLoading,
    checkListResult,
    checkListFormData,
    isCheckListFormDataLoading,
    levelsFilled,
    isLevelsFetching,
    refetchLevels,
    isAddOrIncompleteSRMCustomerForm,
    isAddOrIncompleteSRMPaymentForm,
    vehicleIdParam: vehicleId || null,
  };
};
