type FormFieldArrayItem = {
  amount?: string; // Now optional
  paymentDate?: Date | null | undefined; // Now optional
};

type ValidationResult = string | null;

/**
 * Generic validation helper for array fields like Traffic Fine, Salik, and Additional Charges
 * @param fieldArray - Array of form field items to validate
 * @param fieldName - Name of the field (used for error messages)
 * @returns {ValidationResult} - Error message or null if valid
 */
export const validateFieldArray = (
  fieldArray: FormFieldArrayItem[] | undefined,
  fieldName: string
): ValidationResult => {
  if (!fieldArray || fieldArray.length === 0) {
    // If array is empty, it's valid
    return null;
  }

  for (let i = 0; i < fieldArray.length; i++) {
    const { amount, paymentDate } = fieldArray[i];

    if (!amount) {
      return `Amount is required for ${fieldName} all entries`;
    }

    if (!paymentDate) {
      return `Payment date is required for ${fieldName} all entries`;
    }
  }

  // All items are valid
  return null;
};
