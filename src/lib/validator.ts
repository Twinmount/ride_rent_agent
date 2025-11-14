import * as z from "zod";

// company registration form schema
export const RegistrationFormSchema = z.object({
  phoneNumber: z.string().min(6, "Provide a valid mobile  number"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  country: z.string().min(1, "Select your country"),
});

// Company Form Schema
export const CompanyFormSchema = (isIndia: boolean) =>
  z
    .object({
      companyName: z
        .string()
        .min(1, "Company name is required")
        .max(50, "Maximum 50 characters allowed"),
      companyLogo: z.string().min(1, "Company logo is required"),
      commercialLicense: z.string().min(1, "Commercial License is required"),
      expireDate: isIndia ? z.date().optional() : z.date(),
      // If noRegNumber is true (used for India), regNumber becomes optional
      noRegNumber: isIndia
        ? z.boolean().optional().default(false)
        : z.boolean().optional().default(false),
      regNumber: z.string().optional(),
      companyAddress: z
        .string()
        .min(5, "Company address is required")
        .max(150, "Address can be up to 150 characters"),
      companyLanguages: z
        .array(z.string())
        .min(1, "At least one language must be selected"),
      accountType: z.enum(["company", "individual"]),
      location: z
        .object({
          lat: z.number(),
          lng: z.number(),
          address: z.string().optional(),
        })
        .refine((val) => val.lat && val.lng, {
          message: "Location is required",
        }),
    })
    .superRefine((data, ctx) => {
      const noReg = (data as any).noRegNumber;
      const reg = (data as any).regNumber;
      if (!noReg) {
        // regNumber is required when noRegNumber is false
        if (!reg || (typeof reg === "string" && reg.trim().length === 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${isIndia ? "GST" : "Registration"} number is required`,
            path: ["regNumber"],
          });
        } else if (isIndia) {
          // if India, validate GST format
          const gstRegex =
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/;
          if (!gstRegex.test(reg)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Invalid GST number format",
              path: ["regNumber"],
            });
          }
        }
      }
    });

// individual Form Schema
export const IndividualFormSchema = z.object({
  companyName: z
    .string()
    .min(1, "Name is required")
    .max(50, "Maximum 50 characters allowed"),
  companyLogo: z.string().min(1, "Photo is required"),
  commercialLicense: z.string().min(1, "Commercial Registration is required"),
  expireDate: z.date(),
  regNumber: z
    .string()
    .min(1, "PAN number is required")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format"),
  companyAddress: z
    .string()
    .min(5, "Address is required")
    .max(150, "Address can be up to 150 characters"),
  companyLanguages: z
    .array(z.string())
    .min(1, "At least one language must be selected"),
  accountType: z.enum(["company", "individual"]),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
      address: z.string().optional(),
    })
    .refine((val) => val.lat && val.lng, {
      message: "Location is required",
    }),
});

// Company Form Schema
export const ProfileUpdateFormSchema = z.object({
  commercialLicense: z.string().min(1, "Commercial License is required"),
  expireDate: z.date().optional(),
  // Allow optional noRegNumber flag to make regNumber optional when true (India only handled in forms)
  noRegNumber: z.boolean().optional().default(false),
  regNumber: z.string().optional(),
  companyAddress: z
    .string()
    .min(5, "Company address is required")
    .max(150, "Address can be up to 150 characters"),
  companyLanguages: z
    .array(z.string())
    .min(1, "At least one language must be selected"),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
      address: z.string().optional(),
    })
    .refine((val) => val.lat && val.lng, {
      message: "Location is required",
    }),
});

// Add object-level validation to conditionally require regNumber based on noRegNumber
export const ProfileUpdateFormSchemaWithConditionalReg =
  ProfileUpdateFormSchema.superRefine((data, ctx) => {
    const noReg = (data as any).noRegNumber;
    const reg = (data as any).regNumber;
    if (!noReg) {
      if (!reg || (typeof reg === "string" && reg.trim().length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Registration number is required",
          path: ["regNumber"],
        });
      }
    }
  });

// otp page form schema
export const OTPFormSchema = z.object({
  otp: z.string().min(4, "Provide a valid OTP"),
});

// login form schema
export const LoginFormSchema = z.object({
  phoneNumber: z.string().min(1, "Provide your registered phone number"),
  password: z.string().min(1, "Password is required"),
  country: z.string().min(1, "Select your country"),
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
  country: z.string().min(1, "Select your country"),
  phoneNumber: z.string().min(1, "Provide your registered phone number"),
});

// Base schema for day/week/month rentals
const RentalDetailTypeSchema = z.object({
  enabled: z.boolean().optional().default(false),
  rentInAED: z.string().optional().default(""),
  mileageLimit: z.string().optional().default(""),
  unlimitedMileage: z.boolean().optional().default(false),
});

// Extended schema for hourly rentals
const HourlyRentalDetailTypeSchema = RentalDetailTypeSchema.extend({
  minBookingHours: z.string().optional().default(""),
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
    isFancyNumber: z.boolean().default(false),
    vehicleRegisteredYear: z.string().min(1, "Year of Manufacture is required"),
    vehiclePhotos: z
      .array(z.string().min(1, "vehicle photo is required"))
      .min(1, "At least one vehicle photo is required"),
    vehicleVideos: z.array(z.string().optional()),
    commercialLicenses: z.array(z.string().optional()),
    commercialLicenseExpireDate: z.date().optional(),
    isLease: z.boolean().default(false),
    isCryptoAccepted: z.boolean().default(false),
    isVehicleModified: z.boolean().default(false),
    isSpotDeliverySupported: z.boolean().default(false),
    specification: z
      .enum(["India_SPEC", "USA_SPEC", "UAE_SPEC", "OTHERS"], {
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
    isCashSupported: z.boolean().default(false),
    isUPIAccepted: z.boolean().default(false),
    tempCitys: z
      .array(
        z.object({
          stateId: z.string(),
          cityId: z.string(),
          cityName: z.string(),
          cityValue: z.string(),
        })
      )
      .optional(),
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
  customerName: z
    .string()
    .min(1, "Customer name is required")
    .max(50, "Maximum 50 characters allowed"),
  email: z.string().email("Provide a valid email address"),
  nationality: z
    .string()
    .min(1, "Nationality is required")
    .max(30, "Maximum 30 characters allowed"),
  passportNumber: z
    .string()
    .min(1, "Passport number is required")
    .max(30, "Maximum 30 characters allowed"),
  passport: z
    .array(z.string().min(1, "Passport image is required"))
    .min(2, "Upload both front and back of the passport"),
  drivingLicenseNumber: z
    .string()
    .min(1, "Driving license number is required")
    .max(30, "Maximum 30 characters allowed"),
  drivingLicense: z
    .array(z.string().min(1, "Driving license image is required"))
    .min(2, "Upload both front and back of the driving license"),
  phoneNumber: z.string().min(6, "Provide a valid mobile number"),
});

export const SRMPublicCustomerDetailsFormSchema = z.object({
  customerProfilePic: z.string().optional(),
  customerName: z
    .string()
    .min(1, "Customer name is required")
    .max(50, "Maximum 50 characters allowed"),
  email: z.string().email("Provide a valid email address"),
  nationality: z
    .string()
    .min(1, "Nationality is required")
    .max(30, "Maximum 30 characters allowed"),
  passportNumber: z
    .string()
    .min(1, "Passport number is required")
    .max(30, "Maximum 30 characters allowed"),
  passport: z
    .array(z.string().min(1, "Passport image is required"))
    .min(2, "Upload both front and back of the passport"),
  drivingLicenseNumber: z
    .string()
    .min(1, "Driving license number is required")
    .max(30, "Maximum 30 characters allowed"),
  drivingLicense: z
    .array(z.string().min(1, "Driving license image is required"))
    .min(2, "Upload both front and back of the driving license"),
  phoneNumber: z.string().min(6, "Provide a valid mobile number"),
});

export const CustomerShareLinkFormSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export const SRMTaxInfoFormSchema = z.object({
  countryId: z.string().min(1, "Country is required"),
  taxNumber: z.string().min(1, "Tax number is required"),
});

export const SRMContractFormSchema = z.object({
  termsNCondition: z
    .string()
    .min(10, "Contract must be at least 10 characters long")
    .max(30000, "Contract length exceeded"),
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
  numberOfPassengers: z.string().min(1, "Number of passengers is required"),
  vehicleColor: z.string().min(1, { message: "Please select a vehicle color" }),
  bodyType: z.string().min(1, { message: "Please select a body type" }),
  chassisNumber: z
    .string()
    .min(1, { message: "Chassis number is required" })
    .max(50, { message: "Chassis number must be at most 50 characters" }),
  additionalMilageChargePerKm: z
    .string()
    .min(1, "Additional milage charge per km is required"),
  registrationDate: z.date(),
  registrationDueDate: z.date(),
  trafficFineId: z
    .string()
    .min(1, { message: "Traffic Fine ID is required" })
    .max(50, { message: "Traffic Fine ID must be at most 50 characters" }),
  lastServiceDate: z.date(),
  currentKilometre: z
    .string()
    .min(1, "Current kilometre (odometer) is required"),
  serviceKilometre: z.string().min(1, "service kilometre is required"),
  nextServiceKilometre: z.string().min(1, "next service kilometre is required"),
  nextServiceDate: z.date(),
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
  advanceAmount: z.string().optional().default("0"),
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
  currentKilometre: z
    .string()
    .min(1, "Current kilometre (odometer) is required"),
});
