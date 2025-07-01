import { Button } from "@/components/ui/button";
import Spinner from "@/components/general/Spinner";
import { getFormGenericButtonClass } from "@/helpers/form";

type Props = {
  text: string;
  isLoading: boolean;
  className?: string;
};

/**
 * FormSubmitButton
 *
 * typical form submit button with loading spinner
 */
export const FormSubmitButton = ({ text, isLoading, className }: Props) => {
  return (
    <FormGenericButton disabled={isLoading} className={className}>
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
  onClick,
  isLoading = false,
}: {
  children: React.ReactNode;
  type?: "submit" | "reset" | "button";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
}) => {
  const defaultClasses = getFormGenericButtonClass();
  return (
    <Button
      type={type}
      size="lg"
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${defaultClasses} ${className}`}
    >
      {children}
      {isLoading && <Spinner />}
    </Button>
  );
};
