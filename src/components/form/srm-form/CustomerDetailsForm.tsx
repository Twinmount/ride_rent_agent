import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SRMCustomerDetailsFormDefaultValues } from "@/constants";
import { SRMCustomerDetailsFormSchema } from "@/lib/validator";
import { CustomerType, SRMCustomerDetailsFormType } from "@/types/srm-types";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { deleteMultipleFiles } from "@/helpers/form";
import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/general/Spinner";
import { useParams } from "react-router-dom";
import { GcsFilePaths } from "@/constants/enum";
import SingleFileUpload from "../file-uploads/SingleFileUpload";
import {
  addCustomerDetailsForm,
  createCustomerBooking,
  updateCustomerDetailsForm,
} from "@/api/srm/srmFormApi";
import NationalityDropdown from "../dropdowns/NationalityDropdown";
import CustomerSearch from "../dropdowns/CustomerSearchAndAutoFill";

type SRMCustomerDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMCustomerDetailsFormType | null;
  onNextTab?: () => void;
  initialCountryCode?: string;
};

export default function SRMCustomerDetailsForm({
  type,
  onNextTab,
  formData,
  initialCountryCode,
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

  const {} = useParams<{}>();

  const initialValues =
    formData && type === "Update"
      ? formData
      : SRMCustomerDetailsFormDefaultValues;

  // Define your form.
  const form = useForm<z.infer<typeof SRMCustomerDetailsFormSchema>>({
    resolver: zodResolver(SRMCustomerDetailsFormSchema),
    defaultValues: initialValues as SRMCustomerDetailsFormType,
  });

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

    // Append other form data
    try {
      let data;
      if (type === "Add") {
        // creating the customer in the db
        if (!!existingCustomerId) {
          console.log("existing customer", existingCustomerId);
          // Call only createCustomerBooking if the customer exists
          const bookingResponse = await createCustomerBooking(
            existingCustomerId as string
          );
          const bookingId = bookingResponse.result.bookingId;
          sessionStorage.setItem("bookingId", bookingId);
        } else {
          console.log("new customer");
          // Add customer details and create a booking if the customer is new
          data = await addCustomerDetailsForm(
            values as SRMCustomerDetailsFormType,
            countryCode
          );

          const customerId = data.result.customerId;
          const bookingResponse = await createCustomerBooking(customerId);

          console.log("bookingResponse", bookingResponse);

          //  storing in session storage
          if (bookingResponse) {
            const bookingId = bookingResponse.result.bookingId;
            sessionStorage.setItem("bookingId", bookingId);
          }
        }
      } else if (type === "Update") {
        // data = await updateCustomerDetailsForm(
        //   values as SRMCustomerDetailsFormType,
        //   initialCountryCode as string
        // );
      }

      if (data) {
        await deleteMultipleFiles(deletedFiles);
      }

      if (data) {
        toast({
          title: `Vehicle ${type.toLowerCase()}ed successfully`,
          className: "bg-yellow text-white",
        });

        if (type === "Add") {
          if (onNextTab) onNextTab();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${type} Vehicle failed`,
        description: "Something went wrong",
      });

      console.error(error);
    }
  }

  useEffect(() => {
    // Check for validation errors and scroll to the top if errors are present
    if (Object.keys(form.formState.errors).length > 0) {
      toast({
        variant: "destructive",
        title: `Validation Error`,
        description: "Please make sure values are provided",
      });
      window.scrollTo({ top: 65, behavior: "smooth" }); // Scroll to the top of the page
    }
  }, [form.formState.errors]);

  // Handle selecting an existing customer from the results
  const handleCustomerSelect = (
    customerName: string,
    customerData: CustomerType | null
  ) => {
    form.setValue("customerName", customerName);

    if (customerData) {
      setExistingCustomerId(customerData?.customerId);
      form.setValue(
        "customerProfilePic",
        customerData.customerProfilePic || ""
      );
      setCurrentProfilePic(customerData.customerProfilePic || "");
      form.setValue("nationality", customerData.nationality || "");
      form.setValue("passportNumber", customerData.passportNumber || "");
      form.setValue(
        "drivingLicenseNumber",
        customerData.drivingLicenseNumber || ""
      );
      form.setValue(
        "phoneNumber",
        (customerData.countryCode || "971") + customerData.phoneNumber || ""
      );
      setCountryCode(customerData.countryCode || "");
    } else {
      setExistingCustomerId(null);
      setCurrentProfilePic(null);
      form.setValue("customerProfilePic", "");
      form.resetField("nationality");
      form.resetField("passportNumber");
      form.resetField("drivingLicenseNumber");
      form.resetField("phoneNumber");
      setCountryCode("");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5  mx-auto bg-white  rounded-3xl p-2 md:p-4 py-8 !pb-8  "
      >
        <p className="text-sm italic text-center text-gray-600">
          Add customer details here. You can choose existing customer &#40;if
          any&#41; by searching customer name
        </p>
        <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
          {/* customer name */}
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg">
                  Customer Name <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <CustomerSearch
                      value={field.value} // Pass current field value
                      onChangeHandler={handleCustomerSelect}
                      placeholder="Enter / Search customer name"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Provide customer name. You can search existing customer
                    also.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* user profile */}
          <FormField
            control={form.control}
            name="customerProfilePic"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="Customer Profile (optional)"
                description="Customer profile can have a maximum size of 5MB."
                existingFile={currentProfilePic}
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
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Nationality <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <NationalityDropdown
                      value={field.value} // Pass the form's field value
                      onChangeHandler={field.onChange} // Bind to form control's onChange
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Select customer's nationality
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Passport Number */}
          <FormField
            control={form.control}
            name="passportNumber"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Passport Number <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="Enter passport number"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter customers passport number
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Driving License Number */}
          <FormField
            control={form.control}
            name="drivingLicenseNumber"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Driving License Number{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="Enter driving license number"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter customers driving license number
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* mobile */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Mobile Number <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
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
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter the contact details of the customer
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />
        </div>
        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full md:w-10/12 lg:w-8/12 mx-auto flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
        >
          {type === "Add" ? "Continue to Vehicle Details" : "Update User"}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
