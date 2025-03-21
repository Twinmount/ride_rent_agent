import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormField } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { SRMCustomerDetailsFormDefaultValues } from "@/constants";
import { SRMCustomerDetailsFormSchema } from "@/lib/validator";
import { CustomerType, SRMCustomerDetailsFormType } from "@/types/srm-types";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { deleteMultipleFiles } from "@/helpers/form";
import { toast } from "@/components/ui/use-toast";
import { GcsFilePaths } from "@/constants/enum";
import SingleFileUpload from "../file-uploads/SingleFileUpload";
import {
  addCustomerDetails,
  createCustomerBooking,
} from "@/api/srm/srmFormApi";
import NationalityDropdown from "../dropdowns/NationalityDropdown";
import CustomerSearchAndAutoFill from "../dropdowns/CustomerSearchAndAutoFill";

import { useFormValidationToast } from "@/hooks/useFormValidationToast";
import { handleCustomerSelect } from "@/helpers";
import { FormFieldLayout } from "../form-ui/FormFieldLayout";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { FormContainer } from "../form-ui/FormContainer";

type SRMCustomerDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMCustomerDetailsFormType | null;
  onNextTab?: () => void;
};

export default function SRMCustomerDetailsForm({
  type,
  onNextTab,
  formData,
}: SRMCustomerDetailsFormProps) {
  const [countryCode, setCountryCode] = useState<string>("");
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [currentProfilePic, setCurrentProfilePic] = useState<string | null>(
    formData?.customerProfilePic || null
  );
  const [existingCustomerId, setExistingCustomerId] = useState<string | null>(
    null
  );

  //  initial default values for the form
  const initialValues =
    formData && type === "Update"
      ? formData
      : SRMCustomerDetailsFormDefaultValues;

  // Define your form.
  const form = useForm<z.infer<typeof SRMCustomerDetailsFormSchema>>({
    resolver: zodResolver(SRMCustomerDetailsFormSchema),
    defaultValues: initialValues as SRMCustomerDetailsFormType,
  });

  // Handle existing customer booking
  const handleExistingCustomerBooking = async (customerId: string) => {
    const bookingResponse = await createCustomerBooking(customerId);
    const bookingId = bookingResponse.result.bookingId;
    sessionStorage.setItem("bookingId", bookingId);
    return bookingResponse;
  };

  // Handle new customer creation and booking
  const handleNewCustomerBooking = async (
    values: SRMCustomerDetailsFormType,
    countryCode: string
  ) => {
    const customerData = await addCustomerDetails(values, countryCode);
    const customerId = customerData.result.customerId;

    const bookingResponse = await createCustomerBooking(customerId);
    const bookingId = bookingResponse.result.bookingId;
    sessionStorage.setItem("bookingId", bookingId);

    return bookingResponse;
  };

  // Define a submit handler.
  async function onSubmit(
    values: z.infer<typeof SRMCustomerDetailsFormSchema>
  ) {
    if (isFileUploading) {
      toast({
        title: "File Upload in Progress",
        description:
          "Please wait until the file upload completes before submitting the form.",
        duration: 3000,
        className: "bg-orange",
      });
      return;
    }

    try {
      let data;

      if (type === "Add") {
        if (existingCustomerId) {
          // Handle existing customer booking
          data = await handleExistingCustomerBooking(existingCustomerId);
        } else {
          // Handle new customer booking
          data = await handleNewCustomerBooking(values, countryCode);
        }
      }

      if (data) {
        await deleteMultipleFiles(deletedFiles);
        toast({
          title: `Customer ${type.toLowerCase()} successful`,
          className: "bg-yellow text-white",
        });

        if (type === "Add" && onNextTab) {
          onNextTab();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${type} Customer failed`,
        description: "Something went wrong",
      });
      console.error(error);
    }
  }

  // custom hook to validate form
  useFormValidationToast(form);

  // Handle selecting an existing customer from the results
  const onCustomerSelect = (
    customerName: string,
    customerData: CustomerType | null
  ) => {
    // helper function to handle customer selection
    handleCustomerSelect(
      form,
      customerName,
      customerData,
      setExistingCustomerId,
      setCurrentProfilePic,
      setCountryCode
    );
  };

  return (
    <>
      {/* Form container */}
      <Form {...form}>
        <FormContainer
          onSubmit={form.handleSubmit(onSubmit)}
          description={
            <p className="text-sm italic text-center text-gray-600">
              Add customer details here. You can choose existing customer
              &#40;if any&#41; by searching customer name
            </p>
          }
          className="mt-4"
        >
          {/* customer name */}
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormFieldLayout
                label="Customer Name"
                description="  Provide customer name. You can search existing customer
                      also."
              >
                <CustomerSearchAndAutoFill
                  value={field.value}
                  onChangeHandler={onCustomerSelect}
                  placeholder="Enter / Search customer name"
                />
              </FormFieldLayout>
            )}
          />

          {/* user profile */}
          <FormField
            control={form.control}
            name="customerProfilePic"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="Customer Profile "
                description="Customer profile can have a maximum size of 5MB."
                existingFile={currentProfilePic}
                maxSizeMB={5}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.IMAGE}
                isDownloadable={true}
                downloadFileName={"user profile"}
                setDeletedImages={setDeletedFiles}
                additionalClasses="w-[18rem]"
                isDisabled={!!existingCustomerId}
              />
            )}
          />

          {/* Nationality */}
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormFieldLayout
                label="Nationality"
                description="Select customer's nationality"
              >
                <NationalityDropdown
                  value={field.value}
                  onChangeHandler={field.onChange}
                  isDisabled={!!existingCustomerId}
                />
              </FormFieldLayout>
            )}
          />

          {/* Passport Number */}
          <FormField
            control={form.control}
            name="passportNumber"
            render={({ field }) => (
              <FormFieldLayout
                label="Passport Number"
                description="Enter customers passport number"
              >
                <Input
                  placeholder="Enter passport number"
                  {...field}
                  className="input-field"
                  readOnly={!!existingCustomerId}
                />
              </FormFieldLayout>
            )}
          />

          {/* Driving License Number */}
          <FormField
            control={form.control}
            name="drivingLicenseNumber"
            render={({ field }) => (
              <FormFieldLayout
                label="Passport Number"
                description="Enter customers driving license number"
              >
                <Input
                  placeholder="Enter driving license number"
                  {...field}
                  className="input-field"
                  readOnly={!!existingCustomerId}
                />
              </FormFieldLayout>
            )}
          />

          {/* mobile */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormFieldLayout
                label="Mobile Number"
                description="Enter the contact details of the customer"
              >
                <PhoneInput
                  defaultCountry="ae"
                  value={field.value}
                  onChange={(value, country) => {
                    field.onChange(value);
                    setCountryCode(country.country.dialCode);
                  }}
                  className="flex items-center"
                  inputClassName="input-field !w-full !text-base"
                  countrySelectorStyleProps={{
                    className:
                      "bg-white !border-none outline-none !rounded-xl  mr-1",
                    style: {
                      border: "none ",
                    },
                    buttonClassName:
                      "!border-none outline-none !h-[52px] !w-[50px] !rounded-xl !bg-gray-100",
                  }}
                  disabled={!!existingCustomerId}
                />
              </FormFieldLayout>
            )}
          />

          {/* submit  */}
          <FormSubmitButton
            text={type === "Add" ? "Continue to Vehicle" : "Update User"}
            isLoading={form.formState.isSubmitting}
          />
        </FormContainer>
      </Form>
    </>
  );
}
