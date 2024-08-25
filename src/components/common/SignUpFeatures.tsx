import { Check } from 'lucide-react'

const SignUpFeatures = () => {
  return (
    <div className="flex-1">
      <ul className="flex flex-col gap-1">
        <li className="flex items-center gap-x-1">
          <Check className="mb-auto text-yellow" /> No Middlemen of Commission
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
      </ul>
    </div>
  )
}
export default SignUpFeatures
