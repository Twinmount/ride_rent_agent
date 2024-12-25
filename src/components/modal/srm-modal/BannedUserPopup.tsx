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
  onContinue: () => void;
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
          <DialogTitle className="text-red-600">
            Customer Flagged as Spam
          </DialogTitle>
          <DialogDescription>
            {spamDetails?.companyName && (
              <span>
                By Company: <strong>{spamDetails.companyName}</strong>
              </span>
            )}
            {spamDetails?.reason && (
              <span className="text-red-500">Reason: {spamDetails.reason}</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={() => setIsSpamDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={onContinue}
          >
            Continue Trip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
