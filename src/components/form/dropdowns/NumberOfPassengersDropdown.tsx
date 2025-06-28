import { useEffect } from "react";
import SingleSelect from "../SingleSelect";

type NumberOfPassengersDropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  isDisabled?: boolean;
};

const NumberOfPassengersDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
}: NumberOfPassengersDropdownProps) => {
  const options = Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }));

  // select the first one by default
  useEffect(() => {
    if (!value) {
      onChangeHandler(options[0].value);
    }
  }, [value]);

  return (
    <SingleSelect
      value={value || options[0].value}
      onChange={onChangeHandler}
      placeholder="Select number of passengers"
      options={options}
      disabled={isDisabled}
    />
  );
};

export default NumberOfPassengersDropdown;
