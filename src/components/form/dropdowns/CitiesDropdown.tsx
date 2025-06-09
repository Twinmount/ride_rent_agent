import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchAllCities } from "@/api/cities";
import { toast } from "@/components/ui/use-toast";

type CityType = {
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
};

type CitiesDropdownProps = {
  value: string[];
  onChangeHandler: (value: string[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
  stateId: string;
  isTempEditable?: boolean;
  isTempCreatable?: boolean;
  selectedCities: string[];
  setSelectedCities: React.Dispatch<React.SetStateAction<string[]>>;
  cities: CityType[];
  setCities: React.Dispatch<React.SetStateAction<CityType[]>>;
  setTemoraryCities: React.Dispatch<React.SetStateAction<CityType[]>>;
  temoraryCities: CityType[];
};

const generateTempCityId = (name: string) =>
  `temp-${name.toLowerCase().replace(/\s+/g, "-")}`;

const CitiesDropdown = ({
  value = [],
  onChangeHandler,
  placeholder = "cities",
  isDisabled = false,
  stateId,
  isTempEditable = true,
  isTempCreatable = false,
  selectedCities = [],
  setSelectedCities = () => {},
  cities = [],
  setCities = () => {},
  setTemoraryCities = () => {},
  temoraryCities = [],
}: CitiesDropdownProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["cities", stateId],
    queryFn: () => fetchAllCities(stateId),
    enabled: !!stateId,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [editingCityName, setEditingCityName] = useState<string>("");

  useEffect(() => {
    if (data?.result && Array.isArray(data.result)) {
      setCities((prevCities) => {
        const newCities = data.result.filter(
          (newCity: CityType) =>
            !prevCities.some((city) => city.cityId === newCity.cityId)
        );
        return [...prevCities, ...newCities];
      });
    }
  }, [data?.result]);

  useEffect(() => {
    if (temoraryCities.length > 0) {
      setCities((prev) => {
        let newCities = temoraryCities.filter(
          (city) =>
            city.stateId === stateId &&
            !prev.some((prevCity) => prevCity.cityId === city.cityId)
        );
        return [...prev, ...newCities];
      });
    }
  }, [value]);

  useEffect(() => {
    if (value && Array.isArray(value)) {
      setSelectedCities((prevSelected) => {
        const newValues = value.filter((val) => !prevSelected.includes(val));
        return [...prevSelected, ...newValues];
      });
    }
  }, []);

  useEffect(() => {
    if (value) {
      // const tempCitiesToAdd: CityType[] = value
      //   .filter(
      //     (id) =>
      //       id?.startsWith("temp-") &&
      //       !cities.some((city) => city?.cityId === id)
      //   )
      //   .map((id) => {
      //     const name = id.replace("temp-", "").replace(/-/g, " ");
      //     return {
      //       cityId: id,
      //       cityName: name.charAt(0).toUpperCase() + name.slice(1),
      //       cityValue: name,
      //       stateId,
      //     };
      //   });
      // if (tempCitiesToAdd.length > 0) {
      //   setCities((prev) => [...prev, ...tempCitiesToAdd]);
      // }
      // setSelectedCities((prev) => [
      //   ...prev,
      //   ...value.filter((id) => !prev.includes(id)),
      // ]);
    }
  }, [value, cities, stateId]);

  const handleSelectCity = (cityId: string) => {
    const isAlreadySelected = selectedCities.includes(cityId);

    if (!isAlreadySelected && selectedCities.length >= 10) {
      return toast({
        variant: "destructive",
        title: "Action Failed",
        description: "You can only select up to 10 serviceable areas.",
      });
    }

    const updatedSelected = isAlreadySelected
      ? selectedCities.filter((id) => id !== cityId)
      : [...selectedCities, cityId];
    setSelectedCities(updatedSelected);
    onChangeHandler(updatedSelected);
  };

  const handleCreateCity = (name: string) => {
    if (selectedCities.length >= 10)
      return toast({
        variant: "destructive",
        title: `Action Failed`,
        description: "You can only select up to 10 serviceable areas.",
      });
    const cityId = generateTempCityId(name);
    const newCity: CityType = {
      cityId,
      cityName: name,
      cityValue: name,
      stateId,
    };

    setCities((prev) => [newCity, ...prev]);
    setTemoraryCities((prev) => [newCity, ...prev]);
    const updatedSelected = [cityId, ...selectedCities];
    setSelectedCities(updatedSelected);
    onChangeHandler(updatedSelected);
    setSearchTerm("");
  };

  const handleDeleteCity = (cityId: string) => {
    setCities((prev) => prev.filter((c) => c.cityId !== cityId));
    setTemoraryCities((prev) => prev.filter((c) => c.cityId !== cityId));
    const updatedSelected = selectedCities.filter((id) => id !== cityId);
    setSelectedCities(updatedSelected);
    onChangeHandler(updatedSelected);
    if (editingCityId === cityId) {
      setEditingCityId(null);
    }
  };

  const filteredCities = cities.filter((city) =>
    city.cityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cityExists = filteredCities.some(
    (city) => city.cityName.toLowerCase() === searchTerm.toLowerCase()
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={false}
          disabled={isDisabled || isLoading || !stateId}
          className="justify-between w-full font-normal"
        >
          {!stateId
            ? "choose a state first"
            : isLoading
            ? "fetching cities..."
            : selectedCities.length > 0
            ? `${selectedCities.length} cities selected`
            : `Choose ${placeholder}`}
          <ChevronDown className="w-6 h-6 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:!w-96 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            value={searchTerm}
            placeholder={`Type to search or create ${placeholder}...`}
            onValueChange={(query) => setSearchTerm(query)}
          />
          <CommandList>
            {filteredCities.length === 0 && !cityExists ? (
              <CommandEmpty>
                <div className="p-2 text-sm">
                  No match found.
                  <br />
                  {!!searchTerm && !!isTempCreatable && (
                    <button
                      className="text-blue-600 underline mt-2"
                      onClick={() => handleCreateCity(searchTerm)}
                    >
                      Create & Select “{searchTerm}”
                    </button>
                  )}
                </div>
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredCities.map((city) => {
                  const isTemp = city.cityId.startsWith("temp-");
                  const isEditable = isTempEditable && isTemp;

                  return (
                    <CommandItem
                      key={city.cityId}
                      value={city.cityId}
                      onSelect={() => handleSelectCity(city.cityId)}
                      className="flex items-center justify-between gap-2 mt-1"
                    >
                      <div className="flex items-center gap-x-2">
                        <Checkbox
                          checked={selectedCities.includes(city.cityId)}
                          onCheckedChange={() => handleSelectCity(city.cityId)}
                          className="bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
                        />
                        {editingCityId === city.cityId ? (
                          <input
                            type="text"
                            value={editingCityName}
                            onChange={(e) => setEditingCityName(e.target.value)}
                            onBlur={() => {
                              setCities((prev) =>
                                prev.map((c) =>
                                  c.cityId === city.cityId
                                    ? {
                                        ...c,
                                        cityName: editingCityName,
                                        cityValue: editingCityName,
                                      }
                                    : c
                                )
                              );
                              setEditingCityId(null);
                            }}
                            autoFocus
                            className="border px-1 py-0.5 text-sm rounded"
                          />
                        ) : (
                          <span>{city.cityName}</span>
                        )}
                      </div>

                      {isEditable && (
                        <div className="flex items-center gap-x-1">
                          {editingCityId !== city.cityId && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCityId(city.cityId);
                                setEditingCityName(city.cityName);
                              }}
                              className="text-gray-500 hover:text-black"
                            >
                              ✏️
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCity(city.cityId);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CitiesDropdown;
