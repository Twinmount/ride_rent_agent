import { MdEmail } from 'react-icons/md'

import { FaPhoneVolume } from 'react-icons/fa6'
import { socials } from '.'

const Social = () => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* contact */}
      <div className="flex gap-8 mb">
        {/* mobile  */}
        <div className="gap-1 flex-center hover:text-yellow">
          <FaPhoneVolume className="text-yellow" />
          <a
            href={`tel:${import.meta.env.VITE_FOOTER_PHONE_NUM}`}
            className="p-0 max-h-fit max-w-fit w-fit h-fit"
          >
            {import.meta.env.VITE_FOOTER_PHONE_NUM}
          </a>
        </div>
        {/* mail */}
        <div className="gap-1 flex-center hover:text-yellow">
          <MdEmail className="text-yellow" />
          <a href="mailto:Hello@ride.rent" className="t">
            Hello@ride.rent
          </a>
        </div>
      </div>

      {/* social */}
      <div className="flex flex-col gap-2 flex-center">
        <div className="text-xl font-bold text-white">We are Social!</div>
        <div className="flex gap-x-2">
          {socials.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 p-1 text-white transition-all rounded-full flex-center bg-yellow hover:scale-105"
              >
                <Icon className="icon" />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default Social
