import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type NationalityDropdownProps = {
  value?: string; // The currently selected "name" of the country
  onChangeHandler: (name: string) => void; // Callback with the selected "name"
  placeholder?: string;
  isDisabled?: boolean;
};

type NationalityType = {
  name: string; // Name of the country (contains the flag as well)
  value: string; // Internal code of the country
};

const NationalityDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
  placeholder = "Select nationality...",
}: NationalityDropdownProps) => {
  const [nationalities, setNationalities] = React.useState<NationalityType[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  React.useEffect(() => {
    const fetchNationalities = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
        );
        const data = await response.json();
        const formattedData = data.countries.map((country: any) => ({
          name: country.label, // Name contains the flag and label
          value: country.value, // Value is the internal code
        }));
        setNationalities(formattedData);
        setError(null); // Reset error if successful
      } catch (err) {
        setError("Failed to load countries. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNationalities();
  }, []);

  const filteredNationalities = nationalities.filter((nationality) =>
    nationality.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="ring-0 select-field focus:ring-0 input-fields w-full justify-between text-gray-600"
          disabled={isDisabled || isLoading}
        >
          {value || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-w-full p-0">
        {isLoading ? (
          <div className="p-2 text-sm text-center">Loading countries...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : (
          <Command>
            <input
              placeholder="Search nationality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ring-0 focus:ring-0 border-none outline-none h-10 w-full px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <CommandList>
              <CommandEmpty>No nationality found.</CommandEmpty>
              <CommandGroup>
                {filteredNationalities.map((nationality) => (
                  <CommandItem
                    key={nationality.name}
                    value={nationality.name}
                    onSelect={(currentValue) => {
                      const selectedName =
                        currentValue === value ? "" : currentValue;
                      onChangeHandler(selectedName); // Pass "name" to the handler
                      setOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    {nationality.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === nationality.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NationalityDropdown;
