import { Calendar } from "lucide-react";

export const BookingPeriodDisplay = ({
  bookingStartDate,
  bookingEndDate,
}: {
  bookingStartDate: string;
  bookingEndDate: string;
}) => {
  return (
    <div className="flex flex-col gap-4 items-start px-2 py-1 my-3 bg-gray-800 rounded-lg md:items-center md:justify-between md:flex-row h-fit">
      <dl className="flex gap-x-2 items-center px-2 h-full text-sm text-gray-200 rounded-lg">
        <dt className="flex gap-x-1 items-center">
          <span className="gap-1 w-[4.5rem] flex items-center">
            <Calendar /> From
          </span>
          :
        </dt>
        <dd>{new Date(bookingStartDate).toLocaleDateString()}</dd>
      </dl>
      <dl className="flex gap-x-4 items-center px-2 h-full text-sm text-gray-200 rounded-lg">
        <dt className="flex gap-x-1 justify-between items-center w-16">
          <span className="flex gap-1 items-center max-md:min-w-[4.5rem]  w-[4.5rem]">
            <Calendar /> To
          </span>
          :
        </dt>
        <dd className="ml-2">
          {new Date(bookingEndDate).toLocaleDateString()}
        </dd>
      </dl>
    </div>
  );
};
