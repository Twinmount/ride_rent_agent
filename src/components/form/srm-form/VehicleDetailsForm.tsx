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
} from "@/api/srm/srmFormApi";
import BrandsDropdown from "../dropdowns/BrandsDropdown";
import RentalDetailsFormField from "../RentalDetailsFormField";
import { deleteMultipleFiles, validateSRMRentalDetails } from "@/helpers/form";
import SingleFileUpload from "../file-uploads/SingleFileUpload";
import { GcsFilePaths } from "@/constants/enum";
import VehicleSearch from "../dropdowns/VehicleSearchAndAutoFill";
import { handleVehicleSelection } from "@/helpers";
import { useFormValidationToast } from "@/hooks/useFormValidationToast";

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

  // initial default values for the form
  const initialValues =
    formData && type === "Update"
      ? formData
      : SRMVehicleDetailsFormDefaultValues;

  // Define your form
  const form = useForm<z.infer<typeof SRMVehicleDetailsFormSchema>>({
    resolver: zodResolver(SRMVehicleDetailsFormSchema),
    defaultValues: initialValues as SRMVehicleDetailsFormType,
  });

  // Handle logic for adding a new vehicle record
  const handleAddVehicleBooking = async (
    values: SRMVehicleDetailsFormType,
    bookingId: string
  ) => {
    let data;
    if (!!existingVehicleId) {
      // Handle updating an existing vehicle booking record
      data = await updateBookingDataForVehicle(bookingId, existingVehicleId);
    } else {
      //   Handle adding a new vehicle
      const vehicleData = await addVehicleDetailsForm(values);
      const vehicleId = vehicleData.result.id;

      // Handle updating the vehicle booking record
      data = await updateBookingDataForVehicle(bookingId, vehicleId);
    }
    return data;
  };

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
        data = await handleAddVehicleBooking(values, bookingId);
      }

      if (data) {
        await deleteMultipleFiles(deletedFiles);
        sessionStorage.setItem(
          "rentalDetails",
          JSON.stringify(values.rentalDetails)
        );

        toast({
          title: `Vehicle ${type.toLowerCase()} successful`,
          className: "bg-yellow text-white",
        });

        if (type === "Add" && onNextTab) {
          onNextTab();

          window.scrollTo({ top: 0, behavior: "smooth" });
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

  // custom hook to validate complex form fields
  useFormValidationToast(form);

  // Handle selecting a vehicle from the registration number dropdown results to auto fill the form fields.
  const handleVehicleSelect = (
    vehicleRegistrationNumber: string,
    vehicleData: VehicleType | null
  ) => {
    handleVehicleSelection(
      vehicleRegistrationNumber,
      vehicleData,
      form,
      setExistingVehicleId,
      setCurrentVehiclePhoto
    );
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
                      isDisabled={!!existingVehicleId}
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
                      isDisabled={
                        !form.watch("vehicleCategoryId") || !!existingVehicleId
                      }
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
                label="Vehicle Photo"
                description="Vehicle Photo can have a maximum size of 5MB."
                existingFile={currentVehiclePhoto}
                maxSizeMB={5}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.LOGOS}
                isDownloadable={true}
                downloadFileName={"vehicle-photo"}
                setDeletedImages={setDeletedFiles}
                additionalClasses="w-[18rem]"
                isDisabled={!!existingVehicleId}
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
                      <RentalDetailsFormField
                        isDisabled={!!existingVehicleId}
                      />
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
