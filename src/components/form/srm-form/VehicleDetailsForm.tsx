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
import { useNavigate, useParams } from "react-router-dom";
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
import { handleVehicleSelection } from "@/helpers";
import { useFormValidationToast } from "@/hooks/useFormValidationToast";
import { FormContainer } from "../form-ui/FormContainer";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { FormFieldLayout } from "../form-ui/FormFieldLayout";
import { Input } from "@/components/ui/input";
import NumberOfPassengersDropdown from "../dropdowns/NumberOfPassengersDropdown";
import VehicleColorDropdown from "../dropdowns/VehicleColorDropdown";
import BodyTypeDropdown from "../dropdowns/BodyTypeDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQueryClient } from "@tanstack/react-query";

type SRMVehicleDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMVehicleDetailsFormType | undefined;
  onNextTab?: () => void;
  refetchLevels?: () => void;
  isAddOrIncomplete?: boolean;
  showDescription?: boolean;
  isDedicatedAddPage?: boolean;
  setCheckListData?: (value: { vehicleId: string; bodyType: string }) => void;
};

export default function SRMVehicleDetailsForm({
  type,
  onNextTab,
  formData,
  refetchLevels,
  isAddOrIncomplete,
  showDescription = true,
  isDedicatedAddPage = false,
  setCheckListData,
}: SRMVehicleDetailsFormProps) {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    defaultValues: initialValues as z.infer<typeof SRMVehicleDetailsFormSchema>,
  });

  // Handle logic for adding a new vehicle record
  const handleVehicleSubmit = async (values: SRMVehicleDetailsFormType) => {
    let data;

    // if we are in the dedicated SRMVehicleAddPage or SRMVehicleUpdatePage
    if (isDedicatedAddPage) {
      if (type === "Add") {
        data = await addVehicleDetailsForm(values);
      } else if (type === "Update") {
        data = await updateVehicleDetailsForm(vehicleId as string, values);
      }
    } else {
      // else we are in the SRMFormAddPage or SRMFormUpdatePage, which means we need to update the booking data for the vehicle. No Vehicle Specific Add or Update occurs here, only the srm booking related logic is updated here.
      const bookingId = sessionStorage.getItem("bookingId"); // Retrieve bookingId

      if (!bookingId) {
        toast({
          variant: "destructive",
          title: "Booking ID Missing",
          description: "Please complete the Customer Details Form first.",
        });
        return;
      }

      if (existingVehicleId && bookingId) {
        data = await updateBookingDataForVehicle(bookingId, existingVehicleId);

        // saving the vehicle id for the vehicle-check-list form
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error updating vehicle data",
        });
      }
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

    // form submission
    try {
      let data;
      if (isAddOrIncomplete) {
        data = await handleVehicleSubmit(values);
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

        if (isDedicatedAddPage) {
          queryClient.invalidateQueries({
            queryKey: ["srm-vehicles"],
          });
          navigate("/srm/manage-vehicles");
        } else {
          refetchLevels?.();
          if (type === "Add" && onNextTab) {
            onNextTab();

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
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

    setCheckListData?.({
      vehicleId: vehicleData?.id as string,
      bodyType: vehicleData?.bodyType as string,
    });
  };

  // form fields are disabled if the type is "Update"
  const isFieldsDisabled = type === "Update";

  return (
    <Form {...form}>
      <FormContainer
        onSubmit={form.handleSubmit(onSubmit)}
        description={
          type === "Add" && showDescription ? (
            <p className="text-sm italic text-center text-gray-600">
              Add srm vehicle details here. You can choose existing vehicle
              &#40;if any&#41; by searching registration number
            </p>
          ) : null
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
              {isDedicatedAddPage ? (
                <Input
                  placeholder="eg: '12341234'"
                  {...field}
                  className={`input-field !cursor-default !text-gray-700`}
                />
              ) : (
                <VehicleSearch
                  value={field.value}
                  onChangeHandler={handleVehicleSelect}
                  placeholder="Enter / Search Registration Number"
                  isDisabled={isFieldsDisabled}
                />
              )}
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
                isDisabled={!!existingVehicleId || isFieldsDisabled}
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
                  !form.watch("vehicleCategoryId") ||
                  !!existingVehicleId ||
                  isFieldsDisabled
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
              isDisabled={!!existingVehicleId || isFieldsDisabled}
            />
          )}
        />

        {/* Number of Passengers */}
        <FormField
          control={form.control}
          name="numberOfPassengers"
          render={({ field }) => (
            <FormFieldLayout
              label="Number of Passengers"
              description="Select the number of passengers this vehicle can accommodate."
            >
              <NumberOfPassengersDropdown
                value={field.value}
                onChangeHandler={field.onChange}
                isDisabled={!!existingVehicleId || isFieldsDisabled}
              />
            </FormFieldLayout>
          )}
        />

        {/* vehicle color */}
        <FormField
          control={form.control}
          name="vehicleColor"
          render={({ field }) => (
            <FormFieldLayout
              label="Vehicle Color"
              description="Select the color of the vehicle."
            >
              <VehicleColorDropdown
                value={field.value}
                onChangeHandler={field.onChange}
                isDisabled={!!existingVehicleId || isFieldsDisabled}
              />
            </FormFieldLayout>
          )}
        />
        <FormField
          control={form.control}
          name="bodyType"
          render={({ field }) => (
            <FormFieldLayout
              label="Vehicle Body Type"
              description="Select the vehicle body type with visual reference."
            >
              <BodyTypeDropdown
                value={field.value}
                onChangeHandler={field.onChange}
                isDisabled={!!existingVehicleId || isFieldsDisabled}
              />
            </FormFieldLayout>
          )}
        />

        {/* chassis number */}
        <FormField
          control={form.control}
          name="chassisNumber"
          render={({ field }) => (
            <FormFieldLayout
              label="Chassis Number"
              description="Enter the vehicle's chassis number (max 50 characters)."
            >
              <Input
                placeholder="Enter chassis number"
                maxLength={50}
                className="input-field"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.clearErrors("chassisNumber");
                }}
              />
            </FormFieldLayout>
          )}
        />

        {/* additional milage charge */}
        <FormField
          control={form.control}
          name="additionalMilageChargePerKm"
          render={({ field }) => (
            <FormFieldLayout
              label="Additional Mileage Charge per KM"
              description="Enter the per kilometer extra charge for mileage."
            >
              <Input
                placeholder="Enter charge per KM"
                className="input-field"
                type="text"
                inputMode="numeric"
                {...field}
                onKeyDown={(e) => {
                  if (
                    !/^\d*$/.test(e.key) &&
                    ![
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  field.onChange(e);
                  form.clearErrors("additionalMilageChargePerKm");
                }}
              />
            </FormFieldLayout>
          )}
        />

        {/* registration date */}
        <FormField
          control={form.control}
          name="registrationDate"
          render={({ field }) => (
            <FormFieldLayout
              label="Registration Date"
              description="Select the vehicle's official registration date."
            >
              <DatePicker
                selected={field.value}
                onChange={(date: Date | null) => field.onChange(date)}
                dateFormat="dd/MM/yyyy"
                wrapperClassName="datePicker text-base w-full"
                placeholderText="DD/MM/YYYY"
                id="registrationDate"
                minDate={new Date()}
                disabled={isFieldsDisabled}
              />
            </FormFieldLayout>
          )}
        />

        {/* registration due date */}
        <FormField
          control={form.control}
          name="registrationDueDate"
          render={({ field }) => (
            <FormFieldLayout
              label="Registration Due Date"
              description="Select the date when the registration is due for renewal."
            >
              <DatePicker
                selected={field.value}
                onChange={(date: Date | null) => field.onChange(date)}
                dateFormat="dd/MM/yyyy"
                wrapperClassName="datePicker text-base w-full"
                placeholderText="DD/MM/YYYY"
                id="registrationDueDate"
                minDate={new Date()}
                disabled={isFieldsDisabled}
              />
            </FormFieldLayout>
          )}
        />

        {/* traffic fine id */}
        <FormField
          control={form.control}
          name="trafficFineId"
          render={({ field }) => (
            <FormFieldLayout
              label="Traffic Fine ID"
              description="Enter the associated traffic fine ID (max 50 characters)."
            >
              <Input
                placeholder="Enter Traffic Fine ID"
                maxLength={50}
                className="input-field"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.clearErrors("trafficFineId");
                }}
              />
            </FormFieldLayout>
          )}
        />

        {/* last service date */}
        <FormField
          control={form.control}
          name="lastServiceDate"
          render={({ field }) => (
            <FormFieldLayout
              label="Last Service Date"
              description="Select the date when the vehicle was last serviced."
            >
              <DatePicker
                selected={field.value}
                onChange={(date: Date | null) => field.onChange(date)}
                dateFormat="dd/MM/yyyy"
                wrapperClassName="datePicker text-base w-full"
                placeholderText="DD/MM/YYYY"
                id="lastServiceDate"
                minDate={new Date()}
                disabled={isFieldsDisabled}
              />
            </FormFieldLayout>
          )}
        />

        {/* current kilometre */}
        <FormField
          control={form.control}
          name="currentKilometre"
          render={({ field }) => (
            <FormFieldLayout
              label="Current Kilometre"
              description="Enter the current odometer reading (in KM)."
            >
              <Input
                placeholder="Enter current KM"
                className="input-field"
                type="text"
                inputMode="numeric"
                {...field}
                onKeyDown={(e) => {
                  if (
                    !/^\d*$/.test(e.key) &&
                    ![
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  field.onChange(e);
                  form.clearErrors("currentKilometre");
                }}
              />
            </FormFieldLayout>
          )}
        />

        <FormField
          control={form.control}
          name="serviceKilometre"
          render={({ field }) => (
            <FormFieldLayout
              label="Service Kilometre"
              description="Enter the service in Kilometre."
            >
              <Input
                placeholder="Enter service KM"
                className="input-field"
                type="text"
                inputMode="numeric"
                {...field}
                onKeyDown={(e) => {
                  if (
                    !/^\d*$/.test(e.key) &&
                    ![
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  field.onChange(e);
                  form.clearErrors("currentKilometre");
                }}
              />
            </FormFieldLayout>
          )}
        />

        {/* service kilometre */}
        <FormField
          control={form.control}
          name="nextServiceKilometre"
          render={({ field }) => (
            <FormFieldLayout
              label="Next Service Kilometre"
              description="Enter the kilometre value at which the next service is due."
            >
              <Input
                placeholder="Enter service KM"
                className="input-field"
                type="text"
                inputMode="numeric"
                {...field}
                onKeyDown={(e) => {
                  if (
                    !/^\d*$/.test(e.key) &&
                    ![
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  field.onChange(e);
                  form.clearErrors("nextServiceKilometre");
                }}
              />
            </FormFieldLayout>
          )}
        />

        {/* next service date */}
        <FormField
          control={form.control}
          name="nextServiceDate"
          render={({ field }) => (
            <FormFieldLayout
              label="Next Service Date"
              description="Select the scheduled date for the next service."
            >
              <DatePicker
                selected={field.value}
                onChange={(date: Date | null) => field.onChange(date)}
                showTimeSelect
                timeInputLabel="Time:"
                dateFormat="dd/MM/yyyy h:mm aa"
                wrapperClassName="datePicker text-base w-full"
                placeholderText="DD/MM/YYYY"
                id="nextServiceDate"
                minDate={new Date()}
                disabled={isFieldsDisabled}
              />
            </FormFieldLayout>
          )}
        />

        {/* rental details */}
        <FormField
          control={form.control}
          name="rentalDetails"
          render={() => (
            <FormFieldLayout
              label={<>Rental Details</>}
              description="Provide rent details. All Value Should be provided for calculating rent effectively."
            >
              <RentalDetailsFormField
                isDisabled={!!existingVehicleId || isFieldsDisabled}
                isSRM={true}
              />
            </FormFieldLayout>
          )}
        />

        {/* submit  */}
        {type === "Add" && (
          <FormSubmitButton
            text={
              isDedicatedAddPage
                ? "Add Vehicle"
                : type === "Add"
                ? "Continue to Payment Details"
                : "Update Vehicle Details"
            }
            isLoading={form.formState.isSubmitting}
            className="mt-6 "
          />
        )}
      </FormContainer>
    </Form>
  );
}
