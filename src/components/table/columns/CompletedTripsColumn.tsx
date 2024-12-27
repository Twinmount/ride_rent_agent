import { ColumnDef } from "@tanstack/react-table";

export const CompletedTripsColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "vehicle.vehicleBrand.brandName",
    header: "Brand",
    cell: ({ row }) => (
      <span>{row.original.vehicle.vehicleBrand?.brandName || "N/A"}</span>
    ),
  },
  {
    accessorKey: "vehicle.vehiclePhoto",
    header: "Image",
    cell: ({ row }) => {
      const vehiclePhoto = row.original.vehicle.vehiclePhoto;
      return vehiclePhoto ? (
        <div className="w-16 h-16 overflow-hidden rounded-xl bg-slate-300">
          <img
            src={vehiclePhoto}
            alt="Vehicle"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      ) : (
        <div className="w-16 h-16 overflow-hidden rounded-xl flex-center bg-slate-300">
          No Image
        </div>
      );
    },
  },
  {
    accessorKey: "customer.customerName",
    header: "Customer",
    cell: ({ row }) => (
      <span>{row.original.customer?.customerName || "N/A"}</span>
    ),
  },
  {
    accessorKey: "customerPhone",
    header: "Contact Number",
    cell: ({ row }) => {
      const { countryCode, phoneNumber } = row.original.customer || {};
      return (
        <span>
          {countryCode && phoneNumber
            ? `+${countryCode} ${phoneNumber}`
            : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "customer.nationality",
    header: "Nationality",
    cell: ({ row }) => (
      <span>{row.original.customer?.nationality || "N/A"}</span>
    ),
  },
  {
    accessorKey: "customer.drivingLicenseNumber",
    header: "Driving License",
    cell: ({ row }) => (
      <span>{row.original.customer?.drivingLicenseNumber || "N/A"}</span>
    ),
  },
  {
    accessorKey: "bookingStartDate",
    header: "Trip Started",
    cell: ({ row }) => {
      const startDate = row.original.bookingStartDate;
      return (
        <span>{startDate ? new Date(startDate).toLocaleString() : "N/A"}</span>
      );
    },
  },
  {
    accessorKey: "bookingEndDate",
    header: "Trip Ended",
    cell: ({ row }) => {
      const endDate = row.original.bookingEndDate;
      return (
        <span>{endDate ? new Date(endDate).toLocaleString() : "N/A"}</span>
      );
    },
  },
  {
    accessorKey: "customerBookingRemark",
    header: "Remark",
    cell: ({ row }) => (
      <span>{row.original.customerBookingRemark || "No Remark"}</span>
    ),
  },
  // {
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     const trip = row.original;

  //     return (
  //       <div className="flex space-x-2">
  //         {/* View as Link */}
  //         <Link
  //           to={`/completed-trips/${trip.id}`}
  //           className="text-blue-500 underline hover:text-blue-700"
  //         >
  //           View
  //         </Link>

  //         {/* Download Button */}
  //         <Button
  //           onClick={() => handleDownloadModal(trip.id)}
  //           className="text-white bg-green-500 hover:bg-green-600"
  //         >
  //           Download
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
