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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PrimaryFormSchema } from "@/lib/validator";
import { getPrimaryFormDefaultValues } from "@/constants";
import { PrimaryFormType } from "@/types/types";
import YearPicker from "../YearPicker";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import RentalDetailsFormField from "../RentalDetailsFormField";
import { validateRentalDetailsAndSecurityDeposit } from "@/helpers/form";
import BrandsDropdown from "../dropdowns/BrandsDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CitiesDropdown from "../dropdowns/CitiesDropdown";
import CategoryDropdown from "../dropdowns/CategoryDropdown";
import VehicleTypesDropdown from "../dropdowns/VehicleTypesDropdown";
import StatesDropdown from "../dropdowns/StatesDropdown";
import { save, StorageKeys } from "@/utils/storage";
import { toast } from "@/components/ui/use-toast";

import { useParams } from "react-router-dom";
import { ApiError } from "@/types/types";
import { GcsFilePaths } from "@/constants/enum";
import MultipleFileUpload from "../file-uploads/MultipleFileUpload";
import AdditionalTypesDropdown from "../dropdowns/AdditionalTypesDropdown";
import SecurityDepositField from "../SecurityDepositField";

import { useFormValidationToast } from "@/hooks/useFormValidationToast";
import { useQueryClient } from "@tanstack/react-query";
import {
  showFileUploadInProgressToast,
  showSuccessToast,
} from "@/utils/toastUtils";
import { handleLevelOneFormSubmission } from "@/utils/form-utils";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { FormContainer } from "../form-ui/FormContainer";
import { FormFieldLayout } from "../form-ui/FormFieldLayout";
import { FormCheckbox } from "../form-ui/FormCheckbox";
import { API } from "@/api/ApiService";

type PrimaryFormProps = {
  type: "Add" | "Update";
  formData?: PrimaryFormType | null;
  onNextTab?: () => void;
  levelsFilled?: number;
  initialCountryCode?: string;
  isIndia?: boolean;
  countryId: string;
};

type CityType = {
  _id?: string;
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
};

