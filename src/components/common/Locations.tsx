import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllStates } from "@/api/states";
import { fetchAllCities } from "@/api/cities";
import { CityType, StateType } from "@/types/API-types";
import CitiesSkelton from "../loading-skelton/CitiesSkelton";

const Locations = ({
  countryId,
  isIndia,
}: {
  countryId: string;
  isIndia: boolean;
}) => {
  // State management for selected state and cities
  const [selectedState, setSelectedState] = useState<StateType | null>(null);
  const [cities, setCities] = useState<CityType[]>([]);
  const [showAllCities, setShowAllCities] = useState<boolean>(false);

  // Fetch all states
  const { data: statesData, isLoading: isStatesLoading } = useQuery({
    queryKey: ["states", countryId],
    queryFn: () => fetchAllStates(countryId, isIndia),
    enabled: !!countryId && isIndia,
  });

  // Fetch cities based on the selected state
  const { data: citiesData, isLoading: isCitiesLoading } = useQuery({
    queryKey: ["cities", selectedState?.stateId],
    queryFn: () => fetchAllCities(selectedState?.stateId as string),
    enabled: !!selectedState?.stateId, // Only run if stateId is available
  });

  // Set the first state as selected by default when statesData is available
  useEffect(() => {
    if (statesData && statesData.result.length > 0) {
      setSelectedState(statesData.result[0]); // Set first state as selected by default
    }
  }, [statesData]);

  // Update cities when citiesData changes
  useEffect(() => {
    if (citiesData) {
      setCities(citiesData.result);
    }
  }, [citiesData]);

  // Handle state change
  const handleStateChange = (state: StateType) => {
    setSelectedState(state); // Update the selected state
    setShowAllCities(false); // Reset to show less cities when state changes
  };

  // Toggle show all or less cities
  const toggleShowAllCities = () => {
    setShowAllCities((prev) => !prev);
  };

  // Determine which cities to display
  const citiesToDisplay = showAllCities ? cities : cities.slice(0, 50);

  return (
    <div className="bg-white wrapper">
      <h3 className="mb-2 font-bold text-center">Available Locations</h3>
      <p className="text-center mb-6 text-[0.9rem] text-gray-700">
        Choose your states/city to rent
      </p>
      {/* State selection buttons */}
      <div className="flex flex-wrap gap-2 gap-x-4 justify-center mb-4">
        {isStatesLoading ? (
          <CitiesSkelton count={4} />
        ) : (
          statesData?.result.map((state) => (
            <button
              key={state.stateId}
              onClick={() => handleStateChange(state)}
              className={`${
                selectedState?.stateId === state.stateId &&
                "!bg-black text-white"
              } bg-slate-200 border-none py-1 px-2 rounded-lg cursor-pointer transition-all font-bold hover:bg-black hover:text-white`}
            >
              {state.stateName}
            </button>
          ))
        )}
      </div>
      {/* City list */}
      {selectedState?.stateId && (
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap gap-2 gap-x-4 justify-center mx-auto w-full max-w-full">
            {isCitiesLoading ? (
              <CitiesSkelton count={8} />
            ) : (
              citiesToDisplay.map((city) => (
                <div
                  className="font-semibold bg-slate-100 rounded-xl px-2 text-[0.9rem] cursor-pointer"
                  key={city.cityId}
                >
                  {city.cityName}
                </div>
              ))
            )}
          </div>
          {/* Show more/less button */}
          {cities.length > 50 && (
            <button
              onClick={toggleShowAllCities}
              className="relative bottom-1 px-2 py-1 mt-3 text-white bg-black rounded-xl flex-center"
            >
              {showAllCities ? "Show Less" : "Show All"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Locations;
