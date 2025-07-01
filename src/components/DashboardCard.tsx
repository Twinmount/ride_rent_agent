// components/DashboardCard.tsx
import React from "react";
import DashboardSkelton from "@/components/loading-skelton/DashboardSkelton";

interface DashboardCardProps {
  title: string;
  value: number | string;
  isLoading: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  isLoading,
}) => (
  <div className="p-4 text-center bg-white rounded-lg shadow">
    {isLoading ? (
      <DashboardSkelton />
    ) : (
      <>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-4xl font-bold text-[#FFB347] mt-2">{value}</p>
      </>
    )}
  </div>
);

export default DashboardCard;
