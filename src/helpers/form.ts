import * as z from "zod";
import { PhoneNumberUtil } from "google-libphonenumber";
import {
  FeaturesFormData,
  GetPrimaryForm,
  SpecificationFormData,
} from "@/types/API-types";
import { PrimaryFormType, TabsTypes } from "@/types/types";
import { deleteFile } from "@/api/file-upload";

type SpecificationOption = { label: string; value: string };

// function to create dynamic specification form zod schema based on the currently choose vehicle category
const createSpecificationSchemaForCategory = (
  fields: Record<string, SpecificationOption[]>
) => {
  const schemaObject = Object.keys(fields).reduce((acc, field) => {
    acc[field] = z.string(); // Adjust type according to your needs
    return acc;
  }, {} as Record<string, z.ZodTypeAny>);
  return z.object({ specifications: z.object(schemaObject) });
};

export default createSpecificationSchemaForCategory;

type FeatureOption = { label: string; value: string };

// Function to create dynamic feature form zod schema based on the currently chosen vehicle category
export const createFeatureSchemaForCategory = (
  fields: Record<string, FeatureOption[]>
) => {
  const schemaObject = Object.keys(fields).reduce((acc, field) => {
    acc[field] = z.array(z.string()); // Each field should be an array of strings
    return acc;
  }, {} as Record<string, z.ZodTypeAny>);
  return z.object({ features: z.object(schemaObject) });
};

// mapping function to format the label name .
// For example, "year_of_manufacture" will be converted to "Year Of Manufacturer
export const formatFieldName = (field: string): string => {
  return field
    .replace(/_/g, " ") // Replace underscores with spaces
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join words with spaces
};

// Rental detail type
type RentalDetailType = {
  enabled?: boolean;
  rentInAED?: string;
  mileageLimit?: string;
};

// Hourly rental detail type (with minBookingHours)
type HourlyRentalDetailType = {
  enabled?: boolean;
  rentInAED?: string;
  mileageLimit?: string;
  minBookingHours?: string; // Only for hourly rentals
};

// Rental details type, incorporating hour as an HourlyRentalDetailType
type RentalDetailsType = {
  day: RentalDetailType;
  week: RentalDetailType;
  month: RentalDetailType;
  hour: HourlyRentalDetailType; // Uses HourlyRentalDetailType with minBookingHours
};

// rental details form field validation helper function
export const validateRentalDetails = (
  rentalDetails: RentalDetailsType
): string | null => {
  const { day, week, month, hour } = rentalDetails;

  const message =
    "Rent in AED as well as Mileage should be provided for the checked values";

  // Check if at least one rental period is enabled
  if (!day.enabled && !week.enabled && !month.enabled) {
    return "At least one rental period (day, week, or month) must be enabled";
  }

  // Validate day
  if (day.enabled && (!day.rentInAED || !day.mileageLimit)) {
    return message;
  }

  // Validate week
  if (week.enabled && (!week.rentInAED || !week.mileageLimit)) {
    return message;
  }

  // Validate month
  if (month.enabled && (!month.rentInAED || !month.mileageLimit)) {
    return message;
  }

  // Validate hour, including minBookingHours
  if (hour.enabled) {
    if (!hour.rentInAED || !hour.mileageLimit || !hour.minBookingHours) {
      return "Rent in AED, Mileage Limit, and Minimum Booking Hours are required for hourly rental";
    }
  }

  return null;
};

type SecurityDepositType = {
  enabled: boolean;
  amountInAED?: string;
};

// security deposit form field validation helper function
export const validateSecurityDeposit = (
  securityDeposit: SecurityDepositType
): string | null => {
  if (securityDeposit.enabled && !securityDeposit.amountInAED) {
    return "Please enter a valid deposit amount in AED.";
  }

  // If all validations pass, return null (no error)
  return null;
};

// file upload image file size validator
export const validateFileSize = (file: File, maxSizeMB: number) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// file upload image file dimension validator
export const validateImageDimensions = (
  file: File,
  maxWidth: number,
  maxHeight: number
) => {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const isValid = img.width <= maxWidth && img.height <= maxHeight;
      resolve(isValid);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
};

