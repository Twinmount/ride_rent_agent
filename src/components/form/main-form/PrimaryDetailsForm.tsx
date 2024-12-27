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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PrimaryFormSchema } from "@/lib/validator";
import { PrimaryFormDefaultValues } from "@/constants";
import { PrimaryFormType } from "@/types/types";
import YearPicker from "../YearPicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import RentalDetailsFormField from "../RentalDetailsFormField";
import {
  deleteMultipleFiles,
  validateRentalDetails,
  validateSecurityDeposit,
} from "@/helpers/form";
import BrandsDropdown from "../dropdowns/BrandsDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CitiesDropdown from "../dropdowns/CitiesDropdown";
import CategoryDropdown from "../dropdowns/CategoryDropdown";
import VehicleTypesDropdown from "../dropdowns/VehicleTypesDropdown";
import StatesDropdown from "../dropdowns/StatesDropdown";
import { save, StorageKeys } from "@/utils/storage";
import { toast } from "@/components/ui/use-toast";
import { addPrimaryDetailsForm, updatePrimaryDetailsForm } from "@/api/vehicle";
import Spinner from "@/components/general/Spinner";
import { useParams } from "react-router-dom";
import { ApiError } from "@/types/types";
import { GcsFilePaths } from "@/constants/enum";
import MultipleFileUpload from "../file-uploads/MultipleFileUpload";
import AdditionalTypesDropdown from "../dropdowns/AdditionalTypesDropdown";
import SecurityDepositField from "../SecurityDepositField";
<<<<<<< HEAD
import { useFormValidationToast } from "@/hooks/useFormValidationToast";
=======
import { useQueryClient } from "@tanstack/react-query";
>>>>>>> development

type PrimaryFormProps = {
  type: "Add" | "Update";
  formData?: PrimaryFormType | null;
  onNextTab?: () => void;
<<<<<<< HEAD
  initialCountryCode?: string;
=======
>>>>>>> development
  levelsFilled?: number;
};

