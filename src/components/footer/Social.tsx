import { MdEmail } from 'react-icons/md'

import { FaPhoneVolume } from 'react-icons/fa6'
import { socials } from '.'

const Social = () => {
  return (
    <div className="gap-8 mb-8 flex-center max-md:flex-col">
      {/* contact */}
      <div className="flex flex-col gap-y-1">
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
      <div className="">
        <div className="text-lg font-semibold text-yellow">We are Social</div>
        <div className="flex gap-x-2">
          {socials.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-center hover:text-yellow"
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
