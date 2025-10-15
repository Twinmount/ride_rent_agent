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
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { OTPFormSchema } from "@/lib/validator";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/general/Spinner";
import Footer from "@/components/footer/Footer";

const ResetPasswordOTPPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const form = useForm<z.infer<typeof OTPFormSchema>>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: { otp: "" },
  });

  async function onSubmit(values: z.infer<typeof OTPFormSchema>) {
    sessionStorage.setItem("otp", values.otp);
    let link = searchParams.get("country") || "ae";
    navigate("/confirm-new-password?country=" + link);
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
            className="flex-1 bg-white shadow-lg p-4 pb-6 rounded-3xl  max-md:mx-2 w-full max-w-[500px] mx-auto"
          >
            <h3 className="mb-4 text-3xl font-bold text-center text-yellow">
              OTP Verification
            </h3>
            <div className="flex flex-col w-full max-w-full md:max-w-[800px] mx-auto ">
              {/* otp field */}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center mb-2 w-full">
                    <FormControl>
                      <InputOTP maxLength={4} {...field}>
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
                    </FormControl>
                    <FormDescription className="text-center">
                      Please enter the OTP sent to your{" "}
                      <span className="font-bold">registered</span> number.
                      <br />
                      Valid for only 10 minutes.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                disabled={form.formState.isSubmitting}
                className="w-full mx-auto flex-center col-span-2 mt-2 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
              >
                Verify OTP {form.formState.isSubmitting && <Spinner />}
              </Button>
            </div>
          </form>
        </Form>
      </section>
      <Footer />
    </>
  );
};

export default ResetPasswordOTPPage;
