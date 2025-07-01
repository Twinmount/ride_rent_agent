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
import { handleCustomerRefresh, handleCustomerSelect } from "@/helpers";
import { FormFieldLayout } from "../form-ui/FormFieldLayout";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { FormContainer } from "../form-ui/FormContainer";
import CustomerLinkShareFormDialog from "@/components/dialog/CustomerLinkShareFormDialog";
import MultipleFileUpload from "../file-uploads/MultipleFileUpload";
import useRefreshSRMCustomer from "@/hooks/useRefreshSRMCustomer";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

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

  const queryClient = useQueryClient();

  const customerIdParam = useGetSearchParams("customerId");
  const linkSendCustomerId = sessionStorage.getItem("linkSendCustomerId");

  const customerIdForRefetch =
    type === "Add" ? linkSendCustomerId : customerIdParam;

  // boolean to determine if the type is "Update" and there is no customerId in the url query params. if its true, form will work as "Add Customer"
  const isUpdateWithoutCustomerId =
    type === "Update" && (!customerIdParam || customerIdParam === "undefined");

  // boolean to determine whether "<CustomerLinkShareFormDialog />" and "refresh data" button should be shown or not. if the type is "Add" OR if the type is "Update" and there is no customer id (customerIdParam), then it should be shown
  const shouldShowCustomerLinkSection =
    type === "Add" || isUpdateWithoutCustomerId;

  // get the booking id from the session storage that is set up the vehicle form during the Add phase
  const bookingIdFromSessionStorage = sessionStorage.getItem("bookingId") || "";
  const { bookingId: bookingIdFromUrlParam } = useParams<{
    bookingId: string;
  }>();

  const bookingId =
    type === "Add" ? bookingIdFromSessionStorage : bookingIdFromUrlParam;

  const { isCustomerRefreshLoading, refetchRefreshCustomer } =
    useRefreshSRMCustomer({
      customerId: customerIdForRefetch as string,
    });

  //  initial default values for the form
  const initialValues = formData
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
    const bookingResponse = await updateCustomerBooking(
      customerId,
      bookingId as string
    );

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
    const bookingResponse = await updateCustomerBooking(
      customerId,
      bookingId as string
    );

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

      if (type === "Add" || isAddOrIncomplete || isUpdateWithoutCustomerId) {
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

        queryClient.invalidateQueries({
          queryKey: ["srm-trips"],
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

  const onCustomerRefresh = async () => {
    if (
      !customerIdParam ||
      customerIdParam === "undefined" ||
      !linkSendCustomerId
    ) {
      toast({
        title: "No Customer ID found",
        className: "bg-orange text-white",
      });
      return;
    }
    const result = await refetchRefreshCustomer();
    if (result.data?.result) {
      handleCustomerRefresh(
        form,
        result.data.result,
        setExistingCustomerId,
        setCurrentProfilePic,
        setCountryCode
      );
      toast({
        title: "Customer data refreshed",
        className: "bg-green-500 text-white",
      });
    } else {
      toast({
        variant: "destructive",
        title: "No data returned",
      });
    }
  };

  // FIELDS DISABLED IF THE TYPE === UPDATE and IF THERE IS NO CUSTOMER ID in the URL
  const isFieldsDisabled = type === "Update" && !isUpdateWithoutCustomerId;

  // submit button text
  const submitButtonText =
    type === "Add"
      ? "Submit and proceed to payment"
      : isUpdateWithoutCustomerId
      ? "Update trip details"
      : "Update Customer Details";

  return (
    <div className="flex flex-col">
      {shouldShowCustomerLinkSection && (
        <div>
          <CustomerLinkShareFormDialog />

          {!!customerIdForRefetch && (
            <button
              type="button"
              onClick={onCustomerRefresh}
              disabled={!customerIdForRefetch || isCustomerRefreshLoading}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              🔄 Refresh Data
            </button>
          )}
        </div>
      )}
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
            render={() => {
              const watchedPassport = form.watch("passport") ?? [];
              const existingFiles =
                watchedPassport.length > 0
                  ? watchedPassport
                  : initialValues.passport ?? [];

              return (
                <MultipleFileUpload
                  key={existingFiles.join(",")}
                  name="passport"
                  label="Passport Images"
                  existingFiles={existingFiles}
                  description="Upload both front and back of the passport."
                  maxSizeMB={5}
                  setIsFileUploading={setIsFileUploading}
                  bucketFilePath={GcsFilePaths.IMAGE}
                  isFileUploading={isFileUploading}
                  downloadFileName="passport"
                  setDeletedFiles={setDeletedFiles}
                />
              );
            }}
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
            render={() => {
              const watchedDrivingLicense = form.watch("drivingLicense") ?? [];
              const existingFiles =
                watchedDrivingLicense.length > 0
                  ? watchedDrivingLicense
                  : initialValues.drivingLicense ?? [];

              return (
                <MultipleFileUpload
                  key={existingFiles.join(",")}
                  name="drivingLicense"
                  label="Driving License Images"
                  existingFiles={existingFiles}
                  description="Upload both front and back of the driving license."
                  maxSizeMB={5}
                  setIsFileUploading={setIsFileUploading}
                  bucketFilePath={GcsFilePaths.IMAGE}
                  isFileUploading={isFileUploading}
                  downloadFileName="driving-license"
                  setDeletedFiles={setDeletedFiles}
                />
              );
            }}
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
          {(type === "Add" || isUpdateWithoutCustomerId) && (
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
