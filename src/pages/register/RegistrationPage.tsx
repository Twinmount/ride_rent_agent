import FAQ from '@/components/common/Faq'
import WhyJoin from '@/components/common/WhyJoin'
import WhyOpt from '@/components/common/WhyOpt'
import SignUpFeatures from '@/components/common/SignUpFeatures'
import { features, FAQ_Data } from '@/constants/data/data'
import MotionDiv from '@/components/framer-motion/MotionDiv'
import RegistrationForm from '@/components/form/main-form/RegistrationForm'
import Footer from '@/components/footer/Footer'
import { Helmet } from 'react-helmet-async'

export default function RegistrationPage() {
  return (
    <>
      <section className="py-10 bg-white wrapper">
        <Helmet>
          <title>
            Register Your Vehicle for Free on Ride.Rent- Advertise Cars, Boats,
            Yachts, Helicopters, and Private Jets!
          </title>
          <meta
            name="description"
            content=" Maximize your earnings with zero upfront costs! Ride.Rent connects vehicle owners with
            thousands of renters seeking high-quality, well-maintained vehicles for short-term or long-term
            use. Whether you own a luxury yacht, a powerful sports bike, or a private jet, this is the perfect
            opportunity to showcase your vehicle and start earning. We believe in providing a seamless
            experience for both vehicle owners and renters. Our user-friendly platform allows owners
            (agents) to easily list their vehicles and manage bookings, while renters can effortlessly browse
            and book the perfect vehicle for their needs"
          />
        </Helmet>
        {/* top heading */}
        <MotionDiv className="mt-4 mb-16 text-center">
          <h1 className="text-[1.9rem] font-semibold">
            A SINGLE PLATFORM TO RENT YOUR VEHICLES
          </h1>
          <h2 className="text-gray-700 text-[1.1rem]">
            Register and showcase your fleet to the world, get faster bookings
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
      <Footer />
    </>
  )
}
