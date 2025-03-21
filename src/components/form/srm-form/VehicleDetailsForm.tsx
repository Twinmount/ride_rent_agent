import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormField } from "@/components/ui/form";
import { SRMVehicleDetailsFormDefaultValues } from "@/constants";
import { SRMVehicleDetailsFormSchema } from "@/lib/validator";
import { SRMVehicleDetailsFormType, VehicleType } from "@/types/srm-types";
import CategoryDropdown from "../dropdowns/CategoryDropdown";
import { toast } from "@/components/ui/use-toast";
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
import { FormContainer } from "../form-ui/FormContainer";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { FormFieldLayout } from "../form-ui/FormFieldLayout";

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
    console.log("vehicle data", vehicleData);
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
      <FormContainer
        onSubmit={form.handleSubmit(onSubmit)}
        description={
          <p className="text-sm italic text-center text-gray-600">
            Add vehicle details here. You can choose existing vehicle &#40;if
            any&#41; by searching registration number
          </p>
        }
        className="mt-2"
      >
        {/* vehicle registration number */}
        <FormField
          control={form.control}
          name="vehicleRegistrationNumber"
          render={({ field }) => (
            <FormFieldLayout
              label="Registration Number"
              description="Add or Search Vehicle Registration Number."
            >
              <VehicleSearch
                value={field.value}
                onChangeHandler={handleVehicleSelect}
                placeholder="Enter / Search Registration Number"
              />
            </FormFieldLayout>
          )}
        />

        {/* vehicle category */}
        <FormField
          control={form.control}
          name="vehicleCategoryId"
          render={({ field }) => (
            <FormFieldLayout
              label="Vehicle Category"
              description="Select the vehicle's Category"
            >
              <CategoryDropdown
                onChangeHandler={(value) => {
                  field.onChange(value);
                  form.setValue("vehicleBrandId", "");
                }}
                value={initialValues.vehicleCategoryId || field.value}
                isDisabled={!!existingVehicleId}
              />
            </FormFieldLayout>
          )}
        />

        {/* brand name */}
        <FormField
          control={form.control}
          name="vehicleBrandId"
          render={({ field }) => (
            <FormFieldLayout
              label="Brand Name"
              description="Select the vehicle's Brand"
            >
              <BrandsDropdown
                vehicleCategoryId={form.watch("vehicleCategoryId")}
                value={field.value}
                onChangeHandler={field.onChange}
                isDisabled={
                  !form.watch("vehicleCategoryId") || !!existingVehicleId
                }
              />
            </FormFieldLayout>
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
          render={() => (
            <FormFieldLayout
              label="  Rental Details "
              description="Provide rent details. All Value Should be provided for calculating rent effectively."
            >
              <RentalDetailsFormField isDisabled={!!existingVehicleId} />
            </FormFieldLayout>
          )}
        />

        {/* submit  */}
        <FormSubmitButton
          text={
            type === "Add"
              ? "Continue to Payment Details"
              : "Update Vehicle Details"
          }
          isLoading={form.formState.isSubmitting}
        />
      </FormContainer>
    </Form>
  );
}
