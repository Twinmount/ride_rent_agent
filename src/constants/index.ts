import { CompanyFormType, PrimaryFormType } from '@/types/types'
import { LayoutDashboard, List, UserRoundPen } from 'lucide-react'

// sidebar content
export const sidebarContent = [
  { label: 'Dashboard', icon: LayoutDashboard, link: '/' },
  { label: 'My Listings', icon: List, link: '/listings' },
  {
    label: 'Profile',
    icon: UserRoundPen,
    link: '/profile',
  },
]

// sample vehicle categories
export const VehicleGeneralCategories = [
  {
    id: 1,
    label: 'Car',
    value: 'car',
  },
  {
    id: 2,
    label: 'Sports Car',
    value: 'sports_car',
  },
  {
    id: 3,
    label: 'Cycle',
    value: 'cycle',
  },
  {
    id: 4,
    label: 'Motorcycle',
    value: 'motorcycle',
  },
  {
    id: 5,
    label: 'Sports Bike',
    value: 'sports_bike',
  },
  {
    id: 6,
    label: 'Leisure Boat',
    value: 'leisure_boat',
  },
  {
    id: 7,
    label: 'Charter',
    value: 'charter',
  },
]

// Company registration phase 2 form default values
export const CompanyFormDefaultValues: CompanyFormType = {
  companyName: '',
  companyLogo: '',
  commercialLicense: '',
  expireDate: new Date(),
  regNumber: '',
}

// otp page default value
export const OtpPageDefaultValues = {
  otp: '',
}

// login page default value
export const LoginPageDefaultValues = {
  phoneNumber: '',
  password: '',
}

// primary details form default values
export const PrimaryFormDefaultValues: PrimaryFormType = {
  vehicleCategoryId: '',
  vehicleTypeId: '', //'luxury' for example
  vehicleBrandId: '',
  vehicleModel: '',
  vehiclePhotos: [], //upto 8 photos of the vehicle
  vehicleRegistrationNumber: '',
  vehicleRegisteredYear: '',
  commercialLicenses: [],
  commercialLicenseExpireDate: new Date(),
  isLease: false,
  specification: 'UAE_SPEC',
  rentalDetails: {
    day: { enabled: false, rentInAED: '', mileageLimit: '' },
    week: { enabled: false, rentInAED: '', mileageLimit: '' },
    month: { enabled: false, rentInAED: '', mileageLimit: '' },
  },
  phoneNumber: '',
  stateId: '',
  cityIds: [],
}
