import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UseFormReturn } from "react-hook-form";

export const useValidationToast = (form: UseFormReturn<any, any>) => {
  const { toast } = useToast();

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please make sure required values are provided",
      });
      window.scrollTo({ top: 65, behavior: "smooth" });
    }
  }, [form.formState.errors, toast]);
};
