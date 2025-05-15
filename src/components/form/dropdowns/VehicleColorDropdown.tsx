import SingleSelect from "../SingleSelect";

type VehicleColorDropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  isDisabled?: boolean;
};

const VehicleColorDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
}: VehicleColorDropdownProps) => {
  const colorOptions = [
    { label: "White", value: "white" },
    { label: "Black", value: "black" },
    { label: "Silver", value: "silver" },
    { label: "Blue", value: "blue" },
    { label: "Red", value: "red" },
    { label: "Green", value: "green" },
    { label: "Yellow", value: "yellow" },
    { label: "Grey", value: "grey" },
    { label: "Brown", value: "brown" },
    { label: "Gold", value: "gold" },
    { label: "Other", value: "other" },
  ];

  return (
    <SingleSelect
      value={value}
      onChange={onChangeHandler}
      placeholder="Select vehicle color"
      options={colorOptions}
      disabled={isDisabled}
    />
  );
};

export default VehicleColorDropdown;
