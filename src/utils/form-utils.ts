// utils/submitForm.ts
import { addPrimaryDetailsForm, updatePrimaryDetailsForm } from "@/api/vehicle";
import { deleteMultipleFiles } from "@/helpers/form";
import { PrimaryFormType } from "@/types/types";

export const handleLevelOneFormSubmission = async (
  type: "Add" | "Update",
  values: PrimaryFormType,
  {
    countryCode,
    userId,
    vehicleId,
    isCarsCategory,
    deletedFiles,
  }: {
    countryCode: string;
    userId?: string;
    vehicleId?: string;
    isCarsCategory: boolean;
    deletedFiles: string[];
  }
) => {
  let data;

  if (type === "Add") {
    data = await addPrimaryDetailsForm(
      values,
      countryCode,
      userId as string,
      isCarsCategory
    );
  } else if (type === "Update") {
    data = await updatePrimaryDetailsForm(
      vehicleId as string,
      values,
      countryCode,
      isCarsCategory
    );
  }

  if (data) {
    await deleteMultipleFiles(deletedFiles);
  }

  return data;
};
