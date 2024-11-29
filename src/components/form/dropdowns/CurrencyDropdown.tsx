import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CurrencyDropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
};

const CurrencyDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
}: CurrencyDropdownProps) => {
  const handleChange = (selectedValue: string) => {
    onChangeHandler(selectedValue);
  };

  const currencies = [
    { label: "United Arab Emirates Dirham (AED)", value: "AED" },
    { label: "United States Dollar (USD)", value: "USD" },
    { label: "Indian Rupee (INR)", value: "INR" },
    { label: "Euro (EUR)", value: "EUR" },
  ];

  return (
    <Select
      onValueChange={handleChange}
      defaultValue={value}
      disabled={isDisabled}
    >
      <SelectTrigger className="ring-0 select-field focus:ring-0 input-fields">
        <SelectValue
          className="!font-bold !text-black"
          placeholder="Choose currency"
        />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value} // The value returned to the form
            className="select-item p-regular-14"
          >
            {option.label} {/* The name displayed in the UI */}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencyDropdown;
