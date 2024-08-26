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
  placeholder = 'option',
  options,
  isDisabled = false,
  uniqueValue,
}: MultiSelectDropdownProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.length === 0) {
        const preSelectedValues = options
          .filter((option) => option.selected)
          .map((option) => option.name)

        onChangeHandler(preSelectedValues)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [])
  const handleCheckboxChange = (checkedValue: string, isChecked: boolean) => {
    const newValue = isChecked
      ? [...value, checkedValue]
      : value.filter((val) => val !== checkedValue)

    onChangeHandler(newValue)
  }

  return (
    <AccordionItem value={uniqueValue} className="mb-1">
      <AccordionTrigger
        disabled={isDisabled}
        className="px-2 overflow-hidden rounded-lg hover:no-underline bg-slate-100"
      >
        <div className="text-gray-500">
          Choose <span className="text-gray-800">{placeholder}</span> features{' '}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {options.length > 0 &&
          options.map((option) => (
            <FormItem
              key={option.name}
              className="flex items-center gap-2 mb-1"
            >
              <FormControl>
                <Checkbox
                  checked={value.includes(option.name)}
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
