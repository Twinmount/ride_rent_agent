import { fetchAllStates, fetchParentStates } from "@/api/states";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type CityType = {
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
};

type StatesDropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isIndia: boolean;
  countryId: string;
  setSelectedCities: React.Dispatch<React.SetStateAction<string[]>>;
  setCities: React.Dispatch<React.SetStateAction<CityType[]>>;
};

type StateType = {
  stateId: string;
  stateName: string;
  stateValue: string;
  countryId: string;
  subHeading: string;
  metaTitle: string;
  metaDescription: string;
  stateImage: any;
};

const StatesDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
  isIndia = false,
  countryId,
  setCities,
  setSelectedCities,
}: StatesDropdownProps) => {
  const [selectedFirstState, setSelectedFirstState] = useState<string>("");

  // First dropdown data (for India)
  const { data: firstStatesData, isLoading: isFirstLoading } = useQuery({
    queryKey: ["firstStates", countryId],
    queryFn: () => fetchAllStates(countryId, isIndia),
    enabled: !!countryId && isIndia,
  });

  // Second dropdown data (dependent on first selection for India, or main data for non-India)
  const { data: secondStatesData, isLoading: isSecondLoading } = useQuery({
    queryKey: ["secondStates", countryId, selectedFirstState],
    queryFn: () => fetchAllStates(countryId, isIndia, selectedFirstState),
    enabled: !!countryId && (!isIndia || !!selectedFirstState),
  });

  const { data: parentStateData, isLoading: isParentStateLoading } = useQuery({
    queryKey: ["secondStates", countryId, selectedFirstState],
    queryFn: () => fetchParentStates(value || ""),
    enabled: !!value && isIndia && !selectedFirstState,
  });

  const [firstStates, setFirstStates] = useState<StateType[]>([]);
  const [secondStates, setSecondStates] = useState<StateType[]>([]);

  useEffect(() => {
    if (firstStatesData) {
      setFirstStates(firstStatesData.result);
    }
  }, [firstStatesData]);

  useEffect(() => {
    if (secondStatesData) {
      setSecondStates(secondStatesData.result);
    }
  }, [secondStatesData]);

  useEffect(() => {
    if (parentStateData?.result?.stateId) {
      setSelectedFirstState(parentStateData.result.stateId);
    }
  }, [parentStateData, isParentStateLoading]);

  const handleFirstStateChange = (value: string) => {
    if (value) {
      setSelectedFirstState(value);
      onChangeHandler("");
      setCities([]);
      setSelectedCities([]);
    }
  };

  const handleSecondStateChange = (value: string) => {
    if (value) {
      onChangeHandler(value);
      setCities([]);
      setSelectedCities([]);
    }
  };

  return (
    <div className="flex gap-4">
      {isIndia && (
        <Select
          onValueChange={handleFirstStateChange}
          // defaultValue={selectedFirstState}
          disabled={isDisabled || isFirstLoading}
          value={selectedFirstState}
        >
          <SelectTrigger className="select-field ring-0 focus:ring-0 input-fields">
            <SelectValue
              className="!font-bold !text-black"
              placeholder="Choose state"
            />
          </SelectTrigger>
          <SelectContent>
            {firstStates.length > 0 &&
              firstStates.map((state) => (
                <SelectItem
                  key={state.stateId}
                  value={state.stateId}
                  className="select-item p-regular-14"
                >
                  {state.stateName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}

      <Select
        onValueChange={handleSecondStateChange}
        defaultValue={value ? value : undefined}
        disabled={
          isDisabled ||
          (isIndia ? isSecondLoading : isFirstLoading) ||
          (isIndia && !selectedFirstState)
        }
      >
        <SelectTrigger className="select-field ring-0 focus:ring-0 input-fields">
          <SelectValue
            className="!font-bold !text-black"
            placeholder={isIndia ? "Choose location" : "Choose state"}
          />
        </SelectTrigger>
        <SelectContent>
          {secondStates.length > 0 &&
            secondStates.map((state) => (
              <SelectItem
                key={state.stateId}
                value={state.stateId}
                className="select-item p-regular-14"
              >
                {state.stateName}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatesDropdown;
