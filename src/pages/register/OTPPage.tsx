import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { OTPFormSchema } from '@/lib/validator'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/general/Spinner'
import { toast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { resendOTP, verifyOTP } from '@/api/auth'
import { save, StorageKeys } from '@/utils/storage'

const OTPPage = () => {
  const navigate = useNavigate()
  const [timer, setTimer] = useState(60)

  const form = useForm<z.infer<typeof OTPFormSchema>>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: { otp: '' },
  })

  useEffect(() => {
    const storedTimestamp = sessionStorage.getItem('otpTimestamp')
    const currentTime = Math.floor(Date.now() / 1000)

    if (storedTimestamp) {
      const elapsedTime = currentTime - parseInt(storedTimestamp, 10)
      setTimer(Math.max(60 - elapsedTime, 0))
    } else {
      sessionStorage.setItem('otpTimestamp', currentTime.toString())
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const { mutateAsync: resendOTPMutation, isPending } = useMutation({
    mutationFn: () => {
      const phoneNumber = sessionStorage.getItem('phoneNumber') as string
      const countryCode = sessionStorage.getItem('countryCode') as string
      const password = sessionStorage.getItem('password') as string
      return resendOTP({ phoneNumber, countryCode, password })
    },
    onSuccess: (data) => {
      sessionStorage.setItem('otpId', data?.result.otpId)
      sessionStorage.setItem('userId', data?.result.userId)
      toast({
        title: 'OTP Sent',
        description: 'A new OTP has been sent to your number.',
        className: 'bg-yellow text-white',
      })
      const currentTime = Math.floor(Date.now() / 1000)
      sessionStorage.setItem('otpTimestamp', currentTime.toString())
      setTimer(60)
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to Resend OTP',
        description: 'Something went wrong. Please try again.',
      })
    },
  })

  async function onSubmit(values: z.infer<typeof OTPFormSchema>) {
    try {
      const otpId = sessionStorage.getItem('otpId')
      const userId = sessionStorage.getItem('userId')

      const requestBody = {
        otpId,
        userId,
        otp: values.otp,
      }

      const data = await verifyOTP(
        requestBody as {
          otpId: string
          userId: string
          otp: string
        }
      )

      if (data) {
        sessionStorage.clear()
        save(StorageKeys.ACCESS_TOKEN, data.result.token)
        save(StorageKeys.REFRESH_TOKEN, data.result.refreshToken)
        toast({
          title: 'Your account is created successfully!. Now you can login',
          className: 'bg-yellow text-white',
        })
        navigate('/login', { replace: true })
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error.message
        form.setError('otp', { type: 'manual', message: errorMessage })
      } else {
        toast({
          variant: 'destructive',
          title: 'OTP Verification Failed',
          description: 'Something went wrong.',
        })
      }
    }
  }

  return (
    <section className="h-screen bg-gray-100 flex-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 bg-white shadow-lg p-4 pb-6 rounded-3xl w-full max-w-[500px] mx-auto"
        >
          <h3 className="mb-4 text-3xl font-bold text-center text-yellow">
            OTP Verification
          </h3>
          <div className="flex flex-col w-full max-w-full md:max-w-[800px] mx-auto ">
            {/* otp field */}
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center w-full mb-2">
                  <FormControl>
                    <InputOTP maxLength={4} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-center">
                    Please enter the OTP sent to your{' '}
                    <span className="font-bold">whatsapp</span> number.
                    <br />
                    OTP is valid for only 10 minutes
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </FormItem>
              )}
            />

            <div className="px-2 mt-2 h-fit flex-between text-yellow">
              <Link
                to={'/register'}
                className="text-sm font-semibold hover:underline"
              >
                change number?
              </Link>

              <Button
                onClick={() => resendOTPMutation()}
                disabled={isPending || timer > 0}
                className={`bg-transparent hover:bg-transparent w-fit h-fit text-yellow ${
                  isPending || (timer > 0 && 'text-black')
                }`}
              >
                {timer > 0 ? `resend otp in ${timer} seconds` : 'resend otp'}
              </Button>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="w-full mx-auto flex-center col-span-2 mt-2 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
            >
              Verify and Register {form.formState.isSubmitting && <Spinner />}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default OTPPage
