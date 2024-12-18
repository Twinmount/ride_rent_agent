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
import { ProfileUpdateFormSchema } from "@/lib/validator";
import { ProfileUpdateFormType } from "@/types/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../ui/use-toast";
import { updateCompanyProfile } from "@/api/company";
import Spinner from "../../general/Spinner";
import { load, StorageKeys } from "@/utils/storage";
import { jwtDecode } from "jwt-decode";
import { DecodedRefreshToken } from "@/layout/ProtectedRoutes";

import { GcsFilePaths } from "@/constants/enum";
import { deleteMultipleFiles } from "@/helpers/form";
import SingleFileUpload from "../file-uploads/SingleFileUpload";
import CompanyLanguagesDropdown from "../dropdowns/CompanyLanguagesDropdown";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";

type CompanyProfileUpdateFormProps = {
  formData?: ProfileUpdateFormType | null;
  agentId: string;
};

export default function CompanyProfileUpdateForm({
  formData,
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

  // creating form
  const form = useForm<z.infer<typeof ProfileUpdateFormSchema>>({
    resolver: zodResolver(ProfileUpdateFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof ProfileUpdateFormSchema>) {
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
                label="Commercial License"
                description={
                  <>
                    Please upload a <strong>PHOTO</strong> or a{" "}
                    <strong>SCREENSHOT</strong> of your commercial license,
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
                    Enter the expiry of your Commercial License/Trade License
                    &#40;DD/MM/YYYY&#41;.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* registration number */}
          <FormField
            control={form.control}
            name="regNumber"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg">
                  Registration Number / Trade License Number{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="Enter your company registration number"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="mt-1 ml-1">
                    Enter your company registration number. The number should be
                    a combination of letters and numbers, without any spaces or
                    special characters, up to 15 characters.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

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
                      value={field.value}
                      onChangeHandler={field.onChange}
                      placeholder="Languages"
                    />
                  </FormControl>
                  <FormDescription className="mt-1 ml-1">
                    Select all the languages your staff can speak or understand.
                    These will be displayed on your company's public profile
                    page, helping customers feel comfortable with communication.
                  </FormDescription>
                  <FormMessage />
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
                    Company Address
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
                        Provide company address. This will be showed in your
                        public company profile page. 150 characters max.
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
