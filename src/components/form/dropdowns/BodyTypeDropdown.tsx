import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BODY_TYPES } from "@/constants";

type BodyTypeDropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
};

const BodyTypeDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
  placeholder = "Select body type",
}: BodyTypeDropdownProps) => {
  const assetUrl = import.meta.env.VITE_ASSET_URL;

  return (
    <Select onValueChange={onChangeHandler} value={value} disabled={isDisabled}>
      <SelectTrigger className="ring-0 select-field focus:ring-0 input-fields">
        <SelectValue
          placeholder={placeholder}
          className="!font-bold !text-black"
        />
      </SelectTrigger>

      <SelectContent className="overflow-y-auto">
        {BODY_TYPES.map((bodyType) => (
          <SelectItem
            key={bodyType.value}
            value={bodyType.value}
            className="flex items-center justify-start gap-3 p-regular-14 "
          >
            <div className="flex items-center gap-3">
              <img
                src={`/icon.png`}
                alt={bodyType.label}
                className="w-12 h-12 object-contain rounded-xl"
              />
              {/* <img
              src={`${assetUrl}/srm/body-type/${bodyType.value}.png`}
              alt={bodyType.label}
              className="w-6 h-6 object-contain"
            /> */}
              <span>{bodyType.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BodyTypeDropdown;
