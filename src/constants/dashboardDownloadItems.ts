import { Slug } from "@/api/Api-Endpoints";
import { DownloadDialogConfig } from "@/types/srm-types";

export const downloadItems: DownloadDialogConfig[] = [
  {
    label: "Download Bookings",
    slug: Slug.GET_SRM_BOOKINGS_EXCEL,
    fileName: "bookings.xlsx",
    filters: {
      dateRange: true,
      sortOrder: true,
      bookingStatus: true,
    },
  },
  {
    label: "Download Customers",
    slug: Slug.GET_SRM_CUSTOMERS_EXCEL,
    fileName: "customers.xlsx",
    filters: {
      dateRange: true,
      sortOrder: true,
    },
  },
  {
    label: "Download Vehicles",
    slug: Slug.GET_SRM_VEHICLES_EXCEL,
    fileName: "vehicles.xlsx",
    filters: {
      dateRange: true,
      sortOrder: true,
    },
  },
];
