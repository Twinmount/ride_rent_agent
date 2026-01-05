import ManualRateAdjuster from "@/components/ManualRateAdjuster/ManualRateAdjuster";
import BulkDiscountEditor from "@/components/BulkDiscountEditor/BulkDiscountEditor";
import { useState, useMemo } from "react";
import { useCompany } from "@/hooks/useCompany";
import { useQuery } from "@tanstack/react-query";
import { fetchAllVehicles } from "@/api/vehicle";
import { ApprovalStatusTypes } from "@/types/types";
import { RentalType, RateManagerVehicleType } from "@/types/API-types";
import { Toaster } from "@/components/ui/toaster";

interface UseVehiclesParams {
  page: number;
  limit?: number;
  search?: string;
  filter: ApprovalStatusTypes;
  userId?: string;
}

const useVehicles = ({
  page = 1,
  limit = 10,
  search,
  filter,
  userId,
}: UseVehiclesParams) =>
  useQuery({
    queryKey: ["vehicles", page, search, filter, "rate-manager"],
    queryFn: () =>
      fetchAllVehicles({
        page,
        limit,
        sortOrder: "DESC",
        userId: userId as string,
        search: search || undefined,
        approvalStatus: filter !== "ALL" ? filter : undefined,
      }),
    enabled: !!userId,
  });

export default function RateManager() {
  const [activeTab, setActiveTab] = useState("bulk");
  const [page, setPage] = useState(1);
  const limit = 9;

  const { userId, isCompanyLoading } = useCompany();
  const { data, isLoading, isRefetching, refetch } = useVehicles({
    page,
    limit,
    filter: "ALL",
    userId,
  });

  const mappedCars = useMemo(() => {
    const vehicles: RateManagerVehicleType[] = data?.result?.list || [];

    if (!vehicles.length) return [];

    const dayConversionMap: Record<string, string> = {
      Mon: "Mo",
      Tue: "Tu",
      Wed: "We",
      Thu: "Th",
      Fri: "Fr",
      Sat: "Sa",
      Sun: "Su",
    };

    return vehicles.map((vehicle: RateManagerVehicleType) => {
      const getRental = (type: "Daily" | "Weekly" | "Monthly"): RentalType => {
        const key =
          type === "Daily" ? "day" : type === "Weekly" ? "week" : "month";

        const baseRental = vehicle.rentalDetails?.[key];
        const baseRate = Number(baseRental?.rentInAED) || 0;
        const baseMileage = Number(baseRental?.mileageLimit) || 0;

        // --- PRIORITY 1: Check for a Manual Override ---
        const manualOverride = vehicle.rentals?.find((r) => r.type === type);

        const hasRealManualOverride = manualOverride;

        if (hasRealManualOverride) {
          return {
            type,
            rate: manualOverride.rate,
            mileage: manualOverride.mileage,
            discount: manualOverride.discount,
            weekdays: (manualOverride.weekdays || [])
              .map((day) => dayConversionMap[day] || day)
              .filter(Boolean),
            recurring: manualOverride.recurring,
            isDiscountActive: manualOverride.isDiscountActive,
          };
        }

        // --- PRIORITY 2: If no manual override, check for a fleet-wide Bulk Discount ---
        const bulkRule = vehicle.bulkDiscount;
        if (bulkRule) {
          const bulkDiscountValue =
            ((bulkRule as any)[`${type.toLowerCase()}Discount`] as number) || 0;
          return {
            type,
            rate: baseRate,
            mileage: baseMileage,
            discount: bulkDiscountValue,
            weekdays: (bulkRule.applicableDays || [])
              .map((day) => dayConversionMap[day] || day)
              .filter(Boolean),
            recurring: bulkRule.isRecurring || false,
            isDiscountActive: true,
          };
        }

        // --- PRIORITY 3: Fallback to the base rate with no discounts ---
        return {
          type,
          rate: baseRate,
          mileage: baseMileage,
          discount: 0,
          weekdays: [],
          recurring: false,
          isDiscountActive: false,
        };
      };

      return {
        id: vehicle.vehicleId,
        name: vehicle.vehicleModel,
        registrationNumber: vehicle.vehicleRegistrationNumber,
        imageUrl: vehicle.thumbnail || "https://via.placeholder.com/80x60",
        rentals: [
          getRental("Daily"),
          getRental("Weekly"),
          getRental("Monthly"),
        ],
      };
    });
  }, [data]);

  const finalIsLoading = isLoading || isCompanyLoading || isRefetching;
  const totalPages = data?.result?.totalNumberOfPages || 1;

  return (
    <div className="p-4 sm:p-6 bg-[#f7f8fa] min-h-screen">
      <Toaster />
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Rate Manager
      </h2>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6 border-b">
        <button
          className={`px-3 py-2 sm:px-4 font-semibold ${
            activeTab === "bulk"
              ? "border-b-2 border-[#fea632] text-[#fea632]"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("bulk")}
        >
          Bulk Discount Editor
        </button>
        <button
          className={`px-3 py-2 sm:px-4 font-semibold ${
            activeTab === "manual"
              ? "border-b-2 border-[#fea632] text-[#fea632]"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("manual")}
        >
          Manual Rate Adjuster
        </button>
      </div>

      {activeTab === "bulk" && (
        <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
            Set Fleet-Wide Discounts
          </h3>
          <BulkDiscountEditor />
        </section>
      )}

      {activeTab === "manual" && (
        <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
            Adjust Rates for Individual Vehicles
          </h3>
          {finalIsLoading ? (
            <div className="text-center py-8">Loading vehicle rates...</div>
          ) : (
            <>
              <ManualRateAdjuster cars={mappedCars} refetch={refetch} />
              <div className="flex justify-center mt-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded mx-1"
                >
                  Prev
                </button>
                <span className="px-3 py-1">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded mx-1"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
