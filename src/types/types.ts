// agent context  type
export type AgentContextType = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  isSmallScreen: boolean
}

export type RegistrationType = {
  mobile: string
  password: string
}

export type CompanyFormType = {
  companyName: string
  companyLogo: string
  commercialLicense: string
  expireDate: Date
  regNumber: string
}

// rental details sub type
export type RentalDetailType = {
  enabled: boolean
  rentInAED?: string
  mileageLimit?: string
}

// primary details form type
export type PrimaryFormType = {
  vehicleId?: string
  vehicleCategoryId: string
  vehicleTypeId: string
  vehicleBrandId: string
  vehicleModel: string
  vehiclePhotos: string[] // Array of  URLs
  vehicleRegistrationNumber: string
  vehicleRegisteredYear: string
  commercialLicenses: string[] // Array of  URLs
  commercialLicenseExpireDate: Date
  isLease: boolean
  specification: 'UAE_SPEC' | 'USA_SPEC' | 'OTHERS'
  rentalDetails: {
    day: RentalDetailType
    week: RentalDetailType
    month: RentalDetailType
  }
  countryCode?: string
  phoneNumber: string
  stateId: string
  cityIds: string[]
}

export type SpecificationFormData = {
  id: string
  name: string
  values: { name: string; label: string; _id: string }[] // Adjusted to include _id
  vehicleCategoryId: string
}

export type TabsTypes = 'primary' | 'specifications' | 'features'

export interface ApiError {
  response?: {
    data?: {
      error?: {
        message?: string
      }
    }
  }
}
