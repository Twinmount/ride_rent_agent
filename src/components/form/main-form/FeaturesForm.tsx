import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import MultiSelectDropdown from '../MultiSelectDropdown'
import { useVehicleIdentifiers } from '@/hooks/useVehicleIdentifiers'
import {
  addFeatures,
  getFeaturesFormData,
  getFeaturesFormFieldsData,
  updateFeatures,
} from '@/api/vehicle'
import FormSkelton from '@/components/loading-skelton/FormSkelton'
import Spinner from '@/components/general/Spinner'
import { Accordion } from '@/components/ui/accordion'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'
import { formatFeatures } from '@/helpers/form'

type FeaturesFormType = Record<string, string[] | null>

type FeaturesFormProps = {
  type: 'Add' | 'Update'
  refetchLevels?: () => void
  isAddOrIncomplete?: boolean
}

export default function FeaturesForm({
  type,
  refetchLevels,
  isAddOrIncomplete,
}: FeaturesFormProps) {
  const { vehicleId, vehicleCategoryId } = useVehicleIdentifiers(type)
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: [
      isAddOrIncomplete ? 'features-form-data' : 'features-update-form-data',
      vehicleId,
    ],
    queryFn: async () => {
      if (isAddOrIncomplete) {
        const data = await getFeaturesFormFieldsData({
          vehicleCategoryId: vehicleCategoryId as string,
        })
        return {
          ...data,
          result: data.result.list,
        }
      } else {
        return await getFeaturesFormData(vehicleId)
      }
    },
    enabled: !!vehicleId,
  })

  const form = useForm<FeaturesFormType>({
    defaultValues: {},
  })

  // Custom validation logic: Ensures at least one checkbox is selected for each feature
  const validateFeatures = (values: FeaturesFormType) => {
    let isValid = true
    const updatedErrors: Record<string, string> = {}

    data?.result.forEach((feature) => {
      if (!values[feature.name] || values[feature.name]?.length === 0) {
        updatedErrors[
          feature.name
        ] = `Please select at least one option for ${feature.name}`
        isValid = false
      }
    })

    if (!isValid) {
      Object.keys(updatedErrors).forEach((key) => {
        form.setError(key, {
          type: 'manual',
          message: updatedErrors[key],
        })
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
        className: 'bg-red-500 text-white',
      })
    } else {
      form.clearErrors() // Clear all errors if valid
    }

    return isValid
  }

  async function onSubmit(values: FeaturesFormType) {
    // Validate before submitting
    const isValid = validateFeatures(values)
    if (!isValid) return // Exit if not valid

    // Prepare the features object for the request body
    const features = formatFeatures(values, data?.result || [])

    const requestBody = {
      features,
      userId: userId as string,
      vehicleId: vehicleId as string,
      vehicleCategoryId: vehicleCategoryId as string,
    }

    try {
      let response
      if (isAddOrIncomplete) {
        response = await addFeatures(requestBody)
      } else {
        response = await updateFeatures({ features, vehicleId })
      }
      if (response) {
        toast({
          title: `Features ${type.toLowerCase()}ed successfully`,
          className: 'bg-yellow text-white',
        })
        queryClient.invalidateQueries({
          queryKey: ['features-update-form-data', vehicleId],
        })
        refetchLevels?.()
        navigate('/listings')
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: `${type} Features failed`,
        description: 'Something went wrong',
      })
    }
  }

  const fields = data?.result || []

  return isLoading ? (
    <FormSkelton />
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 mx-auto bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8"
      >
        <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto">
          <Accordion type="single" collapsible>
            {fields.length > 0 ? (
              fields.map((feature, index) => (
                <FormField
                  key={feature.id}
                  control={form.control}
                  name={feature.name}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex w-full mb-2 max-sm:flex-col">
                        <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                          {feature.name}
                          <span className="mr-5 max-sm:hidden">:</span>
                        </FormLabel>
                        <div className="flex-col items-start w-full">
                          <FormControl>
                            <MultiSelectDropdown
                              uniqueValue={index.toString()}
                              onChangeHandler={field.onChange}
                              value={field.value || []}
                              placeholder={feature.name}
                              options={feature.values
                                .filter((value) => value !== null)
                                .map((value) => ({
                                  label: value!.label,
                                  name: value!.name,
                                  selected: value!.selected as boolean,
                                }))}
                            />
                          </FormControl>
                          <FormMessage className="ml-2" />
                        </div>
                      </FormItem>
                    )
                  }}
                />
              ))
            ) : (
              <p>No features found for this category.</p>
            )}
          </Accordion>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full md:w-10/12 lg:w-8/12 mx-auto flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
        >
          {isAddOrIncomplete ? 'Add Features' : 'Update Features'}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  )
}
