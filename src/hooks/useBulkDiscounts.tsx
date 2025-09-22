import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBulkDiscount,
  updateBulkDiscount,
  BulkDiscountData,
} from "../api/rateManager";
import { toast as baseToast } from "@/components/ui/use-toast";
import { useCompany } from "./useCompany";

const BULK_DISCOUNT_QUERY_KEY = "bulkDiscountSettings";

const toast = Object.assign(baseToast, {
  success: (message: string) =>
    baseToast({
      title: "Success",
      description: message,
      variant: "default",
    }),
  error: (message: string) =>
    baseToast({
      title: "Error",
      description: message,
      variant: "destructive",
    }),
});

export const useBulkDiscounts = () => {
  const queryClient = useQueryClient();
  const { userId } = useCompany();

  const {
    data: discountData,
    isLoading,
    isError,
  } = useQuery<BulkDiscountData | undefined>({
    queryKey: [BULK_DISCOUNT_QUERY_KEY, userId],
    queryFn: getBulkDiscount,
    enabled: !!userId,
  });

  const { mutate: updateDiscount, isPending: isUpdating } = useMutation({
    mutationFn: (updatedData: Partial<BulkDiscountData>) =>
      updateBulkDiscount(updatedData),

    onSuccess: (data) => {
      toast.success("Discounts updated successfully!");
      queryClient.setQueryData([BULK_DISCOUNT_QUERY_KEY, userId], data);
      queryClient.invalidateQueries({
        queryKey: [BULK_DISCOUNT_QUERY_KEY, userId],
      });
    },

    onError: (error: any, _variables, _context) => {
      toast.error(`Failed to update discounts: ${error.message}`);
    },
  });

  return {
    discountData,
    isLoading,
    isError,
    updateDiscount,
    isUpdating,
  };
};
