import React from "react";
import { Link } from "react-router-dom";
import {
  CircleUserRound,
  MapPinned,
  Phone,
  Plane,
  Calendar,
} from "lucide-react";
import MotionDiv from "@/components/framer-motion/MotionDiv";
import { Trip } from "@/types/srm-types";

interface OngoingTripsCardProps {
  trip: Trip;
  onOpenModal: (id: string) => void;
  onEndTrip: (id: string) => void;
}

const OngoingTripsCard: React.FC<OngoingTripsCardProps> = ({
  trip,
  onOpenModal,
  onEndTrip,
}) => {
  return (
    <MotionDiv
      key={trip.id}
      className="flex items-center p-4 w-full max-w-3xl bg-white rounded-md border shadow-md"
    >
      {/* Left Section - Image Placeholder */}
      <div className="mr-4 w-1/4 h-36 bg-gray-200 rounded-md max-md:hidden"></div>

      {/* Right Section - Trip Details */}
      <div className="flex flex-col gap-x-2 w-full">
        <div className="flex flex-col">
          <div className="flex mb-2 border-b flex-between">
            <h3 className="text-lg font-bold">
              {trip.vehicle.vehicleBrand.brandName}
            </h3>
            <p className="text-sm text-gray-600">
              {trip.vehicle.vehicleRegistrationNumber}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            <dl className="flex gap-x-2 items-center text-sm">
              <dt>
                <CircleUserRound />
              </dt>
              <dd>{trip.customer.customerName}</dd>
            </dl>
            <dl className="flex gap-x-2 items-center text-sm">
              <dt>
                <Plane />
              </dt>
              <dd>{trip.customer.passportNumber}</dd>
            </dl>
            <dl className="flex gap-x-2 items-center text-sm">
              <dt>
                <MapPinned />
              </dt>
              <dd>{trip.customer.nationality}</dd>
            </dl>
            <dl className="flex gap-x-2 items-center text-sm">
              <dt>
                <Phone />
              </dt>
              <dd>{trip.customer.phoneNumber}</dd>
            </dl>
          </div>
        </div>

        {/* calendar */}
        <div className="flex flex-col gap-4 items-start px-2 py-1 my-3 bg-gray-800 rounded-lg md:items-center md:justify-between md:flex-row h-fit">
          <dl className="flex gap-x-2 items-center px-2 h-full text-sm text-gray-200 rounded-lg">
            <dt className="flex gap-x-1 items-center">
              <span className="gap-1 w-[4.5rem] flex items-center">
                <Calendar /> From
              </span>
              :
            </dt>
            <dd>{new Date(trip.bookingStartDate).toLocaleDateString()}</dd>
          </dl>
          <dl className="flex gap-x-4 items-center px-2 h-full text-sm text-gray-200 rounded-lg">
            <dt className="flex gap-x-1 justify-between items-center w-16">
              <span className="flex gap-1 items-center max-md:min-w-[4.5rem]  w-[4.5rem]">
                <Calendar /> To
              </span>
              :
            </dt>
            <dd className="ml-2">
              {new Date(trip.bookingEndDate).toLocaleDateString()}
            </dd>
          </dl>
        </div>

        {/* buttons */}
        <div className="gap-x-3 flex-between md:justify-end">
          <div className="w-8 h-8 rounded-full bg-slate-300 md:hidden"></div>

          <div className="flex gap-x-2 items-center">
            <button
              onClick={() => onOpenModal(trip.id)}
              className="px-3 py-1 text-white bg-blue-500 rounded-md"
            >
              Extend Trip
            </button>
            <Link
              to={`/srm/ongoing-trips/${trip.id}`}
              onClick={() => onEndTrip(trip.id)}
              className="px-3 py-1 text-white bg-red-500 rounded-md"
            >
              End Trip
            </Link>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

export default OngoingTripsCard;
