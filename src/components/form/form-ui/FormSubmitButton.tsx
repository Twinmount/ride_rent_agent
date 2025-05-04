import { Button } from "@/components/ui/button";
import Spinner from "@/components/general/Spinner";

type Props = {
  text: string;
  isLoading: boolean;
};

/**
 * FormSubmitButton
 *
 * typical form submit button with loading spinner
 */
export const FormSubmitButton = ({ text, isLoading }: Props) => {
  return (
    <FormGenericButton disabled={isLoading}>
      {text}
      {isLoading && <Spinner />}
    </FormGenericButton>
  );
};

/**
 * FormGenericButton
 *
 * generic button that can be used in forms with "disabled, children and optional className props"
 */
export const FormGenericButton = ({
  children,
  type = "submit",
  className,
  disabled = false,
}: {
  children: React.ReactNode;
  type?: "submit" | "reset" | "button";
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <Button
      type={type}
      size="lg"
      disabled={disabled}
      className={`flex-center button hover:bg-darkYellow active:scale-[0.97] duration-100 active:shadow-md transition-all  ease-out col-span-2 mx-auto w-full bg-yellow !text-lg !font-semibold md:w-10/12 lg:w-8/12 ${className}`}
    >
      {children}
    </Button>
  );
};
