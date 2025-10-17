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
    const message = hasLocation
      ? "Location changed successfully"
      : "Location added successfully";

    toast({
      title: message,
      className: "bg-green-500 text-white",
    });
    closeModal();
  };

  // Build a close bbox-based OSM embed URL when a location exists
  const previewUrl = hasLocation
    ? (() => {
      const delta = 0.015; // ~1500m box
      const lat = initialLocation!.lat;
      const lng = initialLocation!.lng;
      const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
    })()
    : "";

  return (
    <>
      {/* If there's a selected location show a visual preview card */}
      {hasLocation ? (
        <div className="flex flex-col gap-2 w-full max-w-md">
          <div className="relative rounded-md overflow-hidden border">
            {/* OpenStreetMap embed (served by OSM) - no API key required */}
            <iframe
              title="Selected location preview"
              src={previewUrl}
              className="w-full h-48 border-0"
            />

            {/* green tick badge in the corner */}
            <span className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5 text-green-500"
                aria-hidden="true"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </span>
          </div>

          <div className="text-sm text-gray-700">
            {initialLocation?.address ? (
              <p className="break-words">{initialLocation.address}</p>
            ) : (
              <p>
                {initialLocation?.lat.toFixed(5)}, {initialLocation?.lng.toFixed(5)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openModal}
              className={buttonClassName}
              aria-label="Change location"
            >
              {appliedText}
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={openModal} className={buttonClassName}>
          {appliedText}
        </button>
      )}

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
