import { API } from "./ApiService";
import { Slug } from "./Api-Endpoints";

export interface BulkDiscountData {
  dailyDiscount: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  applicableDays: string[];
  isRecurring: boolean;
  _id?: string;
}

export const getBulkDiscount = async (): Promise<BulkDiscountData> => {
  try {
    const data = await API.get<{ status: string; result: BulkDiscountData }>({
      slug: Slug.BULK_DISCOUNTS,
    });

    if (!data) {
      throw new Error("Failed to fetch bulk discount");
    }

    return data.result;
  } catch (error) {
    console.error("Error fetching bulk discount:", error);
    throw error;
  }
};

export const updateBulkDiscount = async (
  body: Partial<BulkDiscountData>
): Promise<BulkDiscountData> => {
  try {
    const data = await API.post<{ status: string; result: BulkDiscountData }>({
      slug: Slug.BULK_DISCOUNTS,
      body,
    });

    if (!data) {
      throw new Error("Failed to update bulk discount");
    }

    return data.result;
  } catch (error) {
    console.error("Error updating bulk discount:", error);
    throw error;
  }
};
