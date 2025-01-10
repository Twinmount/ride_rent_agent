import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

type Limit = 10 | 15 | 20 | 30

interface LimitDropdownProps {
  limit: Limit
  setLimit: (value: Limit) => void
  isLoading: boolean
}

export function LimitDropdown({
  limit,
  setLimit,
  isLoading,
}: LimitDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button variant="outline" className="shadow-lg">
          Limit: {limit} <ChevronDown size={17} className="my-auto ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuLabel>Select Limit</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={limit.toString()}
          onValueChange={(value) => setLimit(Number(value) as Limit)} // Type assertion here
        >
          <DropdownMenuRadioItem value="10">10</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="15">15</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="20">20</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="30">30</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
