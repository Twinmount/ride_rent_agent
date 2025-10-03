// LocationPicker.tsx
import React, { useState } from "react";
import MapModal from "./MapModal";
import { toast } from "@/components/ui/use-toast";

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationPickerProps {
  onChangeHandler: (location: Location) => void;
  initialLocation?: Location | null;
  buttonText?: string;
  buttonClassName?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onChangeHandler,
  initialLocation = null,
  buttonText = "Select Location",
  buttonClassName = "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasLocation =
    initialLocation?.lat !== undefined && initialLocation?.lng !== undefined;

  const appliedText = hasLocation ? "Change Location" : buttonText;

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleLocationSelected = (location: Location) => {
    onChangeHandler(location);
    toast({
      title: `Location added successful`,
      className: "bg-yellow text-white",
    });
    closeModal();
  };

  return (
    <>
      <button type="button" onClick={openModal} className={buttonClassName}>
        {appliedText}
      </button>

      {/* Only render the map component when modal is open */}
      {isOpen && (
        <MapModal
          onClose={closeModal}
          onConfirm={handleLocationSelected}
          initialLocation={initialLocation}
        />
      )}
    </>
  );
};

export default LocationPicker;
