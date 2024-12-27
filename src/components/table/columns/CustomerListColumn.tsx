import { ColumnDef } from "@tanstack/react-table";

export const CustomerListColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "customerProfilePic",
    header: "Photo",
    cell: ({ row }) => {
      const customerProfilePic = row.original.customerProfilePic;

      return customerProfilePic ? (
        <div className="w-12 h-12 overflow-hidden rounded-md bg-slate-300">
          <img
            src={customerProfilePic}
            alt={"customer profile"}
            className="object-cover w-full h-full"
            
          />
        </div>
      ) : (
        <div className="w-12 h-12 overflow-hidden rounded-md bg-slate-300">
          <img
            src={"/assets/img/user-profile.webp"}
            alt={"customer profile"}
            className="object-cover w-full h-full"
          />
        </div>
      );
    },
  },
  // {
  //   accessorKey: "customerName",
  //   header: "Customer Name",
  //   cell: ({ row }) => {
  //     const customerId = row.original.customerId; // Unique user identifier
  //     const customerName = row.original.customerName;

  //     return (
  //       <Link
  //         to={`/srm/customer-details/${customerId}`} // Link to customer details
  //         className="text-blue-500 underline hover:text-blue-700"
  //       >
  //         {customerName}
  //       </Link>
  //     );
  //   },
  // },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => {
      // Unique user identifier
      const customerName = row.original.customerName;

      return <span className="font-semibold">{customerName}</span>;
    },
  },

  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      const phoneNumber = row.original.phoneNumber;
      const countryCode = row.original.countryCode;
      return <span>{`+${countryCode} ${phoneNumber}`}</span>;
    },
  },
  {
    accessorKey: "passportNumber",
    header: "Passport Number",
    cell: ({ row }) => <span>{row.original.passportNumber}</span>,
  },
  {
    accessorKey: "drivingLicenseNumber",
    header: "Driving License Number",
    cell: ({ row }) => <span>{row.original.drivingLicenseNumber}</span>,
  },
  {
    accessorKey: "nationality",
    header: "Nationality",
    cell: ({ row }) => <span>{row.original.nationality}</span>,
  },
  {
    accessorKey: "id",
    header: "Customer ID",
    cell: ({ row }) => {
      const userId = row.original.id;
      return <span>{userId}</span>;
    },
  },
];
