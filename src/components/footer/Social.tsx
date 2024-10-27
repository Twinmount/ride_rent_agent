import { MdEmail } from "react-icons/md";

import { FaPhoneVolume } from "react-icons/fa6";
import { socials } from ".";

const Social = () => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* contact */}
      <div className="flex gap-8 mb">
        {/* mobile  */}
        <div className="gap-1 flex-center hover:text-yellow">
          <FaPhoneVolume className="text-yellow" />
          <a
            href="tel:+971502972335"
            className="p-0 max-h-fit max-w-fit w-fit h-fit"
          >
            +971 - 50-297-2335
          </a>
        </div>
        {/* mail */}
        <div className="gap-1 flex-center hover:text-yellow">
          <MdEmail className="text-yellow" />
          <a href="mailto:hello@ride.rent" className="">
            hello@ride.rent
          </a>
        </div>
      </div>

      {/* social */}
      <div className="flex flex-col gap-2 flex-center">
        <div className="text-xl font-bold text-yellow">We are Social!</div>
        <div className="flex gap-x-2">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 w-8 h-8 text-white rounded-full transition-colors flex-center hover:text-yellow hover:scale-105"
              >
                <Icon className="icon" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Social;
