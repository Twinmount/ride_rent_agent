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

const ResetPasswordOTPPage = () => {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof OTPFormSchema>>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: { otp: '' },
  })

  async function onSubmit(values: z.infer<typeof OTPFormSchema>) {
    sessionStorage.setItem('otp', values.otp)
    navigate('/confirm-new-password')
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
                    <span className="font-bold">registered</span> number.
                    <br />
                    OTP is valid for only 10 minutes
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="w-full mx-auto flex-center col-span-2 mt-2 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
            >
              Verify OTP {form.formState.isSubmitting && <Spinner />}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default ResetPasswordOTPPage
