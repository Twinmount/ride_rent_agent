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
import { LoginPageDefaultValues } from "@/constants";
import { LoginFormSchema } from "@/lib/validator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// phone input
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import Spinner from "@/components/general/Spinner";
import { API } from "@/api/ApiService";
import { Slug } from "@/api/Api-Endpoints";
import { toast } from "@/components/ui/use-toast";
import { remove, save, StorageKeys } from "@/utils/storage";
import { LoginResponse } from "@/types/API-types";
import Footer from "@/components/footer/Footer";
import { Eye, EyeOff } from "lucide-react";
import { useAgentContext } from "@/context/AgentContext";
import RegisterCountryDropdown from "@/components/RegisterCountryDropdown";

const LoginPage = ({ country = "ae" }: { country?: string }) => {
  const [isView, setIsView] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const navigate = useNavigate();

  const { setAppState, updateAppCountry } = useAgentContext();

  const initialValues = LoginPageDefaultValues;

  useEffect(() => {
    updateAppCountry(country === "india" ? "in" : "ae");
  }, []);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: initialValues,
  });

  // Dynamic background images based on country
  const backgroundImage =
    country === "india"
      ? "/assets/img/bg/india.webp"
      : "/assets/img/bg/uae.webp";

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    try {
      const phoneNumber = values.phoneNumber
        .replace(`+${countryCode}`, "")
        .trim();

      const requestBody = {
        countryCode,
        phoneNumber,
        password: values.password,
      };

      const data = await API.post<LoginResponse>({
        slug: Slug.LOGIN,
        body: requestBody,
      });

      if (data) {
        remove(StorageKeys.ACCESS_TOKEN);
        remove(StorageKeys.REFRESH_TOKEN);
        save(StorageKeys.ACCESS_TOKEN, data.result.token);
        save(StorageKeys.REFRESH_TOKEN, data.result.refreshToken);
        save(StorageKeys.USER_ID, data.result.userId);
        setAppState((prev) => ({
          ...prev,
          accessToken: data.result.token,
          refreshToken: data.result.refreshToken,
          userId: data.result.userId,
        }));
        navigate("/");
      }
    } catch (error: any) {
      console.error("error : ", error);
      if (error.response && error.response.status === 400) {
        toast({
          variant: "destructive",
          title: "Login Failed!",
          description: "Invalid mobile number or password",
        });
        form.setError("phoneNumber", {
          type: "manual",
          message: "",
        });
        form.setError("password", {
          type: "manual",
          message: "",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "something went wrong :(",
        });
      }
    }
  }

  return (
    <>
      <section
        className="flex relative flex-col pt-8 pb-16 h-auto min-h-screen bg-gray-100 flex-center"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="z-10 mt-20 mb-3 text-5xl font-extrabold text-white max-lg:text-4xl max-md:text-3xl max-lg:text-center">
          SHOWCASE YOUR FLEET TO THE WORLD
        </h1>
        <h2 className="z-10 mb-4 text-3xl font-semibold text-white max-md:text-base max-lg:text-xl max-lg:text-center">
          Log in and manage your fleet, categories, and bookings
        </h2>

        {/* Login Form Card with Country Selector */}
        <div className="z-10 bg-white shadow-lg rounded-[1rem] w-full max-md:w-[95%] h-fit max-h-fit max-w-[500px] mx-auto overflow-visible">
          <div className="p-4 pb-3">
            <h3 className="mb-4 text-3xl font-bold text-center text-yellow max-md:text-2xl">
              Login In
            </h3>

            {/* Country Selector - Outside Form */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm font-medium text-gray-600">
                Country:
              </span>
              <div className="relative z-50">
                <RegisterCountryDropdown country={country} type="login" />
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 pb-6">
              <div className="flex flex-col gap-5 w-full h-fit max-w-full md:max-w-[800px] max-h-fit mx-auto">
                {/* mobile / whatsapp*/}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mb-2 w-full">
                      <FormLabel className="flex justify-between mt-4 ml-2 text-base lg:text-lg max-md:text-sm">
                        Mobile
                      </FormLabel>
                      <div className="flex-col items-start w-full">
                        <FormControl>
                          <div className="bg-gray-50 rounded-xl p-2 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <PhoneInput
                                defaultCountry={
                                  country === "india" ? "in" : "ae"
                                }
                                value={field.value}
                                onChange={(value, country) => {
                                  field.onChange(value);
                                  setCountryCode(country.country.dialCode);
                                }}
                                className="flex items-center flex-1"
                                inputClassName="input-field !w-full !text-base !bg-white !border-none max-md:!text-sm"
                                placeholder="WhatsApp number"
                                countrySelectorStyleProps={{
                                  className:
                                    "bg-white !border !border-gray-200 outline-none !rounded-lg !text-lg max-md:!text-base shadow-sm",
                                  style: {
                                    marginRight: "8px",
                                  },
                                  buttonClassName:
                                    "!border !border-gray-200 outline-none !h-[48px] !w-[70px] !rounded-lg bg-white hover:!bg-gray-50 max-md:!h-[44px] max-md:!w-[65px] transition-colors",
                                }}
                              />
                            </div>
                          </div>
                        </FormControl>
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
                      <FormLabel className="flex justify-between ml-2 text-base lg:text-lg max-md:text-sm">
                        Password
                      </FormLabel>
                      <div className="flex-col items-start w-full">
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={isView ? "text" : "password"}
                              id="password"
                              className={`input-field !text-lg max-md:!text-base`}
                              placeholder="Password"
                              {...field}
                            />
                            {isView ? (
                              <Eye
                                className="absolute top-4 right-4 z-10 text-gray-500 cursor-pointer max-md:w-5 max-md:h-5"
                                onClick={() => {
                                  setIsView(!isView);
                                }}
                              />
                            ) : (
                              <EyeOff
                                className="absolute top-4 right-4 z-10 text-gray-500 cursor-pointer max-md:w-5 max-md:h-5"
                                onClick={() => setIsView(!isView)}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="ml-2" />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                  className="w-full mx-auto flex-center col-span-2 mt-2 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow max-md:!text-base"
                >
                  Login {form.formState.isSubmitting && <Spinner />}
                </Button>
              </div>
              <div className="px-2 mt-3 flex-between max-sm:text-xs max-sm:flex-col max-sm:gap-2 max-sm:items-start">
                <Link
                  to={`${country === "india" ? "/in" : "/ae"}/reset-password`}
                  className="text-yellow hover:underline"
                >
                  Forgot Password ?
                </Link>
                <div className="max-sm:text-left">
                  New to Ride.Rent?{" "}
                  <Link
                    to={`${country === "india" ? "/in" : "/ae"}/register`}
                    className="font-semibold text-yellow hover:underline"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </section>

      {/* footer */}
      <Footer />
    </>
  );
};

export default LoginPage;