import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type CustomerStatusDropdownProps = {
  status: string;
  setStatus: (status: string) => void;
};

export default function CustomerStatusDropdown({
  status,
  setStatus,
}: CustomerStatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="max-w-full">
        <Button
          variant="outline"
          className={`text-white bg-gray-800 hover:bg-gray-800 w-fit flex-center hover:text-white ${
            status === "REJECTED" && "bg-red-500 hover:bg-red-600"
          }`}
        >
          {status} <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[101] w-full max-w-full">
        <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
          <DropdownMenuRadioItem value="PENDING">Pending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="APPROVED">
            Approved
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="REJECTED">
            Rejected
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="UNDER_REVIEW">
            Under Review
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
