import { useFormContext, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { FormDescription } from '../ui/form'

const RentalDetailField = ({
  period,
}: {
  period: 'day' | 'week' | 'month'
}) => {
  const { control, watch } = useFormContext()
  const isEnabled = watch(`rentalDetails.${period}.enabled`)

  return (
    <div className="p-2 mb-2 border-b rounded-lg shadow ">
      <Controller
        name={`rentalDetails.${period}.enabled`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center mt-3 space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="w-5 h-5 bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none"
              id={`rentalDetails-${period}-enabled`}
            />
            <label
              htmlFor={`rentalDetails-${period}-enabled`}
              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </label>
          </div>
        )}
      />
      {isEnabled && (
        <>
          <Controller
            name={`rentalDetails.${period}.rentInAED`}
            control={control}
            render={({ field }) => (
              <div className="flex items-center mt-2">
                <label
                  htmlFor={`rentalDetails-${period}-rentInAED`}
                  className="block mr-1 text-sm font-medium w-28"
                >
                  Rent in AED
                </label>
                <div className="w-full">
                  <Input
                    id={`rentalDetails-${period}-rentInAED`}
                    {...field}
                    placeholder="Rent in AED"
                    className="input-field"
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
                  <FormDescription>
                    {`Rent of the Vehicle in AED per ${period} `}
                  </FormDescription>
                </div>
              </div>
            )}
          />
          <Controller
            name={`rentalDetails.${period}.mileageLimit`}
            control={control}
            render={({ field }) => (
              <div className="flex items-center mt-2">
                <label
                  htmlFor={`rentalDetails-${period}-mileageLimit`}
                  className="block text-sm font-medium w-28"
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
                  <FormDescription>
                    {`Mileage of the vehicle per ${period} `}
                  </FormDescription>
                </div>
              </div>
            )}
          />
        </>
      )}
    </div>
  )
}

const RentalDetailsFormField = () => {
  return (
    <div className="flex flex-col">
      <RentalDetailField period="day" />
      <RentalDetailField period="week" />
      <RentalDetailField period="month" />
    </div>
  )
}

export default RentalDetailsFormField
