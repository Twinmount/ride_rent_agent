import FAQ from "@/components/common/Faq";
import WhyJoin from "@/components/common/WhyJoin";
import WhyOpt from "@/components/common/WhyOpt";
import SignUpFeatures from "@/components/common/SignUpFeatures";
import { features, FAQ_Data } from "@/constants/data/data";
import MotionDiv from "@/components/framer-motion/MotionDiv";
import RegistrationForm from "@/components/form/main-form/RegistrationForm";
import Footer from "@/components/footer/Footer";
import { Helmet } from "react-helmet-async";
import FloatingWhatsAppButton from "@/components/FloatingWhatsappIcon";
import { Link } from "react-router-dom";

export default function RegistrationPage() {
  return (
    <>
      <section className="pb-10 bg-white">
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

        {/* form section */}
        <div
          className="h-auto min-h-[88vh] flex-center max-lg:py-6 relative"
          style={{
            backgroundImage: `url('/assets/img/bg/register-banner.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Link
            to={"/"}
            className="absolute left-4 top-6 z-20 w-32 lg:left-20 md:w-40 lg:w-44"
          >
            <img
              src="/assets/logo/header/agent_white_logo.webp"
              alt="riderent logo"
              className="object-contain w-full h-full"
            />
          </Link>
          <MotionDiv className="flex z-10 flex-col items-center justify-center gap-4 mx-auto mb-12 lg:flex-row W-[95%] lg:w-[85%]">
            {/* sign up features */}
            <SignUpFeatures />

            {/* form */}
            <RegistrationForm />
          </MotionDiv>
        </div>

        {/* Why Join Us */}
        <WhyJoin data={features} />

        {/* FAQ */}
        <FAQ data={FAQ_Data} />

        {/* why opt */}
        <WhyOpt />
      </section>
      <Footer />

      {/* whatsapp floating button */}
      <FloatingWhatsAppButton />
    </>
  );
}
