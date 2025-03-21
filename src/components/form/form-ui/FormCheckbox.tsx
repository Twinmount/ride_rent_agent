import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  id: string;
  label: string | React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const FormCheckbox = ({ id, label, checked, onChange }: Props) => {
  return (
    <div className="mt-3 flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="h-5 w-5 bg-white data-[state=checked]:border-none data-[state=checked]:bg-yellow"
      />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
};
