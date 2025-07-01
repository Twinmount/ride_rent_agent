import React from "react";
import LazyLoader from "@/components/loading-skelton/LazyLoader";
import useDashboard from "@/hooks/useDashboard";
import DashboardOverlay from "@/components/DashboardOverlay";
import DashboardCard from "@/components/DashboardCard";
import DashboardBoost from "@/components/DashboardBoost";

const AgentDashboard: React.FC = () => {
  const { vehicleCount, isVehiclesLoading, metricCards, userId } =
    useDashboard();

  if (isVehiclesLoading) {
    return <LazyLoader />;
  }

  return (
    <section className="relative p-6 py-10 h-auto min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl">
        <h2 className="fixed top-[4.7rem] left-0 pl-10 lg:pl-80 bg-white/20 backdrop-blur-md  z-10 mb-4   text-2xl lg:text-3xl font-bold w-full h-14 flex items-center  shadow-sm ">
          Agent Dashboard
        </h2>

        {/* Conditional Overlay if there is no vehicle */}
        {vehicleCount === 0 && <DashboardOverlay userId={userId as string} />}

        {/* stats grid */}
        <div className="grid grid-cols-1 gap-4 mt-8 mb-6 md:grid-cols-2">
          {metricCards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              value={card.value}
              isLoading={card.isLoading}
            />
          ))}
        </div>

        {/* Free Boost Information */}
        <DashboardBoost />
      </div>
    </section>
  );
};

export default AgentDashboard;
