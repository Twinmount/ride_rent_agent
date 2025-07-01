import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormField } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { SRMTaxInfoFormDefaultValues } from "@/constants";
import { SRMTaxInfoFormSchema } from "@/lib/validator";
import { SRMTaxInfoFormType } from "@/types/srm-types";
import { toast } from "@/components/ui/use-toast";
import { FormFieldLayout } from "../form-ui/FormFieldLayout";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { FormContainer } from "../form-ui/FormContainer";
import { useNavigate } from "react-router-dom";
import SRMCountryDropdown from "../dropdowns/SRMCountryDropdown";
import { updateSRMUserTaxAndContractInfo } from "@/api/srm";
import { useQueryClient } from "@tanstack/react-query";

type FormProps = {
  type: "Add" | "Update";
  formData?: SRMTaxInfoFormType | null;
};

export default function TaxInfoForm({ type, formData }: FormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //  initial default values for the form
  const initialValues =
    formData && type === "Update" ? formData : SRMTaxInfoFormDefaultValues;

  // Define your form.
  const form = useForm<z.infer<typeof SRMTaxInfoFormSchema>>({
    resolver: zodResolver(SRMTaxInfoFormSchema),
    defaultValues: initialValues as SRMTaxInfoFormType,
  });

  // Handle existing customer booking

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof SRMTaxInfoFormSchema>) {
    try {
      let data = await updateSRMUserTaxAndContractInfo({
        country: values.countryId,
        taxNumber: values.taxNumber,
      });

      queryClient.invalidateQueries({
        queryKey: ["srm-onboarding-status"],
      });

      queryClient.invalidateQueries({
        queryKey: ["srm-contract"],
      });

      if (data) {
        toast({
          title: `Tax Info ${type.toLowerCase()} successful`,
          className: "bg-yellow text-white",
        });

        if (type === "Add") {
          navigate("/srm/contract");
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${type} Tax info failed`,
        description: "Something went wrong",
      });
      console.error(error);
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["srm-onboarding-status"],
      });
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
          {/* customer name */}

          {/* Nationality */}
          <FormField
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormFieldLayout
                label="Country"
                description="Select your operating country"
              >
                <SRMCountryDropdown
                  value={field.value}
                  onChangeHandler={field.onChange}
                  isDisabled={false} // or dynamic if needed
                />
              </FormFieldLayout>
            )}
          />

          {/* Passport Number */}
          <FormField
            control={form.control}
            name="taxNumber"
            render={({ field }) => (
              <FormFieldLayout
                label="Tax Number"
                description="Enter tax number"
              >
                <Input
                  placeholder="Enter tax number"
                  {...field}
                  className="input-field"
                />
              </FormFieldLayout>
            )}
          />

          {/* submit  */}

          <FormSubmitButton
            text={type === "Add" ? "Continue to Contract Info" : "Update Info"}
            isLoading={form.formState.isSubmitting}
          />
        </FormContainer>
      </Form>
    </div>
  );
}
