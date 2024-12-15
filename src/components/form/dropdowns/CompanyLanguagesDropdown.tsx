import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

type LanguagesDropdownProps = {
  value: string[];
  onChangeHandler: (value: string[]) => void;
  placeholder?: string;
};

const languages = [
  "English",
  "French",
  "Russian",
  "Arabic",
  "Greek",
  "Spanish",
  "Armenian",
  "Hindi",
  "Turkish",
  "Azerbaijani",
  "Italian",
  "Urdu",
  "Danish",
  "Japanese",
  "Chinese",
  "Dutch",
  "Latin",
  "German",
  "Filipino",
  "Polish",
];

const CompanyLanguagesDropdown = ({
  value = [],
  onChangeHandler,
  placeholder = "Languages",
}: LanguagesDropdownProps) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(value);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelectedLanguages(value);
  }, [value]);

  const handleSelectLanguage = (language: string) => {
    let updatedSelectedLanguages: string[];
    if (selectedLanguages.includes(language)) {
      updatedSelectedLanguages = selectedLanguages.filter(
        (lang) => lang !== language
      );
    } else {
      updatedSelectedLanguages = [...selectedLanguages, language];
    }
    setSelectedLanguages(updatedSelectedLanguages);
    onChangeHandler(updatedSelectedLanguages);
  };

  const filteredLanguages = languages.filter((language) =>
    language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
        >
          {selectedLanguages.length > 0
            ? `${selectedLanguages.length} ${placeholder} selected`
            : `Choose ${placeholder}`}
          <ChevronDown className="w-6 h-6 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:w-96 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder}...`}
            onValueChange={(query) => setSearchTerm(query)}
          />
          <CommandList>
            {filteredLanguages.length === 0 ? (
              <CommandEmpty>No {placeholder} found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredLanguages.map((language) => (
                  <CommandItem
                    key={language}
                    onSelect={() => handleSelectLanguage(language)}
                    className="flex items-center mt-1 gap-x-2"
                  >
                    <Checkbox
                      checked={selectedLanguages.includes(language)}
                      onCheckedChange={() => handleSelectLanguage(language)}
                      className="bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
                    />
                    {language}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CompanyLanguagesDropdown;
