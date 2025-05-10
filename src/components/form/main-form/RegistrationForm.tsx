import { useState } from "react";

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

const RegistrationForm = ({ country }: { country: string }) => {
  const navigate = useNavigate();
  const [isView, setIsView] = useState(false);

  // Retrieve stored values from sessionStorage
  const storedPhoneNumber = sessionStorage.getItem("phoneNumber") || "";
  const storedCountryCode = sessionStorage.getItem("countryCode") || "";
  const storedPassword = sessionStorage.getItem("password") || "";

  const [countryCode, setCountryCode] = useState(storedCountryCode);

  const initialValues = {
    phoneNumber: storedCountryCode + storedPhoneNumber,
    password: storedPassword,
    country:
      country === "uae"
        ? "ee8a7c95-303d-4f55-bd6c-85063ff1cf48"
        : "68ea1314-08ed-4bba-a2b1-af549946523d",
  };

  // Define your form.
  const form = useForm<z.infer<typeof RegistrationFormSchema>>({
    resolver: zodResolver(RegistrationFormSchema),
    defaultValues: initialValues,
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof RegistrationFormSchema>) {
    try {
      const phoneNumber = values.phoneNumber
        .replace(`+${countryCode}`, "")
        .trim();

      const data = await register(values, countryCode);

      if (data) {
        sessionStorage.setItem("otpId", data?.result.otpId);
        sessionStorage.setItem("userId", data?.result.userId);

        // Store phoneNumber, countryCode, and password separately in sessionStorage
        sessionStorage.setItem("phoneNumber", phoneNumber);
        sessionStorage.setItem("countryCode", countryCode);
        sessionStorage.setItem("password", values.password);
        sessionStorage.setItem("country", values.country);

        navigate(`/verify-otp?country=${country}`);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error.message;

        if (typeof errorMessage === "string") {
          form.setError("phoneNumber", {
            type: "manual",
            message: "mobile already registered",
          });
        } else if (errorMessage[0]?.constraints?.IsCustomPhoneNumber) {
          form.setError("phoneNumber", {
            type: "manual",
            message: "mobile number is invalid",
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

  return (
    <Form {...form}>
      <form
        id="agent-account-registration-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 bg-white shadow-lg p-4 lg:mt-6 pb-6 rounded-[1rem] border w-full min-w-[350px] max-w-[400px]"
      >
        <h3 className="text-2xl font-bold text-center">Register Now</h3>
        <h4 className="text-base text-center">No Credit Card Required</h4>
        <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
          {/* mobile / whatsapp*/}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex flex-col mb-2 w-full">
                <FormLabel className="flex justify-between mt-3 ml-2 w-72 text-base lg:text-lg">
                  Mobile
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <PhoneInput
                      defaultCountry={country === "india" ? "in" : "ae"}
                      value={field.value}
                      onChange={(value, country) => {
                        field.onChange(value);
                        setCountryCode(country.country.dialCode);
                      }}
                      className="flex items-center"
                      inputClassName="input-field !w-full !text-base"
                      placeholder="WhatsApp number"
                      countrySelectorStyleProps={{
                        className:
                          "bg-white !border-none outline-none !rounded-xl  mr-1 !text-lg",
                        style: {
                          border: "none ",
                        },
                        buttonClassName:
                          "!border-none outline-none !h-[52px] !w-[50px] !rounded-xl bg-gray-100",
                      }}
                    />
                  </FormControl>
                  <FormDescription className="mt-1 ml-2">
                    Enter your{" "}
                    <span className="italic font-semibold text-green-500">
                      WhatsApp
                    </span>{" "}
                    number (for OTP )
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col mb-2 w-full">
                <FormLabel className="flex justify-between ml-2 w-72 text-base lg:text-lg">
                  Password
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isView ? "text" : "password"}
                        id="password"
                        className={`input-field !text-lg`}
                        placeholder="Password"
                        {...field}
                      />
                      {isView ? (
                        <Eye
                          className="absolute top-4 right-4 z-10 text-gray-500 cursor-pointer"
                          onClick={() => {
                            setIsView(!isView);
                          }}
                        />
                      ) : (
                        <EyeOff
                          className="absolute top-4 right-4 z-10 text-gray-500 cursor-pointer"
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

          <div className="text-sm text-center">
            An OTP will be sent to your provided{" "}
            <span className="font-bold">mobile</span> number
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="w-full  mx-auto flex-center col-span-2 mt-2 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
          >
            Send OTP {form.formState.isSubmitting && <Spinner />}
          </Button>
        </div>

        <div className="px-2 mt-3 text-center">
          <div>
            Already registered?{" "}
            <Link
              to={`${country === "india" ? "/in" : "/uae"}/login`}
              className="font-semibold text-yellow"
            >
              Login
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default RegistrationForm;