export default function PrimaryDetailsForm({
  type,
  onNextTab,
  formData,
<<<<<<< HEAD
  initialCountryCode,
=======
>>>>>>> development
  levelsFilled,
}: PrimaryFormProps) {
  const [countryCode, setCountryCode] = useState<string>("");
  const [isPhotosUploading, setIsPhotosUploading] = useState(false);
  const [isLicenseUploading, setIsLicenseUploading] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [isCarsCategory, setIsCarsCategory] = useState(false);
  const [hideCommercialLicenses, setHideCommercialLicenses] = useState(false);

  const queryClient = useQueryClient();

  const { vehicleId, userId } = useParams<{
    vehicleId: string;
    userId: string;
  }>();

<<<<<<< HEAD
  const initialValues =
    formData && type === "Update" ? formData : PrimaryFormDefaultValues;
=======
  const initialValues = formData ? formData : PrimaryFormDefaultValues;
>>>>>>> development

  // Define your form.
  const form = useForm<z.infer<typeof PrimaryFormSchema>>({
    resolver: zodResolver(PrimaryFormSchema),
    defaultValues: initialValues as PrimaryFormType,
    shouldFocusError: true,
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof PrimaryFormSchema>) {
    const rentalError = validateRentalDetails(values.rentalDetails);
    if (rentalError) {
      form.setError("rentalDetails", {
        type: "manual",
        message: rentalError,
      });
      form.setFocus("rentalDetails");
      return;
    }

    const securityDepositError = validateSecurityDeposit(
      values.securityDeposit
    );

    if (securityDepositError) {
      form.setError("securityDeposit", {
        type: "manual",
        message: securityDepositError,
      });
      form.setFocus("securityDeposit");
      return;
    }

    if (isPhotosUploading || isLicenseUploading) {
      toast({
        title: "File Upload in Progress",
        description:
          "Please wait until the file upload completes before submitting the form.",
        duration: 3000,
        className: "bg-orange",
      });
      return;
    }

    // Append other form data
    try {
      let data;
      if (type === "Add") {
        data = await addPrimaryDetailsForm(
          values as PrimaryFormType,
          countryCode,
          userId as string,
          isCarsCategory
        );
      } else if (type === "Update") {
        data = await updatePrimaryDetailsForm(
          vehicleId as string,
          values as PrimaryFormType,
          countryCode as string,
          isCarsCategory
        );
      }

      if (data) {
        await deleteMultipleFiles(deletedFiles);
        toast({
          title: `Vehicle ${type.toLowerCase()} successful`,
          className: "bg-yellow text-white",
        });

        if (type === "Add") {
          save(StorageKeys.VEHICLE_ID, data.result.vehicleId);
          save(StorageKeys.CATEGORY_ID, data.result.vehicleCategory.categoryId);
          save(StorageKeys.VEHICLE_TYPE_ID, data.result.vehicleType.typeId);

          if (onNextTab) onNextTab();
        }
      }
    } catch (error) {
      const apiError = error as ApiError;

      if (
        apiError.response?.data?.error?.message ===
        "We already have a vehicle registered with this registration number"
      ) {
        form.setError("vehicleRegistrationNumber", {
          type: "manual",
          message:
            "This registration number is already registered. Please use a different one.",
        });
        form.setFocus("vehicleRegistrationNumber");
      } else {
        toast({
          variant: "destructive",
          title: `${type} Vehicle failed`,
          description: "Something went wrong",
        });
      }
      console.error(error);
    } finally {
      // invalidating cached data in the listing page
      queryClient.invalidateQueries({
        queryKey: ["primary-details-form", vehicleId],
        exact: true,
      });
    }
  }

  // custom hook to validate complex form fields
  useFormValidationToast(form);

  const vehicleCategoryId = form.watch("vehicleCategoryId");

  // boolean to check whether custom label should show or not
  const isCustomCommercialLicenseLabel = [
    "ff31e5e3-9879-464f-a0dd-97ead07a9f67", // Yachts
    "dd7b3369-688c-471a-b2dc-585d60a757f2", // Leisure Boats
    "3f249138-f0ee-48f2-bc70-db5dcf20f0f3", // Charters
  ].includes(vehicleCategoryId);

  // CategoryDropdown disable if the levels filled is 3
  const isCategoryDisabled = levelsFilled === 3;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5  mx-auto bg-white  rounded-3xl p-2 md:p-4 py-8 !pb-8  "
      >
        <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
          {/* category of the vehicle */}
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
                        form.setValue("vehicleTypeId", "");
                        form.setValue("vehicleBrandId", "");

                        // Reset `commercialLicenses` if the category is bicycles or buggies
                        if (
                          [
                            "b21e0a75-37bc-430b-be3a-c8c0939ef3ec", //buggies
                            "0ad5ac71-5f8f-43c3-952f-a325e362ad87", //bicycles
                          ].includes(value)
                        ) {
                          form.setValue("commercialLicenses", []);
                        }
                      }}
                      value={initialValues.vehicleCategoryId}
                      setIsCarsCategory={setIsCarsCategory}
                      setHideCommercialLicenses={setHideCommercialLicenses}
                      isDisabled={isCategoryDisabled}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    {isCategoryDisabled
                      ? "Cannot change vehicle category for published vehicles"
                      : " select vehicle category"}
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* type of the vehicle */}
          <FormField
            control={form.control}
            name="vehicleTypeId"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Vehicle Type <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
                  <FormControl>
                    <VehicleTypesDropdown
                      vehicleCategoryId={form.watch("vehicleCategoryId")}
                      value={field.value}
                      onChangeHandler={field.onChange}
                      isDisabled={!form.watch("vehicleCategoryId")}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    select vehicle type
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* services dropdown for cars */}
          {isCarsCategory && (
            <FormField
              control={form.control}
              name="additionalVehicleTypes"
              render={({ field }) => (
                <FormItem className="flex mb-2 w-full max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                    <div>
                      Services Offered <br />
                      <span>&#40;optional&#41;</span>
                    </div>

                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <AdditionalTypesDropdown
                        value={field.value || []}
                        onChangeHandler={field.onChange}
                        vehicleTypeId={form.watch("vehicleTypeId")}
                        isDisabled={!form.watch("vehicleTypeId")}
                      />
                    </FormControl>
                    <FormDescription className="ml-2">
                      &#40;optional&#41; Select additional services for this
                      vehicle if available
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />
          )}

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
                    Select your vehicle's Brand
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />
          {/* model name */}
          <FormField
            control={form.control}
            name="vehicleModel"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Model Name <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="eg: 'Model'"
                      {...field}
                      className={`input-field`}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter the model name, e.g., "Mercedes-Benz C-Class 2024
                    Latest Model.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

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

          {/* Vehicle Photos */}
          <FormField
            control={form.control}
            name="vehiclePhotos"
            render={() => (
              <MultipleFileUpload
                name="vehiclePhotos"
                label="Vehicle Photos"
                existingFiles={initialValues.vehiclePhotos || []}
                description="Add Vehicle Photos. Up to 8 photos can be added."
                maxSizeMB={30}
                setIsFileUploading={setIsPhotosUploading}
                bucketFilePath={GcsFilePaths.IMAGE_VEHICLES}
                isFileUploading={isPhotosUploading}
                downloadFileName={
                  formData?.vehicleModel
                    ? ` ${formData.vehicleModel}`
                    : "vehicle-image"
                }
                setDeletedFiles={setDeletedFiles}
              />
            )}
          />

          {/* Mulkia */}
          {!hideCommercialLicenses && (
            <FormField
              control={form.control}
              name="commercialLicenses"
              render={() => (
                <MultipleFileUpload
                  name="commercialLicenses"
                  label={
                    isCustomCommercialLicenseLabel
                      ? "Registration Card / Certificate"
                      : "Registration Card / Mulkia"
                  }
                  existingFiles={initialValues.commercialLicenses || []}
                  description={
                    <>
                      Upload{" "}
                      <span className="font-bold text-yellow">front</span> &{" "}
                      <span className="font-bold text-yellow">back</span> images
                      of the Registration Card /{" "}
                      {isCustomCommercialLicenseLabel
                        ? "Certificate"
                        : "Mulkia"}
                    </>
                  }
                  maxSizeMB={15}
                  setIsFileUploading={setIsLicenseUploading}
                  bucketFilePath={GcsFilePaths.COMMERCIAL_LICENSES}
                  isFileUploading={isLicenseUploading}
                  downloadFileName={
                    formData?.vehicleModel
                      ? `[commercial-license] - ${formData.vehicleModel}`
                      : "[commercial-license]"
                  }
                  setDeletedFiles={setDeletedFiles}
                />
              )}
            />
          )}

          {/* Mulkia Expiry */}
          <FormField
            control={form.control}
            name="commercialLicenseExpireDate"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Registration Card / Mulkia Expiry Date{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName="datePicker text-base -ml-4 "
                      placeholderText="DD/MM/YYYY"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter Registration Card/Mulkia expiry date
                    &#40;DD/MM/YYYY&#41;.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* registered year */}
          <FormField
            control={form.control}
            name="vehicleRegisteredYear"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Registered Year <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <YearPicker
                      onChangeHandler={field.onChange}
                      value={initialValues.vehicleRegisteredYear}
                      placeholder="year"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter registered year
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Specification */}
          <FormField
            control={form.control}
            name="specification"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Specification <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl className="mt-2">
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-x-5 items-center"
                      defaultValue="UAE_SPEC"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="UAE_SPEC" id="UAE_SPEC" />
                        <Label htmlFor="UAE">UAE</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="USA_SPEC" id="USA_SPEC" />
                        <Label htmlFor="USA_SPEC">USA</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OTHERS" id="others" />
                        <Label htmlFor="others">Others</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription className="mt-1 ml-2">
                    Select the regional specification of the vehicle
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* mobile */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  WhatsApp/Mobile <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
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
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter the{" "}
                    <span className="font-semibold text-green-400">
                      WhatsApp
                    </span>{" "}
                    mobile number. This number will receive the direct booking
                    details.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
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
                      Provide rent details. At least one of "day," "week," or
                      "month" must be selected.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              );
            }}
          />

          {/* Location(state) */}
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Location <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <StatesDropdown
                      onChangeHandler={(value) => {
                        field.onChange(value);
                        form.setValue("cityIds", []); //
                      }}
                      value={initialValues.stateId}
                      placeholder="location"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Choose your state/location
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />
          {/* cities */}
          <FormField
            control={form.control}
            name="cityIds"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-52 text-base min-w-52 lg:text-lg">
                  Cities / Serving Areas{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <CitiesDropdown
                      stateId={form.watch("stateId")}
                      value={field.value}
                      onChangeHandler={field.onChange}
                      placeholder="cities"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Select all the cities of operation/serving areas.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Lease */}
          <FormField
            control={form.control}
            name="isLease"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Lease? <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <div className="flex items-center mt-3 space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
                        id="isLease"
                      />
                      <label
                        htmlFor="isLease"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Available for lease?
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription className="mt-1 ml-6">
                    Select if this vehicle is available for lease.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* security deposit */}
          <FormField
            control={form.control}
            name="securityDeposit"
            render={() => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Security Deposit <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <SecurityDepositField />
                  </FormControl>
                  <FormDescription className="ml-8">
                    Specify if a security deposit is required and provide the
                    amount if applicable.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* payment details */}
          <div className="flex mb-2 w-full max-sm:flex-col max-sm:space-y-1">
            <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
              Payment Info <span className="mr-5 max-sm:hidden">:</span>
            </FormLabel>
            <div className="p-2 w-full rounded-lg border-b shadow">
              <FormField
                control={form.control}
                name="isCryptoAccepted"
                render={({ field }) => (
                  <FormItem className="flex mb-2 w-full max-sm:flex-col">
                    <div className="flex-col items-start w-full">
                      <FormControl>
                        <div className="flex items-center mt-3 space-x-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
                            id="isCryptoAccepted"
                          />
                          <label
                            htmlFor="isCryptoAccepted"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Crypto
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription className="mt-1 ml-7">
                        Select if your company accepts payments via
                        cryptocurrency.
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  </FormItem>
                )}
              />

              {/* credit/debit details */}
              <FormField
                control={form.control}
                name="isCreditOrDebitCardsSupported"
                render={({ field }) => (
                  <FormItem className="flex mb-2 w-full max-sm:flex-col">
                    <div className="flex-col items-start w-full">
                      <FormControl>
                        <div className="flex items-center mt-3 space-x-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
                            id="isCreditDebitCard"
                          />
                          <label
                            htmlFor="isCreditDebitCard"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Credit / Debit card
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription className="mt-1 ml-7">
                        Select if your company accepts payments via credit or
                        debit card.
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  </FormItem>
                )}
              />

              {/*Tabby */}
              <FormField
                control={form.control}
                name="isTabbySupported"
                render={({ field }) => (
                  <FormItem className="flex mb-2 w-full max-sm:flex-col">
                    <div className="flex-col items-start w-full">
                      <FormControl>
                        <div className="flex items-center mt-3 space-x-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
                            id="isTabby"
                          />
                          <label
                            htmlFor="isTabby"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Tabby
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription className="mt-1 ml-7">
                        Select if your company accepts payments via Tabby.
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* spot delivery */}
          <FormField
            control={form.control}
            name="isSpotDeliverySupported"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Spot delivery? <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <div className="flex items-center mt-3 space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
                        id="isSpotDeliverySupported"
                      />
                      <label
                        htmlFor="isSpotDeliverySupported"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Offer spot delivery service?
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription className="mt-1 ml-7">
                    Select this option if your company offers on-the-spot
                    delivery services.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full md:w-10/12 lg:w-8/12 mx-auto flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
        >
          {type === "Add" ? "Add Vehicle" : "Update Vehicle"}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
