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
import { Button } from "@/components/ui/button";
import { SRMVehicleDetailsFormDefaultValues } from "@/constants";
import { SRMVehicleDetailsFormSchema } from "@/lib/validator";
import { SRMVehicleDetailsFormType, VehicleType } from "@/types/srm-types";
import CategoryDropdown from "../dropdowns/CategoryDropdown";
import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/general/Spinner";
import { useParams } from "react-router-dom";
import {
  addVehicleDetailsForm,
  updateBookingDataForVehicle,
  updateVehicleDetailsForm,
} from "@/api/srm/srmFormApi";
import BrandsDropdown from "../dropdowns/BrandsDropdown";
import RentalDetailsFormField from "../RentalDetailsFormField";
import { deleteMultipleFiles, validateSRMRentalDetails } from "@/helpers/form";
import SingleFileUpload from "../file-uploads/SingleFileUpload";
import { GcsFilePaths } from "@/constants/enum";
import VehicleSearch from "../dropdowns/VehicleSearchAndAutoFill";

type SRMVehicleDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMVehicleDetailsFormType | null;
  onNextTab?: () => void;
};

export default function SRMVehicleDetailsForm({
  type,
  onNextTab,
  formData,
}: SRMVehicleDetailsFormProps) {
  const {} = useParams<{}>();
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [currentVehiclePhoto, setCurrentVehiclePhoto] = useState<string | null>(
    formData?.vehiclePhoto || null
  );
  const [existingVehicleId, setExistingVehicleId] = useState<string | null>(
    null
  );

  const initialValues =
    formData && type === "Update"
      ? formData
      : SRMVehicleDetailsFormDefaultValues;

  // Define your form
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

    const bookingId = sessionStorage.getItem("bookingId"); // Retrieve bookingId

    if (!bookingId) {
      toast({
        variant: "destructive",
        title: "Booking ID Missing",
        description: "Please complete the Customer Details Form first.",
      });
      return;
    }

    // form submission
    try {
      let data;
      if (type === "Add") {
        if (!!existingVehicleId) {
          console.log("existing vehicle id", existingVehicleId);
          await updateBookingDataForVehicle(bookingId, existingVehicleId);
        } else {
          console.log("new vehicle");
          data = await addVehicleDetailsForm(
            values as SRMVehicleDetailsFormType
          );
          const vehicleId = data.result.id;

          await updateBookingDataForVehicle(bookingId, vehicleId);
        }
      } else if (type === "Update") {
        // data = await updateVehicleDetailsForm(
        //   values as SRMVehicleDetailsFormType
        // );
      }

      if (data) {
        await deleteMultipleFiles(deletedFiles);
      }

      if (data) {
        toast({
          title: `Vehicle ${type.toLowerCase()} successful`,
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

  // Handle selecting a customer from the results// Handle selecting a vehicle from the results
  const handleVehicleSelect = (
    vehicleRegistrationNumber: string,
    vehicleData: VehicleType | null
  ) => {
    form.setValue("vehicleRegistrationNumber", vehicleRegistrationNumber);

    if (vehicleData) {
      setExistingVehicleId(vehicleData?.id);

      // Set form values based on the selected vehicle
      form.setValue(
        "vehicleCategoryId",
        vehicleData.vehicleCategory?.categoryId || ""
      );
      form.setValue("vehicleBrandId", vehicleData.vehicleBrand?.id || "");
      form.setValue("vehiclePhoto", vehicleData.vehiclePhoto || "");

      form.setValue(
        "rentalDetails.day.enabled",
        vehicleData.rentalDetails.day.enabled || false
      );
      form.setValue(
        "rentalDetails.day.rentInAED",
        vehicleData.rentalDetails.day.rentInAED || ""
      );
      form.setValue(
        "rentalDetails.day.mileageLimit",
        vehicleData.rentalDetails.day.mileageLimit || ""
      );

      form.setValue(
        "rentalDetails.week.enabled",
        vehicleData.rentalDetails.week.enabled || false
      );
      form.setValue(
        "rentalDetails.week.rentInAED",
        vehicleData.rentalDetails.week.rentInAED || ""
      );
      form.setValue(
        "rentalDetails.week.mileageLimit",
        vehicleData.rentalDetails.week.mileageLimit || ""
      );

      form.setValue(
        "rentalDetails.month.enabled",
        vehicleData.rentalDetails.month.enabled || false
      );
      form.setValue(
        "rentalDetails.month.rentInAED",
        vehicleData.rentalDetails.month.rentInAED || ""
      );
      form.setValue(
        "rentalDetails.month.mileageLimit",
        vehicleData.rentalDetails.month.mileageLimit || ""
      );

      form.setValue(
        "rentalDetails.hour.enabled",
        vehicleData.rentalDetails.hour.enabled || false
      );
      form.setValue(
        "rentalDetails.hour.minBookingHours",
        vehicleData.rentalDetails.hour.minBookingHours || ""
      );

      form.setValue(
        "rentalDetails.hour.rentInAED",
        vehicleData.rentalDetails.hour.rentInAED || ""
      );
      form.setValue(
        "rentalDetails.hour.mileageLimit",
        vehicleData.rentalDetails.hour.mileageLimit || ""
      );

      setCurrentVehiclePhoto(vehicleData.vehiclePhoto || "");
    } else {
      // Reset fields if no vehicle data is selected
      setExistingVehicleId(null);
      setCurrentVehiclePhoto(null);

      form.resetField("vehicleCategoryId");
      form.resetField("vehicleBrandId");
      form.resetField("vehiclePhoto");
      form.resetField("rentalDetails");
    }
  };

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
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg">
                  Registration Number{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <VehicleSearch
                      value={field.value} // Pass current field value
                      onChangeHandler={handleVehicleSelect}
                      placeholder="Enter / Search Registration Number"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Add or Search Vehicle Registration Number.
                  </FormDescription>
                  <FormMessage />
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
                      value={initialValues.vehicleCategoryId || field.value}
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
                existingFile={currentVehiclePhoto}
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
