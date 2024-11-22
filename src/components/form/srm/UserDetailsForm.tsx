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
import { SRMUserDetailsFormDefaultValues } from "@/constants";
import { SRMUserDetailsFormSchema } from "@/lib/validator";
import { SRMUserDetailsFormType } from "@/types/types";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { deleteMultipleFiles } from "@/helpers/form";
import CategoryDropdown from "../dropdowns/CategoryDropdown";
import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/general/Spinner";
import { useParams } from "react-router-dom";
import { GcsFilePaths } from "@/constants/enum";
import SingleFileUpload from "../file-uploads/SingleFileUpload";
import {
  addUserDetailsForm,
  updateUserDetailsForm,
} from "@/api/srm/srmFormApi";

type SRMUserDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMUserDetailsFormType | null;
  onNextTab?: () => void;
  initialCountryCode?: string;
};

export default function SRMUserDetailsForm({
  type,
  onNextTab,
  formData,
  initialCountryCode,
}: SRMUserDetailsFormProps) {
  const [countryCode, setCountryCode] = useState<string>("");
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

  const {} = useParams<{}>();

  // Call the useLoadingMessages hook to manage loading messages

  const initialValues =
    formData && type === "Update" ? formData : SRMUserDetailsFormDefaultValues;

  // Define your form.
  const form = useForm<z.infer<typeof SRMUserDetailsFormSchema>>({
    resolver: zodResolver(SRMUserDetailsFormSchema),
    defaultValues: initialValues as SRMUserDetailsFormType,
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof SRMUserDetailsFormSchema>) {
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
        data = await addUserDetailsForm(
          values as SRMUserDetailsFormType,
          countryCode
        );
      } else if (type === "Update") {
        data = await updateUserDetailsForm(
          values as SRMUserDetailsFormType,
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5  mx-auto bg-white  rounded-3xl p-2 md:p-4 py-8 !pb-8  "
      >
        <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
          {/* user name */}
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg">
                  User Name <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
                  <FormControl>
                    <CategoryDropdown
                      onChangeHandler={(value) => {
                        field.onChange(value);
                      }}
                      value={initialValues.userName}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    select user name
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* user profile */}
          <FormField
            control={form.control}
            name="userProfile"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="User Profile (optional)"
                description="User profile can have a maximum size of 5MB."
                existingFile={formData?.userProfile}
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
                    <Input
                      placeholder="Enter your nationality"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
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
                  <FormMessage />
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
                  <FormMessage />
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
                  Whatsapp/Mobile <span className="mr-5 max-sm:hidden">:</span>
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
                    Enter the{" "}
                    <span className="font-semibold text-green-400">
                      Whatsapp
                    </span>{" "}
                    mobile number. This number will receive the direct booking
                    details.
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
          {type === "Add" ? "Add User" : "Update User"}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