export default function PrimaryDetailsForm({
  type,
  onNextTab,
  formData,
  levelsFilled,
  initialCountryCode,
  isIndia = false,
  countryId,
}: PrimaryFormProps) {
  const [isPhotosUploading, setIsPhotosUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isLicenseUploading, setIsLicenseUploading] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [isCarsCategory, setIsCarsCategory] = useState(false);
  const [hideCommercialLicenses, setHideCommercialLicenses] = useState(false);
  const [data, setData] = useState<any | null>(null);

  const [cities, setCities] = useState<CityType[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [temoraryCities, setTemoraryCities] = useState<CityType[]>([]);
  const [countryCode, setCountryCode] = useState<string>(() => {
    const code = initialCountryCode || (isIndia ? "+91" : "+971");
    return code.startsWith("+") ? code : `+${code}`;
  });

  const queryClient = useQueryClient();

  const { vehicleId, userId } = useParams<{
    vehicleId: string;
    userId: string;
  }>();

  useEffect(() => {
    if (initialCountryCode) {
      const normalizedCode = initialCountryCode.startsWith("+")
        ? initialCountryCode
        : `+${initialCountryCode}`;
      setCountryCode(normalizedCode);
    }
  }, [initialCountryCode]);

  useEffect(() => {
    if (!vehicleId) return;
    API.get({ slug: `/vehicle/price-matching/single?vehicleId=${vehicleId}` })
      .then((res: any) => {
        setData(res?.result);
      })
      .catch(() => setData(null));;
  }, [vehicleId]);

  const initialValues = formData
    ? {
      ...formData,
      cityIds: [
        ...formData.cityIds,
        ...(formData.tempCitys ?? []).map((city: CityType) => city.cityId),
      ],
    }
    : getPrimaryFormDefaultValues(isIndia, countryCode);

  // Define your form.
  const form = useForm<z.infer<typeof PrimaryFormSchema>>({
    resolver: zodResolver(PrimaryFormSchema),
    defaultValues: initialValues as PrimaryFormType,
    shouldFocusError: true,
  });

  useEffect(() => {
    if (formData?.tempCitys && Array.isArray(formData.tempCitys)) {
      setCities((prevCities) => {
        const newCities = formData.tempCitys?.filter(
          (newCity: CityType) =>
            !prevCities.some((city) => city.cityId === newCity.cityId)
        );
        return [...prevCities, ...(newCities || [])];
      });

      setTemoraryCities(formData.tempCitys);

      setSelectedCities((prevSelected) => {
        const newCityIds = formData?.tempCitys
          ?.map((city: CityType) => city.cityId)
          .filter((id) => !prevSelected.includes(id));
        return [...prevSelected, ...(newCityIds || [])];
      });
    }
  }, [formData?.tempCitys]);

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof PrimaryFormSchema>) {
    const validationError = validateRentalDetailsAndSecurityDeposit(values);

    if (validationError) {
      form.setError(validationError.fieldName, {
        type: "manual",
        message: validationError.errorMessage,
      });
      form.setFocus(validationError.fieldName);
      return;
    }

    if (isPhotosUploading || isLicenseUploading || isVideoUploading) {
      showFileUploadInProgressToast();
      return;
    }

    const cityIds = selectedCities.filter((city) => !city.includes("temp-"));
    const tempCitys = cities.filter(
      (city) =>
        city.cityId.includes("temp-") && selectedCities.includes(city.cityId)
    );

    try {
      const data = await handleLevelOneFormSubmission(
        type,
        { ...values, cityIds, tempCitys } as PrimaryFormType,
        {
          countryCode,
          userId,
          vehicleId,
          isCarsCategory,
          deletedFiles,
        }
      );

      if (data) {
        showSuccessToast(type);

        if (data.result) {
          setCities((prev) => {
            let approvedCities = prev.filter(
              (city) => !city.cityId.includes("temp-") && !city._id
            );

            return [...approvedCities, ...data.result.tempCitys];
          });
          setSelectedCities([
            ...data.result.city?.map((city: CityType) => city.cityId),
            ...data.result.tempCitys.map((city: CityType) => city.cityId),
          ]);
          setTemoraryCities(data.result.tempCitys);
        }

        setCities((prev) =>
          prev.map((city) => {
            if (
              city.cityId.includes("temp-") &&
              !selectedCities.includes(city.cityId)
            ) {
              const { _id, ...rest } = city; // remove _id
              return rest;
            }
            return city;
          })
        );

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

      queryClient.invalidateQueries({
        queryKey: ["primary-details-form-default"],
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
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        {/* Vehicle Category */}
        <FormField
          control={form.control}
          name="vehicleCategoryId"
          render={({ field }) => (
            <FormFieldLayout
              label="Vehicle Category"
              description={
                isCategoryDisabled
                  ? "Cannot change category of published vehicle"
                  : "Select vehicle category"
              }
            >
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
            </FormFieldLayout>
          )}
        />

        {/* Vehicle Type */}
        <FormField
          control={form.control}
          name="vehicleTypeId"
          render={({ field }) => (
            <FormFieldLayout
              label="Vehicle Type"
              description="Select vehicle type"
            >
              <VehicleTypesDropdown
                vehicleCategoryId={form.watch("vehicleCategoryId")}
                value={field.value}
                onChangeHandler={field.onChange}
                isDisabled={!form.watch("vehicleCategoryId")}
              />
            </FormFieldLayout>
          )}
        />

        {/* services dropdown for cars */}
        {isCarsCategory && (
          <FormField
            control={form.control}
            name="additionalVehicleTypes"
            render={({ field }) => (
              <FormFieldLayout
                label={
                  <div>
                    Services Offered <br />
                    <span>&#40;optional&#41;</span>
                  </div>
                }
                description="(optional) Select additional services for this vehicle if available"
              >
                <AdditionalTypesDropdown
                  value={field.value || []}
                  onChangeHandler={field.onChange}
                  vehicleTypeId={form.watch("vehicleTypeId")}
                  isDisabled={!form.watch("vehicleTypeId")}
                />
              </FormFieldLayout>
            )}
          />
        )}

        {/* Brand  */}
        <FormField
          control={form.control}
          name="vehicleBrandId"
          render={({ field }) => (
            <FormFieldLayout
              label="Brand Name"
              description="Select your vehicle's brand"
            >
              <BrandsDropdown
                vehicleCategoryId={form.watch("vehicleCategoryId")}
                value={field.value}
                onChangeHandler={field.onChange}
                isDisabled={!form.watch("vehicleCategoryId")}
              />
            </FormFieldLayout>
          )}
        />

        {/* Year of Manufacture */}
        <FormField
          control={form.control}
          name="vehicleRegisteredYear"
          render={({ field }) => (
            <FormFieldLayout
              label="Year of Manufacture"
              description="Enter the year in which the vehicle was manufactured."
            >
              <YearPicker
                onChangeHandler={field.onChange}
                value={initialValues.vehicleRegisteredYear}
                placeholder="year"
              />
            </FormFieldLayout>
          )}
        />

        {/* Model Name */}
        <FormField
          control={form.control}
          name="vehicleModel"
          render={({ field }) => (
            <FormFieldLayout
              label="Model Name"
              description={
                <>
                  Enter the model name, e.g.,{" "}
                  <strong>"Mercedes-Benz C-Class 2024 Latest Model."</strong>
                </>
              }
            >
              <Input
                placeholder="e.g., 'Model'"
                {...field}
                className="input-field"
              />
            </FormFieldLayout>
          )}
        />

        {/* is Modified */}
        <FormField
          control={form.control}
          name="isVehicleModified"
          render={({ field }) => (
            <FormFieldLayout
              label="Modified?"
              description="Select this if the vehicle is modified for show/display purposes and can't be used on the road."
            >
              <FormCheckbox
                id="isVehicleModified"
                label="Is this vehicle modified?"
                checked={field.value}
                onChange={field.onChange}
              />
            </FormFieldLayout>
          )}
        />

        {/* vehicle registration number */}
        <FormField
          control={form.control}
          name="vehicleRegistrationNumber"
          render={({ field }) => (
            <FormFieldLayout
              label="Registration Number"
              description={
                <span>
                  Enter your vehicle registration number (e.g.,{" "}
                  <strong>{isIndia ? "KL02AB1234" : "ABC12345"}</strong>).
                  <br />
                  The number should be a combination of letters and numbers,
                  without spaces or special characters, up to 15 characters.
                </span>
              }
            >
              <Input
                placeholder={isIndia ? "e.g., KL02AB1234" : "e.g., ABC12345"}
                {...field}
                className="input-field"
                type="text"
                onKeyDown={(e) => {
                  // Allow only alphanumeric characters and control keys
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
            </FormFieldLayout>
          )}
        />

        <FormField
          control={form.control}
          name="isFancyNumber"
          render={({ field }) => (
            <FormFieldLayout
              label="Fancy Number?"
              description="Select if the vehicle has a fancy number."
            >
              <FormCheckbox
                id="isFancyNumber"
                label="Fancy Number Highlight"
                checked={field.value}
                onChange={field.onChange}
              />
            </FormFieldLayout>
          )}
        />

        {/* Vehicle Photos */}
        <FormField
          control={form.control}
          name="vehiclePhotos"
          render={() => (
            <MultipleFileUpload
              name="vehiclePhotos"
              label="Vehicle Photos & videos"
              existingFiles={initialValues.vehiclePhotos || []}
              description="Add Vehicle Photos / Videos. Up to 8 photos / videos can be added."
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
              isVideoAccepted={false}
              isImageAccepted={true}
            />
          )}
        />

        {/* Vehicle Videos */}
        <FormField
          control={form.control}
          name="vehicleVideos"
          render={() => (
            <MultipleFileUpload
              name="vehicleVideos"
              label="Vehicle Video"
              existingFiles={initialValues.vehicleVideos || []}
              description="Add Vehicle Videos (if any). Up to 1 video can be added."
              maxVideoSizeMB={100}
              setIsFileUploading={setIsVideoUploading}
              bucketFilePath={GcsFilePaths.VIDEO_VEHICLES}
              isFileUploading={isVideoUploading}
              downloadFileName={
                formData?.vehicleModel
                  ? ` ${formData.vehicleModel}`
                  : "vehicle-video"
              }
              setDeletedFiles={setDeletedFiles}
              isVideoAccepted={true}
              isImageAccepted={false}
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
                    ? `Registration Card ${isIndia ? "" : "/ Certificate"}`
                    : `Registration Card  ${isIndia ? "" : "/ Mulkia"}`
                }
                existingFiles={initialValues.commercialLicenses || []}
                description={
                  <>
                    Upload <span className="font-bold text-yellow">front</span>{" "}
                    & <span className="font-bold text-yellow">back</span> images
                    of the Registration Card{" "}
                    {!isIndia
                      ? isCustomCommercialLicenseLabel
                        ? "/ Certificate"
                        : "/ Mulkia"
                      : ""}
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
        {!isIndia && (
          <FormField
            control={form.control}
            name="commercialLicenseExpireDate"
            render={({ field }) => (
              <FormFieldLayout
                label={
                  <span>
                    {`Registration Card ${isIndia ? "" : "/ Mulkia"} Expiry Date`}{" "}
                    <br />
                    <span className="text-sm text-gray-500">(DD/MM/YYYY)</span>
                  </span>
                }
                description={`Enter the expiry date for the Registration Card ${isIndia ? "" : "/ Mulkia"
                  } in the format DD/MM/YYYY.`}
              >
                <DatePicker
                  selected={field.value}
                  onChange={(date: Date | null) => field.onChange(date)}
                  dateFormat="dd/MM/yyyy"
                  wrapperClassName="datePicker text-base -ml-4"
                  placeholderText="DD/MM/YYYY"
                />
              </FormFieldLayout>
            )}
          />
        )}

        {/* Specification */}
        <FormField
          control={form.control}
          name="specification"
          render={({ field }) => (
            <FormFieldLayout
              label="Specification"
              description="Select the regional specification of the vehicle"
            >
              <div className="mt-2">
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-x-5 items-center"
                >
                  {isIndia && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="India_SPEC" id="India_SPEC" />
                      <Label htmlFor="India">India</Label>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="UAE_SPEC" id="UAE_SPEC" />
                    <Label htmlFor="UAE">GCC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="USA_SPEC" id="USA_SPEC" />
                    <Label htmlFor="USA_SPEC">USA</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OTHERS" id="others" />
                    <Label htmlFor="others">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </FormFieldLayout>
          )}
        />

        {/* mobile */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormFieldLayout
              label="Whatsapp/Mobile"
              description={
                <span>
                  Enter the{" "}
                  <span className="font-semibold text-green-400">WhatsApp</span>{" "}
                  mobile number. This number will receive direct booking
                  details.
                </span>
              }
            >
              <PhoneInput
                defaultCountry={isIndia ? "in" : "ae"}
                value={field.value}
                onChange={(value, country) => {
                  field.onChange(value);
                  const newCountryCode = `+${country.country.dialCode}`;
                  setCountryCode(newCountryCode);
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

        {/* rental details */}
        <FormField
          control={form.control}
          name="rentalDetails"
          render={() => {
            const rentalDetails = form.watch("rentalDetails") || {};
            const handleApplyBestPrice = (
              field: "hour" | "day" | "week" | "month",
              value: number
            ) => {
              form.setValue(
                `rentalDetails.${field}.rentInAED` as const,
                value.toString()
              );
            };
            // Helper to get target price
            // Helper to determine if button should show (entered > 1.05 * recommended)
            const shouldShowBtn = (
              entered: string | number | undefined,
              recommended: number | undefined
            ) => {
              const enteredNum = Number(entered);
              const recommendedNum = Number(recommended);

              if (isNaN(recommendedNum) || recommendedNum <= 0) return false;
              if (isNaN(enteredNum) || enteredNum <= 0) return false;

              return enteredNum > recommendedNum * 1.05;
            };
            const priceData = data || {};
            return (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                  Rental Details <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <RentalDetailsFormField
                      isIndia={isIndia}
                      priceRecommendationData={{
                        hour: {
                          data: priceData.hourly,
                          enteredValue: rentalDetails.hour?.rentInAED,
                          onApplyBestPrice: (v) =>
                            handleApplyBestPrice("hour", v),
                          showBtn: shouldShowBtn(
                            rentalDetails.hour?.rentInAED,
                            priceData.hourly
                          ),
                        },
                        day: {
                          data: priceData.daily,
                          enteredValue: rentalDetails.day?.rentInAED,
                          onApplyBestPrice: (v) =>
                            handleApplyBestPrice("day", v),
                          showBtn: shouldShowBtn(
                            rentalDetails.day?.rentInAED,
                            priceData.daily
                          ),
                        },
                        week: {
                          data: priceData.weekly,
                          enteredValue: rentalDetails.week?.rentInAED,
                          onApplyBestPrice: (v) =>
                            handleApplyBestPrice("week", v),
                          showBtn: shouldShowBtn(
                            rentalDetails.week?.rentInAED,
                            priceData.weekly
                          ),
                        },
                        month: {
                          data: priceData.monthly,
                          enteredValue: rentalDetails.month?.rentInAED,
                          onApplyBestPrice: (v) =>
                            handleApplyBestPrice("month", v),
                          showBtn: shouldShowBtn(
                            rentalDetails.month?.rentInAED,
                            priceData.monthly
                          ),
                        },
                      }}
                    />
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
            <FormFieldLayout
              label="Location"
              description={
                isIndia
                  ? "Choose your state and location"
                  : "Choose your state/location"
              }
            >
              <StatesDropdown
                onChangeHandler={(value) => {
                  field.onChange(value);
                  form.setValue("cityIds", []); //
                  form.setValue("tempCitys", []); //
                }}
                value={initialValues.stateId}
                placeholder="location"
                isIndia={isIndia}
                countryId={countryId}
                setCities={setCities}
                setSelectedCities={setSelectedCities}
              />
            </FormFieldLayout>
          )}
        />

        {/* cities */}
        <FormField
          control={form.control}
          name="cityIds"
          render={({ field }) => (
            <FormFieldLayout
              label={
                <span>
                  {isIndia
                    ? "Available Places / Areas"
                    : "City / Serving Areas"}{" "}
                  <br />
                  <span className="text-xs text-gray-500">
                    (multiple selection allowed)
                  </span>
                </span>
              }
              description={
                isIndia
                  ? "Select / Create serviceable. You can select up to 10 serviceable areas."
                  : "Select all the cities of operation/serving areas."
              }
            >
              <CitiesDropdown
                stateId={form.watch("stateId")}
                value={field.value}
                onChangeHandler={field.onChange}
                placeholder="cities"
                setSelectedCities={setSelectedCities}
                selectedCities={selectedCities}
                cities={cities}
                setCities={setCities}
                setTemoraryCities={setTemoraryCities}
                temoraryCities={temoraryCities}
                isTempCreatable={!!isIndia}
              />
            </FormFieldLayout>
          )}
        />

        {/* Lease */}
        <FormField
          control={form.control}
          name="isLease"
          render={({ field }) => (
            <FormFieldLayout
              label="Lease?"
              description="Select if this vehicle is available for lease."
            >
              <FormCheckbox
                id="isLease"
                label="Available for lease?"
                checked={field.value}
                onChange={field.onChange}
              />
            </FormFieldLayout>
          )}
        />

        {/* security deposit */}
        <FormField
          control={form.control}
          name="securityDeposit"
          render={() => (
            <FormFieldLayout
              label="Security Deposit"
              description="Specify if a security deposit is required and provide the amount if applicable."
            >
              <SecurityDepositField isIndia={isIndia} />
            </FormFieldLayout>
          )}
        />

        {/* Payment Info */}
        <div className="mb-2 flex w-full max-sm:flex-col max-sm:space-y-1">
          <FormFieldLayout
            label="Payment Info"
            description="Select the payment methods your company supports."
          >
            <div className="w-full rounded-lg border-b p-2 shadow">
              {/* Crypto */}
              {!isIndia && (
                <FormField
                  control={form.control}
                  name="isCryptoAccepted"
                  render={({ field }) => (
                    <div className="mb-2">
                      <FormCheckbox
                        id="isCryptoAccepted"
                        label="Crypto"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                      <FormDescription className="ml-7 mt-1">
                        Select if your company accepts payments via
                        cryptocurrency.
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  )}
                />
              )}

              {/* Credit/Debit Cards */}
              <FormField
                control={form.control}
                name="isCreditOrDebitCardsSupported"
                render={({ field }) => (
                  <div className="mb-2">
                    <FormCheckbox
                      id="isCreditDebitCard"
                      label="Credit / Debit Card"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                    <FormDescription className="ml-7 mt-1">
                      Select if your company accepts payments via credit or
                      debit cards.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                )}
              />

              {/* Tabby */}
              {!isIndia && (
                <FormField
                  control={form.control}
                  name="isTabbySupported"
                  render={({ field }) => (
                    <div className="mb-2">
                      <FormCheckbox
                        id="isTabby"
                        label="Tabby"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                      <FormDescription className="ml-7 mt-1">
                        Select if your company accepts payments via Tabby.
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  )}
                />
              )}

              {/* Cash */}
              {isIndia && (
                <FormField
                  control={form.control}
                  name="isCashSupported"
                  render={({ field }) => (
                    <div className="mb-2">
                      <FormCheckbox
                        id="isCash"
                        label="Cash"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                      <FormDescription className="ml-7 mt-1">
                        Select if your accepts payments by Cash.
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  )}
                />
              )}
            </div>
          </FormFieldLayout>
        </div>

        {/* spot delivery */}
        <FormField
          control={form.control}
          name="isSpotDeliverySupported"
          render={({ field }) => (
            <FormFieldLayout
              label="Spot Delivery?"
              description="Select this option if your company offers on-the-spot delivery services."
            >
              <FormCheckbox
                id="isSpotDeliverySupported"
                label="Offer spot delivery service?"
                checked={field.value}
                onChange={field.onChange}
              />
            </FormFieldLayout>
          )}
        />

        {/* submit  */}
        <FormSubmitButton
          text={type === "Add" ? "Add Vehicle" : "Update Vehicle"}
          isLoading={form.formState.isSubmitting}
        />
      </FormContainer>
    </Form>
  );
}
