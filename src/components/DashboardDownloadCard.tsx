import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download, Loader2, CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

interface DashboardDownloadCardProps {
  label: string;
  apiPath: string; // base path, dates will be appended
  fileName: string;
  icon: any;
}

const DashboardDownloadCard: React.FC<DashboardDownloadCardProps> = ({
  label,
  apiPath,
  fileName,
  icon,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { refetch, isFetching } = useQuery({
    queryKey: ["download", fileName],
    enabled: false,
    queryFn: async () => {
      if (!startDate || !endDate) return;

      const query = `?start=${startDate.toISOString()}&end=${endDate.toISOString()}`;
      const res = await axios.get(`${apiPath}${query}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setDialogOpen(false);
      return true;
    },
  });

  const handleDownload = () => {
    if (startDate && endDate) {
      refetch();
    }
  };

  const Icon = icon;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div
          className={`flex items-center h-24 justify-between p-4 bg-white rounded-lg shadow cursor-pointer transition hover:bg-gray-100 ${
            isFetching ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <span className=" font-medium text-base flex flex-col gap-y-3 text-gray-700">
            <Icon className="w-8 h-8 text-yellow" /> {label}
          </span>
          {isFetching ? (
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          ) : (
            <Download className="w-8 h-8 text-gray-600" />
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            Select a date range and click "Download" to export your data.
          </DialogDescription>
        </DialogHeader>

        {/* Date Pickers */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <CalendarDays className="text-orange w-5 h-5" />
            <label className="text-gray-700 font-medium w-24">
              Start Date:
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="DD/MM/YYYY"
              className="w-full border px-3 py-2 rounded"
              maxDate={endDate || new Date()}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="flex items-center gap-4">
            <CalendarDays className="text-orange w-5 h-5" />
            <label className="text-gray-700 font-medium w-24">End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="DD/MM/YYYY"
              className="w-full border px-3 py-2 rounded"
              minDate={startDate || new Date()}
              maxDate={new Date()}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => setDialogOpen(false)}
            disabled={isFetching}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!startDate || !endDate || isFetching}
          >
            {isFetching && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDownloadCard;
