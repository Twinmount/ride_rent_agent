import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BannedCustomerType } from "@/types/srm-types";

interface BannedUserPopupProps {
  isSpamDialogOpen: boolean;
  setIsSpamDialogOpen: (val: boolean) => void;
  spamDetails: BannedCustomerType;
  onContinue: () => void; // Add a callback for the "Continue" action
}

export default function BannedUserPopup({
  isSpamDialogOpen,
  setIsSpamDialogOpen,
  spamDetails,
  onContinue,
}: BannedUserPopupProps) {
  return (
    <Dialog open={isSpamDialogOpen} onOpenChange={setIsSpamDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customer Flagged as Spam</DialogTitle>
          <DialogDescription>
            The customer is flagged as spam.
            {spamDetails?.reason && (
              <span className="text-red-600">Reason: {spamDetails.reason}</span>
            )}
            {spamDetails?.vehicleRegistrationNumber && (
              <span>
                Associated Vehicle: {spamDetails.vehicleRegistrationNumber}
              </span>
            )}
            {spamDetails?.companyName && (
              <span>Company: {spamDetails.companyName}</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={() => {
              setIsSpamDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsSpamDialogOpen(false); // Close the dialog
              onContinue(); // Invoke the callback
            }}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
