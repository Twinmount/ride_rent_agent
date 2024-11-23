import { useState, useEffect } from "react";
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
import { CompanyFormDefaultValues } from "@/constants";
import { CompanyFormSchema } from "@/lib/validator";
import { ApiError, CompanyFormType } from "@/types/types";
import { ShieldCheck } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useNavigate } from "react-router-dom";
import { toast } from "../../ui/use-toast";
import { addCompany, sendOtp, updateCompany, verifyOtp } from "@/api/company";
import Spinner from "../../general/Spinner";
import { load, StorageKeys } from "@/utils/storage";
import { jwtDecode } from "jwt-decode";
import { DecodedRefreshToken } from "@/layout/ProtectedRoutes";
import { useMutation } from "@tanstack/react-query";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { GcsFilePaths } from "@/constants/enum";
import { deleteMultipleFiles } from "@/helpers/form";
import SingleFileUpload from "../file-uploads/SingleFileUpload";

type CompanyRegistrationFormProps = {
  type: "Add" | "Update";
  formData?: CompanyFormType | null;
  agentId: string;
};

export default function CompanyRegistrationForm({
  type,
  formData,
  agentId,
}: CompanyRegistrationFormProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isLicenseUploading, setIsLicenseUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  const initialValues =
    formData && type === "Update" ? formData : CompanyFormDefaultValues;

  // accessing refresh token to get the userId
  const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN);
  const decodedRefreshToken = jwtDecode<DecodedRefreshToken>(
    refreshToken as string
  );
  const { userId } = decodedRefreshToken;

  useEffect(() => {
    const isVerified = sessionStorage.getItem("isOtpVerified");
    if (isVerified === "true") {
      setIsOtpVerified(true);
    }
  }, []);

  // creating form
  const form = useForm<z.infer<typeof CompanyFormSchema>>({
    resolver: zodResolver(CompanyFormSchema),
    defaultValues: initialValues,
  });

  const sendOtpMutation = useMutation({
    mutationFn: (variables: { email: string }) => sendOtp(variables.email),
    onSuccess: () => {
      toast({
        title: "OTP sent successfully",
        description: "Please don't refresh or close the page ",
        className: "bg-green-500 text-white",
      });
      setIsTimerActive(true);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to send OTP",
        description: "Something went wrong",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (variables: { otp: string }) => verifyOtp(variables.otp),
    onSuccess: () => {
      setIsOtpVerified(true);
      sessionStorage.setItem("isOtpVerified", "true");
      setOtp(""); // Clear the OTP field
      toast({
        title: "OTP verified successfully",
        className: "bg-green-500 text-white",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to verify OTP",
        description: "Invalid OTP or something went wrong",
      });
    },
  });

  const handleSendOtp = () => {
    if (email) {
      // Start the timer and disable the button immediately when the button is clicked
      setIsEmailSent(true);
      setIsTimerActive(true);

      sendOtpMutation.mutateAsync({ email }).catch((error) => {
        const apiError = error as ApiError;

        if (apiError.response?.data?.error?.message) {
          toast({
            variant: "destructive",
            title: "Email failed",
            description: apiError.response?.data?.error?.message,
          });
        }
        setIsEmailSent(false);
        setIsTimerActive(false);
        setTimer(60);
      });
    } else {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter a valid email to send OTP",
      });
    }
  };

  const handleVerifyOtp = () => {
    if (otp) {
      verifyOtpMutation.mutateAsync({ otp });
    } else {
      toast({
        variant: "destructive",
        title: "OTP required",
        description: "Please enter the OTP sent to your email",
      });
    }
  };

  async function onSubmit(values: z.infer<typeof CompanyFormSchema>) {
    // Check if OTP is verified before submitting the form
    if (!isOtpVerified) {
      toast({
        variant: "destructive",
        title: "OTP not verified",
        description:
          "Please verify the OTP sent to your email before submitting the form.",
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth", // This will create a smooth scrolling effect
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
      if (type === "Add") {
        data = await addCompany(values, userId);
      } else if (type === "Update") {
        data = await updateCompany(values, userId);
      }

      if (data) {
        await deleteMultipleFiles(deletedImages);
      }

      if (data) {
        toast({
          title: `Company ${type}ed successfully`,
          className: "bg-yellow text-white",
        });
        navigate("/listings");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Company failed`,
        description: "Something went wrong",
      });
    }
  }

  useEffect(() => {
    let interval: number | undefined;

    if (isTimerActive) {
      interval = window.setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsTimerActive(false);
            setTimer(60);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 max-w-[800px] mx-auto  bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8 border-t shadow-md"
      >
        <div className="flex flex-col gap-5 p-3 mx-auto w-full rounded-3xl">
          {/* agent id */}
          <div className="flex mb-2 w-full max-sm:flex-col">
            <div className="flex justify-between mt-4 ml-2 w-72 text-base font-semibold max-sm:w-fit lg:text-lg">
              Your Agent Id <span className="mr-5 max-sm:hidden">:</span>
            </div>
            <div className="flex items-center mt-4 w-full text-lg font-semibold text-gray-500 cursor-default">
              {agentId}{" "}
              <ShieldCheck className="ml-3 text-green-500" size={20} />
            </div>
          </div>

          {/* company name */}
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg">
                  Company Name <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="Company Name"
                      {...field}
                      className="input-field"
                      type="text"
                    />
                  </FormControl>
                  <FormDescription className="mt-1 ml-1">
                    Enter your company name
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            {/* Email and OTP Verification Section */}
            <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
              <div className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-64 text-base max-sm:w-fit lg:text-lg">
                  Email <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      readOnly={isEmailSent && isTimerActive}
                    />
                    {!isOtpVerified && (
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        className="button bg-yellow hover:bg-darkYellow"
                        disabled={isTimerActive || !email}
                      >
                        {isTimerActive ? `Resend OTP in ${timer}s` : "Send OTP"}
                      </Button>
                    )}
                  </div>

                  <FormDescription className="mt-1 ml-1">
                    Enter the email for your company. An{" "}
                    <span className="font-semibold text-yellow">OTP</span> will
                    send to it.
                    <br />
                    <span className="italic font-medium">
                      Please do not close or reload the page after email
                      verification
                    </span>
                  </FormDescription>
                </div>
              </div>

              {isEmailSent && !isOtpVerified && (
                <div className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg">
                    OTP <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <div>
                      <div className="flex gap-2">
                        {/* OTP Input using InputOTP */}
                        <InputOTP
                          maxLength={4}
                          value={otp}
                          onChange={(value) => setOtp(value)}
                          disabled={!isEmailSent}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>

                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>

                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>

                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                        </InputOTP>

                        {/* Verify OTP Button */}
                        <Button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="!h-10 button bg-yellow hover:bg-darkYellow"
                          disabled={!email || verifyOtpMutation.isPending}
                        >
                          {verifyOtpMutation.isPending ? (
                            <Spinner />
                          ) : (
                            "Verify OTP"
                          )}
                        </Button>
                      </div>
                      <FormDescription className="mt-1 ml-1">
                        Enter your OTP sent to your email address. Do not
                        refresh or close the page,
                      </FormDescription>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

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
                  Registration Number{" "}
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
        </div>

        {/* submit */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full  mx-auto flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
        >
          {type === "Add" ? "Add Company" : "Update Company"}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
