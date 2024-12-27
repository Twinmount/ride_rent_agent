import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DownloadCompletedTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export default function DownloadCompletedTripModal({
  isOpen,
  onClose,
  onDownload,
}: DownloadCompletedTripModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Trip</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to download this completed trip?</p>
        <div className="flex justify-end mt-4 space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onDownload} className="text-white bg-blue-500">
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