// phone number validation
const phoneUtil = PhoneNumberUtil.getInstance();
export const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

/**
 * Formats the features data into the required POST request structure.
 *
 * @param {Record<string, string[] | null>} values - The values from the form submission.
 * @param {FeaturesFormData[]} featureData - The feature data returned from the API.
 * @returns {Record<string, { name: string; value: string; selected: boolean }[]>} - The formatted features object for the POST request.
 */
export function formatFeatures(
  values: Record<string, string[] | null>,
  featureData: FeaturesFormData[]
): Record<string, { name: string; value: string; selected: boolean }[]> {
  return Object.entries(values).reduce((acc, [key, selectedValues]) => {
    if (selectedValues && selectedValues.length > 0) {
      const featureOptions = featureData.find(
        (feature) => feature.name === key
      )?.values;

      if (featureOptions) {
        acc[key] = selectedValues.map((value) => {
          const option = featureOptions.find((v) => v.name === value);
          return {
            name: option?.name || value, // The name from the dropdown
            value: option?.label || value, // The label from the dropdown or value if not found
            selected: true, // Always true as it's selected
          };
        });
      }
    }
    return acc;
  }, {} as Record<string, { name: string; value: string; selected: boolean }[]>);
}

/**
 * Formats the specifications data into the required POST request structure.
 *
 * @param {Record<string, string | null>} values - The values from the form submission.
 * @param {SpecificationFormData[]} specData - The specification data returned from the API.
 * @returns {Record<string, { name: string; value: string; selected: boolean; hoverInfo: string }>} - The formatted specifications object for the POST request.
 */
export function formatSpecifications(
  values: Record<string, string | null>,
  specData: SpecificationFormData[]
): Record<
  string,
  { name: string; value: string; selected: boolean; hoverInfo: string }
> {
  return Object.keys(values).reduce((acc, key) => {
    const selectedLabel = values[key] as string;
    const specItem = specData.find((spec) => spec.name === key);

    if (specItem) {
      const selectedValueObj = specItem.values.find(
        (value) => value.name === selectedLabel
      );

      if (selectedValueObj) {
        acc[key] = {
          name: selectedValueObj.name,
          value: selectedValueObj.label,
          selected: true,
          hoverInfo: specItem.hoverInfo, // Adding hoverInfo to the object
        };
      }
    }
    return acc;
  }, {} as Record<string, { name: string; value: string; selected: boolean; hoverInfo: string }>); // Updated return type to include hoverInfo
}

/**
 * Maps data from the `GetPrimaryForm` structure to the `PrimaryFormType` structure.
 *
 * This function is used to transform the data fetched from the API into the format
 * expected by the `PrimaryDetailsForm` component. It handles conversions such as
 * turning a date string into a `Date` object and splitting comma-separated strings
 * into arrays.
 *
 * @param {GetPrimaryForm} data - The data object returned from the API that conforms to the `GetPrimaryForm` type.
 * @returns {PrimaryFormType} The transformed data that conforms to the `PrimaryFormType`, ready to be used in the form.
 */
export function mapGetPrimaryFormToPrimaryFormType(
  data: GetPrimaryForm
): PrimaryFormType {
  // Combine countryCode and phoneNumber into a single phoneNumber string
  const formattedPhoneNumber = `+${data.countryCode}${data.phoneNumber}`;

  return {
    vehicleId: data.vehicleId,
    vehicleCategoryId: data.vehicleCategoryId,
    vehicleTypeId: data.vehicleTypeId,
    vehicleBrandId: data.vehicleBrandId,
    vehicleModel: data.vehicleModel,
    vehiclePhotos: data.vehiclePhotos,
    vehicleRegistrationNumber: data.vehicleRegistrationNumber,
    vehicleRegisteredYear: data.vehicleRegisteredYear,
    commercialLicenses: data.commercialLicenses,
    commercialLicenseExpireDate: data.commercialLicenseExpireDate
      ? new Date(data.commercialLicenseExpireDate)
      : undefined,
    isLease: data.isLease,
    isCryptoAccepted: data.isCryptoAccepted,
    isSpotDeliverySupported: data.isSpotDeliverySupported,
    specification: data.specification as "UAE_SPEC" | "USA_SPEC" | "OTHERS",
    rentalDetails: data.rentalDetails,
    phoneNumber: formattedPhoneNumber, // Set the combined phone number
    stateId: data.stateId,
    cityIds: data.cityIds,
    additionalVehicleTypes: data?.additionalVehicleTypes || [],
    securityDeposit: data.securityDeposit,
    isCreditOrDebitCardsSupported: data.isCreditOrDebitCardsSupported,
    isTabbySupported: data.isTabbySupported,
  };
}

