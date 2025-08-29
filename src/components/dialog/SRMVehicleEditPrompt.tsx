import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pen } from "lucide-react";
import { useState } from "react";

type SRMVehicleEditPromptProps = {
  vehicleId: string;
};

export default function SRMVehicleEditPrompt({
  vehicleId,
}: SRMVehicleEditPromptProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    navigate(`/srm/manage-vehicles/edit/${vehicleId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={
          "flex-center -mb-4 button  hover:bg-darkYellow active:scale-[0.97] duration-100 active:shadow-md transition-all  ease-out col-span-2 mx-auto w-full text-white bg-slate-900 hover:bg-slate-800 !text-lg gap-x-2 !font-semibold md:w-10/12 lg:w-8/12"
        }
      >
        Edit Vehicle <Pen size={16} />
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit Vehicle?</DialogTitle>
          <DialogDescription>
            Do you want to edit this vehicle? Any unsaved changes will be lost.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleEdit}
            className="bg-slate-900 hover:bg-slate-800 transition-colors text-white"
          >
            Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
