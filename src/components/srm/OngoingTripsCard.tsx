import React from "react";
import { MapPinned, Phone, Plane } from "lucide-react";
import MotionDiv from "@/components/framer-motion/MotionDiv";
import { Trip } from "@/types/srm-types";
import { getExpiryNotificationText } from "@/helpers";
import { TripActionButtons } from "./TripActionButtons";
import { BookingPeriodDisplay } from "./BookingPeriodDisplay";

interface OngoingTripsCardProps {
  trip: Trip;
  onOpenModal: (id: string) => void;
}

export const OngoingTripsCard: React.FC<OngoingTripsCardProps> = ({
  trip,
  onOpenModal,
}) => {
  const { reminderMessage, className } = getExpiryNotificationText(
    trip.bookingStartDate,
    trip.bookingEndDate
  );

  return (
    <MotionDiv
      key={trip.id}
      className="flex items-center p-4 w-full max-w-3xl bg-white rounded-md border shadow-md"
    >
      {/* Left Section - Image Placeholder */}
      <div className="mr-4 w-1/4 h-36 bg-gray-200 overflow-hidden rounded-md max-md:hidden">
        {trip.vehicle.vehiclePhoto ? (
          <img
            src={trip.vehicle.vehiclePhoto}
            className="object-cover w-full h-full"
            alt={trip.vehicle.vehicleBrand.brandName + "image"}
          />
        ) : (
          <span className="flex-center h-full text-sm italic  text-slate-500">
            No Image
          </span>
        )}
      </div>

      {/* Right Section - Trip Details */}
      <div className="flex flex-col gap-x-2 w-full">
        <div className="flex flex-col">
          <div className="flex mb-2 border-b flex-between">
            <h3 className="text-lg font-bold">
              {trip.vehicle.vehicleBrand.brandName}
            </h3>
            <p className="text-sm text-gray-600">
              Reg. No: &nbsp;{trip.vehicle.vehicleRegistrationNumber}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            <dl className="flex gap-x-2 items-center text-sm">
              <dt className="w-6 h-6 rounded-full overflow-hidden">
                {trip.customer.customerProfilePic ? (
                  <img
                    src={trip.customer.customerProfilePic}
                    alt={"profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={"/assets/img/user-profile.webp"}
                    alt={"profile"}
                    className="w-full h-full object-cover"
                  />
                )}
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
              <dd>
                +{trip.customer.countryCode} {trip.customer.phoneNumber}
              </dd>
            </dl>
          </div>
        </div>

        {/* calendar */}
        <BookingPeriodDisplay
          bookingStartDate={trip.bookingStartDate}
          bookingEndDate={trip.bookingEndDate}
        />

        {/* buttons */}
        <div className="gap-x-3 flex-between md:justify-end">
          <div className="w-16 h-10 rounded-xl overflow-hidden bg-slate-300 md:hidden">
            {trip.vehicle.vehiclePhoto ? (
              <img
                src={trip.vehicle.vehiclePhoto}
                className="object-cover w-full h-full"
                alt={trip.vehicle.vehicleBrand.brandName + "image"}
              />
            ) : (
              <span className="flex-center h-full text-xs italic  text-slate-500">
                No Image
              </span>
            )}
          </div>

          {/* notification on expiry */}
          {reminderMessage && (
            <span
              className={`max-md:hidden w-fit p-2 px-4 font-[500] mr-auto text-sm rounded-lg bg-slate-100 ${className}`}
            >
              {reminderMessage}
            </span>
          )}

          <TripActionButtons
            bookingId={trip.bookingId}
            customerId={trip.customer.customerId}
            vehicleId={trip.vehicle.id}
            paymentId={trip.payment.id}
            onExtend={() => onOpenModal(trip.bookingId)}
          />
        </div>
      </div>
    </MotionDiv>
  );
};
