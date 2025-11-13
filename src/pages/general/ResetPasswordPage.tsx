import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ResetPasswordFormSchema } from "@/lib/validator";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Spinner from "@/components/general/Spinner";
import { API } from "@/api/ApiService";
import { Slug } from "@/api/Api-Endpoints";
import { toast } from "@/components/ui/use-toast";
import { ResetPasswordResponse } from "@/types/API-types";
import Footer from "@/components/footer/Footer";
import { ArrowLeft } from "lucide-react";
import { useAgentContext } from "@/context/AgentContext";
import RegisterCountryDropdown from "@/components/RegisterCountryDropdown";

const ResetPasswordPage = ({ country = "ae" }: { country?: string }) => {
  // ✅ Initialize countryCode based on country prop
  const initialCountryCode = country === "india" ? "91" : "971";
  const [countryCode, setCountryCode] = useState(initialCountryCode);

  const navigate = useNavigate();
  const { updateAppCountry } = useAgentContext();

  const phonePlaceholder = country === "india" ? "9812345678" : "50 123 4567";

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      country: "",
      phoneNumber: "",
    },
  });

  // Set app country on mount
  useEffect(() => {
    updateAppCountry(country === "india" ? "in" : "ae");
  }, [country, updateAppCountry]);

  // ✅ Clear phone number when country changes (cleanest UX)
  useEffect(() => {
    const newCountryCode = country === "india" ? "91" : "971";
    setCountryCode(newCountryCode);

    // Clear phone number when switching countries
    form.setValue("phoneNumber", "", {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [country, form]);

  // Handle reset password submission
  async function onSubmit(values: z.infer<typeof ResetPasswordFormSchema>) {
    if (!values.country) {
      form.setError("country", {
        type: "manual",
        message: "Select a country",
      });
      return;
    }

    try {
      const phoneNumber = values.phoneNumber
        .replace(`+${countryCode}`, "")
        .trim();

      const requestBody = {
        countryCode,
        phoneNumber,
      };

      const data = await API.post<ResetPasswordResponse>({
        slug: Slug.POST_RESET_PASSWORD,
        body: requestBody,
      });

      if (data) {
        sessionStorage.setItem("otpId", data?.result.otpId);
        navigate("/reset-password/verify-otp?country=" + country);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast({
          variant: "destructive",
          title: "Invalid mobile number",
          description:
            "Verify your mobile number and make sure it is the one you registered with",
        });
        form.setError("phoneNumber", {
          type: "manual",
          message: "Invalid mobile number",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try again later",
        });
      }
    }
  }

  const backgroundImage =
    country === "india"
      ? "/assets/img/bg/india.webp"
      : "/assets/img/bg/uae.webp";

  return (
    <>
      <section
        className="relative flex flex-col py-8 h-auto bg-gray-900 overflow-hidden"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>

        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-600/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-bl from-blue-600/10 to-transparent rounded-full blur-3xl"></div>

        <Link
          to="/"
          className="absolute top-6 left-6 z-20 w-36 md:w-44 md:left-10 hover:scale-105 transition-transform"
        >
          <img
            src="/assets/logo/header/agent_white_logo.webp"
            alt="Ride.Rent Agent Portal"
            className="w-full h-auto drop-shadow-lg"
          />
        </Link>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 right-6 z-20 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="w-full lg:mt-16 flex flex-col items-center justify-center z-10 px-4">
          <div className="w-full max-w-md backdrop-blur-2xl bg-gradient-to-br from-white/15 to-white/10 border border-white/25 rounded-3xl shadow-2xl p-7 hover:border-white/35 transition-all duration-300 relative z-20">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-white mb-1">
                Reset Password
              </h1>
              <p className="text-white/70 text-sm font-light">
                Enter your details to receive OTP
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Country selection field */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => {
                    const hasError = !!form.formState.errors.country;
                    return (
                      <FormItem>
                        <div className="flex items-center justify-between gap-2">
                          <FormLabel
                            className={`text-sm md:text-base font-medium flex-shrink-0 transition-colors ${
                              hasError ? "text-red-400" : "text-white/90"
                            }`}
                          >
                            Country
                          </FormLabel>
                          <FormControl>
                            <div className="flex-1">
                              <RegisterCountryDropdown
                                country={country}
                                type="forgotPassword"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  if (form.formState.errors.country) {
                                    form.clearErrors("country");
                                  }
                                }}
                                pageType="reset-password"
                                isCompact={true}
                              />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage className="text-xs text-red-400 mt-0.5" />
                      </FormItem>
                    );
                  }}
                />

                {/* Phone number field with country code */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => {
                    const hasError = !!form.formState.errors.phoneNumber;
                    return (
                      <FormItem>
                        <FormLabel
                          className={`text-sm md:text-base font-medium block mb-1.5 transition-colors ${
                            hasError ? "text-red-400" : "text-white/90"
                          }`}
                        >
                          Mobile Number
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-2 relative z-10">
                            <div
                              className={`w-20 h-10 border-2 rounded-lg bg-transparent backdrop-blur-sm flex items-center justify-center transition-all flex-shrink-0 ${
                                hasError
                                  ? "border-red-400"
                                  : "border-white/20 hover:border-white/40 focus-within:border-white/60 focus-within:ring-2 focus-within:ring-amber-500/30"
                              }`}
                            >
                              {/* ✅ PhoneInput only for flag display */}
                              <PhoneInput
                                key={country}
                                defaultCountry={
                                  country === "india" ? "in" : "ae"
                                }
                                className="flex items-center justify-center"
                                inputClassName="hidden"
                                countrySelectorStyleProps={{
                                  className:
                                    "bg-transparent !border-none outline-none !text-xs !p-0 !bg-transparent !shadow-none",
                                  style: {
                                    border: "none",
                                    padding: 0,
                                    backgroundColor: "transparent",
                                    background: "transparent",
                                    boxShadow: "none",
                                  },
                                  buttonClassName:
                                    "!border-none outline-none !h-full !w-full !rounded-none bg-transparent !p-0 !bg-transparent !shadow-none",
                                }}
                              />
                              <span className="text-white font-semibold text-xs ml-0.5">
                                +{countryCode}
                              </span>
                            </div>

                            <input
                              type="tel"
                              placeholder={phonePlaceholder}
                              value={field.value
                                .replace(`+${countryCode}`, "")
                                .trim()}
                              onChange={(e) => {
                                field.onChange(
                                  `+${countryCode}${e.target.value}`
                                );
                              }}
                              className={`flex-1 h-10 px-3 border-2 rounded-lg bg-transparent backdrop-blur-sm outline-none text-white placeholder:text-white/40 text-sm transition-all ${
                                hasError
                                  ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                                  : "border-white/20 hover:border-white/40 focus:border-white/60 focus:ring-2 focus:ring-amber-500/30"
                              }`}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-400 mt-0.5" />
                      </FormItem>
                    );
                  }}
                />

                <p className="text-sm text-white/70 text-center mt-4">
                  An OTP will be sent to your registered{" "}
                  <span className="font-semibold">mobile number</span>
                </p>

                {/* Send OTP button */}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-11 mt-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.03] active:scale-95 text-base relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>

                  <div className="relative flex items-center justify-center gap-2">
                    {form.formState.isSubmitting ? (
                      <>
                        <Spinner />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </div>
                </Button>
              </form>
            </Form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/15"></div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-white/70 text-sm">
                Remember your password?{" "}
                <Link
                  to={`${country === "india" ? "/in" : "/ae"}/login`}
                  className="font-semibold text-amber-300 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ResetPasswordPage;
