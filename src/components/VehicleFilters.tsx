import { ApprovalStatusTypes } from "@/types/types";
import React from "react";

const filterOptions: { value: ApprovalStatusTypes; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "PENDING", label: "Pending" },
  { value: "UNDER_REVIEW", label: "Under Review" },
];
export default function VehicleFilters({
  filters,
  setFilters,
}: {
  filters: { approvalStatus: ApprovalStatusTypes };
  setFilters: React.Dispatch<
    React.SetStateAction<{ approvalStatus: ApprovalStatusTypes }>
  >;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 ml-2">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setFilters({ approvalStatus: option.value })}
          className={`px-2 text-sm  rounded-lg outline-none ring-0 hover:bg-yellow hover:text-white transition-colors shadow-lg border border-gray-300 ${
            filters.approvalStatus === option.value
              ? "bg-yellow text-white"
              : " bg-white  text-black"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
