// Utility function to extract and transform enquiry data from API response
export interface TransformedEnquiry {
  id: string;
  car: {
    name: string;
    image: string;
    location: string;
    registrationNumber: string;
    vehicleCode: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
    avatar: string;
  };
  booking: {
    message: string;
    startDate: string;
    endDate: string;
    duration: number;
    price: number;
    totalAmount: number;
  };
  status: string;
  enquiryDate: string;
  createdAt: string;
}

export interface ApiEnquiry {
  _id: string;
  userId: string;
  agentId: string;
  carId: string;
  message: string;
  status: string;
  rentalStartDate: string;
  rentalEndDate: string;
  name: string;
  phone: string;
  email: string;
  isMasked?: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
  __v: number;
  agent: {
    _id: string;
    agentId: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
    password?: string;
    role?: string;
    profile?: any;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    countryId?: string;
  };
  car: {
    _id: string;
    brandId: string;
    vehicleTypeId: string;
    vehicleCategoryId: string;
    vehicleModel: string;
    registredYear: string;
    stateId: string;
    cityIds: string[];
    vehiclePhotos: string[];
    comercialLicense: string[];
    isDisabled: boolean;
    isModifiedData: boolean;
    newRegistration: boolean;
    vehicleRegistrationNumber: string;
    vehicleSpefication: string;
    rentalDetails: {
      day?: {
        enabled: boolean;
        rentInAED: string;
        mileageLimit?: string;
        unlimitedMileage?: boolean;
      };
      week?: {
        enabled: boolean;
        rentInAED: string;
        mileageLimit?: string;
        unlimitedMileage?: boolean;
      };
      month?: {
        enabled: boolean;
        rentInAED: string;
        mileageLimit?: string;
        unlimitedMileage?: boolean;
      };
      hour?: {
        enabled: boolean;
        rentInAED: string;
        mileageLimit?: string;
        unlimitedMileage?: boolean;
        minBookingHours?: string;
      };
    };
    levelsFilled: number;
    companyId: string;
    vehicleCode: string;
    commercialLicenseExpiryDate: string;
    approvalStatus: string;
    isCryptoAccepted: boolean;
    isTabbySupported: boolean;
    isCreditOrDebitCardsSupported: boolean;
    securityDeposits: {
      enabled: boolean;
      amountInAED: string;
    };
    additionalVehicleTypes: string[];
    isSpotDeliverySupported: boolean;
    isAvailableForLease: boolean;
    countryCode: string;
    phoneNumber: string;
    rank: number;
    description?: string;
    disabledBy?: string;
    rejectionReason?: string;
    vehicleFeatures?: Record<string, any[]>;
    vehicleMetaDescription?: string;
    vehicleMetaTitle?: string;
    vehicleSpecs?: Record<string, any>;
    vehicleTitle?: string;
    vehicleSeriesId?: string;
    vehicleTitleH1?: string;
    isCashSupported?: boolean;
    isUPIAccepted?: boolean;
    isFancyNumber?: boolean;
    isVehicleModified?: boolean;
    location?: {
      type: string;
      coordinates: [number, number];
      address: string;
    };
    mapImage?: string;
    vehicleVideos?: string[];
    disablePriceMatching?: boolean;
  };
}

export const transformEnquiryData = (
  apiEnquiries: any
): TransformedEnquiry[] => {
  return apiEnquiries.map((enquiry: ApiEnquiry) => {
    // Calculate duration in days
    const startDate = new Date(enquiry.rentalStartDate);
    const endDate = new Date(enquiry.rentalEndDate);
    const duration = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Get the best available rental price (prioritize day, then week, then month)
    let price = 0;
    const rentalDetails = enquiry.car.rentalDetails;
    if (rentalDetails.day?.enabled && rentalDetails.day.rentInAED) {
      price = parseFloat(rentalDetails.day.rentInAED);
    } else if (rentalDetails.week?.enabled && rentalDetails.week.rentInAED) {
      price = parseFloat(rentalDetails.week.rentInAED) / 7; // Convert weekly to daily
    } else if (rentalDetails.month?.enabled && rentalDetails.month.rentInAED) {
      price = parseFloat(rentalDetails.month.rentInAED) / 30; // Convert monthly to daily
    } else if (rentalDetails.hour?.enabled && rentalDetails.hour.rentInAED) {
      price = parseFloat(rentalDetails.hour.rentInAED) * 24; // Convert hourly to daily
    }

    // Generate customer avatar from customer name or email
    const generateAvatar = (name: string, email: string): string => {
      if (name && name.trim()) {
        const nameParts = name.trim().split(" ");
        if (nameParts.length >= 2) {
          return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
      }

      const nameParts = email.split("@")[0].split(".");
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      }
      return email.substring(0, 2).toUpperCase();
    };

    // Format enquiry date
    const formatEnquiryDate = (dateString: string): string => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24)
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7)
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

      return date.toLocaleDateString();
    };

    // Get location from coordinates or default
    const getLocation = (): string => {
      if (enquiry.car.location?.address) {
        return enquiry.car.location.address;
      }
      if (enquiry.car.location?.coordinates) {
        return `Location: ${enquiry.car.location.coordinates[1]}, ${enquiry.car.location.coordinates[0]}`;
      }
      return "Location not specified";
    };

    // Get vehicle title or model
    const getVehicleName = (): string => {
      return (
        enquiry.car.vehicleTitle ||
        enquiry.car.vehicleModel ||
        "Unknown Vehicle"
      );
    };

    // Get customer name from the actual customer data
    const getCustomerName = (): string => {
      return enquiry.name || "Unknown Customer";
    };

    // Get customer phone from the actual customer data
    const getCustomerPhone = (): string => {
      return enquiry.phone || "N/A";
    };

    // Get customer email from the actual customer data
    const getCustomerEmail = (): string => {
      return enquiry.email || "N/A";
    };

    return {
      id: enquiry._id,
      car: {
        name: getVehicleName(),
        image: enquiry.car.vehiclePhotos[0] || "/placeholder.svg",
        location: getLocation(),
        registrationNumber: enquiry.car.vehicleRegistrationNumber,
        vehicleCode: enquiry.car.vehicleCode,
      },
      customer: {
        name: getCustomerName(),
        phone: getCustomerPhone(),
        email: getCustomerEmail(),
        avatar: generateAvatar(getCustomerName(), getCustomerEmail()),
      },
      booking: {
        message: enquiry.message,
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
        duration: duration || 1,
        price: Math.round(price),
        totalAmount: Math.round(price * (duration || 1)),
      },
      status: enquiry.status.toLowerCase(),
      enquiryDate: formatEnquiryDate(enquiry.createdAt),
      createdAt: enquiry.createdAt,
    };
  });
};

export const getStatusDisplayName = (status: string): string => {
  switch (status.toLowerCase()) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "cancelled":
      return "Cancelled";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    default:
      return status;
  }
};
