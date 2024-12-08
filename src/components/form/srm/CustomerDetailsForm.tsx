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
import { SRMCustomerDetailsFormType } from "@/types/srm-types";
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
  updateCustomerDetailsForm,
} from "@/api/srm/srmFormApi";
import NationalityDropdown from "../dropdowns/NationalityDropdown";

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
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search input value
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const {} = useParams<{}>();

  // Call the useLoadingMessages hook to manage loading messages

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
        data = await addCustomerDetailsForm(
          values as SRMCustomerDetailsFormType,
          countryCode
        );
      } else if (type === "Update") {
        data = await updateCustomerDetailsForm(
          values as SRMCustomerDetailsFormType,
          initialCountryCode as string
        );
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

  // Handle selecting a customer from the results
  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    setSearchTerm("");

    // Update form values with the selected customer's details
    form.setValue("customerName", customer.name);
    form.setValue("customerProfile", customer.customerProfile);
    form.setValue("nationality", customer.nationality);
    form.setValue("passportNum", customer.passportNum);
    form.setValue("drivingLicenseNum", customer.drivingLicenseNum);
    form.setValue("phoneNumber", customer.phoneNumber);
  };

  const customers = [
    {
      id: 1,
      name: "John Doe",
      customerProfile:
        "https://media.istockphoto.com/id/1370772148/photo/track-and-mountains-in-valle-del-lago-somiedo-nature-park-asturias-spain.jpg?s=612x612&w=0&k=20&c=QJn62amhOddkJSbihcjWKHXShMAfcKM0hPN65aCloco=",
      nationality: "American",
      passportNum: "A12345678",
      drivingLicenseNum: "D12345678",
      phoneNumber: "+1234567890",
    },
    {
      id: 2,
      name: "Jane Smith",
      customerProfile: "profile2.jpg",
      nationality: "British",
      passportNum: "B87654321",
      drivingLicenseNum: "D87654321",
      phoneNumber: "+9876543210",
    },
  ];

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
          {/* user name */}
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
                    <Input
                      placeholder="Enter / Search customer name"
                      {...field}
                      className="input-field"
                      onChange={(e) => {
                        setSearchTerm(e.target.value); // Update searchTerm for future use
                        field.onChange(e); // Update form field value
                      }}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Provide customer name.
                  </FormDescription>
                  <FormMessage />

                  {searchTerm && customers.length > 0 && (
                    <ul className="overflow-y-auto absolute z-10 w-full max-h-60 bg-white rounded-md border border-gray-300 shadow-md">
                      {customers
                        .filter((customer) =>
                          customer.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((customer) => (
                          <li
                            key={customer.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleCustomerSelect(customer)}
                          >
                            {customer.name}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </FormItem>
            )}
          />

          {/* user profile */}
          <FormField
            control={form.control}
            name="customerProfile"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="Customer Profile (optional)"
                description="Customer profile can have a maximum size of 5MB."
                existingFile={formData?.customerProfile}
                maxSizeMB={5}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.LOGOS}
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
            name="passportNum"
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
            name="drivingLicenseNum"
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
