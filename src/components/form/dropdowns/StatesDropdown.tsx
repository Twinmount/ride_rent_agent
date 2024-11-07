import { fetchAllStates } from '@/api/states'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

type StatesDropdownProps = {
  value?: string
  onChangeHandler: (value: string) => void
  placeholder?: string
  isDisabled?: boolean
}

type StateType = {
  stateId: string
  stateName: string
  stateValue: string
  countryId: string
  subHeading: string
  metaTitle: string
  metaDescription: string
  stateImage: any
}

const StatesDropdown = ({
  value,
  onChangeHandler,
  isDisabled = false,
}: StatesDropdownProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['states'],
    queryFn: () => fetchAllStates(),
  })

  const [states, setStates] = useState<StateType[]>([])

  useEffect(() => {
    if (data) {
      setStates(data.result)
    }
  }, [data])

  return (
    <Select
      onValueChange={onChangeHandler}
      defaultValue={value}
      disabled={isDisabled || isLoading}
    >
      <SelectTrigger className="select-field ring-0 focus:ring-0 input-fields">
        <SelectValue
          className="!font-bold !text-black"
          placeholder="Choose state"
        />
      </SelectTrigger>
      <SelectContent>
        {states.length > 0 &&
          states.map((state) => (
            <SelectItem
              key={state.stateId}
              value={state.stateId} // The value returned to the form
              className="select-item p-regular-14"
            >
              {state.stateName} {/* The name displayed in the UI */}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}

export default StatesDropdown
