import { useAgentContext } from "@/context/AgentContext";
import { useState } from "react";

type Country = {
  registerUrl: string;
  loginUrl: string;
  forgotPasswordUrl: string;
  imagePath: string;
  name: string;
  value: string;
};

type CountryKey = "UAE" | "India";

type Countries = {
  [key in CountryKey]: Country;
};

const countries: Countries = {
  UAE: {
    name: "UAE",
    value: "ae",
    imagePath:
      "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1e6-1f1ea.svg",
    registerUrl: "/ae/register",
    loginUrl: "/ae/login",
    forgotPasswordUrl: "/ae/reset-password",
  },
  India: {
    name: "India",
    value: "in",
    imagePath:
      "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ee-1f1f3.svg", // 🇮🇳
    registerUrl: "/in/register",
    loginUrl: "/in/login",
    forgotPasswordUrl: "/in/reset-password",
  },
};

const RegisterCountryDropdown = ({
  country,
  type = "register",
}: {
  country: string;
  type?: string;
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>(
    country === "ae" ? "UAE" : "India"
  );
  const [open, setOpen] = useState(false);
  const { updateAppCountry } = useAgentContext();

  const switchHref = (type: string, country) => {
    let href: string;

    switch (type) {
      case "register":
        href = country.registerUrl;
        break;
      case "login":
        href = country.loginUrl;
        break;
      case "forgotPassword":
        href = country.forgotPasswordUrl;
        break;
      default:
        href = country.loginUrl;
    }

    return href;
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
      >
        <img
          src={countries[selectedCountry].imagePath}
          alt={selectedCountry}
          className="w-5 h-4 mr-2"
        />
        <span className="text-sm">{countries[selectedCountry].name}</span>
        <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.2l3.71-3.97a.75.75 0 111.1 1.02l-4.25 4.54a.75.75 0 01-1.1 0L5.21 8.29a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {Object.entries(countries).map(([key, country]) => (
            <a
              href={
                switchHref(type, country)
              }
              key={key}
              onClick={() => {
                updateAppCountry(country.value);
                setSelectedCountry(key as CountryKey);
                setOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              <img
                src={country.imagePath}
                alt={`${country.name} flag`}
                className="w-5 h-4 mr-2"
              />
              {country.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegisterCountryDropdown;
