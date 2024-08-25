import * as z from 'zod'

// company registration form schema
export const RegistrationFormSchema = z.object({
  phoneNumber: z.string().min(6, 'Provide a valid mobile  number'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

// Company Form Schema
export const CompanyFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyLogo: z
    .union([
      z.instanceof(File), // For when a file is selected
      z.string(), // For when a URL from backend is used
    ])
    .refine((value) => {
      // Ensure value is either a File or a non-empty string (URL)
      if (value instanceof File) {
        return true
      } else if (typeof value === 'string') {
        return value.trim().length > 0
      }
      return false
    }, 'Logo must be either a valid File or a non-empty URL'),
  commercialLicense: z
    .union([
      z.instanceof(File), // For when a file is selected
      z.string(), // For when a URL from backend is used
    ])
    .refine((value) => {
      // Ensure value is either a File or a non-empty string (URL)
      if (value instanceof File) {
        return true
      } else if (typeof value === 'string') {
        return value.trim().length > 0
      }
      return false
    }, 'Logo must be either a valid File or a non-empty URL'),
  expireDate: z.date(),
  regNumber: z.string().min(1, 'Registration number is required'),
})

// otp page form schema
export const OTPFormSchema = z.object({
  otp: z.string().min(4, 'Provide a valid OTP'),
})

// login form schema
export const LoginFormSchema = z.object({
  phoneNumber: z.string().min(1, 'Provide your registered phone number'),
  password: z.string().min(1, 'Password is required'),
})

// confirm password schema
export const ConfirmPasswordFormSchema = z
  .object({
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // This sets the error on the confirmPassword field
  })

// reset password schema
export const ResetPasswordFormSchema = z.object({
  phoneNumber: z.string().min(1, 'Provide your registered phone number'),
})

// RentalDetailType Schema
const RentalDetailTypeSchema = z.object({
  enabled: z.boolean().optional(),
  rentInAED: z.string().optional(),
  mileageLimit: z.string().optional(),
})

// Primary Form Schema
export const PrimaryFormSchema = z.object({
  vehicleCategoryId: z.string().min(1, 'Category is required'),
  vehicleTypeId: z.string().min(1, 'Type is required'),
  vehicleBrandId: z.string().min(1, 'Brand is required'),
  vehicleModel: z.string().min(1, 'Model is required'),
  vehicleRegistrationNumber: z
    .string()
    .min(1, 'Vehicle registration number is required'),
  vehicleRegisteredYear: z.string().min(1, 'Registered Year is required'),
  vehiclePhotos: z
    .array(
      z.union([
        z.instanceof(File), // For newly uploaded files
        z.string().url('Photo must be a valid URL'), // For existing URLs
      ])
    )
    .max(8, 'You can upload up to 8 photos only')
    .min(1, 'At least one photo is required')
    .refine(
      (arr) =>
        arr.every((item) => item instanceof File || typeof item === 'string'),
      'Each photo must be either a file or a URL'
    ),
  commercialLicenses: z
    .array(
      z.union([
        z.instanceof(File), // For newly uploaded files
        z.string().url('Commercial License (Mulkia) card must be a valid URL'), // For existing URLs
      ])
    )
    .length(2, 'Mulkia/ Registration card (front and back) images are required')
    .refine(
      (arr) =>
        arr.every((item) => item instanceof File || typeof item === 'string'),
      'Commercial License (Mulkia) must be either a file or a URL'
    ),
  commercialLicenseExpireDate: z.date(),
  isLease: z.boolean().default(false),
  specification: z
    .enum(['USA_SPEC', 'UAE_SPEC', 'OTHERS'], {
      required_error: 'Specification is required',
    })
    .default('UAE_SPEC'),
  rentalDetails: z.object({
    day: RentalDetailTypeSchema,
    week: RentalDetailTypeSchema,
    month: RentalDetailTypeSchema,
  }),
  phoneNumber: z.string().min(6, 'Provide a valid mobile number'),
  stateId: z.string().min(1, 'State  is required'),
  cityIds: z
    .array(z.string().min(1, 'City ID is required'))
    .min(1, 'At least one city must be selected'),
})
