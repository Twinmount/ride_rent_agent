import { API } from "./ApiService";
import { Slug } from "./Api-Endpoints";

// Define a TypeScript interface for the data structure.
// This matches your backend Mongoose schema.
export interface BulkDiscountData {
  dailyDiscount: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  applicableDays: string[];
  isRecurring: boolean;
  _id?: string;
}

/**
 * Fetches the current bulk discount settings using the central ApiService.
 */
export const getBulkDiscount = async (): Promise<BulkDiscountData> => {
  const res = await API.get<{ status: string; result: BulkDiscountData }>({
    slug: Slug.BULK_DISCOUNTS,
  });

  if (!res) {
    throw new Error("No response from API.get");
  }

  return res.result ?? (res as unknown as BulkDiscountData);
};

export const updateBulkDiscount = async (
  data: Partial<BulkDiscountData>
): Promise<BulkDiscountData> => {
  const res = await API.post<{ status: string; result: BulkDiscountData }>({
    slug: Slug.BULK_DISCOUNTS,
    body: data,
  });

  if (!res) {
    throw new Error("No response from API.post");
  }

  return res.result ?? (res as unknown as BulkDiscountData);
};

