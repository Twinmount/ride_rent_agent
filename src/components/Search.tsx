import React, { useState, useEffect } from "react";

function Search({
  search,
  setSearch,
  placeholder = "Search vehicles...",
  description,
}: {
  search: string;
  setSearch: (value: string) => void;
  placeholder?: string;
  description?: React.ReactNode;
}) {
  const [inputValue, setInputValue] = useState(search); // Immediate input update
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  ); // Store timeout ID

  // Sync input value with parent state
  useEffect(() => {
    setInputValue(search); // Update input value if parent state changes
  }, [search]);

  // Handle input change with debounce logic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Immediate input update

    // Clear previous timeout if it exists
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new timeout
    const timeoutId = setTimeout(() => {
      setSearch(value); // Update parent state after debounce delay
    }, 1000); // 1000ms debounce delay

    setDebounceTimeout(timeoutId); // Save the new timeout ID
  };

  return (
    <div className="flex flex-col justify-start w-full  mb-4 max-w-[500px] gap-y-2">
      <div className="flex gap-x-1 justify-start items-center">
        <input
          type="search"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="bg-white w-full h-[40px] focus-visible:ring-offset-0 placeholder:text-gray-500 rounded-2xl p-regular-16 px-4 py-3 border focus-visible:ring-transparent"
        />
      </div>
      {description && <div>{description}</div>}
    </div>
  );
}

export default Search;
