"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type SRMCountryDropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
};

type Country = {
  countryId: string;
  countryName: string;
  countryValue: string;
};

const SRMCountryDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
}: SRMCountryDropdownProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["country"],
    queryFn: () => {},
  });
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    if (data) {
      setCountries(data.result);
    }
  }, [data]);

  const getPlaceholderText = () => {
    if (isLoading) return "Fetching countries...";
    if (!countries.length) return "No countries found";
    return "Select country";
  };

  return (
    <Select
      onValueChange={onChangeHandler}
      value={value}
      disabled={isDisabled || isLoading}
    >
      <SelectTrigger
        className={`select-field ring-0 focus:ring-0 input-fields ${
          (isDisabled || isLoading) && "!opacity-60 !cursor-default"
        }`}
      >
        <SelectValue
          className="!font-bold !text-black"
          placeholder={getPlaceholderText()}
        />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem
            key={country.countryId}
            value={country.countryId}
            className="select-item p-regular-14"
          >
            {country.countryName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SRMCountryDropdown;
