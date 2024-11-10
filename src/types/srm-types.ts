export interface AddUserFormResponse {
  result: {
    userId: string; // Unique identifier for the user
    userName: string; // User's name
    nationality: string; // User's nationality
    passportNum: string; // User's passport number
    drivingLicenseNum: string; // User's driving license number
    phoneNumber: string; // User's phone number, possibly formatted
    userProfile?: string; // Optional field for the user's profile image or identifier
    countryCode: string; // The country code associated with the user's phone number
    createdAt: string; // Timestamp when the record was created
    updatedAt: string; // Timestamp when the record was last updated
  };
  status: string; // Status message (e.g., 'success', 'error')
  statusCode: number; // HTTP status code (e.g., 200, 400)
}

export interface AddVehicleFormResponse {
  result: {
    vehicleId: string; // Unique identifier for the vehicle
    vehicleCategoryId: string; // Category ID of the vehicle
    vehicleBrandId: string; // Brand ID of the vehicle
    vehicleRegistrationNumber: string; // Registration number of the vehicle
    bookingStartDate: string; // Start date of the booking in ISO format
    bookingEndDate: string; // End date of the booking in ISO format
    createdAt: string; // Timestamp when the record was created
    updatedAt: string; // Timestamp when the record was last updated
  };
  status: string; // Status message (e.g., 'success', 'error')
  statusCode: number; // HTTP status code (e.g., 200, 400)
}

export interface AddPaymentFormResponse {
  result: {
    paymentId: string; // Unique identifier for the payment
    currency: string; // Currency code used for the payment
    advanceAmount: string; // Recorded advance amount
    remainingAmount: string; // Remaining amount
    createdAt: string; // Timestamp when the record was created
    updatedAt: string; // Timestamp when the record was last updated
  };
  status: string; // Status message (e.g., 'success', 'error')
  statusCode: number; // HTTP status code (e.g., 200, 400)
}
