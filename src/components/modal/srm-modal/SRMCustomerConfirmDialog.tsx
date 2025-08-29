// components/SRMCustomerConfirmDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SRMCustomerConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
  title: string;
  description: string;
};

const SRMCustomerConfirmDialog = ({
  open,
  onClose,
  onProceed,
  title,
  description,
}: SRMCustomerConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {/* <DialogActions>
          <DialogAction onClick={onClose}>Close</DialogAction>
          <DialogAction onClick={onProceed}>Proceed</DialogAction>
        </DialogActions> */}

        <div className="flex justify-end gap-x-3">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-md mr-2"
          >
            Cancel
          </button>

          <button
            onClick={onProceed}
            className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md"
          >
            Proceed
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SRMCustomerConfirmDialog;
