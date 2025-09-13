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
import { LoginFormSchema } from "@/lib/validator";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Spinner from "@/components/general/Spinner";
import { API } from "@/api/ApiService";
import { Slug } from "@/api/Api-Endpoints";
import { toast } from "@/components/ui/use-toast";
import { remove, save, StorageKeys } from "@/utils/storage";
import { LoginResponse } from "@/types/API-types";
import Footer from "@/components/footer/Footer";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAgentContext } from "@/context/AgentContext";
import RegisterCountryDropdown from "@/components/RegisterCountryDropdown";

const LoginPage = ({ country = "ae" }: { country?: string }) => {
  const [isView, setIsView] = useState(false);
  const [selectedCountryFromDropdown, setSelectedCountryFromDropdown] =
    useState<string | null>(null);

  const navigate = useNavigate();
  const { setAppState, updateAppCountry } = useAgentContext();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
      country: "",
    },
  });

  useEffect(() => {
    updateAppCountry(country === "india" ? "in" : "ae");
  }, [country, updateAppCountry]);

  useEffect(() => {
    if (selectedCountryFromDropdown) {
      form.setValue("phoneNumber", "", {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [selectedCountryFromDropdown, form]);

  const onSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    if (!values.country) {
      form.setError("country", {
        type: "manual",
        message: "Select your country",
      });
      return;
    }

    try {
      const countryCode = selectedCountryFromDropdown === "ae" ? "971" : "91";
      const phoneNumber = values.phoneNumber
        .replace(`+${countryCode}`, "")
        .trim();

      const response = await API.post<LoginResponse>({
        slug: Slug.LOGIN,
        body: {
          countryCode,
          phoneNumber,
          password: values.password,
        },
      });

      if (response) {
        remove(StorageKeys.ACCESS_TOKEN);
        remove(StorageKeys.REFRESH_TOKEN);
        save(StorageKeys.ACCESS_TOKEN, response.result.token);
        save(StorageKeys.REFRESH_TOKEN, response.result.refreshToken);
        save(StorageKeys.USER_ID, response.result.userId);

        setAppState((prev) => ({
          ...prev,
          accessToken: response.result.token,
          refreshToken: response.result.refreshToken,
          userId: response.result.userId,
        }));

        navigate("/");
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast({
          variant: "destructive",
          title: "Login Failed!",
          description: "Invalid mobile number or password",
        });
        form.setError("phoneNumber", { type: "manual", message: "" });
        form.setError("password", { type: "manual", message: "" });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Something went wrong",
        });
      }
    }
  };

  const getCountryCode = () => {
    if (!selectedCountryFromDropdown) return "";
    return selectedCountryFromDropdown === "ae" ? "971" : "91";
  };

  const getPhoneCountry = () => {
    if (!selectedCountryFromDropdown) return undefined;
    return selectedCountryFromDropdown === "ae" ? "ae" : "in";
  };

  const getPhonePlaceholder = () => {
    if (!selectedCountryFromDropdown) return "Select country first";
    return selectedCountryFromDropdown === "in" ? "9812345678" : "50 123 4567";
  };

  const countryCode = getCountryCode();
  const phoneCountry = getPhoneCountry();
  const phonePlaceholder = getPhonePlaceholder();

  const backgroundImage =
    country === "india"
      ? "/assets/img/bg/india.webp"
      : "/assets/img/bg/uae.webp";

  return (
    <>
      <section
        className="relative flex flex-col min-h-screen bg-gray-900 overflow-x-hidden"
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

        {/* Logo - fixed position with proper spacing */}
        <Link
          to="/"
          className="absolute top-4 left-4 z-20 w-28 sm:w-36 md:w-44 sm:top-6 sm:left-6 md:left-10 hover:scale-105 transition-transform"
        >
          <img
            src="/assets/logo/header/agent_white_logo.webp"
            alt="Ride.Rent Agent Portal"
            className="w-full h-auto drop-shadow-lg"
          />
        </Link>

        {/* Main content with proper spacing from top */}
        <div className="w-full flex flex-col items-center justify-center flex-1 z-10 px-3 sm:px-4 pt-24 pb-8 sm:pt-28 md:pt-16">
          <div className="w-full max-w-md backdrop-blur-2xl bg-gradient-to-br from-white/15 to-white/10 border border-white/25 rounded-3xl shadow-2xl p-5 sm:p-7 hover:border-white/35 transition-all relative z-20">
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                Agent Portal
              </h1>
              <p className="text-white/70 text-xs sm:text-sm font-light">
                Sign in to manage your fleet
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 sm:space-y-4"
              >
                {/* Country selection field */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => {
                    const hasError = !!form.formState.errors.country;
                    return (
                      <FormItem>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <FormLabel
                            className={`text-sm md:text-base font-medium transition-colors ${
                              hasError ? "text-red-400" : "text-white/90"
                            }`}
                          >
                            Country
                          </FormLabel>
                          <FormControl>
                            <div className="w-full sm:w-auto sm:flex-1 sm:max-w-[200px]">
                              <RegisterCountryDropdown
                                country={country}
                                type="login"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);

                                  const selectedCountry =
                                    value ===
                                    "ee8a7c95-303d-4f55-bd6c-85063ff1cf48"
                                      ? "ae"
                                      : "in";
                                  setSelectedCountryFromDropdown(
                                    selectedCountry
                                  );

                                  if (form.formState.errors.country) {
                                    form.clearErrors("country");
                                  }
                                }}
                                pageType="login"
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

                {/* Phone number field */}
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
                          <div className="flex gap-2 relative z-10 w-full">
                            {/* Country code display with flag */}
                            <div
                              className={`w-16 sm:w-20 h-10 border-2 rounded-lg bg-transparent backdrop-blur-sm flex items-center justify-center transition-all flex-shrink-0 ${
                                hasError
                                  ? "border-red-400"
                                  : "border-white/20 hover:border-white/40 focus-within:border-white/60 focus-within:ring-2 focus-within:ring-amber-500/30"
                              }`}
                            >
                              {selectedCountryFromDropdown ? (
                                <>
                                  <PhoneInput
                                    key={selectedCountryFromDropdown}
                                    defaultCountry={phoneCountry}
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
                                  <span className="text-white font-semibold text-[0.65rem] sm:text-xs ml-0.5">
                                    +{countryCode}
                                  </span>
                                </>
                              ) : (
                                <span className="text-white/40 text-[0.55rem] sm:text-[0.65rem] text-center px-0.5">
                                  Country
                                </span>
                              )}
                            </div>

                            {/* Phone number input */}
                            <input
                              type="tel"
                              placeholder={phonePlaceholder}
                              disabled={!selectedCountryFromDropdown}
                              value={
                                countryCode
                                  ? field.value
                                      .replace(`+${countryCode}`, "")
                                      .trim()
                                  : ""
                              }
                              onChange={(e) => {
                                if (countryCode) {
                                  field.onChange(
                                    `+${countryCode}${e.target.value}`
                                  );
                                }
                              }}
                              className={`flex-1 min-w-0 h-10 px-2 sm:px-3 border-2 rounded-lg bg-transparent backdrop-blur-sm outline-none text-white placeholder:text-white/40 text-sm transition-all ${
                                hasError
                                  ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                                  : selectedCountryFromDropdown
                                  ? "border-white/20 hover:border-white/40 focus:border-white/60 focus:ring-2 focus:ring-amber-500/30"
                                  : "border-white/20 cursor-not-allowed opacity-60"
                              }`}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-400 mt-0.5" />
                      </FormItem>
                    );
                  }}
                />

                {/* Password field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    const hasError = !!form.formState.errors.password;
                    return (
                      <FormItem>
                        <FormLabel
                          className={`text-sm md:text-base font-medium block mb-1.5 transition-colors ${
                            hasError ? "text-red-400" : "text-white/90"
                          }`}
                        >
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <input
                              type={isView ? "text" : "password"}
                              placeholder="Enter your password"
                              className={`h-10 w-full px-3 border-2 rounded-lg bg-transparent backdrop-blur-sm outline-none text-white placeholder:text-white/40 text-sm pr-10 transition-all ${
                                hasError
                                  ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                                  : "border-white/20 hover:border-white/40 focus:border-white/60 focus:ring-2 focus:ring-amber-500/30"
                              }`}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setIsView(!isView)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                            >
                              {isView ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-400 mt-0.5" />
                      </FormItem>
                    );
                  }}
                />

                <div className="flex justify-end">
                  <Link
                    to={`${country === "india" ? "/in" : "/ae"}/reset-password`}
                    className="text-xs font-medium text-white/60 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-10 sm:h-11 mt-3 sm:mt-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.03] active:scale-95 text-sm sm:text-base relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>

                  <div className="relative flex items-center justify-center gap-2">
                    {form.formState.isSubmitting ? (
                      <>
                        <Spinner />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </Button>
              </form>
            </Form>

            <div className="relative my-3 sm:my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/15"></div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-white/70 text-xs sm:text-sm">
                New to Ride.Rent?{" "}
                <Link
                  to={`${country === "india" ? "/in" : "/ae"}/register`}
                  className="font-semibold text-amber-300 hover:text-white transition-colors"
                >
                  Create an account
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

export default LoginPage;
