import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OptionType = {
  label: string;
  value: string;
};

type SingleSelectProps = {
  value?: string;
  placeholder?: string;
  options: OptionType[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

const SingleSelect = ({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  disabled = false,
}: SingleSelectProps) => {
  return (
    <Select onValueChange={onChange} defaultValue={value} disabled={disabled}>
      <SelectTrigger className="ring-0 select-field focus:ring-0 input-fields">
        <SelectValue
          placeholder={placeholder}
          className="!font-bold !text-black"
        />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="select-item p-regular-14"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SingleSelect;
