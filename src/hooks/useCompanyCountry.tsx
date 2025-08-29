import { fetchComapnyCountry } from '@/api/dashboard';
import { useQuery } from '@tanstack/react-query';

export const useCompanyCountry = (id: string | undefined, options = {}) => {
  return useQuery({
    queryKey: ["country_for_user", id],
    queryFn: () => {
      if (!id) throw new Error("ID is required");
      return fetchComapnyCountry(id);
    },
    enabled: !!id,
    staleTime: Infinity, // Data will never become stale
    gcTime: Infinity, // Cache will never be garbage collected
    ...options,
  });
};
