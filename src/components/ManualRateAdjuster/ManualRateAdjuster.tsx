import React, { useRef, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { API } from "@/api/ApiService";
import { downloadRatesTemplate } from "@/api/vehicle";
import RateManagerCard from "./RateManagerCard";
import * as XLSX from "xlsx";
import SuccessModal from "@/components/modal/SuccessModal";
import { Dialog } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { VehicleRateRow, ApiVehicleUpdate } from "@/types/API-types";
import { validateExcelRows, transformRowForApi } from "@/helpers/ratehelper";

type Car = {
  id: string;
  name: string;
  registrationNumber: string;
  imageUrl?: string;
  rentals?: any[];
};

type ManualRateAdjusterProps = {
  cars: Car[];
  refetch: () => void;
};

function BulkRateUpdateModal({
  open,
  onClose,
  onDownload,
  onSave,
  bulkLoading,
}: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!open) return null;

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave(uploadedFile);
    setIsSaving(false);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setUploadedFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
          onClick={handleClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2">
          Steps to Update Rental Prices via Excel
        </h2>
        <p className="text-gray-600 mb-4">
          Follow the instructions to quickly update rental rates using an Excel
          upload.
        </p>
        <div className="rounded-2xl shadow-inner bg-gray-50 p-4 mb-4">
          <div className="font-semibold mb-2">1. Get the Template</div>
          <p className="text-gray-600 text-sm mb-2">
            Download the Excel template with your current pricing.
          </p>
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={onDownload}
          >
            Download Excel Format
          </Button>

          <div className="font-semibold mb-2">2. Upload Your Changes</div>
          <p className="text-gray-600 text-sm mb-2">
            Once updated, upload the file here.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Updated File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setUploadedFile(e.target.files[0]);
              }
            }}
          />
          {uploadedFile && (
            <div className="text-xs text-gray-500 mt-2 truncate">
              Selected: {uploadedFile.name}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={bulkLoading || isSaving}
          >
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#fea632" }}
            className="text-white hover:opacity-90 flex items-center"
            onClick={handleSaveClick}
            disabled={!uploadedFile || isSaving || bulkLoading}
            type="button"
          >
            {bulkLoading || isSaving ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Saving...
              </>
            ) : (
              "Save & Update"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function BulkUpdateResultModal({
  open,
  onClose,
  successRows,
  failedRows,
}: {
  open: boolean;
  onClose: () => void;
  successRows: { regNum: string; rowNum: number }[];
  failedRows: { regNum: string; rowNum: number; error: string }[];
}) {
  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">Bulk Update Results</h2>
        <div className="mb-4">
          <span className="text-green-700 font-semibold">
            {successRows.length} vehicles updated successfully
          </span>
          {successRows.length > 0 && (
            <ul className="list-disc list-inside text-green-700 text-sm mt-2">
              {successRows.map((row) => (
                <li key={row.rowNum}>
                  Row {row.rowNum}: {row.regNum}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <span className="text-red-700 font-semibold">
            {failedRows.length} vehicles failed to update
          </span>
          {failedRows.length > 0 && (
            <ul className="list-disc list-inside text-red-700 text-sm mt-2">
              {failedRows.map((row) => (
                <li key={row.rowNum}>
                  Row {row.rowNum}: {row.regNum} — {row.error}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default function ManualRateAdjuster({
  cars,
  refetch,
}: ManualRateAdjusterProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [excelErrors, setExcelErrors] = useState<string[]>([]);
  const [excelRows, setExcelRows] = useState<any[]>([]);
  const [excelFileName, setExcelFileName] = useState<string>("");
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [bulkSuccessRows, setBulkSuccessRows] = useState<
    { regNum: string; rowNum: number }[]
  >([]);
  const [bulkFailedRows, setBulkFailedRows] = useState<
    { regNum: string; rowNum: number; error: string }[]
  >([]);
  const [bulkLoading, setBulkLoading] = useState(false); // NEW: Bulk update loading state
  const [lastSubmitSuccess, setLastSubmitSuccess] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!modalOpen && lastSubmitSuccess) {
      setSuccessOpen(true);
      setLastSubmitSuccess(false);
    }
  }, [modalOpen, lastSubmitSuccess]);

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(search.toLowerCase()) ||
      car.registrationNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = async () => {
    try {
      const blob = await downloadRatesTemplate();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rate_update_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the Excel template.",
        variant: "destructive",
      });
    }
  };

  const handleBulkUpdate = async (file: File | null) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload an Excel file.",
        variant: "destructive",
      });
      return;
    }

    setBulkLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        blankrows: false,
      });

      if (rawData.length < 2)
        throw new Error(
          "Excel file must have at least a header row and one data row."
        );

      const headers = rawData[0] as string[];
      const dataRows = rawData.slice(1);
      const formattedRows: VehicleRateRow[] = dataRows.map((row: any[]) => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || "";
        });
        return obj as VehicleRateRow;
      });

      const validationResult = validateExcelRows(formattedRows);
      if (!validationResult.valid) {
        toast({
          title: "Validation Failed",
          description: validationResult.error,
          variant: "destructive",
        });
        return;
      }

      const transformedVehicles: ApiVehicleUpdate[] =
        formattedRows.map(transformRowForApi);

      const response = await API.post<{
        updatedCount: number;
        failedRows?: {
          registrationNumber: string;
          rowNum: number;
          error: string;
        }[];
        successRows?: { registrationNumber: string; rowNum: number }[];
      }>({
        slug: "/vehicle/bulk-update-rates",
        body: { vehicles: transformedVehicles },
      });

      const failedRows = response?.failedRows || [];
      const successRows = response?.successRows || [];
      let successRowsDisplay: { regNum: string; rowNum: number }[] = [];
      let failedRowsDisplay: {
        regNum: string;
        rowNum: number;
        error: string;
      }[] = [];

      if (successRows.length > 0 || failedRows.length > 0) {
        successRowsDisplay = successRows.map((r) => ({
          regNum: r.registrationNumber,
          rowNum: r.rowNum,
        }));
        failedRowsDisplay = failedRows.map((r) => ({
          regNum: r.registrationNumber,
          rowNum: r.rowNum,
          error: r.error,
        }));
      } else {
        successRowsDisplay = transformedVehicles.map((v, idx) => ({
          regNum: v.registrationNumber,
          rowNum: idx + 2,
        }));
      }

      setBulkSuccessRows(successRowsDisplay);
      setBulkFailedRows(failedRowsDisplay);
      setResultModalOpen(true);

      toast({
        title: "Bulk Update Complete",
        description: `Updated ${
          successRowsDisplay.length
        } vehicles successfully${
          failedRowsDisplay.length > 0
            ? `, ${failedRowsDisplay.length} failed.`
            : "."
        }`,
        variant: failedRowsDisplay.length > 0 ? "destructive" : "default",
      });

      setSuccessOpen(true);
      setModalOpen(false);
      setLastSubmitSuccess(true);
    } catch (error: any) {
      console.error("Bulk update error:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setBulkLoading(false);
    }
  };
  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExcelErrors([]);
    setExcelRows([]);
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const errors: string[] = [];
      rows.forEach((row, idx) => {
        if (Number(row.dailyDiscount) > 30) {
          errors.push(`Row ${idx + 2}: Daily Discount > 30`);
        }
        if (Number(row.weeklyDiscount) > 30) {
          errors.push(`Row ${idx + 2}: Weekly Discount > 30`);
        }
        if (Number(row.monthlyDiscount) > 30) {
          errors.push(`Row ${idx + 2}: Monthly Discount > 30`);
        }
        if (!row.vehicleId) {
          errors.push(`Row ${idx + 2}: Missing Vehicle ID`);
        }
      });

      setExcelRows(rows);
      setExcelErrors(errors);
    };
    reader.readAsBinaryString(file);
  };

  const handleExcelUpload = async () => {
    if (excelErrors.length > 0) return;
    setBulkLoading(true);
    setExcelModalOpen(false);
    setExcelRows([]);
    setExcelFileName("");
    refetch();
    setBulkLoading(false);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow">
      <div className="flex flex-col md:flex-row justify-start md:justify-between items-stretch md:items-center gap-4 mb-8 flex-wrap">
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by Reg No, Make, Model"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-4 py-2 w-full md:w-64 text-base h-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleExport}
              className="h-10 px-6 w-full sm:w-auto"
            >
              Export
            </Button>
          </div>
          <div className="w-full sm:w-auto">
            <button
              type="button"
              className="bg-[#fea632] text-white px-4 py-2 rounded-lg font-semibold w-full sm:w-auto h-10"
              onClick={() => setModalOpen(true)}
            >
              Bulk Rate Update
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-8 justify-center">
        {filteredCars.length === 0 && (
          <div className="text-gray-400 italic">
            No cars found for this agent.
          </div>
        )}
        {filteredCars.map((car) => (
          <RateManagerCard key={car.id} car={car} refetch={refetch} />
        ))}
      </div>

      <BulkRateUpdateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleBulkUpdate}
        onDownload={handleExport}
        bulkLoading={bulkLoading}
      />

      <SuccessModal
        isOpen={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          queryClient.invalidateQueries({ queryKey: ["vehicles"] });
          refetch();
        }}
        title="Bulk Update Successful"
        message="Vehicle rates have been updated successfully!"
      />

      <BulkUpdateResultModal
        open={resultModalOpen}
        onClose={() => {
          setResultModalOpen(false);
          refetch();
        }}
        successRows={bulkSuccessRows}
        failedRows={bulkFailedRows}
      />

      {/* --- Excel Upload Modal --- */}
      {excelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-4 sm:p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setExcelModalOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-2">Bulk Excel Upload</h2>
            <p className="text-gray-600 mb-4">
              Upload an Excel file to update rental rates in bulk.
            </p>

            <div className="rounded-2xl shadow-inner bg-gray-50 p-4 mb-4">
              <div className="font-semibold mb-2">
                1. Prepare Your Excel File
              </div>
              <p className="text-gray-600 text-sm mb-2">
                Ensure your file matches the correct format. Use the template to
                avoid errors.
              </p>

              <div className="font-semibold mb-2 mt-4">
                2. Upload Your Excel File
              </div>
              <p className="text-gray-600 text-sm mb-2">
                Select your file and check for validation errors.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  document.getElementById("excel-file-input")?.click()
                }
              >
                Choose Excel File
              </Button>
              <input
                id="excel-file-input"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleExcelFileChange}
              />
              {excelFileName && (
                <div className="text-xs text-gray-500 mt-2 truncate">
                  Selected: {excelFileName}
                </div>
              )}
              {excelErrors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  <strong>Validation Errors:</strong>
                  <ul className="list-disc list-inside">
                    {excelErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center sm:justify-end gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => setExcelModalOpen(false)}
                disabled={bulkLoading}
              >
                Cancel
              </Button>
              <Button
                style={{ backgroundColor: "#fea632" }}
                className="text-white hover:opacity-90 flex items-center"
                onClick={handleExcelUpload}
                disabled={
                  excelErrors.length > 0 ||
                  excelRows.length === 0 ||
                  bulkLoading
                }
              >
                {bulkLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
