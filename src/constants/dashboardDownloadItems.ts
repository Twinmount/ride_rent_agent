import { Users, Car, MapPinned, ReceiptText } from "lucide-react";

export const dashboardDownloadItems = [
  {
    label: "Download Customer List",
    apiPath: "/api/downloads/customers",
    fileName: "customers.xlsx",
    icon: Users,
  },
  {
    label: "Download Vehicle List",
    apiPath: "/api/downloads/vehicles",
    fileName: "vehicles.xlsx",
    icon: Car,
  },
  {
    label: "Download Trip Details",
    apiPath: "/api/downloads/trips",
    fileName: "trips.xlsx",
    icon: MapPinned,
  },
  {
    label: "Download Receipts",
    apiPath: "/api/downloads/receipts",
    fileName: "receipts.xlsx",
    icon: ReceiptText,
  },
];
