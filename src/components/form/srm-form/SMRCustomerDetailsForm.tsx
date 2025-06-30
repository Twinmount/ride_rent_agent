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
import { createCustomer, updateCustomerBooking } from "@/api/srm/srmFormApi";
import NationalityDropdown from "../dropdowns/NationalityDropdown";
import CustomerSearchAndAutoFill from "../dropdowns/CustomerSearchAndAutoFill";

import { useFormValidationToast } from "@/hooks/useFormValidationToast";
import { handleCustomerSelect } from "@/helpers";
import { FormFieldLayout } from "../form-ui/FormFieldLayout";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { FormContainer } from "../form-ui/FormContainer";
import CustomerLinkShareFormDialog from "@/components/dialog/CustomerLinkShareFormDialog";
import MultipleFileUpload from "../file-uploads/MultipleFileUpload";

type SRMCustomerDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMCustomerDetailsFormType | null;
  isAddOrIncomplete?: boolean;
  onNextTab?: () => void;
};

export default function SRMCustomerDetailsForm({
  type,
  onNextTab,
  formData,
  isAddOrIncomplete,
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

  const bookingId = sessionStorage.getItem("bookingId") || "";

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

  // Update the existing srm booking for the customer data
  const handleExistingCustomerBooking = async (customerId: string) => {
    console.log(
      "handleExistingCustomerBooking: updating srm customer booking ..."
    );
    const bookingResponse = await updateCustomerBooking(customerId, bookingId);

    console.log("customer booking updated : ...", bookingResponse);
    return bookingResponse;
  };

  /**
   * If there is no existing customer, create a new customer and update the srm customer booking
   */
  const handleNewCustomerBooking = async (
    values: SRMCustomerDetailsFormType,
    countryCode: string
  ) => {
    console.log("handle new customer booking function ...");
    console.log("customer is getting created ...");
    // create new customer
    const customerData = await createCustomer(values, countryCode);
    const customerId = customerData.result.customerId;

    console.log("customer created : ...", customerData);

    console.log("updating srm customer booking ...");
    // update srm customer booking
    const bookingResponse = await updateCustomerBooking(customerId, bookingId);

    console.log("customer booking updated : ...", bookingResponse);
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

      if (type === "Add" || isAddOrIncomplete) {
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
    } catch (error: any) {
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.error?.message === "Customer already exists"
      ) {
        toast({
          variant: "destructive",
          title: "Customer Already Exists",
          description:
            "A customer with the same passport / driving license / phone number is already registered.",
          duration: 5000,
        });
      } else {
        toast({
          variant: "destructive",
          title: `${type} Customer failed`,
          description: "Something went wrong",
        });
      }
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

  // FIELDS DISABLED IF THE TYPE === UPDATE
  const isFieldsDisabled = type === "Update";

  // submit button text
  const submitButtonText = type === "Add" ? "Add Customer" : "Update Customer";

  return (
    <div className="flex flex-col">
      {type === "Add" && <CustomerLinkShareFormDialog />}
      {/* Form container */}
      <Form {...form}>
        <FormContainer
          onSubmit={form.handleSubmit(onSubmit)}
          description={
            <p className="text-sm italic text-center text-gray-600">
              Add customer details here. You can choose existing customer (if
              any) by searching customer name
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
                description={
                  "Provide customer name. You can search existing customer also."
                }
              >
                <CustomerSearchAndAutoFill
                  value={field.value}
                  onChangeHandler={onCustomerSelect}
                  placeholder="Enter / Search customer name"
                  isDisabled={isFieldsDisabled}
                />
              </FormFieldLayout>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormFieldLayout
                label="Customer Email"
                description="Enter customers email"
              >
                <Input
                  placeholder="Enter email"
                  {...field}
                  type="email"
                  className="input-field"
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
                isDisabled={!!existingCustomerId || isFieldsDisabled}
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
                  isDisabled={!!existingCustomerId || isFieldsDisabled}
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
                  readOnly={!!existingCustomerId || isFieldsDisabled}
                />
              </FormFieldLayout>
            )}
          />

          <FormField
            control={form.control}
            name="passport"
            render={() => (
              <MultipleFileUpload
                name="passport"
                label="Passport Images"
                existingFiles={initialValues.passport || []}
                description="Upload both front and back of the passport."
                maxSizeMB={5}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.IMAGE}
                isFileUploading={isFileUploading}
                downloadFileName="passport"
                setDeletedFiles={setDeletedFiles}
              />
            )}
          />

          {/* Driving License Number */}
          <FormField
            control={form.control}
            name="drivingLicenseNumber"
            render={({ field }) => (
              <FormFieldLayout
                label="Driving License Number"
                description="Enter customers driving license number"
              >
                <Input
                  placeholder="Enter driving license number"
                  {...field}
                  className="input-field"
                  readOnly={!!existingCustomerId || isFieldsDisabled}
                />
              </FormFieldLayout>
            )}
          />

          <FormField
            control={form.control}
            name="drivingLicense"
            render={() => (
              <MultipleFileUpload
                name="drivingLicense"
                label="Driving License Images"
                existingFiles={initialValues.drivingLicense || []}
                description="Upload both front and back of the driving license."
                maxSizeMB={5}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.IMAGE}
                isFileUploading={isFileUploading}
                downloadFileName="driving-license"
                setDeletedFiles={setDeletedFiles}
              />
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
                  disabled={!!existingCustomerId || isFieldsDisabled}
                />
              </FormFieldLayout>
            )}
          />

          {type === "Add" && (
            <p className="text-red-500 text-center text-sm -mb-2 font-semibold">
              Warning: Please double check and ensure the accuracy of the
              details to avoid potential consequences.
            </p>
          )}

          {/* submit  */}
          {type === "Add" && (
            <FormSubmitButton
              text={submitButtonText}
              isLoading={form.formState.isSubmitting}
            />
          )}
        </FormContainer>
      </Form>
    </div>
  );
}
