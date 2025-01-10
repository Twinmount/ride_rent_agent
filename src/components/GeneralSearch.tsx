import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";

function GeneralSearch({
  placeholder = "search brand..",
  isBrandSearch = true,
}: {
  placeholder?: string;
  isBrandSearch?: boolean;
}) {
  const [searchValue, setSearchValue] = useState(""); // Update input value immediately
  const [searchParams, setSearchParams] = useSearchParams();
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  ); // Store timeout ID

  // Initialize search value from the URL if available when the component mounts
  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    setSearchValue(initialSearch); // Sync initial input value with URL
  }, [searchParams]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value); // Immediate input update

    // Clear previous timeout if it exists
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new timeout
    const timeoutId = setTimeout(() => {
      if (value) {
        setSearchParams({ search: value }); // Update URL with search value
      } else {
        searchParams.delete("search");
        setSearchParams(searchParams); // Remove search param if input is empty
      }
    }, 700); // 1000ms debounce delay

    setDebounceTimeout(timeoutId); // Save the new timeout ID
  };

  return (
    <div
      className={`flex flex-col justify-start w-full mt-1 max-w-[500px] gap-y-2 ${
        isBrandSearch ? "mb-8" : ""
      }`}
    >
      <div className="flex gap-x-1 justify-start items-center">
        <Input
          type="search"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="bg-white w-full h-[40px] focus-visible:ring-offset-0 placeholder:text-gray-500 rounded-2xl p-regular-16 px-4 py-3 border focus-visible:ring-transparent"
        />
      </div>
    </div>
  );
}

export default GeneralSearch;
