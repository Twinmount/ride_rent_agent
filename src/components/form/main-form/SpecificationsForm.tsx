import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import SpecificationDropdown from "../dropdowns/SpecificationDropdown";
import { useVehicleIdentifiers } from "@/hooks/useVehicleIdentifiers";
import { addSpecifications, updateSpecifications } from "@/api/vehicle";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import Spinner from "@/components/general/Spinner";
import { toast } from "@/components/ui/use-toast";
import { formatSpecifications, hasSelected } from "@/helpers/form";
import { SpecificationFormData } from "@/types/API-types";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSpecificationFormQuery } from "@/hooks/useFormQuery";

type SpecificationFormType = Record<string, string | null>;

type SpecificationFormProps = {
  type: "Add" | "Update";
  onNextTab?: () => void;
  refetchLevels?: () => void;
  isAddOrIncomplete?: boolean;
};

export default function SpecificationsForm({
  type,
  onNextTab,
  refetchLevels,
  isAddOrIncomplete,
}: SpecificationFormProps) {
  const { vehicleId, vehicleCategoryId, vehicleTypeId } =
    useVehicleIdentifiers(type);

  const queryClient = useQueryClient();

  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // useQuery for fetching form data, now relying on levelsFilled
  const { data, isLoading } = useSpecificationFormQuery({
    vehicleId,
    vehicleCategoryId,
    vehicleTypeId,
    isAddOrIncomplete: !!isAddOrIncomplete,
  });

  const fields = data?.result || [];

  const form = useForm<SpecificationFormType>({
    defaultValues: {},
  });

  useEffect(() => {
    if (data) {
      const formDefaultValues: Record<string, string> = {};

      data.result.forEach((spec) => {
        const selectedValue = spec.values
          .filter((value) => value !== null) // Filter out null values
          .find((value) => hasSelected(value) && value.selected);

        if (selectedValue) {
          formDefaultValues[spec.name] = selectedValue.name;
        }
      });

      form.reset(formDefaultValues);
    }
  }, [data]);

  // Custom validation logic: Ensures at least one option is selected for each specification
  const validateSpecifications = (values: SpecificationFormType) => {
    let isValid = true;
    const updatedErrors: Record<string, string> = {};

    data?.result.forEach((spec) => {
      const validValues = spec.values.filter((value) => value !== null); // Filter out null values

      if (
        !values[spec.name] ||
        values[spec.name]?.length === 0 ||
        !validValues.length
      ) {
        updatedErrors[
          spec.name
        ] = `Please select at least one option for ${spec.name}`;
        isValid = false;
      }
    });

    if (!isValid) {
      Object.keys(updatedErrors).forEach((key) => {
        form.setError(key, {
          type: "manual",
          message: updatedErrors[key],
        });
      });

      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Show a toast message indicating the validation error
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    } else {
      form.clearErrors(); // Clear all errors if valid
    }

    return isValid;
  };

  async function onSubmit(values: SpecificationFormType) {
    if (!validateSpecifications(values)) {
      return;
    }

    // Transform data.result to match SpecificationFormData[]
    const transformedData = (data?.result || []).map((spec) => ({
      ...spec,
      values: spec.values.map((value) => ({
        ...value,
        _id: "",
      })),
    })) as SpecificationFormData[];

    // Format the data as per the backend requirement
    const specs = formatSpecifications(values, transformedData);

    const requestBody = {
      specs,
      userId: userId as string,
      vehicleId,
      vehicleCategoryId: vehicleCategoryId as string,
    };

    try {
      let response;
      if (isAddOrIncomplete) {
        response = await addSpecifications(requestBody);
      } else if (type === "Update") {
        response = await updateSpecifications({
          specs,
          vehicleId: vehicleId as string,
        });
      }

      if (response) {
        toast({
          title: `Specifications ${type.toLowerCase()}ed successfully`,
          className: "bg-yellow text-white",
        });

        refetchLevels?.();
        if (isAddOrIncomplete && onNextTab) {
          onNextTab();
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Specifications failed`,
        description: "Something went wrong",
      });
    } finally {
      // invalidating cached data in the listing page
      queryClient.invalidateQueries({
        queryKey: ["specification-update-form-data", vehicleId],
        exact: true,
      });
    }
  }

  return isLoading ? (
    <FormSkelton />
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 mx-auto bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8"
      >
        <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto">
          {fields.length > 0 ? (
            fields.map((spec) => (
              <FormField
                key={spec.id}
                control={form.control}
                name={spec.name}
                render={({ field }) => {
                  // selecting the default value for Update case.
                  const selectedOption = spec.values
                    .filter((option) => option !== null)
                    .find(
                      (
                        option
                      ): option is {
                        name: string;
                        label: string;
                        selected: boolean;
                      } => option && "selected" in option && option.selected
                    );

                  return (
                    <FormItem className="flex mb-2 w-full max-sm:flex-col">
                      <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
                        {spec.name}
                        <span className="mr-5 max-sm:hidden">:</span>
                      </FormLabel>
                      <div className="flex-col items-start w-full">
                        <FormControl>
                          <SpecificationDropdown
                            onChangeHandler={field.onChange}
                            value={field.value || selectedOption?.name || ""}
                            options={spec.values
                              .filter((value) => value !== null)
                              .map((value) => ({
                                label: value!.label, // Non-null assertion
                                value: value!.name,
                              }))}
                            isEngineType={spec.name === "Engine Type"}
                          />
                        </FormControl>
                        <FormMessage className="ml-2" />
                      </div>
                    </FormItem>
                  );
                }}
              />
            ))
          ) : (
            <p>No specifications found for this category.</p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full md:w-10/12 lg:w-8/12 mx-auto flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
        >
          {isAddOrIncomplete ? "Add Specifications" : "Update Specifications"}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
