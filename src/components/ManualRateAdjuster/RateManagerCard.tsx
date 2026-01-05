import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API } from "@/api/ApiService";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAgentContext } from "@/context/AgentContext";

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const updateVehicleRatesApi = (vehicleId: string, body: any) =>
  API.patch({ slug: `/vehicle/${vehicleId}/rates`, body });

function validateManualInput(
  rate: number,
  discount: number,
  selectedDays: string[],
  recurring: boolean
) {
  if (rate < 0) return "Rate must be ≥ 0";
  if (discount < 0 || discount > 100) return "Discount must be 0–100";
  if (
    recurring &&
    discount > 0 &&
    (!selectedDays || selectedDays.length === 0)
  ) {
    return "Select at least one day";
  }
  return null;
}

function DaySelector({
  selectedDays,
  onToggle,
  title,
}: {
  selectedDays: string[];
  onToggle: (day: string) => void;
  title: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {days.map((day) => (
        <button
          key={day}
          type="button"
          aria-pressed={selectedDays.includes(day)}
          aria-label={`Toggle ${day} for ${title} Rental`}
          className={`w-8 h-8 rounded-full border text-sm font-medium transition-colors ${
            selectedDays.includes(day)
              ? "bg-[#fea632] border-[#fea632] text-white"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
          }`}
          onClick={() => onToggle(day)}
        >
          {day}
        </button>
      ))}
    </div>
  );
}

function NoSpinnerInput({ value, onChange, ...props }: any) {
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={(e) =>
        onChange({ target: { value: e.target.value.replace(/[^0-9]/g, "") } })
      }
      className="h-10 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fea632] text-base w-full"
      {...props}
    />
  );
}

function RentalTypeForm({ title, rental, setRental, currency, error }: any) {
  const newPrice = useMemo(
    () =>
      ((Number(rental.rate) * (100 - Number(rental.discount))) / 100).toFixed(
        2
      ),
    [rental.rate, rental.discount]
  );
  const toggleDay = (day: string) =>
    setRental((prev: any) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d: string) => d !== day)
        : [...prev.selectedDays, day],
    }));

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-5 shadow-sm border">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold text-base">{title} Rental</h4>
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Recurring:</Label>
          <Switch
            checked={rental.recurring}
            onCheckedChange={(value) =>
              setRental({ ...rental, recurring: value })
            }
            className="data-[state=checked]:bg-[#fea632]"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">Mileage</Label>
          <NoSpinnerInput
            value={rental.mileage}
            onChange={(e: any) =>
              setRental({ ...rental, mileage: e.target.value })
            }
            placeholder="0"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">{`Rate (${currency})`}</Label>
          <NoSpinnerInput
            value={rental.rate}
            onChange={(e: any) =>
              setRental({ ...rental, rate: e.target.value })
            }
            placeholder="0"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">Discount (%)</Label>
          <Select
            value={String(rental.discount)}
            onValueChange={(value) =>
              setRental({ ...rental, discount: Number(value) })
            }
          >
            <SelectTrigger className="h-10 rounded-lg w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(31).keys()].map((val) => (
                <SelectItem key={val} value={String(val)}>
                  {val}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">New Price</Label>
          <input
            type="text"
            value={newPrice}
            disabled
            readOnly
            className="h-10 rounded-lg px-3 py-2 border-gray-200 bg-gray-100 text-gray-500 w-full"
          />
        </div>
      </div>
      <DaySelector
        selectedDays={rental.selectedDays}
        onToggle={toggleDay}
        title={title}
      />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}

