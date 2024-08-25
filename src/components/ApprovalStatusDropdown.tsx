import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

type ApprovalStatusType = 'APPROVED' | 'UNDER_REVIEW' | 'REJECTED' | 'PENDING'

const approvalStatuses = [
  { value: 'APPROVED', label: 'Live Vehicles' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'REJECTED', label: 'Rejected Vehicles' },
  { value: 'PENDING', label: 'Pending Completion' },
]

interface ApprovalStatusDropdownProps {
  approvalStatus: ApprovalStatusType
  onStatusChange: (status: ApprovalStatusType) => void
}

export default function ApprovalStatusDropdown({
  approvalStatus,
  onStatusChange,
}: ApprovalStatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="border-0 outline-none focus:outline-none ring-0 focus:ring-0'"
      >
        <div className="px-3 py-2 border-none rounded-lg outline-none cursor-pointer text-yellow bg-slate-900 flex-center focus:outline-none w-fit whitespace-nowrap ring-0 focus:ring-0">
          {approvalStatuses.find((status) => status.value === approvalStatus)
            ?.label || 'Select Status'}{' '}
          <ChevronDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Approval Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={approvalStatus}
          onValueChange={(value) => onStatusChange(value as ApprovalStatusType)}
        >
          {approvalStatuses.map((status) => (
            <DropdownMenuRadioItem key={status.value} value={status.value}>
              {status.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
