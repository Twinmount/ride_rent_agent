import { SingleVehicleType } from "@/types/API-types";
import { differenceInHours } from "date-fns";

type ApprovalStatusType = "APPROVED" | "UNDER_REVIEW" | "REJECTED" | "PENDING";

// Function to get descriptive message based on approval status
export function getApprovalStatusDescription(status: ApprovalStatusType) {
  switch (status) {
    case "APPROVED":
      return "These are vehicles that are currently live.";
    case "UNDER_REVIEW":
      return "These are registration completed vehicles, but it is currently under review. It will be live soon as the admin approves it.";
    case "REJECTED":
      return "These vehicles have been rejected. Please check the details and resubmit or contact support for further assistance.";
    case "PENDING":
      return "These are vehicles for which the vehicle registration form completion is pending, or vehicle registration is incomplete.";
    default:
      return "Unknown status";
  }
}

// helper function to generate dynamic url for vehicle details page
export function generateModelDetailsUrl(vehicle: SingleVehicleType): string {
  // Fallback values if vehicle details are missing
  const fallbackBrand = "brand";
  const fallbackModel = "model";
  const fallbackState = "state";

  const cleanText = (text: string): string => {
    return text
      .toLowerCase() // Convert to lowercase
      .replace(/ - /g, "-") // Handle hyphens within the string
      .replace(/[^a-z0-9-]+/g, "-") // Replace non-alphanumeric characters and spaces with hyphen
      .replace(/^-+|-+$/g, ""); // Remove any leading or trailing hyphens
  };

  const brand = cleanText(vehicle?.brand.brandName || fallbackBrand);
  const model = cleanText(vehicle?.vehicleModel || fallbackModel);
  const state = cleanText(vehicle?.state.stateValue || fallbackState);

  return `rent-${brand}-${model}-model-in-${state}`;
}

// helper function for debounce
export const debounce = <T extends any[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

interface RentalDetails {
  day: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
  week: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
  month: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
  hour: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    minBookingHours: string;
  };
}

export const calculateRentalAmount = (
  rentalDetails: RentalDetails,
  bookingStartDate: string,
  bookingEndDate: string
): number => {
  const startDate = new Date(bookingStartDate);
  const endDate = new Date(bookingEndDate);

  let remainingHours = differenceInHours(endDate, startDate);
  let totalAmount = 0;

  // Calculate months
  if (rentalDetails.month.enabled && remainingHours >= 24 * 30) {
    const months = Math.floor(remainingHours / (24 * 30));
    totalAmount += months * parseFloat(rentalDetails.month.rentInAED);
    remainingHours -= months * 24 * 30;
  }

  // Calculate weeks
  if (rentalDetails.week.enabled && remainingHours >= 24 * 7) {
    const weeks = Math.floor(remainingHours / (24 * 7));
    totalAmount += weeks * parseFloat(rentalDetails.week.rentInAED);
    remainingHours -= weeks * 24 * 7;
  }

  // Calculate days
  if (rentalDetails.day.enabled && remainingHours >= 24) {
    const days = Math.floor(remainingHours / 24);
    totalAmount += days * parseFloat(rentalDetails.day.rentInAED);
    remainingHours -= days * 24;
  }

  // Calculate hours
  if (rentalDetails.hour.enabled && remainingHours > 0) {
    const minBookingHours = parseInt(
      rentalDetails.hour.minBookingHours || "1",
      10
    );
    if (remainingHours >= minBookingHours) {
      totalAmount += remainingHours * parseFloat(rentalDetails.hour.rentInAED);
    }
  }

  return totalAmount;
};

export const calculateFinalAmount = (
  baseAmount: number,
  additionalChargesTotal: number,
  discount: string
): number => {
  const discountAmount = parseFloat(discount || "0");

  // Add base rental, additional charges total, subtract discount, and add 5% tax
  let finalAmount = baseAmount + additionalChargesTotal - discountAmount;

  // Add 5% tax
  finalAmount += finalAmount * 0.05;

  return finalAmount;
};
