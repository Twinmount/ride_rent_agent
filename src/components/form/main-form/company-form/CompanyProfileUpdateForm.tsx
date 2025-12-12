import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import "react-datepicker/dist/react-datepicker.css";

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
import { ProfileUpdateFormDefaultValues } from "@/constants";
import {
  ProfileUpdateFormSchemaWithConditionalReg,
} from "@/lib/validator";
import { ProfileUpdateFormType } from "@/types/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../ui/use-toast";
import { updateCompanyProfile } from "@/api/company";
import Spinner from "../../../general/Spinner";
import { load, StorageKeys } from "@/utils/storage";
import { jwtDecode } from "jwt-decode";
import { DecodedRefreshToken } from "@/layout/ProtectedRoutes";

import { GcsFilePaths } from "@/constants/enum";
import { deleteMultipleFiles } from "@/helpers/form";
import SingleFileUpload from "../../file-uploads/SingleFileUpload";
import CompanyLanguagesDropdown from "../../dropdowns/CompanyLanguagesDropdown";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import LocationPicker from "../../LocationPicker";
import { FormCheckbox } from "../../form-ui/FormCheckbox";

type CompanyProfileUpdateFormProps = {
  formData?: ProfileUpdateFormType | null;
  agentId: string;
  country: string;
};

