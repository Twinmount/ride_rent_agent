import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PrimaryFormDefaultValues } from '@/constants'
import { PrimaryFormSchema } from '@/lib/validator'
import { PrimaryFormType } from '@/types/types'
import YearPicker from '../YearPicker'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import RentalDetailsFormField from '../RentalDetailsFormField'
import FileUpload from '../FileUpload'
import { validateRentalDetails } from '@/helpers/form'
import BrandsDropdown from '../BrandsDropdown'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CitiesDropdown from '../CitiesDropdown'
import CategoryDropdown from '../CategoryDropdown'
import VehicleTypesDropdown from '../VehicleTypesDropdown'
import StatesDropdown from '../StatesDropdown'
import { jwtDecode } from 'jwt-decode'
import { DecodedRefreshToken } from '@/layout/ProtectedRoutes'
import { load, save, StorageKeys } from '@/utils/storage'
import { toast } from '@/components/ui/use-toast'
import { addPrimaryDetailsForm, updatePrimaryDetailsForm } from '@/api/vehicle'
import Spinner from '@/components/general/Spinner'
import { useParams } from 'react-router-dom'
import { useLoadingMessages } from '@/hooks/useLoadingMessage'

type PrimaryFormProps = {
  type: 'Add' | 'Update'
  formData?: PrimaryFormType | null
  onNextTab?: () => void
  initialCountryCode?: string
}

