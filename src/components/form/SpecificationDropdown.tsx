import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type DropdownProps = {
  value?: string
  onChangeHandler: (value: string) => void
  options: { label: string; value: string }[]
  isDisabled?: boolean
}

const SpecificationDropdown = ({
  value,
  onChangeHandler,
  options,
  isDisabled = false,
}: DropdownProps) => {
  return (
    <Select onValueChange={onChangeHandler} value={value} disabled={isDisabled}>
      <SelectTrigger className="select-field ring-0 focus:ring-0 input-fields">
        <SelectValue
          className="!font-bold !text-black"
          placeholder={`Choose option`}
        />
      </SelectTrigger>
      <SelectContent>
        {options.length > 0 &&
          options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="select-item p-regular-14"
            >
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}

export default SpecificationDropdown
