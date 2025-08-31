import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBulkDiscount, updateBulkDiscount, BulkDiscountData } from '../api/rateManager';
import { toast } from 'react-hot-toast';
import { useCompany } from './useCompany'; // Import useCompany to get the userId

const BULK_DISCOUNT_QUERY_KEY = 'bulkDiscountSettings';

/**
 * Custom hook to manage fetching and updating bulk discount data.
 */
export const useBulkDiscounts = () => {
  const queryClient = useQueryClient();
  const { userId } = useCompany(); // Get the logged-in user's ID

  // ✅ MODIFIED: Fetches data only when we have a userId.
  const { 
    data: discountData, 
    isLoading, 
    isError 
  } = useQuery<BulkDiscountData | undefined>({
    queryKey: [BULK_DISCOUNT_QUERY_KEY, userId], // Query is now unique to the user
    queryFn: getBulkDiscount,
    enabled: !!userId, // The query will not run until the userId is available
  });

  const { 
    mutate: updateDiscount, 
    isPending: isUpdating 
  } = useMutation({
    mutationFn: (updatedData: Partial<BulkDiscountData>) => updateBulkDiscount(updatedData),
    
    // ✅ MODIFIED: We go back to invalidating the query.
    // Since the GET endpoint now returns the correct data, this is the best approach.
    onSuccess: (data) => {
  // data should be the saved BulkDiscountData
  toast.success('Discounts updated successfully!');
  queryClient.setQueryData([BULK_DISCOUNT_QUERY_KEY, userId], data);
  // optionally still refetch:
  queryClient.invalidateQueries({ queryKey: [BULK_DISCOUNT_QUERY_KEY, userId] });
},

    
    // ✅ MODIFIED: Fixed the TypeScript warning by renaming unused parameters with an underscore.
    onError: (error, _variables, _context) => {
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