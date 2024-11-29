import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { CloudDownload } from "lucide-react";

type DownloadExcelModalProps = {
  title: string; // Title of the dialog (e.g., "Excel Data Download")
  onDownload: () => Promise<void>; // Async function to handle the download
};

const DownloadExcelModal: React.FC<DownloadExcelModalProps> = ({
  title,
  onDownload,
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to control dialog visibility
  const [isDownloading, setIsDownloading] = useState(false); // State to show loading during download

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await onDownload(); // Call the async download function
      setIsOpen(false); // Close the dialog after download
    } catch (error) {
      console.error("Error during download:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Button */}
      <DialogTrigger>
        <Button
          variant="outline"
          aria-label="Download Excel"
          className="text-yellow hover:text-yellow"
        >
          <CloudDownload />
        </Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end mt-4">
          <Button
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setIsOpen(false)}
            disabled={isDownloading} // Disable during download
          >
            Cancel
          </Button>
          <Button
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            onClick={handleDownload}
            disabled={isDownloading} // Disable during download
          >
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadExcelModal;
