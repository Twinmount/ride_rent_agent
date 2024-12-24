export enum Slug {
  // Authentication Endpoints
  LOGIN = "/auth/agent/login",
  REGISTER = "/auth/send-otp",
  VERIFY_OTP = "/auth/verify-otp",
  REFRESH = "/auth/refresh",
  POST_SEND_OTP = "/auth/generate-email-otp",
  POST_VERIFY_OTP = "/auth/verify-email-otp",
  POST_RESET_PASSWORD = "/auth/reset-password",
  POST_VERIFY_RESET_PASSWORD = "/auth/verify-reset-password-otp",

  // file upload endpoints
  POST_SINGLE_FILE = "/file/upload/single",
  GET_SINGLE_FILE = "/file",
  DELETE_SINGLE_FILE = "/file",
  POST_MULTIPLE_FILES = "/file/upload/multiple",

  // agent end points
  POST_COMPANY = "/company",
  PUT_COMPANY = "/company/seller",
  GET_COMPANY = "/company",
  DELETE_COMPANY = "/company",
  GET_ALL_COMPANY = "/company/list",
  PUT_TOGGLE_VEHICLE_VISIBILITY = "/vehicle/toggle-visibility",

  // user end point
  GET_USER = "/users",

  // Vehicle Categories Endpoints
  GET_ALL_CATEGORIES = "/vehicle-category/list",

  // Vehicle Types Endpoints
  GET_ALL_VEHICLE_TYPE = "/vehicle-type/list",

  // Brands Endpoints
  GET_ALL_BRANDS = "/vehicle-brand/list",
  GET_BRAND = "/vehicle-brand",

  // States Endpoints
  GET_ALL_STATES = "/states/list",

  // Cities Endpoints
  GET_ALL_CITIES = "/city/list",

  // vehicles endpoints
  GET_ALL_VEHICLES = "/vehicle/all/modified",
  GET_LEVELS_FILLED = "/vehicle/level-filled",

  // vehicle primary form endPoints
  POST_PRIMARY_FORM = "/vehicle/level-one",
  PUT_PRIMARY_FORM = "/vehicle/level-one",
  GET_PRIMARY_FORM = "/vehicle/level-one",

  // vehicle specification form endPoints
  GET_SPEC_FORM_FIELD_LIST = "/vehicle-spec/list",
  GET_SPEC_FORM_DATA = "/vehicle/level-two",
  POST_SPECIFICATION_FORM = "/vehicle/level-two",
  PUT_SPECIFICATION_FORM = "/vehicle/level-two",

  // vehicle features form endPoints
  GET_FEATURES_FORM_FIELD_LIST = "/vehicle-features/list",
  POST_FEATURES_FORM = "/vehicle/level-three",
  GET_FEATURES_FORM_DATA = "/vehicle/level-three",
  PUT_FEATURES_FORM_DATA = "/vehicle/level-three",

  // dashboard end points
  GET_ENQUIRIES = "/queries",
  GET_PORTFOLIO = "/portfolio",

  // SRM Form endpoints
  // SRM CUSTOMERS
  POST_SRM_CUSTOMER_FORM = "/srm-customers",
  PUT_SRM_CUSTOMER_FORM = "/srm-customers",
  GET_SRM_CUSTOMER_FORM = "/srm-customers",
  GET_SRM_CUSTOMER_LIST = "/srm-customers/list",

  // SRM VEHICLES
  POST_SRM_VEHICLE_FORM = "srm-vehicle",
  GET_SRM_VEHICLE_FORM = "srm-vehicle",
  GET_SRM_VEHICLE_LIST = "srm-vehicle/list",
  PUT_SRM_VEHICLE_FORM = "srm-vehicle",

  // SRM PAYMENTS
  POST_SRM_PAYMENT_FORM = "/srm-payment",
  GET_SRM_PAYMENT_FORM = "/srm-payment",
  PUT_SRM_PAYMENT_FORM = "/srm-payment",

  // SRM BOOKINGS (customer, vehicle and payment)
  POST_SRM_BOOKING_CUSTOMER = "/srm-bookings/customer",
  PUT_SRM_BOOKING_VEHICLE = "/srm-bookings/vehicle",
  PUT_SRM_BOOKING_PAYMENT = "/srm-bookings/payment",

  // SRM TRIPS
  GET_SRM_TRIPS = "/srm-bookings/list",
  PUT_SRM_END_ACTIVE_TRIP = "/trips/end",
  GET_END_TRIP = "/trips/end-trip",
}
