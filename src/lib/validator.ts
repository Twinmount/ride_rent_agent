import * as z from "zod";

// company registration form schema
export const RegistrationFormSchema = z.object({
  phoneNumber: z.string().min(6, "Provide a valid mobile  number"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

// Company Form Schema
export const CompanyFormSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(50, "Maximum 50 characters allowed"),
  companyLogo: z.string().min(1, "Company logo is required"),
  commercialLicense: z.string().min(1, "Commercial License is required"),
  expireDate: z.date(),
  regNumber: z.string().min(1, "Registration number is required"),
  companyAddress: z
    .string()
    .min(5, "Company address is required")
    .max(150, "Address can be up to 150 characters"),
  companyLanguages: z
    .array(z.string())
    .min(1, "At least one language must be selected"),
});

// Company Form Schema
export const ProfileUpdateFormSchema = z.object({
  commercialLicense: z.string().min(1, "Commercial License is required"),
  expireDate: z.date(),
  regNumber: z.string().min(1, "Registration number is required"),
  companyAddress: z
    .string()
    .min(5, "Company address is required")
    .max(150, "Address can be up to 150 characters"),
  companyLanguages: z
    .array(z.string())
    .min(1, "At least one language must be selected"),
});

// otp page form schema
export const OTPFormSchema = z.object({
  otp: z.string().min(4, "Provide a valid OTP"),
});

// login form schema
export const LoginFormSchema = z.object({
  phoneNumber: z.string().min(1, "Provide your registered phone number"),
  password: z.string().min(1, "Password is required"),
});

// confirm password schema
export const ConfirmPasswordFormSchema = z
  .object({
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This sets the error on the confirmPassword field
  });

// reset password schema
export const ResetPasswordFormSchema = z.object({
  phoneNumber: z.string().min(1, "Provide your registered phone number"),
});

// RentalDetailType Schema for day, week, and month rentals )
const RentalDetailTypeSchema = z.object({
  enabled: z.boolean().optional().default(false),
  rentInAED: z.string().optional().default(""),
  mileageLimit: z.string().optional().default(""),
});

// HourlyRentalDetailType Schema with minBookingHours
const HourlyRentalDetailTypeSchema = z.object({
  enabled: z.boolean().optional().default(false),
  rentInAED: z.string().optional().default(""),
  mileageLimit: z.string().optional().default(""),
  minBookingHours: z.string().optional().default(""), // Only for hourly rentals
});

// Primary Form Schema
export const PrimaryFormSchema = z
  .object({
    vehicleCategoryId: z.string().min(1, "Category is required"),
    vehicleTypeId: z.string().min(1, "Type is required"),
    vehicleBrandId: z.string().min(1, "Brand is required"),
    vehicleModel: z.string().min(1, "Model is required"),
    vehicleRegistrationNumber: z
      .string()
      .min(1, "Vehicle registration number is required")
      .max(15, "Vehicle registration number cannot exceed 15 characters"),
    vehicleRegisteredYear: z.string().min(1, "Registered Year is required"),
    vehiclePhotos: z
      .array(z.string().min(1, "vehicle photo is required"))
      .min(1, "At least one vehicle photo is required"),
    commercialLicenses: z.array(z.string().optional()),
    commercialLicenseExpireDate: z.date(),
    isLease: z.boolean().default(false),
    isCryptoAccepted: z.boolean().default(false),
    isSpotDeliverySupported: z.boolean().default(false),
    specification: z
      .enum(["USA_SPEC", "UAE_SPEC", "OTHERS"], {
        required_error: "Specification is required",
      })
      .default("UAE_SPEC"),
    rentalDetails: z.object({
      day: RentalDetailTypeSchema,
      week: RentalDetailTypeSchema,
      month: RentalDetailTypeSchema,
      hour: HourlyRentalDetailTypeSchema,
    }),
    phoneNumber: z.string().min(6, "Provide a valid mobile number"),
    stateId: z.string().min(1, "State  is required"),
    cityIds: z
      .array(z.string().min(1, "City ID is required"))
      .min(1, "At least one city must be selected"),
    additionalVehicleTypes: z.array(z.string()).optional(),
    securityDeposit: z.object({
      enabled: z.boolean().default(false),
      amountInAED: z.string().optional().default(""),
    }),
    isCreditOrDebitCardsSupported: z.boolean().default(false),
    isTabbySupported: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const categoriesExemptFromLicenses = [
        "0ad5ac71-5f8f-43c3-952f-a325e362ad87", // Bicycles
        "b21e0a75-37bc-430b-be3a-c8c0939ef3ec", // Buggies
      ];

      // If the category is Bicycles or Buggies, commercialLicenses can be skipped
      if (categoriesExemptFromLicenses.includes(data.vehicleCategoryId)) {
        return true;
      }

      // For other categories, ensure exactly 2 commercialLicenses are provided
      return data.commercialLicenses?.length === 2;
    },
    {
      message:
        "Commercial License is  required and must contain both front and back of the document",
      path: ["commercialLicenses"], // Attach error to the correct field
    }
  );

// RentalDetailType Schema for day, week, and month rentals )
const SRMRentalDetailTypeSchema = z.object({
  enabled: z.boolean().default(false),
  rentInAED: z.string().default(""),
  mileageLimit: z.string().default(""),
});

// HourlyRentalDetailType Schema with minBookingHours
const SRMHourlyRentalDetailTypeSchema = z.object({
  enabled: z.boolean().default(false),
  rentInAED: z.string().default(""),
  mileageLimit: z.string().default(""),
  minBookingHours: z.string().default(""),
});

// SRM : Customer Details Form Schema
export const SRMCustomerDetailsFormSchema = z.object({
  customerProfilePic: z.string().optional(),
  customerName: z.string().min(1, "Customer name is required"),
  nationality: z.string().min(1, "Nationality is required"),
  passportNumber: z.string().min(1, "Passport number is required"),
  drivingLicenseNumber: z.string().min(1, "Driving license number is required"),
  phoneNumber: z.string().min(6, "Provide a valid mobile number"),
});

// SRM : Vehicle Details Form Schema
export const SRMVehicleDetailsFormSchema = z.object({
  vehicleCategoryId: z.string().min(1, "Category is required"),
  vehicleBrandId: z.string().min(1, "Brand is required"),
  vehicleRegistrationNumber: z
    .string()
    .min(1, "Vehicle registration number is required")
    .max(15, "Vehicle registration number cannot exceed 15 characters"),
  vehiclePhoto: z.string(),
  rentalDetails: z.object({
    day: SRMRentalDetailTypeSchema,
    week: SRMRentalDetailTypeSchema,
    month: SRMRentalDetailTypeSchema,
    hour: SRMHourlyRentalDetailTypeSchema,
  }),
});

// SRM : Payment Details Form Schema
export const SRMPaymentDetailsFormSchema = z.object({
  currency: z.string().min(1, "Currency is required"),
  advanceAmount: z.string().min(1, "Advance amount is required"),
  remainingAmount: z.string().min(1, "Remaining amount is required"),
  securityDeposit: z.object({
    enabled: z.boolean().default(false),
    amountInAED: z.string().optional().default(""),
  }),
  bookingStartDate: z.date(),
  bookingEndDate: z.date(),
});

// Extend Trip Form Schema
export const ExtendTripSchema = z.object({
  newEndDate: z.date(),
  advanceAmount: z.string().min(1, "Advance amount is required"),
  remainingAmount: z.string().min(1, "Remaining amount is required"),
});

// Trip End Form Schema
export const TripEndFormSchema = z.object({
  customerStatus: z.string().min(1, "Customer status is required"),
  finesCollected: z.any().optional(),
  salikCollected: z.any().optional(),
  additionalCharges: z.any().optional(),
  discounts: z.string().default("0").optional(),
  totalAmountCollected: z.string().min(1, "Total amount is required"),
});
