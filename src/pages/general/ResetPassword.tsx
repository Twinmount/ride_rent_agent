import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { ResetPasswordFormSchema } from '@/lib/validator'
import { Button } from '@/components/ui/button'

// phone input
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import Spinner from '@/components/general/Spinner'
import { API } from '@/api/ApiService'
import { Slug } from '@/api/Api-Endpoints'
import { toast } from '@/components/ui/use-toast'
import { ResetPasswordResponse } from '@/types/API-types'

const LoginPage = () => {
  // State to store the country code separately
  const [countryCode, setCountryCode] = useState('')
  const navigate = useNavigate()

  // for phone validation

  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      phoneNumber: '',
    },
  })

  // form submit handler
  async function onSubmit(values: z.infer<typeof ResetPasswordFormSchema>) {
    try {
      // Extract the phone number part without the country code
      const phoneNumber = values.phoneNumber
        .replace(`+${countryCode}`, '')
        .trim()

      // Construct the final request body to send to the backend
      const requestBody = {
        countryCode,
        phoneNumber,
      }

      const data = await API.post<ResetPasswordResponse>({
        slug: Slug.POST_RESET_PASSWORD,
        body: requestBody,
      })

      if (data) {
        sessionStorage.setItem('otpId', data?.result.otpId)
        navigate('/reset-password/verify-otp')
      }
    } catch (error: any) {
      console.error('error : ', error)
      if (error.response && error.response.status === 400) {
        toast({
          variant: 'destructive',
          title: 'Invalid mobile number',
          description:
            'verify your mobile number and make sure it is the one you registered with',
        })
        form.setError('phoneNumber', {
          type: 'manual',
          message:
            'verify your mobile number and make sure it is the one you registered with',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
        })
      }
    }
  }

  return (
    <section className="h-screen bg-gray-100 flex-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 bg-white shadow-lg p-4 pb-6 rounded-[1rem] w-full max-w-[500px] mx-auto"
        >
          <h3 className="mb-4 text-3xl font-bold text-center text-yellow">
            Reset Password
          </h3>
          <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto ">
            {/* mobile / whatsapp*/}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full mb-2">
                  <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                    Mobile
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <PhoneInput
                        defaultCountry="ae"
                        value={field.value}
                        onChange={(value, country) => {
                          field.onChange(value)

                          // Set the country code in state
                          setCountryCode(country.country.dialCode)
                        }}
                        className="flex items-center"
                        inputClassName="input-field !w-full !text-base"
                        placeholder="whatsapp number"
                        countrySelectorStyleProps={{
                          className:
                            'bg-white !border-none outline-none !rounded-xl  mr-1 !text-lg',
                          style: {
                            border: 'none ',
                          },
                          buttonClassName:
                            '!border-none outline-none !h-[52px] !w-[50px] !rounded-xl bg-gray-100',
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Verify the phone number associated with your account
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />

            <div className="text-sm text-center">
              An OTP will be sent to your registered{' '}
              <span className="font-bold ">mobile</span> number
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="w-full  mx-auto flex-center col-span-2 mt-2 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
            >
              Send OTP {form.formState.isSubmitting && <Spinner />}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default LoginPage
