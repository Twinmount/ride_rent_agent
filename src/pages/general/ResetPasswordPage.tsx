import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { ResetPasswordFormSchema } from "@/lib/validator";
import { Button } from "@/components/ui/button";

// phone input
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Spinner from "@/components/general/Spinner";
import { API } from "@/api/ApiService";
import { Slug } from "@/api/Api-Endpoints";
import { toast } from "@/components/ui/use-toast";
import { ResetPasswordResponse } from "@/types/API-types";
import Footer from "@/components/footer/Footer";
import { useAgentContext } from "@/context/AgentContext";
import RegisterCountryDropdown from "@/components/RegisterCountryDropdown";

const ResetPasswordPage = ({ country = 'ae' }: { country?: string }) => {
  // State to store the country code separately
  const [countryCode, setCountryCode] = useState("");
  const navigate = useNavigate();

  const { setAppState, updateAppCountry } = useAgentContext();

  useEffect(() => {
    updateAppCountry(country === "india" ? "in" : "ae");
  }, []);

  // for phone validation

  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  // form submit handler
  async function onSubmit(values: z.infer<typeof ResetPasswordFormSchema>) {
    try {
      // Extract the phone number part without the country code
      const phoneNumber = values.phoneNumber
        .replace(`+${countryCode}`, "")
        .trim();

      // Construct the final request body to send to the backend
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
      console.error("error : ", error);
      if (error.response && error.response.status === 400) {
        toast({
          variant: "destructive",
          title: "Invalid mobile number",
          description:
            "verify your mobile number and make sure it is the one you registered with",
        });
        form.setError("phoneNumber", {
          type: "manual",
          message:
            "verify your mobile number and make sure it is the one you registered with",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
        });
      }
    }
  }

  return (
    <>
      <section
        className="h-screen bg-gray-100 flex-center"
        style={{
          backgroundImage: `url('/assets/img/bg/register-banner.webp')`,
          backgroundSize: "cover", // This ensures the image covers the div
          backgroundPosition: "center", // This centers the background image
          backgroundRepeat: "no-repeat", // Prevent the image from repeating
        }}
      >
        <Link
          to={"/"}
          className="absolute left-4 top-6 z-20 w-32 lg:left-20 md:w-40 lg:w-44"
        >
          <img
            src="/assets/logo/header/agent_white_logo.webp"
            alt="riderent logo"
            className="object-contain w-full h-full"
          />
        </Link>
        <div className="absolute right-4 top-6 z-20">
          <RegisterCountryDropdown country={country} type="forgotPassword" />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 bg-white shadow-lg p-4 pb-6 rounded-[1rem]  max-md:mx-2 w-full max-w-[500px] mx-auto"
          >
            <h3 className="mb-4 text-3xl font-bold text-center text-yellow">
              Reset Password
            </h3>
            <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
              {/* mobile / whatsapp*/}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-2 w-full">
                    <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                      Mobile
                    </FormLabel>
                    <div className="flex-col items-start w-full">
                      <FormControl>
                        <PhoneInput
                          defaultCountry={country === "india" ? "in" : "ae"}
                          value={field.value}
                          onChange={(value, country) => {
                            field.onChange(value);

                            // Set the country code in state
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
                      <FormDescription>
                        Verify the phone number associated with your account
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  </FormItem>
                )}
              />

              <div className="text-sm text-center">
                An OTP will be sent to your registered{" "}
                <span className="font-bold">WhatsApp Mobile Number</span>
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
          </form>
        </Form>
      </section>
      <Footer />
    </>
  );
};

export default ResetPasswordPage;
