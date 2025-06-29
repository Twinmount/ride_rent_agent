import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormField } from "@/components/ui/form";

import { SRMContractFormDefaultValues } from "@/constants";
import { SRMContractFormSchema } from "@/lib/validator";
import { SRMContractFormType } from "@/types/srm-types";
import { toast } from "@/components/ui/use-toast";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { FormContainer } from "../form-ui/FormContainer";
import { useNavigate } from "react-router-dom";
import { updateSRMUserTaxAndContractInfo } from "@/api/srm";
import SRMContractTextEditor from "../SRMContractTextEditor";

type FormProps = {
  type: "Add" | "Update";
  formData?: SRMContractFormType | null;
};

export default function SRMContractForm({ type, formData }: FormProps) {
  const navigate = useNavigate();

  //  initial default values for the form
  const initialValues =
    formData && type === "Update" ? formData : SRMContractFormDefaultValues;

  // Define your form.
  const form = useForm<z.infer<typeof SRMContractFormSchema>>({
    resolver: zodResolver(SRMContractFormSchema),
    defaultValues: initialValues as SRMContractFormType,
  });

  // Handle existing customer booking

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof SRMContractFormSchema>) {
    try {
      let data = await updateSRMUserTaxAndContractInfo({
        termsNCondition: values.contractContent,
      });

      if (data) {
        toast({
          title: `Contract ${type.toLowerCase()} successful`,
          className: "bg-yellow text-white",
        });

        // if (isPublic && type === "Add") {
        //   navigate("/srm/customer-details/public/success");
        // } else if (type === "Add" && onNextTab) {
        //   onNextTab();
        //   window.scrollTo({ top: 0, behavior: "smooth" });
        // }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${type} Contract failed`,
        description: "Something went wrong",
      });
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Form container */}
      <Form {...form}>
        <FormContainer
          onSubmit={form.handleSubmit(onSubmit)}
          description={
            <p className="text-sm italic text-center text-gray-600">
              Before you begin, please provide your country and tax information.
            </p>
          }
          className="mt-4"
        >
          <FormField
            control={form.control}
            name="contractContent"
            render={({ field }) => (
              <SRMContractTextEditor
                content={field.value}
                onUpdate={(updatedContent) => field.onChange(updatedContent)}
              />
            )}
          />

          {/* submit  */}
          <FormSubmitButton
            text={type === "Add" ? "Submit & Continue" : "Update Info"}
            isLoading={form.formState.isSubmitting}
          />
        </FormContainer>
      </Form>
    </div>
  );
}
