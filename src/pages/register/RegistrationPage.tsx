import FAQ from '@/components/common/Faq'
import WhyJoin from '@/components/common/WhyJoin'
import WhyOpt from '@/components/common/WhyOpt'
import SignUpFeatures from '@/components/common/SignUpFeatures'
import { features, FAQ_Data } from '@/constants/data/data'
import MotionDiv from '@/components/framer-motion/MotionDiv'

import RegistrationForm from '@/components/form/main-form/RegistrationForm'

export default function RegistrationPage() {
  return (
    <section className="py-10 bg-white wrapper">
      {/* top heading */}
      <MotionDiv className="mt-4 mb-16 text-center">
        <h1 className="text-[1.9rem] ">
          A SINGLE PLATFORM TO RENT YOUR VEHICLES
        </h1>
        <h2 className="text-gray-700 text-[1.1rem]">
          Showcase your fleet to the world, get faster bookings
        </h2>
      </MotionDiv>

      {/* form section */}
      <MotionDiv className="flex flex-col-reverse items-center justify-center gap-4 mx-auto mb-12 md:w-4/5 lg:w-[80%] xl:w-[60%] lg:flex-row">
        {/* sign up features */}
        <SignUpFeatures />

        {/* form */}
        <RegistrationForm />
      </MotionDiv>

      {/* Why Join Us */}
      <WhyJoin data={features} />

      {/* FAQ */}
      <FAQ data={FAQ_Data} />

      {/* why opt */}
      <WhyOpt />
    </section>
  )
}
