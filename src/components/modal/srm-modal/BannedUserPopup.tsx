import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BannedUserPopupProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  passportNumber: string;
  drivingLicenseNumber: string;
  phoneNumber: string;
  customerStatus: string;
}

export default function BannedUserPopup({
  isOpen,
  onClose,
  customerName,
  passportNumber,
  drivingLicenseNumber,
  phoneNumber,
  customerStatus,
}: BannedUserPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Status: {customerStatus}</DialogTitle>
          <DialogDescription>
            This user is currently flagged in the system. Below are the user's
            details.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Name:</p>
              <p>{customerName}</p>
            </div>
            <div>
              <p className="font-semibold">Nationality:</p>
              <p>{passportNumber ? "Available" : "Not Provided"}</p>
            </div>
            <div>
              <p className="font-semibold">Passport Number:</p>
              <p>{passportNumber || "Not Provided"}</p>
            </div>
            <div>
              <p className="font-semibold">Driving License Number:</p>
              <p>{drivingLicenseNumber || "Not Provided"}</p>
            </div>
            <div>
              <p className="font-semibold">Mobile Number:</p>
              <p>{phoneNumber || "Not Provided"}</p>
            </div>
          </div>

          {/* Customer Status */}
          <div className="mt-6">
            <p className="font-semibold">Status:</p>
            <p className="text-red-500">{customerStatus}</p>
            <p className="mt-2 text-sm text-gray-600">
              If this status is incorrect, the user must contact the appropriate
              authority directly for clearance.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
