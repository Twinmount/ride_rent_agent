import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { ConfirmPasswordFormSchema } from "@/lib/validator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/general/Spinner";
import { API } from "@/api/ApiService";
import { Slug } from "@/api/Api-Endpoints";
import { toast } from "@/components/ui/use-toast";
import { LoginResponse } from "@/types/API-types";
import Footer from "@/components/footer/Footer";


const ConfirmNewPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // for phone validation

  const form = useForm<z.infer<typeof ConfirmPasswordFormSchema>>({
    resolver: zodResolver(ConfirmPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // form submit handler
  async function onSubmit(values: z.infer<typeof ConfirmPasswordFormSchema>) {
    try {
      const otpId = sessionStorage.getItem("otpId");
      const otp = sessionStorage.getItem("otp");
      // Construct the final request body to send to the backend
      const requestBody = {
        password: values.password,
        confirmPassword: values.confirmPassword,
        otpId,
        otp,
      };

      const data = await API.post<LoginResponse>({
        slug: Slug.POST_VERIFY_RESET_PASSWORD,
        body: requestBody,
      });

      if (data) {
        toast({
          title: "Password changed successfully",
          description: "Now you can login with your new password",
          className: "bg-yellow text-white",
        });
        let link = searchParams.get("country") || "ae";
        if (link === "india") link = "in";
        navigate(`/${link}/login`);
      }
    } catch (error: any) {
      console.error("error : ", error);
      if (error.response && error.response.status === 400) {
        toast({
          variant: "destructive",
          title: "Password change failed",
          description: "Something went wrong when changing password",
        });
        form.setError("password", {
          type: "manual",
          message: "",
        });
        form.setError("confirmPassword", {
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 bg-white shadow-lg p-4 pb-6 rounded-[1rem] w-full  max-md:mx-2 max-w-[500px] mx-auto"
          >
            <h3 className="mb-4 text-3xl font-bold text-center text-yellow">
              New Password
            </h3>
            <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
              {/* password field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-2 w-full">
                    <FormLabel className="flex justify-between ml-2 w-72 text-base lg:text-lg">
                      New Password
                    </FormLabel>
                    <div className="flex-col items-start w-full">
                      <FormControl>
                        <Input
                          placeholder="Password"
                          {...field}
                          className={`input-field !text-lg`}
                          type="password"
                        />
                      </FormControl>
                      <FormDescription className="ml-2">
                        Enter your new password
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  </FormItem>
                )}
              />

              {/* confirm password field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-2 w-full">
                    <FormLabel className="flex justify-between ml-2 w-72 text-base lg:text-lg">
                      Confirm Password
                    </FormLabel>
                    <div className="flex-col items-start w-full">
                      <FormControl>
                        <Input
                          placeholder="Confirm Password"
                          {...field}
                          className={`input-field !text-lg`}
                          type="password"
                        />
                      </FormControl>
                      <FormDescription className="ml-2">
                        Confirm your new password
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                disabled={form.formState.isSubmitting}
                className="w-full  mx-auto flex-center col-span-2 mt-2 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
              >
                Change Password {form.formState.isSubmitting && <Spinner />}
              </Button>
            </div>
          </form>
        </Form>
      </section>
      <Footer />
    </>
  );
};

export default ConfirmNewPassword;
