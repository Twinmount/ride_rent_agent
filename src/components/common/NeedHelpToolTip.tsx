import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type TooltipTypes = {
  trigger?: string;
  content?: string;
};
export default function NeedHelpToolTip({
  trigger = "change?",
  content = "Contact Support to Change",
}: TooltipTypes) {
  return (
    <Popover>
      <PopoverTrigger className="ml-auto text-blue-400 w-fit">
        <span className="text-sm text-right">{trigger}</span>
      </PopoverTrigger>
      <PopoverContent className="p-1 px-2 text-sm text-white rounded-xl shadow-md bg-slate-900">
        {content}
      </PopoverContent>
    </Popover>
  );
}
