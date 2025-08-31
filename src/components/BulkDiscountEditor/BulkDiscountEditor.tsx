import { useEffect, useState } from "react";
import { useBulkDiscounts } from "@/hooks/useBulkDiscounts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BulkDiscountData, updateBulkDiscount as apiUpdateDiscount } from "@/api/rateManager";
import { Button } from "@/components/ui/button";
import SuccessModal from "@/components/modal/SuccessModal"; // ★ 2. Import the new modal component

const DISCOUNT_TYPES = [
  { label: "Daily", icon: "calendar" },
  { label: "Weekly", icon: "calendar" },
  { label: "Monthly", icon: "calendar" },
];
const DAYS = [
  { label: "Mo", value: "Mo" }, { label: "Tu", value: "Tu" },
  { label: "We", value: "We" }, { label: "Th", value: "Th" },
  { label: "Fr", value: "Fr" }, { label: "Sa", value: "Sa" },
  { label: "Su", value: "Su" },
];

const SkeletonLoader = () => (
  <div className="p-4 animate-pulse">
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1 border-2 rounded-2xl p-6 h-40 bg-gray-200"></div>
      <div className="flex-1 border-2 rounded-2xl p-6 h-40 bg-gray-200"></div>
      <div className="flex-1 border-2 rounded-2xl p-6 h-40 bg-gray-200"></div>
    </div>
    <div className="mb-6">
      <div className="h-5 w-1/3 bg-gray-200 rounded mb-3"></div>
      <div className="flex gap-3 mb-2">
        {DAYS.map((day) => <div key={day.value} className="w-10 h-10 rounded-full bg-gray-200"></div>)}
      </div>
    </div>
    <div className="flex justify-end gap-4 pt-4 border-t">
      <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

export default function BulkDiscountEditor() {
  const { discountData, isLoading: isLoadingData, isError } = useBulkDiscounts();

  const [discounts, setDiscounts] = useState({ Daily: 0, Weekly: 0, Monthly: 0 });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [recurring, setRecurring] = useState(false);
  const [selectedType, setSelectedType] = useState("Daily");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: apiUpdateDiscount,
    onSuccess: () => {
      setIsModalOpen(true);
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['bulkDiscounts'] });
    },
    onError: (error: any) => {
      console.error("❌ Mutation failed:", error);
    },
  });

  useEffect(() => {
    if (discountData) {
      setDiscounts({
        Daily: discountData.dailyDiscount || 0,
        Weekly: discountData.weeklyDiscount || 0,
        Monthly: discountData.monthlyDiscount || 0,
      });
      setSelectedDays(discountData.applicableDays || []);
      setRecurring(discountData.isRecurring || false);
    }
  }, [discountData]);

  const handleDiscountChange = (type: "Daily" | "Weekly" | "Monthly", value: string) => {
    setDiscounts((prev) => ({
      ...prev,
      [type]: Math.max(0, Math.min(30, Number(value))),
    }));
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handleApply = () => {
    const payload: Partial<BulkDiscountData> = {
      dailyDiscount: discounts.Daily,
      weeklyDiscount: discounts.Weekly,
      monthlyDiscount: discounts.Monthly,
      applicableDays: selectedDays,
      isRecurring: recurring,
    };
    mutation.mutate(payload);
  };

  if (isLoadingData) return <SkeletonLoader />;
  if (isError) return <div className="p-4 text-center text-red-500">Error: Could not load discount settings.</div>;

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
        {DISCOUNT_TYPES.map((type) => (
          <div
            key={type.label}
            className={`flex-1 border-2 rounded-2xl p-4 sm:p-6 flex flex-col items-center transition cursor-pointer
              ${selectedType === type.label
                ? "border-[#feac40] bg-[#fff7e8] shadow"
                : "border-gray-200 bg-white"}
            `}
            onClick={() => setSelectedType(type.label)}
          >
            <div className="text-[#feac40] mb-2">
              <svg width={32} height={32} fill="none" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="16" rx="3" fill="currentColor" opacity="0.15" />
                <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
                <rect x="7" y="2" width="2" height="6" rx="1" fill="currentColor" />
                <rect x="15" y="2" width="2" height="6" rx="1" fill="currentColor" />
              </svg>
            </div>
            <div className="font-bold text-base sm:text-lg mb-2">{type.label}</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Discount</span>
              <select
                value={discounts[type.label as keyof typeof discounts]}
                onChange={(e) => handleDiscountChange(type.label as "Daily" | "Weekly" | "Monthly", e.target.value)}
                className="w-16 sm:w-20 px-2 py-1 border rounded text-center font-semibold"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <span className="text-gray-500">%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="font-medium mb-3">Apply Discount Automatically on:</div>
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-2">
          {DAYS.map((day, idx) => (
            <button
              key={day.value + idx}
              type="button"
              onClick={() => toggleDay(day.value)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition
                ${selectedDays?.includes(day.value)
                  ? "bg-[#feac40] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"}
              `}
            >
              {day.label}
            </button>
          ))}
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          The offer rates will be displayed exclusively on the specified dates, refreshed automatically on a weekly basis.
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-8">
        <div className="flex items-center gap-1">
          <span className="font-medium">Enable Recurring</span>
          <span tabIndex={0} className="ml-1 text-[#feac40] cursor-pointer" title="If enabled, the discount will repeat automatically on selected days.">
            ⓘ
          </span>
        </div>
        <button
          type="button"
          onClick={() => setRecurring((r) => !r)}
          className={`relative w-12 h-6 rounded-full transition
            ${recurring ? "bg-[#feac40]" : "bg-gray-300"}
          `}
          aria-pressed={recurring}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition
              ${recurring ? "translate-x-6" : ""}
            `}
            style={{ transition: "transform 0.2s" }}
          />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4 border-t">
        <Button
          style={{ backgroundColor: "#fea632" }}
          className="px-5 sm:px-7 py-2 sm:py-3 text-base font-semibold text-white hover:opacity-90 transition rounded-lg"
          onClick={handleApply}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Apply Changes"}
        </Button>
        <SuccessModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message="Bulk discounts have been applied successfully!"
        />
      </div>
    </div>
  );
}