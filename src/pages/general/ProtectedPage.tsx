import { Building2, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProtectedPage() {
  return (
    <section className="flex justify-center h-screen">
      <div className="flex flex-col items-center w-full max-w-[500px] p-3 px-6 mt-40 bg-white rounded-xl h-fit">
        <div className="relative w-20 h-20 rounded-full bg-yellow flex-center">
          <Building2 size={45} className="text-white" />
        </div>

        <div className="flex flex-col mt-4 text-center gap-y-4">
          <h2 className="text-2xl font-bold">Register your company now!</h2>
          <p>
            Your account has been created. Register your company to add your
            vehicles and get access for this page!
          </p>
          <p>
            Click the button below to{' '}
            <span className="font-semibold text-yellow">add your company</span>{' '}
            <br /> in just{' '}
            <span className="font-semibold text-yellow">one step!</span>
          </p>

          <Link
            to="/register/company-details"
            className="flex items-center justify-center w-full p-3 mt-2 font-semibold text-white bg-yellow hover:bg-yellow rounded-xl"
          >
            ADD YOUR COMPANY <Plus size={20} strokeWidth={3} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