export default function RateManagerCard({
  car,
  refetch,
}: {
  car: any;
  refetch: any;
}) {
  const { appCountry } = useAgentContext();
  const defaultCurrency =
    appCountry === "in" ? "INR" : appCountry === "ae" ? "AED" : "USD";
  const [currency] = useState(defaultCurrency);
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultRentalState = {
    rate: 0,
    discount: 0,
    recurring: false,
    selectedDays: [],
    mileage: 0,
  };
  const [dailyError, setDailyError] = useState<string | null>(null);
  const [weeklyError, setWeeklyError] = useState<string | null>(null);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);

  const findRentalData = (type: "Daily" | "Weekly" | "Monthly") => {
    if (!Array.isArray(car.rentals)) {
      return undefined;
    }
    return car.rentals.find((rental) => rental.type === type);
  };

  const dailyData = findRentalData("Daily");
  const weeklyData = findRentalData("Weekly");
  const monthlyData = findRentalData("Monthly");

  const [daily, setDaily] = useState({
    ...defaultRentalState,
    ...dailyData,
    selectedDays: dailyData?.weekdays || [],
  });

  const [weekly, setWeekly] = useState({
    ...defaultRentalState,
    ...weeklyData,
    selectedDays: weeklyData?.weekdays || [],
  });

  const [monthly, setMonthly] = useState({
    ...defaultRentalState,
    ...monthlyData,
    selectedDays: monthlyData?.weekdays || [],
  });

  const applyChanges = async () => {
    setIsSubmitting(true);

    const dailyValidation = validateManualInput(
      Number(daily.rate),
      Number(daily.discount),
      daily.selectedDays,
      daily.recurring
    );
    const weeklyValidation = validateManualInput(
      Number(weekly.rate),
      Number(weekly.discount),
      weekly.selectedDays,
      weekly.recurring
    );
    const monthlyValidation = validateManualInput(
      Number(monthly.rate),
      Number(monthly.discount),
      monthly.selectedDays,
      monthly.recurring
    );

    setDailyError(dailyValidation);
    setWeeklyError(weeklyValidation);
    setMonthlyError(monthlyValidation);

    if (dailyValidation || weeklyValidation || monthlyValidation) {
      toast({
        title: "Validation Error",
        description: "Please fix validation errors before saving.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const formatPayload = (state: typeof daily) => ({
      rate: Number(state.rate) || 0,
      mileage: Number(state.mileage) || 0,
      discount: Number(state.discount) || 0,
      recurring: state.recurring,
      selectedDays: state.selectedDays,
    });

    const payload = {
      daily: formatPayload(daily),
      weekly: formatPayload(weekly),
      monthly: formatPayload(monthly),
    };

    try {
      await updateVehicleRatesApi(car.id, payload);
      toast({
        title: "Success",
        description: `${car.name} rates have been updated.`,
      });
      queryClient.invalidateQueries({ queryKey: ["vehicles"], exact: false });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update rates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetRates = async () => {
    try {
      await API.patch({ slug: `/vehicle/${car.id}/reset-rates` });
      toast({
        title: "Success",
        description: "Rates reset to Bulk/Default",
      });
      if (refetch) refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reset rates",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-2xl shadow-lg bg-white p-4 sm:p-6 w-full max-w-lg flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={car.imageUrl}
            alt={car.name}
            className="w-20 h-16 object-cover rounded-lg"
          />
          <div>
            <h3 className="text-xl font-bold">{car.name}</h3>
            <p className="text-sm text-gray-500">
              Reg: {car.registrationNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Label className="text-sm font-medium">Currency:</Label>
          <div className="flex-grow">
            <input
              type="text"
              value={currency}
              disabled
              readOnly
              className="w-full h-10 rounded-lg px-3 py-2 border-gray-200 bg-gray-100 text-gray-500"
            />
          </div>
        </div>
      </div>

      <RentalTypeForm
        title="Daily"
        rental={daily}
        setRental={setDaily}
        currency={currency}
        error={dailyError}
      />
      <RentalTypeForm
        title="Weekly"
        rental={weekly}
        setRental={setWeekly}
        currency={currency}
        error={weeklyError}
      />
      <RentalTypeForm
        title="Monthly"
        rental={monthly}
        setRental={setMonthly}
        currency={currency}
        error={monthlyError}
      />

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 mt-auto w-full">
        <Button variant="outline" className="w-full sm:w-auto">
          Cancel
        </Button>

        <Button
          style={{ backgroundColor: "#fea632" }}
          className="text-white hover:opacity-90 w-full sm:w-auto"
          onClick={applyChanges}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Apply Changes"}
        </Button>

        <Button
          variant="destructive"
          className="w-full sm:w-auto"
          onClick={handleResetRates}
        >
          Reset Manual Override
        </Button>
      </div>
    </div>
  );
}
