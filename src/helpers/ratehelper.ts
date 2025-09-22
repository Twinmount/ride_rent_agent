import { VehicleRateRow, ApiVehicleUpdate } from "@/types/API-types";
import { parseWeekdays, normalizeRecurring } from "@/utils/rateUtils";

export function validateExcelRows(rows: VehicleRateRow[]) {
  const requiredHeaders = [
    "Registration Number",
    "Daily Rate",
    "Daily Discount",
    "Daily Mileage",
    "Daily Recurring",
    "Daily Weekdays",
    "Weekly Rate",
    "Weekly Discount",
    "Weekly Mileage",
    "Weekly Recurring",
    "Weekly Weekdays",
    "Monthly Rate",
    "Monthly Discount",
    "Monthly Mileage",
    "Monthly Recurring",
    "Monthly Weekdays",
  ];

  if (rows.length === 0) {
    return { valid: false, error: "Excel file is empty or has no data rows." };
  }

  const firstRow = rows[0];
  const missingHeaders = requiredHeaders.filter(
    (header) => !(header in firstRow)
  );
  if (missingHeaders.length > 0) {
    return {
      valid: false,
      error: `Missing required headers: ${missingHeaders.join(
        ", "
      )}. Please use the downloaded template.`,
    };
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const excelRowNum = i + 2;

    const regNum = String(row["Registration Number"] || "").trim();
    if (!regNum) {
      return {
        valid: false,
        error: `Row ${excelRowNum}: Registration Number cannot be empty.`,
      };
    }

    const rateFields: (keyof VehicleRateRow)[] = [
      "Daily Rate",
      "Weekly Rate",
      "Monthly Rate",
    ];
    for (const field of rateFields) {
      const value = Number(row[field]);
      if (isNaN(value) || value < 0) {
        return {
          valid: false,
          error: `Row ${excelRowNum}: ${field} must be a number ≥ 0.`,
        };
      }
    }

    const discountFields: (keyof VehicleRateRow)[] = [
      "Daily Discount",
      "Weekly Discount",
      "Monthly Discount",
    ];
    for (const field of discountFields) {
      const value = Number(row[field]);
      if (isNaN(value) || value < 0 || value > 30) {
        return {
          valid: false,
          error: `Row ${excelRowNum}: ${field} must be between 0 and 30.`,
        };
      }
    }

    const mileageFields: (keyof VehicleRateRow)[] = [
      "Daily Mileage",
      "Weekly Mileage",
      "Monthly Mileage",
    ];
    for (const field of mileageFields) {
      const value = Number(row[field]);
      if (isNaN(value) || value < 0) {
        return {
          valid: false,
          error: `Row ${excelRowNum}: ${field} must be ≥ 0.`,
        };
      }
    }

    const weekdayFields: (keyof VehicleRateRow)[] = [
      "Daily Weekdays",
      "Weekly Weekdays",
      "Monthly Weekdays",
    ];
    for (const field of weekdayFields) {
      const weekdays = parseWeekdays(row[field]);
      const inputValue = String(row[field] || "").trim();

      if (inputValue && weekdays.length === 0) {
        const validEmptyValues = ["none", "0", ""];
        if (!validEmptyValues.includes(inputValue.toLowerCase())) {
          return {
            valid: false,
            error: `Row ${excelRowNum}: ${field} has invalid format. Use: All, Weekdays, Weekends, None, or Mo,Tu,We,Th,Fr,Sa,Su`,
          };
        }
      }
    }

    const recurringFields: (keyof VehicleRateRow)[] = [
      "Daily Recurring",
      "Weekly Recurring",
      "Monthly Recurring",
    ];
    for (const field of recurringFields) {
      const value = String(row[field] || "")
        .trim()
        .toLowerCase();
      const validValues = ["true", "false", "1", "0", "yes", "no", ""];
      if (value && !validValues.includes(value)) {
        return {
          valid: false,
          error: `Row ${excelRowNum}: ${field} must be TRUE/FALSE, YES/NO, or 1/0.`,
        };
      }
    }
  }

  return { valid: true };
}

export function transformRowForApi(row: VehicleRateRow): ApiVehicleUpdate {
  return {
    registrationNumber: String(row["Registration Number"]).trim(),

    // Daily
    dailyRate: Number(row["Daily Rate"]) || 0,
    dailyDiscount: Number(row["Daily Discount"]) || 0,
    dailyMileage: Number(row["Daily Mileage"]) || 0,
    dailyRecurring: normalizeRecurring(row["Daily Recurring"]),
    dailyWeekdays: parseWeekdays(row["Daily Weekdays"]),

    // Weekly
    weeklyRate: Number(row["Weekly Rate"]) || 0,
    weeklyDiscount: Number(row["Weekly Discount"]) || 0,
    weeklyMileage: Number(row["Weekly Mileage"]) || 0,
    weeklyRecurring: normalizeRecurring(row["Weekly Recurring"]),
    weeklyWeekdays: parseWeekdays(row["Weekly Weekdays"]),

    // Monthly
    monthlyRate: Number(row["Monthly Rate"]) || 0,
    monthlyDiscount: Number(row["Monthly Discount"]) || 0,
    monthlyMileage: Number(row["Monthly Mileage"]) || 0,
    monthlyRecurring: normalizeRecurring(row["Monthly Recurring"]),
    monthlyWeekdays: parseWeekdays(row["Monthly Weekdays"]),
  };
}
