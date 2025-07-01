// core styles are required for all packages
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RichTextEditorComponent from "./RichTextEditorComponent";

interface SRMContractTextEditorProps {
  content?: string;
  onUpdate: (content: string) => void;
}

export default function SRMContractTextEditor({
  content = "",
  onUpdate,
}: SRMContractTextEditorProps) {
  return (
    <FormItem className="flex flex-col w-full mb-2 max-sm:flex-col">
      <FormLabel className="w-full mt-4 ml-2 text-lg font-semibold text-left ">
        Contract
      </FormLabel>
      <FormDescription className="w-full ml-2">
        Please enter the contract details
      </FormDescription>
      <FormControl>
        {/* Render the RichTextEditor component */}
        <RichTextEditorComponent content={content} onUpdate={onUpdate} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
