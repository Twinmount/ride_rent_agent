// LocationPicker.tsx
import React, { useState } from "react";
import MapModal from "./MapModal";

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

  const appliedClassName = hasLocation
    ? "w-full cursor-pointer bg-yellow text-white px-4 py-2 rounded-md"
    : buttonClassName;

  const appliedText = hasLocation ? "Change Location" : buttonText;

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleLocationSelected = (location: Location) => {
    onChangeHandler(location);
    closeModal();
  };

  return (
    <>
      <button type="button" onClick={openModal} className={appliedClassName}>
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
