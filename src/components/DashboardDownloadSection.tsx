import { downloadItems } from "@/constants/dashboardDownloadItems";
import ExcelDownloadDialog from "./ExcelDownloadDialog";

export default function DashboardDownloadSection() {
  return (
    <section className="mt-10 border-t-2 pt-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Download Reports</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {downloadItems.map((item, idx) => (
          <ExcelDownloadDialog key={idx} {...item} />
        ))}
      </div>
    </section>
  );
}
