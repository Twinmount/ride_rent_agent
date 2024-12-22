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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SRMVehicleDetailsFormDefaultValues } from "@/constants";
import { SRMVehicleDetailsFormSchema } from "@/lib/validator";
import { SRMVehicleDetailsFormType } from "@/types/srm-types";
import CategoryDropdown from "../dropdowns/CategoryDropdown";
import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/general/Spinner";
import { useParams } from "react-router-dom";
import {
  addVehicleDetailsForm,
  updateVehicleDetailsForm,
} from "@/api/srm/srmFormApi";
import BrandsDropdown from "../dropdowns/BrandsDropdown";
import RentalDetailsFormField from "../RentalDetailsFormField";
import { deleteMultipleFiles, validateSRMRentalDetails } from "@/helpers/form";
import SingleFileUpload from "../file-uploads/SingleFileUpload";
import { GcsFilePaths } from "@/constants/enum";

type SRMVehicleDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMVehicleDetailsFormType | null;
  onNextTab?: () => void;
  initialCountryCode?: string;
  isAddOrIncomplete: boolean;
};

export default function SRMVehicleDetailsForm({
  type,
  onNextTab,
  formData,
}: SRMVehicleDetailsFormProps) {
  const {} = useParams<{}>();
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

  // Call the useLoadingMessages hook to manage loading messages

  const initialValues =
    formData && type === "Update"
      ? formData
      : SRMVehicleDetailsFormDefaultValues;

  // Define your form.
  const form = useForm<z.infer<typeof SRMVehicleDetailsFormSchema>>({
    resolver: zodResolver(SRMVehicleDetailsFormSchema),
    defaultValues: initialValues as SRMVehicleDetailsFormType,
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof SRMVehicleDetailsFormSchema>) {
    // rental details validation
    const rentalError = validateSRMRentalDetails(values.rentalDetails);
    if (rentalError) {
      form.setError("rentalDetails", {
        type: "manual",
        message: rentalError,
      });
      form.setFocus("rentalDetails");
      return;
    }

    // if file is being uploaded, show loading message
    if (isFileUploading) {
      toast({
        title: "File Upload in Progress",
        description:
          "Please wait until the file upload completes before submitting the form.",
        duration: 3000,
        className: "bg-orange",
      });
      return;
    }

    // form submission
    try {
      let data;
      if (type === "Add") {
        data = await addVehicleDetailsForm(values as SRMVehicleDetailsFormType);
      } else if (type === "Update") {
        data = await updateVehicleDetailsForm(
          values as SRMVehicleDetailsFormType
        );
      }

      if (data) {
        await deleteMultipleFiles(deletedFiles);
      }

      if (data) {
        toast({
          title: `Vehicle ${type.toLowerCase()}ed successfully`,
          className: "bg-yellow text-white",
        });

        if (type === "Add") {
          if (onNextTab) onNextTab();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${type} Vehicle failed`,
        description: "Something went wrong",
      });

      console.error(error);
    }
  }

  // form error validation for complex fields
  useEffect(() => {
    // Check for validation errors and scroll to the top if errors are present
    if (Object.keys(form.formState.errors).length > 0) {
      toast({
        variant: "destructive",
        title: `Validation Error`,
        description: "Please make sure values are provided",
      });
      window.scrollTo({ top: 65, behavior: "smooth" }); // Scroll to the top of the page
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5  mx-auto bg-white  rounded-3xl p-2 md:p-4 py-8 !pb-8  "
      >
        <p className="-mt-4 text-sm italic text-center text-gray-600">
          Add vehicle details here. You can choose existing vehicle &#40;if
          any&#41; by searching registration number
        </p>
        <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
          {/* vehicle registration number */}
          <FormField
            control={form.control}
            name="vehicleRegistrationNumber"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Registration Number{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="eg: ABC12345"
                      {...field}
                      className={`input-field`}
                      type="text"
                      onKeyDown={(e) => {
                        // Allow only alphanumeric characters and control keys like Backspace, Delete, and Arrow keys
                        if (
                          !/[a-zA-Z0-9]/.test(e.key) &&
                          ![
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab", // To allow tabbing between fields
                          ].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter your vehicle registration number (e.g., ABC12345). The
                    number should be a combination of letters and numbers,
                    without any spaces or special characters, up to 15
                    characters.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleCategoryId"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg">
                  Vehicle Category <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
                  <FormControl>
                    <CategoryDropdown
                      onChangeHandler={(value) => {
                        field.onChange(value);

                        form.setValue("vehicleBrandId", "");
                      }}
                      value={initialValues.vehicleCategoryId}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    select vehicle category
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* brand name */}
          <FormField
            control={form.control}
            name="vehicleBrandId"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Brand Name <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <BrandsDropdown
                      vehicleCategoryId={form.watch("vehicleCategoryId")}
                      value={field.value}
                      onChangeHandler={field.onChange}
                      isDisabled={!form.watch("vehicleCategoryId")}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Select the vehicle's Brand
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* user profile */}
          <FormField
            control={form.control}
            name="vehiclePhoto"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="Vehicle Photo (optional)"
                description="Vehicle Photo can have a maximum size of 5MB."
                existingFile={formData?.vehiclePhoto}
                maxSizeMB={5}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.LOGOS}
                isDownloadable={true}
                downloadFileName={"vehicle-photo"}
                setDeletedImages={setDeletedFiles}
                additionalClasses="w-[18rem]"
              />
            )}
          />

          {/* rental details */}
          <FormField
            control={form.control}
            name="rentalDetails"
            render={() => {
              return (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    Rental Details <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <RentalDetailsFormField />
                    </FormControl>
                    <FormDescription className="ml-2">
                      Provide rent details. All Value Should be provided for
                      calculating rent effectively.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              );
            }}
          />
        </div>

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full md:w-10/12 lg:w-8/12 mx-auto flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
        >
          {type === "Add"
            ? "Continue to Payment Details"
            : "Update Vehicle Details"}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
