import { useEffect, useState } from "react";
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

import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { RegistrationFormSchema } from "@/lib/validator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/api/auth";
import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/general/Spinner";
import { Eye, EyeOff } from "lucide-react";
import RegisterCountryDropdown from "@/components/RegisterCountryDropdown";

const RegistrationForm = ({ country }: { country: string }) => {
  const navigate = useNavigate();
  const [isView, setIsView] = useState(false);
  
  const [selectedCountryFromDropdown, setSelectedCountryFromDropdown] =
    useState<string | null>(null);

  const storedPassword = sessionStorage.getItem("password") || "";

  const phonePlaceholder = country === "india" ? "9812345678" : "50 123 4567";

  const initialValues = {
    phoneNumber: "",
    password: storedPassword,
    country: "",
  };

  const form = useForm<z.infer<typeof RegistrationFormSchema>>({
    resolver: zodResolver(RegistrationFormSchema),
    defaultValues: initialValues,
  });

  // ✅ Update phone input when country is selected from dropdown
  useEffect(() => {
    if (selectedCountryFromDropdown) {
      form.setValue("phoneNumber", "", {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [selectedCountryFromDropdown, form]);

  async function onSubmit(values: z.infer<typeof RegistrationFormSchema>) {
    if (!values.country || values.country === "") {
      form.setError("country", {
        type: "manual",
        message: "Select a country",
      });
      return;
    }

    try {
      const countryCode = selectedCountryFromDropdown === "ae" ? "971" : "91";

      const phoneNumber = values.phoneNumber
        .replace(`+${countryCode}`, "")
        .trim();

      sessionStorage.setItem("phoneNumber", phoneNumber);
      sessionStorage.setItem("password", values.password);
      sessionStorage.setItem("country", values.country);

      const selectedCountryCode =
        values.country === "ee8a7c95-303d-4f55-bd6c-85063ff1cf48" ? "ae" : "in";

      const data = await register(values, countryCode);

      if (data) {
        sessionStorage.setItem("otpId", data?.result.otpId);
        sessionStorage.setItem("userId", data?.result.userId);

        navigate(`/verify-otp?country=${selectedCountryCode}`);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error.message;

        if (typeof errorMessage === "string") {
          form.setError("phoneNumber", {
            type: "manual",
            message: "Mobile already registered",
          });
        } else if (errorMessage[0]?.constraints?.IsCustomPhoneNumber) {
          form.setError("phoneNumber", {
            type: "manual",
            message: "Mobile number is invalid",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "Something went wrong. Please try again.",
        });
      }
    }
  }

  const getCountryCode = () => {
    if (!selectedCountryFromDropdown) return "";
    return selectedCountryFromDropdown === "ae" ? "971" : "91";
  };
  const getPhoneCountry = () => {
    if (!selectedCountryFromDropdown) return undefined;
    return selectedCountryFromDropdown === "ae" ? "ae" : "in";
  };

  const countryCode = getCountryCode();
  const phoneCountry = getPhoneCountry();

  return (
    <div className="bg-white shadow-lg p-4 lg:mt-2 rounded-[1rem] border w-full min-w-[350px] max-w-[400px]">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Register Now</h3>
        <h4 className="text-base text-gray-600 mb-2">
          No Payment Required To List Vehicles.
        </h4>
        <div className="border-t border-gray-300 w-full"></div>
      </div>

      <Form {...form}>
        <form
          id="agent-account-registration-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 flex flex-col w-full max-w-full md:max-w-[800px] mx-auto"
        >
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex flex-col mb-4 w-full">
                <FormLabel className="text-base lg:text-lg font-semibold ml-2 mb-2">
                  Country <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="ml-2">
                    <RegisterCountryDropdown
                      country={country}
                      type="register"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);

                        const selectedCountry =
                          value === "ee8a7c95-303d-4f55-bd6c-85063ff1cf48"
                            ? "ae"
                            : "in";
                        setSelectedCountryFromDropdown(selectedCountry);

                        if (form.formState.errors.country) {
                          form.clearErrors("country");
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage className="ml-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex flex-col mb-2 w-full">
                <FormLabel className="text-base lg:text-lg font-semibold ml-2 mb-2">
                  Mobile
                </FormLabel>

                <div className="flex gap-3 w-full items-center">
                  <div className="w-28 h-12">
                    <div className="border-2 border-gray-300 rounded-lg bg-gray-50 h-full flex items-center justify-center gap-2 px-3">
                      {selectedCountryFromDropdown ? (
                        <>
                          <PhoneInput
                            key={selectedCountryFromDropdown}
                            defaultCountry={phoneCountry}
                            className="flex items-center justify-center"
                            inputClassName="hidden"
                            countrySelectorStyleProps={{
                              className:
                                "bg-transparent !border-none outline-none !text-sm flex items-center justify-center",
                              style: {
                                border: "none",
                              },
                              buttonClassName:
                                "!border-none outline-none !h-full !w-full !rounded-none bg-transparent flex items-center justify-center",
                            }}
                          />
                          <span className="text-gray-700 font-semibold text-sm whitespace-nowrap">
                            +{countryCode}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs text-center">
                          Select country first
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 h-12">
                    <FormControl>
                      <input
                        type="tel"
                        placeholder={
                          selectedCountryFromDropdown
                            ? phonePlaceholder
                            : "Select country first"
                        }
                        disabled={!selectedCountryFromDropdown}
                        value={
                          countryCode
                            ? field.value.replace(`+${countryCode}`, "").trim()
                            : ""
                        }
                        onChange={(e) => {
                          if (countryCode) {
                            field.onChange(`+${countryCode}${e.target.value}`);
                          }
                        }}
                        className={`w-full h-full border-2 border-gray-300 rounded-lg bg-gray-50 px-4 py-3 outline-none text-base text-gray-700 transition max-md:text-sm ${
                          selectedCountryFromDropdown
                            ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            : "cursor-not-allowed opacity-60"
                        }`}
                      />
                    </FormControl>
                  </div>
                </div>

                <FormDescription className="mt-2 ml-2">
                  Enter your{" "}
                  <span className="italic font-semibold text-green-500">
                    WhatsApp
                  </span>{" "}
                  number (for OTP)
                </FormDescription>
                <FormMessage className="ml-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col mb-6 w-full">
                <FormLabel className="text-base lg:text-lg font-semibold ml-2 mb-3">
                  Password
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <div className="relative border-2 border-gray-300 rounded-lg bg-gray-50 h-12 flex items-center px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition">
                      <Input
                        type={isView ? "text" : "password"}
                        id="password"
                        className="!border-0 !outline-none !bg-transparent !text-base !padding-0 !h-full max-md:!text-sm !ring-0"
                        placeholder="Password"
                        {...field}
                      />
                      {isView ? (
                        <Eye
                          className="absolute top-3 right-4 z-10 text-gray-500 cursor-pointer"
                          onClick={() => {
                            setIsView(!isView);
                          }}
                        />
                      ) : (
                        <EyeOff
                          className="absolute top-3 right-4 z-10 text-gray-500 cursor-pointer"
                          onClick={() => setIsView(!isView)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="mt-1 ml-2">
                    Enter a password of at least 4 characters long
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <div className="text-sm text-center mb-6">
            An OTP will be sent to your provided{" "}
            <span className="font-bold">WhatsApp Mobile Number</span>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="w-full mx-auto flex-center col-span-2 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
          >
            Send OTP {form.formState.isSubmitting && <Spinner />}
          </Button>
        </form>
      </Form>

      <div className="px-2 mt-3 text-center">
        <div>
          Already registered?{" "}
          <Link
            to={`${country === "india" ? "/in" : "/ae"}/login`}
            className="font-semibold text-yellow"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
