// MapModal.tsx
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface MapModalProps {
  onClose: () => void;
  onConfirm: (location: Location) => void;
  initialLocation?: Location | null;
}

const MapModal: React.FC<MapModalProps> = ({
  onClose,
  onConfirm,
  initialLocation = null,
}) => {
  // Google Maps only loads when this component is mounted
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [mapCenter, setMapCenter] = useState<Location>(
    initialLocation || { lat: 28.633008, lng: 77.221976 }
  );
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [address, setAddress] = useState<string>(
    initialLocation?.address || ""
  );

  useEffect(() => {
    if (isLoaded && initialLocation) {
      setSelectedLocation(initialLocation);
      setMapCenter(initialLocation);
      setAddress(initialLocation.address || "");
    }
  }, [isLoaded, initialLocation]);

  const handlePlaceChanged = () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      console.warn("No geometry data available for the selected place");
      return;
    }

    const newLocation: Location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      address: place.formatted_address || "",
    };

    setSelectedLocation(newLocation);
    setMapCenter(newLocation);
    setAddress(newLocation.address || "");
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        address,
      };
      setSelectedLocation(newLocation);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onConfirm({
        ...selectedLocation,
        address: address || "",
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(newLocation);
          setMapCenter(newLocation);
        },
        () => {
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Select Location</h2>

        {isLoaded ? (
          <>
            <div className="mb-4">
              <Autocomplete
                onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  type="text"
                  placeholder="Search location"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </Autocomplete>
            </div>

            <div className="h-64 w-full mb-4 relative">
              <GoogleMap
                mapContainerStyle={{ height: "100%", width: "100%" }}
                center={mapCenter}
                zoom={15}
              >
                {selectedLocation && (
                  <Marker
                    key={`${selectedLocation.lat}-${selectedLocation.lng}`}
                    position={selectedLocation}
                    draggable
                    onDragEnd={handleMarkerDragEnd}
                  />
                )}
              </GoogleMap>
            </div>

            {address && (
              <div className="mb-4 p-2 bg-gray-100 rounded">
                <p className="text-sm">
                  <strong>Address:</strong> {address}
                </p>
              </div>
            )}

            <div className="flex justify-between mb-4">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="text-blue-500 hover:text-blue-700"
              >
                Use Current Location
              </button>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedLocation}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
              >
                Confirm
              </button>
            </div>
          </>
        ) : (
          <div>Loading map...</div>
        )}
      </div>
    </div>
  );
};

export default MapModal;
