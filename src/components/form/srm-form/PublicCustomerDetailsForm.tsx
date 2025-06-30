import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormField } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { SRMPublicCustomerDetailsFormSchema } from "@/lib/validator";
import {
  SRMCustomerDetailsFormType,
  SRMPublicCustomerDetailsFormType,
} from "@/types/srm-types";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { deleteMultipleFiles } from "@/helpers/form";
import { toast } from "@/components/ui/use-toast";
import { GcsFilePaths } from "@/constants/enum";
import SingleFileUpload from "../file-uploads/SingleFileUpload";
import { updateCustomerByPublic } from "@/api/srm/srmFormApi";
import NationalityDropdown from "../dropdowns/NationalityDropdown";

import { useFormValidationToast } from "@/hooks/useFormValidationToast";
import { FormFieldLayout } from "../form-ui/FormFieldLayout";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { FormContainer } from "../form-ui/FormContainer";
import { useNavigate } from "react-router-dom";
import MultipleFileUpload from "../file-uploads/MultipleFileUpload";

type Props = {
  token: string;
  formData: SRMPublicCustomerDetailsFormType;
  customerId: string;
  initialCountryCode: string;
};

/**
 * Public customer details form for SRM
 */
export default function SRMPublicCustomerDetailsForm({
  token,
  formData,
  customerId,
  initialCountryCode,
}: Props) {
  const navigate = useNavigate();

  const [countryCode, setCountryCode] = useState<string>(
    initialCountryCode || "+971"
  );
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

  //  initial default values for the form
  const initialValues = formData;

  // Define your form.
  const form = useForm<z.infer<typeof SRMPublicCustomerDetailsFormSchema>>({
    resolver: zodResolver(SRMPublicCustomerDetailsFormSchema),
    defaultValues: initialValues as SRMPublicCustomerDetailsFormType,
  });

  const handlePublicCustomerBooking = async (
    values: SRMCustomerDetailsFormType,
    countryCode: string
  ) => {
    const customerData = await updateCustomerByPublic(
      values,
      countryCode,
      token,
      customerId
    );

    return customerData;
  };

  // Define a submit handler.
  async function onSubmit(values: SRMPublicCustomerDetailsFormType) {
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
      let data = await handlePublicCustomerBooking(values, countryCode);

      if (data) {
        await deleteMultipleFiles(deletedFiles);
        toast({
          title: `Customer added successful`,
          className: "bg-yellow text-white",
        });

        navigate("/srm/customer-details/public/success");
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
          title: `Customer creation failed`,
          description: "Something went wrong",
        });
      }
      console.error(error);
    }
  }

  // custom hook to validate form
  useFormValidationToast(form);

  return (
    <div className="flex flex-col">
      {/* Form container */}
      <Form {...form}>
        <FormContainer
          onSubmit={form.handleSubmit(onSubmit)}
          description={
            <p className="text-sm italic text-center text-gray-600">
              Public form for filling customer details.
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
                  "You cannot edit customer name as this field is already provided by the corresponding agent."
                }
              >
                <Input
                  placeholder="Enter customer name"
                  {...field}
                  className="input-field"
                  readOnly
                  disabled
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
                description="You cannot edit customer email as this field is already provided by the corresponding agent."
              >
                <Input
                  placeholder="Enter email"
                  {...field}
                  type="email"
                  className="input-field"
                  readOnly
                  disabled
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
                existingFile={null}
                maxSizeMB={5}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.IMAGE}
                isDownloadable={true}
                downloadFileName={"user profile"}
                setDeletedImages={setDeletedFiles}
                additionalClasses="w-[18rem]"
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
                description="You cannot edit customer phone number as this field is already provided by the corresponding agent."
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
                  disabled={true}
                />
              </FormFieldLayout>
            )}
          />

          <p className="text-red-500 text-center text-sm -mb-2 font-semibold">
            Warning: Please double check and ensure the accuracy of the details
            to avoid potential consequences.
          </p>

          {/* submit  */}
          <FormSubmitButton
            text={"Submit"}
            isLoading={form.formState.isSubmitting}
          />
        </FormContainer>
      </Form>
    </div>
  );
}
