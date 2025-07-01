import { SingleVehicleType } from "@/types/API-types";
import { differenceInHours, isValid } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { CustomerType } from "@/types/srm-types";
import { VehicleType } from "@/types/srm-types";
import {
  format,
  differenceInCalendarDays,
  isBefore,
  isAfter,
  isSameDay,
  parseISO,
} from "date-fns";
import { CustomerApiType, DashboardAnalytics } from "@/types/srm-api-types";

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

/**
 * Calculates the total rental amount based on the rental details and booking period.
 *
 * @param rentalDetails - An object containing rates (in AED) for each rental period.
 * @param bookingStartDate - The start date of the booking in string format.
 * @param bookingEndDate - The end date of the booking in string format.
 * @returns The total rental amount for the specified booking period.
 */
export const calculateRentalAmount = (
  rentalDetails: RentalDetails,
  bookingStartDate: string,
  bookingEndDate: string
): number => {
  const startDate = new Date(bookingStartDate);
  const endDate = new Date(bookingEndDate);

  // Calculate total hours between start and end dates
  let remainingHours = differenceInHours(endDate, startDate);
  let totalAmount = 0;

  const hoursInMonth = 24 * 30;
  const hoursInWeek = 24 * 7;
  const hoursInDay = 24;

  // Calculate rental for months
  const months = Math.floor(remainingHours / hoursInMonth);
  if (months > 0) {
    totalAmount += months * parseFloat(rentalDetails.month.rentInAED);
    remainingHours -= months * hoursInMonth;
  }

  // Calculate rental for weeks
  const weeks = Math.floor(remainingHours / hoursInWeek);
  if (weeks > 0) {
    totalAmount += weeks * parseFloat(rentalDetails.week.rentInAED);
    remainingHours -= weeks * hoursInWeek;
  }

  // Calculate rental for days
  const days = Math.floor(remainingHours / hoursInDay);
  if (days > 0) {
    totalAmount += days * parseFloat(rentalDetails.day.rentInAED);
    remainingHours -= days * hoursInDay;
  }

  // Calculate rental for remaining hours
  if (remainingHours > 0) {
    totalAmount += remainingHours * parseFloat(rentalDetails.hour.rentInAED);
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

// Helper function to handle customer selection to auto fill the Customer form
export const handleCustomerSelect = (
  form: UseFormReturn<any, any>,
  customerName: string,
  customerData: CustomerType | null,
  setExistingCustomerId: (id: string | null) => void,
  setCurrentProfilePic: (pic: string | null) => void,
  setCountryCode: (code: string) => void
) => {
  form.setValue("customerName", customerName);

  if (customerData) {
    form.setValue("email", customerData.email || "");
    setExistingCustomerId(customerData.customerId);
    form.setValue("customerProfilePic", customerData.customerProfilePic || "");
    setCurrentProfilePic(customerData.customerProfilePic || "");
    form.setValue("nationality", customerData.nationality || "");
    form.setValue("passportNumber", customerData.passportNumber || "");
    form.setValue("passport", customerData.passport || []);
    form.setValue(
      "drivingLicenseNumber",
      customerData.drivingLicenseNumber || ""
    );

    form.setValue("drivingLicense", customerData.drivingLicense || []);
    form.setValue(
      "phoneNumber",
      (customerData.countryCode || "971") + customerData.phoneNumber || ""
    );
    setCountryCode(customerData.countryCode || "");
  } else {
    setExistingCustomerId(null);
    setCurrentProfilePic(null);
    form.setValue("customerProfilePic", "");
    form.setValue("email", "");
    form.resetField("nationality");
    form.resetField("passportNumber");
    form.resetField("passport");
    form.resetField("drivingLicenseNumber");
    form.resetField("drivingLicense");
    form.resetField("phoneNumber");
    setCountryCode("");
  }
};

export const handleCustomerRefresh = (
  form: UseFormReturn<any, any>,
  customerData: CustomerApiType,
  setExistingCustomerId: (id: string | null) => void,
  setCurrentProfilePic: (pic: string | null) => void,
  setCountryCode: (code: string) => void
) => {
  if (!customerData) return;

  form.setValue("customerName", customerData.customerName || "");
  form.setValue("email", customerData.email || "");
  form.setValue("customerProfilePic", customerData.customerProfilePic || "");
  form.setValue("nationality", customerData.nationality || "");
  form.setValue("passportNumber", customerData.passportNumber || "");
  form.setValue("passport", customerData.passport || []);
  form.setValue(
    "drivingLicenseNumber",
    customerData.drivingLicenseNumber || ""
  );
  form.setValue("drivingLicense", customerData.drivingLicense || []);
  form.setValue(
    "phoneNumber",
    (customerData.countryCode || "971") + customerData.phoneNumber || ""
  );

  setExistingCustomerId(customerData.customerId || null);
  setCurrentProfilePic(customerData.customerProfilePic || null);
  setCountryCode(customerData.countryCode || "");
};

// Helper function to handle vehicle selection to auto fill the SRM Vehicle form
export const handleVehicleSelection = (
  vehicleRegistrationNumber: string,
  vehicleData: VehicleType | null,
  form: any,
  setExistingVehicleId: (id: string | null) => void,
  setCurrentVehiclePhoto: (photo: string | null) => void
) => {
  form.setValue("vehicleRegistrationNumber", vehicleRegistrationNumber);

  if (vehicleData) {
    setExistingVehicleId(vehicleData.id);
    setCurrentVehiclePhoto(vehicleData.vehiclePhoto || "");

    form.setValue(
      "vehicleCategoryId",
      vehicleData.vehicleCategory?.categoryId || ""
    );
    form.setValue("vehicleBrandId", vehicleData.vehicleBrand?.id || "");
    form.setValue("vehiclePhoto", vehicleData.vehiclePhoto || "");

    // New Fields
    form.setValue("numberOfPassengers", vehicleData.numberOfPassengers || "");
    form.setValue("vehicleColor", vehicleData.vehicleColor || "");
    form.setValue("bodyType", vehicleData.bodyType || "");
    form.setValue("chassisNumber", vehicleData.chassisNumber || "");
    form.setValue(
      "additionalMilageChargePerKm",
      vehicleData.additionalMilageChargePerKm || ""
    );
    form.setValue("trafficFineId", vehicleData.trafficFineId || "");
    form.setValue("currentKilometre", vehicleData.currentKilometre || "");
    form.setValue("serviceKilometre", vehicleData.serviceKilometre || "");
    form.setValue(
      "nextServiceKilometre",
      vehicleData.nextServiceKilometre || ""
    );

    // Dates - ensure they exist before setting
    form.setValue("registrationDate", new Date(vehicleData.registrationDate));
    form.setValue(
      "registrationDueDate",
      new Date(vehicleData.registrationDueDate)
    );
    form.setValue("lastServiceDate", new Date(vehicleData.lastServiceDate));
    form.setValue("nextServiceDate", new Date(vehicleData.nextServiceDate));

    // Rental Details
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
  } else {
    // Reset the form if no vehicle is selected
    setExistingVehicleId(null);
    setCurrentVehiclePhoto(null);

    form.resetField("vehicleCategoryId");
    form.resetField("vehicleBrandId");
    form.resetField("vehiclePhoto");
    form.resetField("rentalDetails");
    form.resetField("numberOfPassengers");
    form.resetField("vehicleColor");
    form.resetField("bodyType");
    form.resetField("chassisNumber");
    form.resetField("additionalMilageChargePerKm");
    form.resetField("registrationDate");
    form.resetField("registrationDueDate");
    form.resetField("trafficFineId");
    form.resetField("lastServiceDate");
    form.resetField("currentKilometre");
    form.resetField("serviceKilometre");
    form.resetField("nextServiceKilometre");
    form.resetField("nextServiceDate");
  }
};

// for showing notification like indication in the ongoing srm trips card
export function getExpiryNotificationText(
  bookingStartDate: string,
  bookingEndDate: string
): {
  reminderMessage: string;
  className: string;
} {
  if (!bookingStartDate || !bookingEndDate) {
    return {
      reminderMessage: "Booking date missing",
      className: "text-gray-400",
    };
  }

  const startDate = parseISO(bookingStartDate);
  const endDate = parseISO(bookingEndDate);

  if (!isValid(startDate) || !isValid(endDate)) {
    return {
      reminderMessage: "Invalid date",
      className: "text-gray-400",
    };
  }
  const today = new Date();

  const daysUntilStart = differenceInCalendarDays(startDate, today);
  const daysUntilEnd = differenceInCalendarDays(endDate, today);

  // Case 1: Not started yet
  if (isBefore(today, startDate)) {
    return {
      reminderMessage: `Starts in ${daysUntilStart} day${
        daysUntilStart > 1 ? "s" : ""
      }`,
      className: "text-blue-500",
    };
  }

  // Case 2: Ongoing
  if (!isBefore(today, startDate) && !isAfter(today, endDate)) {
    if (isSameDay(today, endDate)) {
      return {
        reminderMessage: "Ends today",
        className: "text-orange",
      };
    }

    if (daysUntilEnd <= 3) {
      return {
        reminderMessage: `${daysUntilEnd} day${
          daysUntilEnd > 1 ? "s" : ""
        } left`,
        className: "text-orange",
      };
    }

    return {
      reminderMessage: `${daysUntilEnd} day${daysUntilEnd > 1 ? "s" : ""} left`,
      className: "text-yellow",
    };
  }

  // Case 3: Expired
  return {
    reminderMessage: `Ended on ${format(endDate, "dd/MM/yyyy")}`,
    className: "text-red-500",
  };
}

/**
 * Returns an array of dashboard stats objects given the input data from api.
 */
export const getDashboardStats = (data: DashboardAnalytics | undefined) => {
  return [
    {
      title: "Ongoing Trips",
      count: data?.ongoingTripsCount ?? "N/A",
      link: "/srm/ongoing-trips",
      overlayText: "Show Ongoing Trips",
    },
    {
      title: "Completed Trips",
      count: data?.completedTripsCount ?? "N/A",
      link: "/srm/completed-trips",
      overlayText: "Show Completed Trips",
    },
    {
      title: "Vehicle List",
      count: data?.vehicleCount ?? "N/A",
      link: "/srm/manage-vehicles",
      overlayText: "Show Vehicle List",
    },
    {
      title: "Customer List",
      count: data?.customersCount ?? "N/A",
      link: "/srm/customer-list",
      overlayText: "Show Customer List",
    },
  ];
};
