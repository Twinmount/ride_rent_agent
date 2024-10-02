import { Check } from 'lucide-react'

const SignUpFeatures = () => {
  return (
    <div className="w-[93%] lg:w-3/4 max-lg:mb-4 max-lg:mt-16">
      <h1 className="mb-3 text-5xl font-extrabold text-white max-lg:text-4xl max-lg:text-center">
        A FREE SHOWCASE FOR YOUR FLEET
      </h1>
      <h2 className="mb-4 text-3xl font-semibold text-white max-lg:text-xl max-lg:text-center">
        GET FASTER BOOKINGS & MORE PROFITS
      </h2>
      <ul className="flex flex-col gap-1 text-lg font-semibold text-white w-fit max-lg:mx-auto">
        <li className="flex items-center gap-x-1">
          <Check className="mb-auto text-yellow" /> No Middlemen or Commission
        </li>
        <li className="flex items-center gap-x-1">
          <Check className="mb-auto text-yellow" />
          Faster On-boarding
        </li>
        <li className="flex items-center gap-x-1">
          <Check className="mb-auto text-yellow" /> Get Booking details via
          direct SMS/Email/Call
        </li>
        <li className="flex items-center gap-x-1">
          <Check className="mb-auto text-yellow" /> Dedicated Profiles
        </li>
        <li className="flex items-center gap-x-1">
          <Check className="mb-auto text-yellow" /> A Single Platform To Rent
          Your Vehicles
        </li>
      </ul>
    </div>
  )
}
export default SignUpFeatures
