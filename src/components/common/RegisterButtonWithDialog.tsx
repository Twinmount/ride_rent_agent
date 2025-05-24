import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RegistrationForm from "../form/main-form/RegistrationForm";

export default function RegisterButtonWithDialog({
  country,
}: {
  country: string;
}) {
  const [open, setOpen] = useState(false);

  const handleRegisterClick = () => {
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="lg"
          onClick={handleRegisterClick}
          className="mt-8 !rounded-md mx-auto flex-start col-span-2 text-black !text-lg !font-semibold button bg-yellow hover:bg-darkYellow hover:scale-105 duration-300  transition"
        >
          Register with Ride.Rent
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[350px] max-w-[400px] bg-transparent border-none custom-register-modal-content">
        <DialogHeader>
          <DialogDescription>
            <RegistrationForm country={country} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
