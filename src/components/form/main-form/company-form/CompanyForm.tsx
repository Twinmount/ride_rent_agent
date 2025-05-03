import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import "react-datepicker/dist/react-datepicker.css";

import { Form, FormField } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { CompanyFormDefaultValues } from "@/constants";
import { CompanyFormSchema } from "@/lib/validator";
import { CompanyFormType } from "@/types/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { toast } from "../../../ui/use-toast";
import {
  addCompany,
  fetchIsEmailAlreadyVerified,
  updateCompany,
} from "@/api/company";
import { useMutation } from "@tanstack/react-query";

import { GcsFilePaths } from "@/constants/enum";
import { deleteMultipleFiles } from "@/helpers/form";
import SingleFileUpload from "../../file-uploads/SingleFileUpload";
import CompanyLanguagesDropdown from "../../dropdowns/CompanyLanguagesDropdown";
import { Textarea } from "@/components/ui/textarea";
import useUserId from "@/hooks/useUserId";
import AgentId from "./AgentId";
import { FormFieldLayout } from "../../form-ui/FormFieldLayout";
import { FormSubmitButton } from "../../form-ui/FormSubmitButton";
import EmailOtpVerification from "./EmailOtpVerification";
import { FormContainer } from "../../form-ui/FormContainer";
import LocationPicker from "../../LocationPicker";

type CompanyRegistrationFormProps = {
  country: string;
  type: "Add" | "Update";
  formData?: CompanyFormType | null;
  agentId: string;
};

