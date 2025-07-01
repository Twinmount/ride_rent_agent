export enum Slug {
  // Authentication Endpoints
  LOGIN = "/auth/agent/login",
  REGISTER = "/auth/send-otp",
  VERIFY_OTP = "/auth/verify-otp",
  REFRESH = "/auth/refresh",
  POST_SEND_OTP = "/auth/generate-email-otp",
  GET_IS_EMAIL_ALREADY_VERIFIED = "/auth/is-email-already-verified",
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

  // Country Endpoints
  GET_COUNTRY = "/country",
  GET_ALL_COUNTRY = "/country/list",

  // Cities Endpoints
  GET_ALL_CITIES = "/city/list",

  // vehicles endpoints
  GET_ALL_VEHICLES = "/vehicle/all/modified",
  GET_LEVELS_FILLED = "/vehicle/level-filled",

  // vehicle primary form endPoints
  POST_PRIMARY_FORM = "/vehicle/level-one",
  PUT_PRIMARY_FORM = "/vehicle/level-one",
  GET_PRIMARY_FORM = "/vehicle/level-one",
  GET_PRIMARY_FORM_DEFAULT = "/vehicle/level-one-default",

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

  // SRM
  GET_SRM_LEVELS_FILLED = "/srm-bookings/levels-filled",
  POST_SRM_CUSTOMER_PUBLIC_FORM = "/auth/temp-auth-token",
  GET_SRM_STATUS = "/srm-status",
  GET_SRM_DASHBOARD = "/srm-bookings/dashboard/analytics",

  // SRM CUSTOMERS
  POST_SRM_CUSTOMER_FORM = "/srm-customers",
  PUT_SRM_CUSTOMER_FORM = "/srm-customers",
  GET_SRM_CUSTOMER_FORM = "/srm-customers",
  GET_SRM_CUSTOMER_FORM_BY_ID = "/srm-customers",
  GET_SRM_CUSTOMER_LIST = "/srm-customers/list",
  POST_SEND_LINK_FORM_CUSTOMER_CREATION = "/auth/temp-auth-token",

  // SRM VEHICLES
  POST_SRM_VEHICLE_FORM = "srm-vehicle",
  GET_SRM_VEHICLE_FORM = "srm-vehicle",
  GET_SRM_VEHICLE_LIST = "srm-vehicle/list",
  PUT_SRM_VEHICLE_FORM = "srm-vehicle",

  // SRM VEHICLES CHECKLIST
  GET_SRM_CHECKLIST = "/srm-vehicle/check-list",
  POST_SRM_CHECKLIST = "/srm-vehicle/check-list",
  PUT_SRM_CHECKLIST = "/srm-vehicle/check-list",

  // SRM PAYMENTS
  POST_SRM_PAYMENT_FORM = "/srm-payment",
  GET_SRM_PAYMENT_FORM = "/srm-bookings/payment",
  PUT_SRM_PAYMENT_FORM = "/srm-payment",

  // SRM BOOKINGS (customer, vehicle and payment)
  POST_SRM_BOOKING_VEHICLE = "/srm-bookings/vehicle/v2",
  PUT_SRM_BOOKING_CUSTOMER = "/srm-bookings/customer/v2",
  PUT_SRM_BOOKING_PAYMENT = "/srm-bookings/payment",
  GET_SRM_IS_CUSTOMER_SPAM = "/srm-bookings/customer/is-spammed-customer",
  GET_SRM_UPCOMING_BOOKINGS = "/srm-bookings/vehicle/upcoming-booking-dates",

  //SRM TAX AND CONTRACT INFO
  GET_SRM_USER_TAX_AND_CONTRACT_INFO = "/users/agreement-data",
  PUT_SRM_USER_TAX_AND_CONTRACT_INFO = "/users/agreement-data",

  // SRM TRIPS
  GET_SRM_TRIP_BY_BOOKING_ID = "/srm-bookings",
  GET_SRM_TRIPS = "/srm-bookings/list",
  POST_SRM_END_TRIP = "/srm-bookings/end-trip",
  GET_SRM_END_TRIP = "/srm-bookings/end-trip",
  GET_SRM_EXTEND_TRIP = "/srm-bookings/extend-trip",
  POST_EXTEND_TRIP = "/srm-bookings/extend-trip",

  // SRM EXCEL
  GET_SRM_BOOKINGS_EXCEL = "/srm-bookings/download/excel/bookings",
  GET_SRM_VEHICLES_EXCEL = "/srm-vehicle/download/excel/vehicle/list",
  GET_SRM_CUSTOMERS_EXCEL = "/srm-customers/download/excel/customer/list",

  // SRM PDF
}
