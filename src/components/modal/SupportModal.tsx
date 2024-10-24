import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, MessageCircleMore, Phone } from "lucide-react";

export default function SupportModal({
  classes = "px-3 py-1 text-white transition-colors bg-black shadow-lg hover:text-yellow rounded-2xl flex-center gap-x-2",
}: {
  classes?: string;
}) {
  const whatsappLink = `https://api.whatsapp.com/send?phone=971502972335&text=Hello%2C%0AI need assistance managing my account.%0APlease connect me with an agent at your earliest convenience.%0A%0AThank you`;

  return (
    <Dialog>
      <DialogTrigger>
        <div className={classes}>
          Need help? <MessageCircleMore size={20} />
        </div>
      </DialogTrigger>
      <DialogContent className=" w-fit max-sm:w-[95%] mx-auto !rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Need Help ?
          </DialogTitle>
          <DialogDescription aria-label="Delete selected item" />
          <div className="p-2 max-w-md text-center bg-white rounded-lg">
            <p className="mb-2 font-bold text-gray-700">
              Feel free to contact us! We are always happy to help you.
            </p>
            <ul className="mb-6 list-disc list-inside text-left text-gray-600">
              <li>Need help with vehicle registration?</li>
              <li>Having trouble managing your listings?</li>
              <li>Company details need updating?</li>
              <li>Issues with uploading vehicle photos?</li>
              <li>Want to know more about your subscription plan?</li>
              <li>Have questions about your account settings?</li>
              <li>Delete your account?</li>
            </ul>
            <p className="mb-6 text-sm text-gray-600">
              Click the button below to chat with us via WhatsApp
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center px-5 py-3 font-semibold text-white bg-green-500 rounded-2xl shadow-lg transition-transform hover:bg-green-600 hover:scale-105"
            >
              <MessageCircleMore size={20} className="mr-2" />
              WhatsApp us
            </a>

            <div className="mt-3 text-lg font-bold text-center">OR</div>

            {/* phone and mail */}
            <div className="flex gap-x-6 justify-center items-center mt-4 text-gray-700 max-sm:flex-col">
              <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                <Phone className="w-5 h-5 text-blue-500" />
                <a
                  href="tel:+971502972335"
                  className="ml-2 text-gray-600 hover:underline hover:text-gray-800"
                >
                  +971 50-297-2335
                </a>
              </div>

              <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                <Mail className="w-5 h-5 text-red-500" />
                <a
                  href="mailto:help@ride.rent"
                  className="ml-2 text-gray-600 hover:underline hover:text-gray-800"
                >
                  help@ride.rent
                </a>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Support available Monday to Friday, 9am - 9pm.
            </p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
