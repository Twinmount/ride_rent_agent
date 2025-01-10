import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchAllCategories } from "@/api/vehicle-categories";

type CategoryDropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  setIsCarsCategory?: (isCars: boolean) => void;
  setHideCommercialLicenses?: (value: boolean) => void;
};

type CategoryType = {
  categoryId: string;
  name: string;
  value: string;
};

const CategoryDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
  setIsCarsCategory,
  setHideCommercialLicenses,
}: CategoryDropdownProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAllCategories({ page: 1, limit: 20, sortOrder: "ASC" }),
  });

  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    if (data) {
      setCategories(data.result.list);
    }
  }, [data]);

  // Set isCarsCategory and hideCommercialLicenses based on the initial value
  useEffect(() => {
    if (value && categories.length > 0) {
      const selectedCategory = categories.find(
        (category) => category.categoryId === value
      );
      setIsCarsCategory?.(selectedCategory?.value === "cars");
      setHideCommercialLicenses?.(
        ["bicycles", "buggies"].includes(selectedCategory?.value || "")
      );
    }
  }, [value, categories, setIsCarsCategory, setHideCommercialLicenses]);

  const handleChange = (selectedCategoryId: string) => {
    onChangeHandler(selectedCategoryId);

    // Find the selected category object
    const selectedCategory = categories.find(
      (category) => category.categoryId === selectedCategoryId
    );

    // Update states based on the selected category
    setIsCarsCategory?.(selectedCategory?.value === "cars");
    setHideCommercialLicenses?.(
      ["bicycles", "buggies"].includes(selectedCategory?.value || "")
    );
  };

  return (
    <Select
      onValueChange={handleChange}
      defaultValue={value}
      disabled={isDisabled || isLoading}
    >
      <SelectTrigger className="ring-0 select-field focus:ring-0 input-fields">
        <SelectValue
          className="!font-bold !text-black"
          placeholder="Choose category"
        />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem
              key={category.categoryId}
              value={category.categoryId} // The value returned to the form
              className="select-item p-regular-14"
            >
              {category.name} {/* The name displayed in the UI */}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryDropdown;
