import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { sendOtp, verifyOtp, fetchIsEmailAlreadyVerified } from "@/api/company";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FormDescription, FormLabel } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/general/Spinner";
import { useOtpTimer } from "@/hooks/useOtpTimer";

type EmailOtpVerificationProps = {
  email: string;
  setEmail: (email: string) => void;
  isEmailVerifiedUI: boolean;
  setIsEmailVerifiedUI: (value: boolean) => void;
};

const EmailOtpVerification = ({
  email,
  setEmail,
  isEmailVerifiedUI,
  setIsEmailVerifiedUI,
}: EmailOtpVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  // custom hook for otp timer
  const { timer, isTimerActive, startTimer } = useOtpTimer();

  //  API call to check if email is verified
  const checkEmailVerification = useMutation({
    mutationFn: (variables: { email: string }) =>
      fetchIsEmailAlreadyVerified(variables.email),
  });

  const sendOtpMutation = useMutation({
    mutationFn: (variables: { email: string }) => sendOtp(variables.email),
    onSuccess: () => {
      toast({
        title: "OTP sent successfully",
        description: "Please don't refresh or close the page",
        className: "bg-green-500 text-white",
      });
      startTimer();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to send OTP",
        description: "Email already verified or something went wrong",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (variables: { otp: string }) => verifyOtp(variables.otp),
    onSuccess: () => {
      setOtp(""); // Clear the OTP field
      toast({
        title: "OTP verified successfully",
        className: "bg-green-500 text-white",
      });
      setIsEmailVerifiedUI(true);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to verify OTP",
        description: "Invalid OTP or something went wrong",
      });

      // Clear the OTP field
      setOtp("");
      setIsEmailVerifiedUI(false);
    },
  });

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter a valid email to send OTP",
      });
      return;
    }

    try {
      const response = await checkEmailVerification.mutateAsync({ email });

      if (response?.result.isEmailVerified) {
        toast({
          title: "Email already verified",
          description: "You can proceed with filling out the form.",
          className: "bg-green-500 text-white",
        });
        setIsEmailVerifiedUI(true);
        return;
      }

      await sendOtpMutation.mutateAsync({ email });
      setIsEmailSent(true);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error?.message || "Something went wrong";

      if (errorMessage.includes("Email already taken by another user")) {
        toast({
          variant: "destructive",
          title: "Email is already in use",
          description:
            "This email is already associated with another user. Please try a different email.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to send OTP",
          description: "Something went wrong",
        });
      }
      setIsEmailSent(false);
      setIsEmailVerifiedUI(false);
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedEmail = e.target.value.trim();
    setEmail(trimmedEmail);
    setOtp(""); // Reset OTP if email changes
    setIsEmailSent(false); // Reset OTP state
    setIsEmailVerifiedUI(false); // Reset the verified state
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Email and OTP Verification Section */}
      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
        <div className="flex mb-2 w-full max-sm:flex-col">
          <FormLabel className="flex justify-between mt-4 ml-2 w-64 font-semibold text-base max-sm:w-fit lg:text-lg">
            Email <span className="mr-5 max-sm:hidden">:</span>
          </FormLabel>
          <div className="flex-col items-start w-full">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className="input-field"
                readOnly={isEmailSent && isTimerActive}
              />

              {!isEmailVerifiedUI && (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  className={`button ${
                    isEmailVerifiedUI
                      ? "bg-green-500 cursor-default"
                      : "bg-yellow hover:bg-darkYellow"
                  }`}
                  disabled={
                    isTimerActive || !email || !/^\S+@\S+\.\S+$/.test(email)
                  }
                >
                  {isEmailVerifiedUI
                    ? " Verified"
                    : isTimerActive
                      ? `Resend OTP in ${timer}s`
                      : "Send OTP"}
                </Button>
              )}
            </div>

            <FormDescription className="mt-1 ml-1">
              Enter the email for your company. An{" "}
              <span className="font-semibold text-yellow">OTP</span> will send
              to it.
              <br />
              {isEmailVerifiedUI && (
                <span className="text-green-500 font-semibold mt-1">
                  Your email is verified! You can continue filling out the form.
                </span>
              )}
            </FormDescription>
          </div>
        </div>

        {!isEmailVerifiedUI && isEmailSent && (
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
                    {Array.from({ length: 4 }, (_, index) => (
                      <InputOTPGroup key={index}>
                        <InputOTPSlot index={index} />
                      </InputOTPGroup>
                    ))}
                  </InputOTP>

                  {/* Verify OTP Button */}
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="!h-10 button bg-yellow hover:bg-darkYellow"
                    disabled={
                      !email || !otp.trim() || verifyOtpMutation.isPending
                    }
                  >
                    {verifyOtpMutation.isPending ? <Spinner /> : "Verify OTP"}
                  </Button>
                </div>
                <FormDescription className="mt-1 ml-1">
                  Enter your OTP sent to your email address. Do not refresh or
                  close the page,
                </FormDescription>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailOtpVerification;
