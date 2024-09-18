import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormLabel, FormItem } from '@/components/ui/form'
import { useEffect } from 'react'

type MultiSelectDropdownProps = {
  value?: string[]
  onChangeHandler: (value: string[]) => void
  placeholder?: string
  options: { name: string; label: string; selected: boolean }[]
  isDisabled?: boolean
  uniqueValue: string
}

const MultiSelectDropdown = ({
  value = [],
  onChangeHandler,
  options,
  isDisabled = false,
  uniqueValue,
}: MultiSelectDropdownProps) => {
  useEffect(() => {
    // Pre-select the values on mount (for Update case)
    const timer = setTimeout(() => {
      if (value.length === 0) {
        const preSelectedValues = options
          .filter((option) => option.selected)
          .map((option) => option.name)

        onChangeHandler(preSelectedValues)
      }
    }, 1000)

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer)
  }, []) // Empty dependency array to run only on mount

  const handleCheckboxChange = (checkedValue: string, isChecked: boolean) => {
    // Modify the selected values based on checkbox interaction
    const newValue = isChecked
      ? [...value, checkedValue]
      : value.filter((val) => val !== checkedValue)

    onChangeHandler(newValue) // Call the handler to update form value
  }
  return (
    <AccordionItem value={uniqueValue} className="pb-2 mb-2 border-none">
      <AccordionTrigger
        disabled={isDisabled}
        className="px-2 overflow-hidden bg-white border rounded-lg hover:no-underline"
      >
        <div className="text-gray-500">
          {value.length > 0
            ? `${value.length} features selected`
            : 'Choose features'}
        </div>
      </AccordionTrigger>
      <AccordionContent className="overflow-y-auto max-h-96 bg-slate-50">
        {options.length > 0 &&
          options.map((option) => (
            <FormItem
              key={option.name}
              className="flex items-center gap-2 mb-1"
            >
              <FormControl>
                <Checkbox
                  checked={value.includes(option.name)} // Set checkbox state based on selected values
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(option.name, checked as boolean)
                  }
                  className="bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none mt-2"
                />
              </FormControl>
              <FormLabel className="">{option.label}</FormLabel>
            </FormItem>
          ))}
      </AccordionContent>
    </AccordionItem>
  )
}

export default MultiSelectDropdown
