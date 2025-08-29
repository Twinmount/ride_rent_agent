import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import PriceRecommendationBar from "./PriceRecommendationBar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription } from "../ui/form";

type Period = "hourly" | "day" | "week" | "month";

type PriceRec = {
  data?: any;
  enteredValue?: any;
  onApplyBestPrice?: (v: number) => void;
  showBtn?: boolean;
};

type RentalDetailsFieldProps = {
  period: Period;
  description: string;
  isDisabled?: boolean;
  isSRM?: boolean;
  isIndia?: boolean;
  priceRecommendationData?: Record<Period, PriceRec> | any;
};

const RentalDetailField: React.FC<RentalDetailsFieldProps> = ({
  period,
  description,
  isDisabled = false,
  isSRM = false,
  isIndia = false,
  priceRecommendationData,
}) => {
  const { control, watch, clearErrors } = useFormContext();
  const isEnabled = watch(`rentalDetails.${period}.enabled`);

  return (
    <div className="p-2 mb-2 rounded-lg border-b shadow">
      <Controller
        name={`rentalDetails.${period}.enabled` as any}
        control={control}
        render={({ field }) => (
          <div className="flex items-center mt-3 space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={(val: any) => {
                if (isSRM && !val) return;
                field.onChange(val);
                if (!val) clearErrors(["rentalDetails"]);
              }}
              id={`rentalDetails-${period}-enabled`}
              disabled={isDisabled}
              className="w-5 h-5 bg-white"
            />
            <label
              htmlFor={`rentalDetails-${period}-enabled`}
              className="text-base font-medium"
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}{" "}
              <span className="text-sm italic text-gray-700">
                {description}
              </span>
            </label>
          </div>
        )}
      />

      {isEnabled && (
        <>
          <Controller
            name={`rentalDetails.${period}.rentInAED` as any}
            control={control}
            render={({ field }) => (
              <div className="flex items-center mt-2">
                <label
                  htmlFor={`rentalDetails-${period}-rentInAED`}
                  className="block mr-1 mb-5 w-28 text-sm font-medium"
                >
                  Rent in {isIndia ? "INR" : "AED"}
                </label>
                <div className="w-full relative">
                  <Input
                    id={`rentalDetails-${period}-rentInAED`}
                    {...field}
                    placeholder={isIndia ? "Rent in INR" : "Rent in AED"}
                    className="input-field pr-28"
                    type="text"
                    inputMode="numeric"
                    onKeyDown={(e: any) => {
                      if (
                        !/^\d*$/.test(e.key) &&
                        !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(
                          e.key
                        )
                      )
                        e.preventDefault();
                    }}
                    onChange={(e: any) => {
                      field.onChange(e);
                      clearErrors("rentalDetails");
                    }}
                    readOnly={isDisabled}
                  />

                  {/* Position the recommendation button absolutely on the right of the input */}
                  {priceRecommendationData &&
                    priceRecommendationData[period]?.showBtn && (
                      <div className="absolute right-3 top-[36%] transform -translate-y-1/2">
                        <PriceRecommendationBar
                          priceData={priceRecommendationData[period].data}
                          currentPrice={Number(priceRecommendationData[period].enteredValue)}
                          onApplyBestPrice={priceRecommendationData[period].onApplyBestPrice}
                          compact={true}
                          className="!mt-0"
                        />
                      </div>
                    )}

                  <FormDescription>
                    {`Rent of the Vehicle in ${isIndia ? "INR" : "AED"} per ${period}`}
                  </FormDescription>
                </div>
              </div>
            )}
          />

          <Controller
            name={`rentalDetails.${period}.mileageLimit` as any}
            control={control}
            render={({ field }) => (
              <div className="flex items-center mt-2">
                <label
                  htmlFor={`rentalDetails-${period}-mileageLimit`}
                  className="block mb-6 w-28 text-sm font-medium"
                >
                  Mileage Limit
                </label>
                <div className="w-full">
                  <Input
                    id={`rentalDetails-${period}-mileageLimit`}
                    {...field}
                    placeholder="Mileage Limit"
                    className="input-field"
                    type="text"
                    inputMode="numeric"
                    disabled={watch(
                      `rentalDetails.${period}.unlimitedMileage`
                    )}
                    onKeyDown={(e: any) => {
                      if (
                        !/^\d*$/.test(e.key) &&
                        !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(
                          e.key
                        )
                      )
                        e.preventDefault();
                    }}
                    onChange={(e: any) => {
                      field.onChange(e);
                      clearErrors("rentalDetails");
                    }}
                    readOnly={isDisabled}
                  />

                  <FormDescription>
                    {`Mileage of the vehicle per ${period} (KM)`}
                  </FormDescription>
                </div>
              </div>
            )}
          />

          <Controller
            name={`rentalDetails.${period}.unlimitedMileage` as any}
            control={control}
            render={({ field }) => (
              <div className="ml-24 mt-4 flex w-fit max-w-full flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(val: any) => field.onChange(val)}
                    id={`rentalDetails-${period}-unlimitedMileage`}
                    disabled={isDisabled}
                  />
                  <label
                    htmlFor={`rentalDetails-${period}-unlimitedMileage`}
                    className="flex-center gap-x-2 text-sm font-medium leading-none"
                  >
                    Unlimited Mileage
                  </label>
                </div>
                <FormDescription>
                  Check this box if the vehicle has no mileage limit.
                </FormDescription>
              </div>
            )}
          />
        </>
      )}
    </div>
  );
};

const RentalDetailsFormField: React.FC<{
  isDisabled?: boolean;
  isSRM?: boolean;
  isIndia?: boolean;
  priceRecommendationData?: any;
}> = ({ isDisabled = false, isSRM = false, isIndia = false, priceRecommendationData }) => {
  return (
    <div className="flex flex-col">
      <RentalDetailField
        period="hourly"
        description="(Select to set hourly rental rates)"
        isDisabled={isDisabled}
        isSRM={isSRM}
        isIndia={isIndia}
        priceRecommendationData={priceRecommendationData}
      />
      <RentalDetailField
        period="day"
        description="(Select to set daily rental rates)"
        isDisabled={isDisabled}
        isSRM={isSRM}
        isIndia={isIndia}
        priceRecommendationData={priceRecommendationData}
      />
      <RentalDetailField
        period="week"
        description="(Select to set weekly rental rates)"
        isDisabled={isDisabled}
        isSRM={isSRM}
        isIndia={isIndia}
        priceRecommendationData={priceRecommendationData}
      />
      <RentalDetailField
        period="month"
        description="(Select to set monthly rental rates)"
        isDisabled={isDisabled}
        isSRM={isSRM}
        isIndia={isIndia}
        priceRecommendationData={priceRecommendationData}
      />
    </div>
  );
};

export default RentalDetailsFormField;
