import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CompletedTripsInvoiceDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export default function CompletedTripsInvoiceDownloadModal({
  isOpen,
  onClose,
  onDownload,
}: CompletedTripsInvoiceDownloadModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Invoice of the Trip?</DialogTitle>
          <DialogDescription>
            Are you sure you want to download the invoice for this trip?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onDownload} className="text-white bg-green-500">
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
