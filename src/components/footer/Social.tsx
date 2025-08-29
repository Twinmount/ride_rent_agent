import { socials } from ".";

const Social = () => {
  return (
    <div className="flex flex-col gap-4 mb-8">
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
