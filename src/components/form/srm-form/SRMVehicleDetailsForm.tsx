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
  createBookingDataForVehicle,
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
import useGetSearchParams from "@/hooks/useGetSearchParams";
import SRMVehicleEditPrompt from "@/components/dialog/SRMVehicleEditPrompt";

type SRMVehicleDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMVehicleDetailsFormType | undefined;
  onNextTab?: () => void;
  refetchLevels?: () => void;
  showDescription?: boolean;
  isDedicatedVehiclePage?: boolean;
};

export default function SRMVehicleDetailsForm({
  type,
  onNextTab,
  formData,
  refetchLevels,
  showDescription = true,
  isDedicatedVehiclePage = false,
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

  // boolean to determine if user reached this form from SRM trip vehicle form
  const srmQueryParam = useGetSearchParams("from", false);
  const isFromSrm = srmQueryParam === "srm";

  console.log("isFromSrm : ", isFromSrm);

  // access vehicleRegistrationNumber from the url search params
  const vehicleRegistrationNumber = useGetSearchParams(
    "vehicleRegistrationNumber"
  );

  // initial default values for the form
  const initialValues =
    formData && type === "Update"
      ? formData
      : {
          ...SRMVehicleDetailsFormDefaultValues,
          ...(vehicleRegistrationNumber && {
            vehicleRegistrationNumber,
          }),
        };

  // Define your form
  const form = useForm<z.infer<typeof SRMVehicleDetailsFormSchema>>({
    resolver: zodResolver(SRMVehicleDetailsFormSchema),
    defaultValues: initialValues as z.infer<typeof SRMVehicleDetailsFormSchema>,
  });

  // Handle logic for adding a new vehicle record
  const handleVehicleSubmit = async (values: SRMVehicleDetailsFormType) => {
    let data;

    // if we are in the dedicated SRMVehicleAddPage or SRMVehicleUpdatePage
    if (isDedicatedVehiclePage) {
      if (type === "Add") {
        data = await addVehicleDetailsForm(values);
      } else if (type === "Update") {
        data = await updateVehicleDetailsForm(vehicleId as string, values);
      }
    } else {
      // else we are in the SRMFormAddPage or SRMFormUpdatePage. which means we need to Create /Update the booking data with the vehicle. No Vehicle-Specific Add or Update occurs here, only the srm booking related logic is added/updated here

      if (existingVehicleId) {
        // creating the booking
        data = await createBookingDataForVehicle(existingVehicleId);
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
      let data = await handleVehicleSubmit(values);

      console.log("handle vehicle submit data : ", data);

      if (data) {
        await deleteMultipleFiles(deletedFiles);

        // if we are in the dedicated SRMVehicleAddPage or SRMVehicleUpdatePage, store the vehicleId in the session storage from the data.result.id. Otherwise, store it from the data.result.vehicle.id
        if (!isDedicatedVehiclePage) {
          console.log(
            "we are now not in the dedicated SRMVehicleAddPage or SRMVehicleUpdatePage"
          );
          sessionStorage.setItem("vehicleId", data.result.vehicle.id);
          sessionStorage.setItem("bookingId", data.result.bookingId);
        }

        sessionStorage.setItem(
          "rentalDetails",
          JSON.stringify(values.rentalDetails)
        );

        queryClient.invalidateQueries({
          queryKey: ["srm-vehicles"],
        });

        if (isDedicatedVehiclePage) {
          // if user reached here from SRM vehicle form, navigate them back that same page, otherwise, navigate to srm vehicle list
          if (isFromSrm) {
            toast({
              title: "Vehicle added successful",
              className: "bg-yellow text-white",
              description: "You can now search for the new vehicle just added",
            });
            navigate("/srm/trips/new");
          } else {
            navigate("/srm/manage-vehicles");
          }
        } else {
          refetchLevels?.();
          if (type === "Add" && onNextTab) {
            toast({
              title: `Vehicle phase success, moving to customer details`,
              className: "bg-yellow text-white",
            });

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

    console.log("vehicleData : ", vehicleData);

    // store vehicleId and bodyType in the session storage
    sessionStorage.setItem("vehicleId", vehicleData?.id as string);
    sessionStorage.setItem("bodyType", vehicleData?.bodyType as string);
  };

  // form fields are disabled if the type is "Update"
  const isFieldsDisabled = !isDedicatedVehiclePage || !!existingVehicleId;

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
              {isDedicatedVehiclePage ? (
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
                value={field.value}
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
              isDisabled={isFieldsDisabled}
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
                disabled={isFieldsDisabled}
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
                disabled={isFieldsDisabled}
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
                disabled={isFieldsDisabled}
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
                disabled={isFieldsDisabled}
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
                disabled={isFieldsDisabled}
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
                disabled={isFieldsDisabled}
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
                dateFormat="dd/MM/yyyy"
                wrapperClassName="datePicker text-base w-full"
                placeholderText="DD/MM/YYYY"
                id="nextServiceDate"
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

        {!!existingVehicleId && (
          <SRMVehicleEditPrompt vehicleId={existingVehicleId} />
        )}

        {/* submit  */}

        {(isDedicatedVehiclePage || type === "Add") && (
          <FormSubmitButton
            text={
              isDedicatedVehiclePage
                ? type === "Add"
                  ? "Add Vehicle"
                  : "Update Vehicle"
                : "Continue to Customer Details"
            }
            isLoading={form.formState.isSubmitting}
            className="mt-6"
          />
        )}
      </FormContainer>
    </Form>
  );
}
