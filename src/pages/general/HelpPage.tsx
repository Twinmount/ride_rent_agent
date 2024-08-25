import { MessageCircleMore } from 'lucide-react'

export default function HelpPage() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUM
  const whatsappMessage = 'Hello, I need support with Ride Rent.'

  const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
    whatsappMessage
  )}`

  return (
    <section className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md p-6 text-center bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Need Assistance?
        </h2>
        <p className="mb-2 text-gray-700 ">
          Feel free to contact us! We are always happy to help you.
        </p>
        <ul className="mb-6 text-left text-gray-600 list-disc list-inside">
          <li>Need help with vehicle registration?</li>
          <li>Having trouble managing your listings?</li>
          <li>Company details need updating?</li>
          <li>Issues with uploading vehicle photos?</li>
          <li>Want to know more about your subscription plan?</li>
          <li>Have questions about your account settings?</li>
        </ul>
        <p className="mb-6 text-sm text-gray-600">
          Click the button below to chat with us via WhatsApp
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-3 font-semibold text-white transition-transform bg-green-500 shadow-lg rounded-2xl hover:bg-green-600 hover:scale-105"
        >
          <MessageCircleMore size={20} className="mr-2" />
          WhatsApp us
        </a>
        <p className="mt-4 text-xs text-gray-500">
          Support available Monday to Friday, 9am - 9pm.
        </p>
      </div>
    </section>
  )
}
