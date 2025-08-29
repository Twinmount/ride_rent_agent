import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const countries: Country[] = [
    {
      countryId: "ee8a7c95-303d-4f55-bd6c-85063ff1cf48",
      countryName: "UAE",
      countryValue: "UAE",
    },
  ];

  const getPlaceholderText = () => {
    if (!countries.length) return "No countries found";
    return "Select country";
  };

  return (
    <Select onValueChange={onChangeHandler} value={value} disabled={isDisabled}>
      <SelectTrigger
        className={`select-field ring-0 focus:ring-0 input-fields ${
          isDisabled && "!opacity-60 !cursor-default"
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