export default function PrimaryDetailsForm({
  type,
  onNextTab,
  formData,
  initialCountryCode,
}: PrimaryFormProps) {
  const [countryCode, setCountryCode] = useState<string>('')

  const { vehicleId } = useParams<{
    vehicleId: string
  }>()

  // Call the useLoadingMessages hook to manage loading messages
  const message = useLoadingMessages()

  const initialValues =
    formData && type === 'Update' ? formData : PrimaryFormDefaultValues

  // Define your form.
  const form = useForm<z.infer<typeof PrimaryFormSchema>>({
    resolver: zodResolver(PrimaryFormSchema),
    defaultValues: initialValues as PrimaryFormType,
  })

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof PrimaryFormSchema>) {
    const rentalError = validateRentalDetails(values.rentalDetails)
    if (rentalError) {
      form.setError('rentalDetails', {
        type: 'manual',
        message: rentalError,
      })
      return
    }
    const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN)
    const { userId } = jwtDecode<DecodedRefreshToken>(refreshToken as string)

    // Append other form data
    try {
      let data
      if (type === 'Add') {
        data = await addPrimaryDetailsForm(
          values as PrimaryFormType,
          countryCode,
          userId
        )
      } else if (type === 'Update') {
        data = await updatePrimaryDetailsForm(
          vehicleId as string,
          values as PrimaryFormType,
          initialCountryCode as string
        )
      }

      if (data) {
        toast({
          title: `Vehicle ${type.toLowerCase()}ed successfully`,
          className: 'bg-yellow text-white',
        })

        if (type === 'Add') {
          save(StorageKeys.VEHICLE_ID, data.result.vehicleId)
          save(StorageKeys.CATEGORY_ID, data.result.vehicleCategory.categoryId)
          if (onNextTab) onNextTab()
        }
      }
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: `${type} Company failed`,
        description: 'Something went wrong',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5  mx-auto bg-white  rounded-3xl p-2 md:p-4 py-8 !pb-8  "
      >
        <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
          {/* category of the vehicle */}
          <FormField
            control={form.control}
            name="vehicleCategoryId"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base max-sm:w-fit w-72 lg:text-lg">
                  Vehicle Category <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
                  <FormControl>
                    <CategoryDropdown
                      onChangeHandler={(value) => {
                        field.onChange(value)
                        form.setValue('vehicleTypeId', '')
                        form.setValue('vehicleBrandId', '')
                      }}
                      value={initialValues.vehicleCategoryId}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    select the vehicle category
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* type of the vehicle */}
          <FormField
            control={form.control}
            name="vehicleTypeId"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Vehicle Type <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
                  <FormControl>
                    <VehicleTypesDropdown
                      vehicleCategoryId={form.watch('vehicleCategoryId')}
                      value={field.value}
                      onChangeHandler={field.onChange}
                      isDisabled={!form.watch('vehicleCategoryId')}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    select the vehicle type
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* brand name */}
          <FormField
            control={form.control}
            name="vehicleBrandId"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Brand Name <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <BrandsDropdown
                      vehicleCategoryId={form.watch('vehicleCategoryId')}
                      value={field.value}
                      onChangeHandler={field.onChange}
                      isDisabled={!form.watch('vehicleCategoryId')}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Select your vehicle's Brand
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />
          {/* model name */}
          <FormField
            control={form.control}
            name="vehicleModel"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Model <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="eg: 'Model'"
                      {...field}
                      className={`input-field`}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter the model name, e.g., "Mercedes-Benz C-Class 2024
                    Latest Model.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* vehicle registration number */}
          <FormField
            control={form.control}
            name="vehicleRegistrationNumber"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Registration Number{' '}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="eg: '1234-1234"
                      {...field}
                      className={`input-field`}
                      type="text"
                      inputMode="numeric"
                      onKeyDown={(e) => {
                        if (
                          !/^\d*$/.test(e.key) &&
                          ![
                            'Backspace',
                            'Delete',
                            'ArrowLeft',
                            'ArrowRight',
                          ].includes(e.key)
                        ) {
                          e.preventDefault()
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter the vehicle registration number
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Vehicle Photos */}
          <FormField
            control={form.control}
            name="vehiclePhotos"
            render={() => (
              <FileUpload
                name="vehiclePhotos"
                label="Vehicle Photos"
                multiple={true}
                existingFiles={initialValues.vehiclePhotos}
                description="Add Vehicle Photos. Up to 8 photos can be added. Each photos can be upto 1MB"
                maxSizeMB={1}
              />
            )}
          />

          {/* Mulkia */}
          <FormField
            control={form.control}
            name="commercialLicenses"
            render={() => (
              <FileUpload
                name="commercialLicenses"
                label="Registration Card / Mulkia"
                multiple={true}
                existingFiles={initialValues.commercialLicenses}
                description="Upload images of the Registration Card/Mulkia, both front and back."
              />
            )}
          />

          {/* Mulkia Expiry */}
          <FormField
            control={form.control}
            name="commercialLicenseExpireDate"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Registration Card / Mulkia Expiry Date{' '}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="MM/dd/yyyy"
                      wrapperClassName="datePicker text-base -ml-4 "
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter Registration Card/Mulkia expiry date
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* registered year */}
          <FormField
            control={form.control}
            name="vehicleRegisteredYear"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Registered Year <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <YearPicker
                      onChangeHandler={field.onChange}
                      value={initialValues.vehicleRegisteredYear}
                      placeholder="year"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter registered year
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Lease */}
          <FormField
            control={form.control}
            name="isLease"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Lease <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <div className="flex items-center mt-3 space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
                        id="isLease"
                      />
                      <label
                        htmlFor="isLease"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Available for lease?
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription className="mt-1 ml-2">
                    Select if this vehicle is available for lease.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />
          {/* Specification */}
          <FormField
            control={form.control}
            name="specification"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Specification <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full ">
                  <FormControl className="mt-2">
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex items-center gap-x-5"
                      defaultValue="UAE_SPEC"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="UAE_SPEC" id="UAE_SPEC" />
                        <Label htmlFor="UAE">UAE</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="USA_SPEC" id="USA_SPEC" />
                        <Label htmlFor="USA_SPEC">USA</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OTHERS" id="others" />
                        <Label htmlFor="others">Others</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription className="mt-1 ml-2">
                    Select the regional specification of the vehicle
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />
          {/* mobile */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Mobile <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <PhoneInput
                      defaultCountry="ae"
                      value={field.value}
                      onChange={(value, country) => {
                        field.onChange(value)
                        setCountryCode(country.country.dialCode)
                      }}
                      className="flex items-center"
                      inputClassName="input-field !w-full !text-base"
                      countrySelectorStyleProps={{
                        className:
                          'bg-white !border-none outline-none !rounded-xl  mr-1',
                        style: {
                          border: 'none ',
                        },
                        buttonClassName:
                          '!border-none outline-none !h-[52px] !w-[50px] !rounded-xl !bg-gray-100',
                      }}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter the mobile number that will receive the direct booking
                    details.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* rental details */}
          <FormField
            control={form.control}
            name="rentalDetails"
            render={() => {
              return (
                <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                  <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                    Rental Details <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <RentalDetailsFormField />
                    </FormControl>
                    <FormDescription className="ml-2">
                      Provide rent details. At least one value should be
                      selected.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )
            }}
          />

          {/* Location(state) */}
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Location <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <StatesDropdown
                      onChangeHandler={(value) => {
                        field.onChange(value)
                        form.setValue('cityIds', []) //
                      }}
                      value={initialValues.stateId}
                      placeholder="location"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Choose your state/location
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />
          {/* cities */}
          <FormField
            control={form.control}
            name="cityIds"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-52 min-w-52 lg:text-lg">
                  Cities / Serving Areas{' '}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <CitiesDropdown
                      stateId={form.watch('stateId')}
                      value={field.value}
                      onChangeHandler={field.onChange}
                      placeholder="cities"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Select all the cities of operation/serving areas.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full md:w-10/12 lg:w-8/12 mx-auto flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
        >
          {type === 'Add' ? 'Add Vehicle' : 'Update Vehicle'}
          {form.formState.isSubmitting && <Spinner />}
        </Button>

        {form.formState.isSubmitting && (
          <div className="-mt-5 italic text-center text-gray-600">
            <p>{message}</p>
          </div>
        )}
      </form>
    </Form>
  )
}
