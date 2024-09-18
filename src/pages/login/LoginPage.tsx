import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { LoginPageDefaultValues } from '@/constants'
import { LoginFormSchema } from '@/lib/validator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// phone input
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'

import Spinner from '@/components/general/Spinner'
import { API } from '@/api/ApiService'
import { Slug } from '@/api/Api-Endpoints'
import { toast } from '@/components/ui/use-toast'
import { remove, save, StorageKeys } from '@/utils/storage'
import { LoginResponse } from '@/types/API-types'

const LoginPage = () => {
  // State to store the country code separately
  const [countryCode, setCountryCode] = useState('')
  const navigate = useNavigate()

  const initialValues = LoginPageDefaultValues

  // for phone validation

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: initialValues,
  })

  // form submit handler
  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    try {
      // Extract the phone number part without the country code
      const phoneNumber = values.phoneNumber
        .replace(`+${countryCode}`, '')
        .trim()

      // Construct the final request body to send to the backend
      const requestBody = {
        countryCode,
        phoneNumber,
        password: values.password,
      }

      const data = await API.post<LoginResponse>({
        slug: Slug.LOGIN,
        body: requestBody,
      })

      console.log('login data; ', data)

      if (data) {
        remove(StorageKeys.ACCESS_TOKEN)
        remove(StorageKeys.REFRESH_TOKEN)
        save(StorageKeys.ACCESS_TOKEN, data.result.token)
        save(StorageKeys.REFRESH_TOKEN, data.result.refreshToken)
        save(StorageKeys.USER_ID, data.result.userId)

        navigate('/')
      }
    } catch (error: any) {
      console.log('error : ', error)
      if (error.response && error.response.status === 400) {
        toast({
          variant: 'destructive',
          title: 'Login Failed!',
          description: 'Invalid mobile number or password',
        })
        form.setError('phoneNumber', {
          type: 'manual',
          message: '',
        })
        form.setError('password', {
          type: 'manual',
          message: '',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'something went wrong :(',
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
            Login Now
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
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />

            {/* password field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full mb-2 ">
                  <FormLabel className="flex justify-between ml-2 text-base w-72 lg:text-lg">
                    Password
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Input
                        placeholder="Password"
                        {...field}
                        className={`input-field !text-lg`}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="w-full  mx-auto flex-center col-span-2 mt-2 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
            >
              Login {form.formState.isSubmitting && <Spinner />}
            </Button>
          </div>
          <div className="px-2 mt-3 flex-between">
            <Link to={'/reset-password'} className="text-yellow">
              Forgot Password ?
            </Link>
            <div>
              New to Ride.Rent?{' '}
              <Link to={'/register'} className="font-semibold text-yellow">
                Register
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default LoginPage