export default function CompanyRegistrationForm({
  country = "UAE",
  type,
  formData,
  agentId,
}: CompanyRegistrationFormProps) {
  const [email, setEmail] = useState("");
  const [isEmailVerifiedUI, setIsEmailVerifiedUI] = useState(false);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isLicenseUploading, setIsLicenseUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const navigate = useNavigate();

  // accessing userId from useUserId hook
  const { userId } = useUserId();

  const initialValues = CompanyFormDefaultValues;

  const isIndia = country === "India" || country === "india";

  //  API call to check if email is verified
  const checkEmailVerification = useMutation({
    mutationFn: (variables: { email: string }) =>
      fetchIsEmailAlreadyVerified(variables.email),
  });

  // creating form
  const form = useForm<z.infer<ReturnType<typeof CompanyFormSchema>>>({
    resolver: zodResolver(CompanyFormSchema(isIndia)),
    defaultValues: initialValues,
  });

  async function onSubmit(
    values: z.infer<ReturnType<typeof CompanyFormSchema>>
  ) {
    // Check if OTP is verified before submitting the form
    // 1️⃣ Before submitting, check if email is verified

    const { result } = await checkEmailVerification.mutateAsync({ email });

    if (!result.isEmailVerified) {
      toast({
        variant: "destructive",
        title: "Email not verified",
        description: "Please verify your email before submitting the form.",
      });
      return;
    }

    if (isLogoUploading || isLicenseUploading) {
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
      const userIdString = userId as string;
      if (type === "Add") {
        data = await addCompany(values, userIdString);
      } else if (type === "Update") {
        data = await updateCompany(values, userIdString);
      }

      if (data) {
        await deleteMultipleFiles(deletedImages);
      }

      if (data) {
        toast({
          title: `Company Added successfully`,
          className: "bg-yellow text-white",
        });
        navigate("/listings");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `Add Company failed`,
        description: "Something went wrong",
      });
    }
  }

  return (
    <Form {...form}>
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        {/* agent id */}
        <AgentId agentId={agentId} />

        {/* company name */}
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormFieldLayout
              label="Company Name"
              description={"Enter your company name"}
            >
              <Input
                placeholder="Company Name"
                {...field}
                className="input-field"
                type="text"
              />
            </FormFieldLayout>
          )}
        />

        {/* Email and OTP verification */}
        <EmailOtpVerification
          email={email}
          setEmail={setEmail}
          isEmailVerifiedUI={isEmailVerifiedUI}
          setIsEmailVerifiedUI={setIsEmailVerifiedUI}
        />

        {/* company logo */}
        <FormField
          control={form.control}
          name="companyLogo"
          render={({ field }) => (
            <SingleFileUpload
              name={field.name}
              label="Company Logo"
              description="Company logo can have a maximum size of 5MB."
              existingFile={formData?.companyLogo}
              maxSizeMB={5}
              setIsFileUploading={setIsLogoUploading}
              bucketFilePath={GcsFilePaths.LOGOS}
              isDownloadable={true}
              downloadFileName={
                formData?.companyName
                  ? `[${formData.companyName}] - company-logo`
                  : "company-logo"
              }
              setDeletedImages={setDeletedImages}
              imageOnly={true}
            />
          )}
        />

        {/* trade license */}
        <FormField
          control={form.control}
          name="commercialLicense"
          render={({ field }) => (
            <SingleFileUpload
              name={field.name}
              label={isIndia ? "Registration Detail" : "Commercial License"}
              description={
                <>
                  Please upload a <strong>PHOTO</strong> or a{" "}
                  <strong>SCREENSHOT</strong> of your{" "}
                  {isIndia
                    ? `Company Registration / GST Registration / Trade License,`
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
              downloadFileName={
                formData?.companyName
                  ? `[${formData.companyName}] - commercial-license`
                  : "commercial-license"
              }
              setDeletedImages={setDeletedImages}
            />
          )}
        />

        {/* expiry date */}
        <FormField
          control={form.control}
          name="expireDate"
          render={({ field }) => (
            <FormFieldLayout
              label="Expiry Date"
              description={
                <span>
                  Enter the expiry of your{" "}
                  {isIndia
                    ? `Company Registration / GST Registration / Trade License`
                    : "Commercial License/Trade License"}{" "}
                  &#40;DD/MM/YYYY&#41;.
                </span>
              }
            >
              <DatePicker
                selected={field.value}
                onChange={(date: Date | null) => field.onChange(date)}
                dateFormat="dd/MM/yyyy"
                wrapperClassName="datePicker text-base  "
                placeholderText="DD/MM/YYYY"
              />
            </FormFieldLayout>
          )}
        />

        {/* registration number */}
        <FormField
          control={form.control}
          name="regNumber"
          render={({ field }) => (
            <FormFieldLayout
              label={
                isIndia
                  ? "GST Number"
                  : "Registration Number / Trade License Number"
              }
              description={
                isIndia
                  ? `Enter your company GST number. The number should be a combination of letters and numbers, without any spaces or special characters.`
                  : `Enter your company registration number. The number should be a combination of letters and numbers, without any spaces or special characters, up to 15 characters.`
              }
            >
              <Input
                placeholder={
                  isIndia
                    ? "Enter your company GST number"
                    : "Enter your company registration number"
                }
                {...field}
                className="input-field"
              />
            </FormFieldLayout>
          )}
        />

        {/* company languages */}
        <FormField
          control={form.control}
          name="companyLanguages"
          render={({ field }) => (
            <FormFieldLayout
              label="Supported Languages"
              description="Select all the languages your staff can speak or understand.
                    These will be displayed on your company's public profile
                    page, helping customers feel comfortable with communication."
            >
              <CompanyLanguagesDropdown
                isIndia={isIndia}
                value={field.value}
                onChangeHandler={field.onChange}
                placeholder="Languages"
              />
            </FormFieldLayout>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormFieldLayout
              label="GPS Location"
              description={
                <span>
                  Enter the GSP location where the company is registered or
                  operates.
                </span>
              }
            >
              <LocationPicker
                onChangeHandler={field.onChange}
                initialLocation={field.value}
                buttonText="Choose Location"
                buttonClassName="w-full cursor-pointer bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900"
              />
            </FormFieldLayout>
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
              <FormFieldLayout
                label="Company Address"
                description={
                  <>
                    <span className="w-full max-w-[90%]">
                      Provide company address. This will be showed in your
                      public company profile page. 150 characters max.
                    </span>{" "}
                    <span className="ml-auto"> {`${charCount}/150`}</span>
                  </>
                }
              >
                <Textarea
                  placeholder="Company Address"
                  {...field}
                  className={`textarea rounded-xl transition-all duration-300 h-28`} // Dynamic height
                  onChange={handleInputChange} // Handle change to track character count
                />
              </FormFieldLayout>
            );
          }}
        />

        {/* submit */}
        <FormSubmitButton
          text={"Add Company"}
          isLoading={form.formState.isSubmitting}
        />
      </FormContainer>
    </Form>
  );
}
