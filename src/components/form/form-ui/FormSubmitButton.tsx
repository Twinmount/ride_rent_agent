import { Button } from "@/components/ui/button";
import Spinner from "@/components/general/Spinner";

type Props = {
  text: string;
  isLoading: boolean;
};

export const FormSubmitButton = ({ text, isLoading }: Props) => {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={isLoading}
      className="flex-center button hover:bg-darkYellow col-span-2 mx-auto mt-3 w-full bg-yellow !text-lg !font-semibold md:w-10/12 lg:w-8/12"
    >
      {text}
      {isLoading && <Spinner />}
    </Button>
  );
};