export default function CompanyProfileUpdateForm({
  formData,
  country,
}: CompanyProfileUpdateFormProps) {
  const [isLicenseUploading, setIsLicenseUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const navigate = useNavigate();

  // agentId from params
  const { agentId } = useParams<{ agentId: string }>();

  const queryClient = useQueryClient();

  const initialValues = formData
    ? {
      ...formData,
      expireDate: formData.expireDate
        ? new Date(formData.expireDate)
        : undefined,
    }
    : ProfileUpdateFormDefaultValues;

  // accessing refresh token to get the userId
  const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN);
  const { userId } = jwtDecode<DecodedRefreshToken>(refreshToken as string);
  const isIndia = country === "India" || country === "india";
  // creating form (use schema with conditional regNumber validation)
  const form = useForm<z.infer<typeof ProfileUpdateFormSchemaWithConditionalReg>>({
    resolver: zodResolver(ProfileUpdateFormSchemaWithConditionalReg),
    defaultValues: initialValues,
  });

  const isIndividual =
    !!formData?.accountType && formData?.accountType === "individual";

  async function onSubmit(values: z.infer<typeof ProfileUpdateFormSchemaWithConditionalReg>) {
    console.log('working');

    if (isLicenseUploading) {
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
      let data = await updateCompanyProfile(values, userId);

      if (data) {
        await deleteMultipleFiles(deletedImages);
      }

      if (data) {
        toast({
          title: `Company update successful`,
          className: "bg-yellow text-white",
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `Update Company failed`,
        description: "Something went wrong",
      });
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["company", agentId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "company"],
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 max-w-[800px] mx-auto  bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8 border-t shadow-md"
      >
        <div className="flex flex-col gap-5 p-3 mx-auto w-full rounded-3xl">
          {/* trade license */}
          <FormField
            control={form.control}
            name="commercialLicense"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label={
                  isIndia && !isIndividual
                    ? "Registration Details"
                    : isIndia && isIndividual
                      ? "Commercial Registration"
                      : "Commercial License"
                }
                description={
                  <>
                    Please upload a <strong>PHOTO</strong> or a{" "}
                    <strong>SCREENSHOT</strong> of your{" "}
                    {isIndia && !isIndividual
                      ? `Company Registration / GST Registration / Trade License,`
                      : isIndia && isIndividual
                        ? "Commercial Registration / Tourist Permit"
                        : `commercial license,
                    `}{" "}
                    maximum file size 5MB.
                  </>
                }
                existingFile={formData?.commercialLicense}
                maxSizeMB={5}
                setIsFileUploading={setIsLicenseUploading}
                bucketFilePath={GcsFilePaths.DOCUMENTS}
                isDownloadable={true}
                downloadFileName={"company-commercial-license"}
                setDeletedImages={setDeletedImages}
              />
            )}
          />
          {/* expiry date */}
          {!isIndia && (
            <FormField
              control={form.control}
              name="expireDate"
              render={({ field }) => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-52 text-base max-sm:w-fit lg:text-lg">
                    Expiry Date <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-fit">
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onChange={(date: Date | null) => field.onChange(date)}
                        dateFormat="dd/MM/yyyy"
                        wrapperClassName="datePicker text-base  "
                        placeholderText="DD/MM/YYYY"
                        minDate={new Date()}
                      />
                    </FormControl>
                    <FormDescription className="mt-1 ml-1">
                      Enter the expiry of your
                      {isIndia && !isIndividual
                        ? " Commercial License / GST Registration / Trade License"
                        : isIndia && isIndividual
                          ? " Commercial Registration / Tourist Permit"
                          : " Commercial License / Trade License"}{" "}
                      &#40;DD/MM/YYYY&#41;.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          )}
          {/* registration number */}
          <FormField
            control={form.control}
            name="regNumber"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg">
                  {isIndia && !isIndividual
                    ? "GST Number"
                    : isIndia && isIndividual
                      ? "PAN Number"
                      : "Registration Number / Trade License Number"}{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder={
                        isIndia
                          ? "Enter your company GST number"
                          : "Enter your company registration number"
                      }
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="mt-1 ml-1">
                    {isIndia && !isIndividual
                      ? `Enter your company GST number. The number should be a combination of letters and numbers, without any spaces or special characters.`
                      : isIndia && isIndividual
                        ? "Enter your company PAN. The number should be a combination of letters and numbers, without any spaces or special characters."
                        : `Enter your company registration number. The number should be a combination of letters and numbers, without any spaces or special characters, up to 15 characters.`}
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          {isIndia && !isIndividual && (
            <FormField
              control={form.control}
              name="noRegNumber"
              render={({ field }) => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg" />
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <FormCheckbox
                        id={field.name}
                        checked={!!field.value}
                        onChange={(checked) => {
                          field.onChange(checked);
                          if (checked) form.setValue("regNumber", "");
                        }}
                        label={"I do not have a GST number"}
                      />
                    </FormControl>
                    <FormDescription className="mt-1 ml-1">
                      If your company doesn't have a GST number, check this box to skip validation.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="companyLanguages"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg">
                  Supported Languages{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <CompanyLanguagesDropdown
                      isIndia={isIndia}
                      value={field.value}
                      onChangeHandler={field.onChange}
                      placeholder="Languages"
                    />
                  </FormControl>
                  <FormDescription className="mt-1 ml-1">
                    {isIndividual
                      ? "Select all the languages you can speak or understand. These will be shown on your public profile to help customers communicate comfortably with you."
                      : "Select all the languages your staff can speak or understand. These will be displayed on your company's public profile page, helping customers feel comfortable with communication."}
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-52 text-base max-sm:w-fit lg:text-lg">
                  Office Location <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-fit">
                  <LocationPicker
                    onChangeHandler={field.onChange}
                    initialLocation={field.value}
                    buttonText="Choose Location"
                    buttonClassName="w-full cursor-pointer bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900"
                  />
                  <FormDescription className="mt-1 ml-1">
                    Choose the GSP location where the company is registered or
                    operates.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyAddress"
            render={({ field }) => {
              const [charCount, setCharCount] = useState(
                field.value?.length || 0
              ); // To track character count

              const handleInputChange = (
                e: React.ChangeEvent<HTMLTextAreaElement>
              ) => {
                const newValue = e.target.value;
                if (newValue.length <= 150) {
                  setCharCount(newValue.length);
                  field.onChange(e);
                }
              };

              return (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-52 text-base h-fit min-w-52 lg:text-lg">
                    {isIndividual ? "" : "Company"} Address
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Textarea
                        placeholder="Company Address"
                        {...field}
                        className={`textarea rounded-xl transition-all duration-300 h-28`} // Dynamic height
                        onChange={handleInputChange} // Handle change to track character count
                      />
                    </FormControl>
                    <FormDescription className="mt-1 ml-2 w-full flex-between">
                      <span className="w-full max-w-[90%]">
                        {isIndividual
                          ? "Provide your address. It will appear on your public profile and must match your registered details"
                          : "Provide company address. This will be showed in your public company profile page. 150 characters max."}
                      </span>{" "}
                      <span className="ml-auto"> {`${charCount}/150`}</span>
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              );
            }}
          />
        </div>

        {/* submit */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full  mx-auto flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
        >
          {"Update Company"}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
