import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Download, CloudDownload } from "lucide-react";
import { DownloadDialogConfig } from "@/types/srm-types";
import { downloadSRMExcelBlob } from "@/api/srm";

export const bookingStatusOptions = [
  "COMPLETED",
  "ONGOING",
  "CANCELLED",
  "INCOMPLETE",
] as const;

export type BookingStatusType = (typeof bookingStatusOptions)[number];

const sortOptions = ["ASC", "DESC"];

export default function ExcelDownloadDialog({
  label,
  slug,
  fileName,
  filters,
  variant = "card",
}: DownloadDialogConfig) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [bookingStatus, setBookingStatus] =
    useState<BookingStatusType>("COMPLETED");

  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filters.dateRange) {
        if (!startDate || !endDate) {
          toast({
            variant: "destructive",
            title: "Please select both start and end dates.",
          });
          setLoading(false);
          return;
        }
        params.append("startDate", startDate.toISOString());
        params.append("endDate", endDate.toISOString());
      }

      if (filters.sortOrder) {
        params.append("sortOrder", sortOrder);
      }

      if (filters.bookingStatus && bookingStatus) {
        params.append("bookingStatus", bookingStatus);
      }

      await downloadSRMExcelBlob({ slug, fileName, params });

      toast({ title: "Download started" });
      setDialogOpen(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: err.message || "Download failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {/* dialog trigger */}
      <CardDialogTrigger variant={variant} label={label} loading={loading} />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            Fill in the fields and click download to get the Excel file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Booking Status */}
          {filters.bookingStatus && (
            <div className="space-y-1 md:flex md:items-center md:gap-4">
              <label className="block text-sm font-medium text-gray-700 md:w-40">
                Booking Status
              </label>
              <Select
                value={bookingStatus}
                onValueChange={(value: string) =>
                  setBookingStatus(value as BookingStatusType)
                }
              >
                <SelectTrigger className="w-full md:flex-1  md:-ml-2">
                  <SelectValue placeholder="Select booking status" />
                </SelectTrigger>
                <SelectContent className="z-[101]">
                  <SelectGroup>
                    {bookingStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Start Date */}
          {filters.dateRange && (
            <>
              <div className="space-y-1 md:flex md:items-center md:gap-4">
                <label className="block text-sm font-medium text-gray-700 md:w-40">
                  Start Date
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  maxDate={new Date()}
                  placeholderText="Select start date"
                  className="w-full md:flex-1 border px-3 py-2 rounded"
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              <div className="space-y-1 md:flex md:items-center md:gap-4">
                <label className="block text-sm font-medium text-gray-700 md:w-40">
                  End Date
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={startDate || undefined}
                  maxDate={new Date()}
                  placeholderText="Select end date"
                  className="w-full md:flex-1 border px-3 py-2 rounded"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </>
          )}

          {/* Sort Order */}
          {filters.sortOrder && (
            <div className="space-y-1 md:flex md:items-center md:gap-4">
              <label className="block text-sm font-medium text-gray-700 md:w-40">
                Sort Order
              </label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full md:flex-1 md:-ml-2">
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent className="z-[101]">
                  <SelectGroup>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => setDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={
              loading || (filters.dateRange && (!startDate || !endDate))
            }
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Dialog trigger that conditionally displays an icon or card
const CardDialogTrigger = ({
  variant,
  label,
  loading,
}: {
  variant: "card" | "icon";
  label: string;
  loading: boolean;
}) => {
  return (
    <DialogTrigger asChild>
      {variant === "icon" ? (
        <div
          aria-label="Download Excel"
          className="gap-x-2 h-10 w-10 rounded-lg shadow-lg flex-center text-yellow bg-white hover:bg-yellow hover:text-white transition-colors"
        >
          <CloudDownload />
        </div>
      ) : (
        <div className="cursor-pointer rounded-lg bg-white p-4 shadow hover:bg-gray-100 transition">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">{label}</span>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            ) : (
              <Download className="h-6 w-6 text-yellow" />
            )}
          </div>
        </div>
      )}
    </DialogTrigger>
  );
};
