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
import { addTaxInfo, updateTaxInfo } from "@/api/srm";

type SRMCustomerDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMTaxInfoFormType | null;
};

export default function TaxInfoForm({
  type,
  formData,
}: SRMCustomerDetailsFormProps) {
  const navigate = useNavigate();

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
      let data;

      if (type === "Add") {
        // Handle existing customer booking
        data = await addTaxInfo(values.countryId, values.taxNumber);
      } else {
        // Handle new customer booking
        data = await updateTaxInfo(values.countryId, values.taxNumber, "124");
      }

      if (data) {
        toast({
          title: `Customer ${type.toLowerCase()} successful`,
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
        title: `${type} Customer failed`,
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
                label="Passport Number"
                description="Enter customers passport number"
              >
                <Input
                  placeholder="Enter passport number"
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
