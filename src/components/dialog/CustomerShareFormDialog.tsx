import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import * as z from "zod";
import { useState } from "react";
import { FormContainer } from "../form/form-ui/FormContainer";
import { FormFieldLayout } from "../form/form-ui/FormFieldLayout";
import { FormSubmitButton } from "../form/form-ui/FormSubmitButton";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { sendCustomerFormLink } from "@/api/srm";
import { toast } from "../ui/use-toast";
import { CustomerShareLinkFormSchema } from "@/lib/validator";

export type ShareFormData = z.infer<typeof CustomerShareLinkFormSchema>;

export default function CustomerShareFormDialog() {
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState<string>("");

  const form = useForm<ShareFormData>({
    resolver: zodResolver(CustomerShareLinkFormSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: ShareFormData) => {
    setLoading(true);

    try {
      // TODO: Add your API call logic here
      console.log("Submitted data:", data);
      const response = await sendCustomerFormLink(data, countryCode);

      if (response) {
        toast({
          title: "Success",
          description:
            "A link  has been sent to the customer email, You can now close this window and wait for the customer to fill the form, or you can continue to fill the form.",
          duration: 3000,
          className: "bg-green",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send link",
        description: "Something went wrong. Please try again.",
      });

      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit bg-transparent hover:bg-transparent text-blue-500 hover:textblue-600 hover:cursor-pointer ml-auto">
          Let customer fill it? Share link instead.
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] sm:w-full sm:max-w-[600px] h-[600px] max-h-[80vh] rounded-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Send Form to Customer</DialogTitle>
          <DialogDescription>
            Enter the customer's name, email, and phone number. They’ll receive
            an email with a link to fill out the form on their own.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto">
          <Form {...form}>
            <FormContainer
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4"
            >
              {/* Passport Number */}
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormFieldLayout
                    label="Customer Name"
                    description="Enter customers name"
                  >
                    <Input
                      placeholder="Enter customer name"
                      {...field}
                      className="input-field"
                    />
                  </FormFieldLayout>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormFieldLayout
                    label="Customer Email"
                    description="Enter customers email"
                  >
                    <Input
                      placeholder="Enter email"
                      {...field}
                      type="email"
                      className="input-field"
                    />
                  </FormFieldLayout>
                )}
              />

              {/* mobile */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormFieldLayout
                    label="Mobile Number"
                    description="Enter the contact details of the customer"
                  >
                    <PhoneInput
                      defaultCountry="ae"
                      value={field.value}
                      onChange={(value, country) => {
                        field.onChange(value);
                        setCountryCode(country.country.dialCode);
                      }}
                      className="flex items-center"
                      inputClassName="input-field !w-full !text-base"
                      countrySelectorStyleProps={{
                        className:
                          "bg-white !border-none outline-none !rounded-xl  mr-1",
                        style: {
                          border: "none ",
                        },
                        buttonClassName:
                          "!border-none outline-none !h-[52px] !w-[50px] !rounded-xl !bg-gray-100",
                      }}
                    />
                  </FormFieldLayout>
                )}
              />

              <FormSubmitButton
                text={loading ? "Sending..." : "Send Link"}
                isLoading={form.formState.isSubmitting}
              />
            </FormContainer>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
