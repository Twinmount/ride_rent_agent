import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface YearPickerProps {
  value?: string
  onChangeHandler?: (value: string) => void
  placeholder?: string
  isDisabled?: boolean
}

export default function YearPicker({
  value,
  onChangeHandler,
  placeholder = 'year',
  isDisabled = false,
}: YearPickerProps) {
  const [selectedValue, setSelectedValue] = useState(value || '')
  const [searchTerm, setSearchTerm] = useState('')

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1899 }, (_, i) =>
    (currentYear - i).toString()
  )

  const filteredYears = years.filter((year) => year.includes(searchTerm))

  const handleSelect = (currentValue: string) => {
    setSelectedValue(currentValue)
    if (onChangeHandler) onChangeHandler(currentValue)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={false}
          disabled={isDisabled}
          className="justify-between w-full font-normal"
        >
          {selectedValue || `Choose ${placeholder}`}
          <ChevronDown className="w-6 h-6 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:!w-96 p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder}...`}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {filteredYears.length === 0 ? (
              <CommandEmpty>No {placeholder} found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredYears.map((year) => (
                  <CommandItem
                    key={year}
                    value={year}
                    onSelect={() => handleSelect(year)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedValue === year ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {year}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
