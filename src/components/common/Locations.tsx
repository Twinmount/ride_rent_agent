import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllStates } from '@/api/states'
import { fetchAllCities } from '@/api/cities'
import { CityType, StateType } from '@/types/API-types'
import LocationsTabSkelton from '../loading-skelton/LocationsTabSkelton'

const Locations = () => {
  // State management for selected country and cities
  const [selectedState, setSelectedState] = useState<StateType | null>(null)
  const [cities, setCities] = useState<CityType[]>([])

  // Fetch all states
  const { data: statesData, isLoading: isStatesLoading } = useQuery({
    queryKey: ['states'],
    queryFn: fetchAllStates,
  })

  // Fetch cities based on the selected state
  const { data: citiesData, isLoading: isCitiesLoading } = useQuery({
    queryKey: ['cities', selectedState?.stateId],
    queryFn: () => fetchAllCities(selectedState?.stateId as string),
    enabled: !!selectedState?.stateId, // Only run if stateId is available
  })

  // Set the first state as selected by default when statesData is available
  useEffect(() => {
    if (statesData && statesData.result.length > 0) {
      setSelectedState(statesData.result[0]) // Set first state as selected by default
    }
  }, [statesData])

  // Update cities when citiesData changes
  useEffect(() => {
    if (citiesData) {
      setCities(citiesData.result)
    }
  }, [citiesData])

  // Handle state change
  const handleStateChange = (state: StateType) => {
    setSelectedState(state) // Update the selected state
  }

  return (
    <div className="bg-white wrapper">
      <h3 className="mb-2 font-bold text-center">Available Locations</h3>
      <p className="text-center mb-6 text-[0.9rem] text-gray-700">
        Choose your states/city to rent
      </p>
      {/* State selection buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4 gap-x-4">
        {isStatesLoading ? (
          <LocationsTabSkelton count={4} />
        ) : (
          statesData?.result.map((state) => (
            <button
              key={state.stateId}
              onClick={() => handleStateChange(state)}
              className={` ${
                selectedState?.stateId === state.stateId &&
                '!bg-black text-white'
              } bg-white border-none py-1 px-2 rounded-lg cursor-pointer transition-all font-bold hover:bg-black hover:text-white`}
            >
              {state.stateName}
            </button>
          ))
        )}
      </div>
      {/* City list */}
      {selectedState?.stateId && (
        <div className="flex flex-wrap justify-center w-full max-w-full gap-2 mx-auto cursor-pointer gap-x-4 md:max-w-[90%] lg:max-w-[80%]">
          {isCitiesLoading ? (
            <LocationsTabSkelton count={8} />
          ) : (
            cities.map((city) => (
              <div className="font-semibold text-[0.9rem] " key={city.cityId}>
                {city.cityName}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Locations