interface TabValidationProps {
  tab: TabsTypes;
  levelsFilled: number;
}

/**
 * Function to validate access to different tabs in the vehicle form process.
 * Returns an object indicating if access is allowed and the relevant message.
 *
 * @function validateTabAccess
 * @param {TabValidationProps} params - The properties required for tab validation.
 * @returns {object} - Returns an object containing `canAccess` boolean and `message`.
 */
export const validateTabAccess = ({
  tab,
  levelsFilled,
}: TabValidationProps): { canAccess: boolean; message: string } => {
  if (tab === "primary" && levelsFilled > 0) {
    return {
      canAccess: false,
      message: "The Primary Details form is already completed.",
    };
  }

  if (tab === "specifications") {
    if (levelsFilled >= 1 && levelsFilled < 2) {
      return {
        canAccess: true,
        message: "",
      }; // Access allowed
    } else if (levelsFilled >= 2) {
      return {
        canAccess: false,
        message: "The Specifications form is already completed.",
      };
    } else {
      return {
        canAccess: false,
        message: "Please complete the Primary Details form to proceed.",
      };
    }
  }

  if (tab === "features") {
    if (levelsFilled >= 2 && levelsFilled < 3) {
      return {
        canAccess: true,
        message: "",
      }; // Access allowed
    } else if (levelsFilled === 3) {
      return {
        canAccess: false,
        message: "The Features form is already completed.",
      };
    } else {
      return {
        canAccess: false,
        message: "Please complete the Specifications form to proceed.",
      };
    }
  }

  return { canAccess: true, message: "" }; // Default case
};

// Type guard to check if a value has the 'selected' property for specification form
export function hasSelected(
  value:
    | { name: string; label: string; _id?: string }
    | { name: string; label: string; selected: boolean }
): value is { name: string; label: string; selected: boolean } {
  return (value as { selected: boolean }).selected !== undefined;
}

// image download helper function
export const downloadFileFromStream = async (
  imagePath: string,
  fileName: string
) => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    const url = `${apiBaseUrl}/file/stream?path=${imagePath}`; // Stream endpoint for download

    // Fetch the image stream from the backend API
    const response = await fetch(url);
    const reader = response.body?.getReader();

    if (!reader) {
      throw new Error("Failed to get reader from stream");
    }

    let chunks: Uint8Array[] = [];
    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          controller.enqueue(value);
          chunks.push(value);
        }
      },
    });

    // Create a blob from the stream
    const blob = await new Response(stream).blob();

    // Extract the file extension directly from the image path
    const extension = imagePath.split(".").pop(); // e.g., 'jpg', 'png'

    // Create an object URL for the blob
    const objectURL = URL.createObjectURL(blob);

    // Trigger the download directly with the correct extension
    const link = document.createElement("a");
    link.href = objectURL;
    link.download = `${fileName}.${extension}`; // Use the extension from the path
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(objectURL);
  } catch (error) {
    throw new Error("Download failed");
  }
};

// Helper function to delete multiple files
export const deleteMultipleFiles = async (
  imagePaths: string[]
): Promise<void> => {
  if (imagePaths.length === 0) return;

  try {
    for (const imagePath of imagePaths) {
      await deleteFile(imagePath); // Call deleteFile API for each image path
    }
  } catch (error) {
    console.error("Error deleting files:", error);
    throw error; // Optional: re-throw the error if you want to handle it in the form
  }
};
