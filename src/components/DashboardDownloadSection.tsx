import { dashboardDownloadItems } from "@/constants/dashboardDownloadItems";
import DashboardDownloadCard from "./DashboardDownloadCard";

export default function DashboardDownloadSection() {
  return (
    <div className="mt-10 space-y-4 pt-6 border-t-2">
      <h2 className="text-xl font-semibold text-gray-800">Download Reports</h2>
      <div className="grid grid-cols-2 gap-4 ">
        {dashboardDownloadItems.map((item, index) => (
          <DashboardDownloadCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
