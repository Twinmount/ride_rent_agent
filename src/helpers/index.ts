import { SingleVehicleType } from "@/types/API-types";

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
