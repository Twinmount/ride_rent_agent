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
import Footer from '@/components/footer/Footer'

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

      if (data) {
        remove(StorageKeys.ACCESS_TOKEN)
        remove(StorageKeys.REFRESH_TOKEN)
        save(StorageKeys.ACCESS_TOKEN, data.result.token)
        save(StorageKeys.REFRESH_TOKEN, data.result.refreshToken)
        save(StorageKeys.USER_ID, data.result.userId)

        navigate('/')
      }
    } catch (error: any) {
      console.error('error : ', error)
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
    <>
      <section
        className="relative flex flex-col h-screen bg-gray-100 flex-center"
        style={{
          backgroundImage: `url('/assets/img/bg/register-banner.webp')`,
          backgroundSize: 'cover', // This ensures the image covers the div
          backgroundPosition: 'center', // This centers the background image
          backgroundRepeat: 'no-repeat', // Prevent the image from repeating
        }}
      >
        <div className="absolute z-10 w-32 left-4 lg:left-20 top-6 md:w-40 lg:w-44">
          <img
            src="/assets/logo/header/agent_white_logo.webp"
            alt="riderent logo"
            className="object-contain w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="z-10 mt-16 mb-3 text-5xl font-extrabold text-white max-lg:text-4xl max-lg:text-center">
          SHOWCASE YOUR FLEET TO THE WORLD
        </h1>
        <h2 className="z-10 mb-4 text-3xl font-semibold text-white max-lg:text-xl max-lg:text-center">
          Log in and manage your fleet, categories, and bookings
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="z-10  bg-white shadow-lg p-4 pb-6 rounded-[1rem] w-full max-md:w-[95%] h-fit max-h-fit max-w-[500px] mx-auto"
          >
            <h3 className="mb-4 text-3xl font-bold text-center text-yellow">
              Login Now
            </h3>
            <div className="flex flex-col gap-5 w-full h-fit max-w-full md:max-w-[800px] max-h-fit mx-auto ">
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
      <Footer />
    </>
  )
}

export default LoginPage
