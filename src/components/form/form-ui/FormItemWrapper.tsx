import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  label: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * FormItemWrapper is a styled component that wraps a form item with a label and form control.
 *
 * @param {React.ReactNode} label - The label to display
 * @param {React.ReactNode} [description] - An optional description to display
 * @param {React.ReactNode} children - The form control to display
 * @returns {JSX.Element} A JSX element containing the form item
 */
export const FormItemUIWrapper = ({ label, description, children }: Props) => {
  return (
    <FormItem className="mb-2 flex w-full max-sm:flex-col">
      <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base font-semibold lg:text-lg">
        {label} <span className="mr-5 max-sm:hidden">:</span>
      </FormLabel>
      <div className="w-full flex-col items-start">
        <FormControl>{children}</FormControl>
        {description && (
          <FormDescription className="ml-2">{description}</FormDescription>
        )}
        <FormMessage className="ml-2" />
      </div>
    </FormItem>
  );
};
