import { useAgentContext } from "@/context/AgentContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ee-1f1f3.svg",
    registerUrl: "/in/register",
    loginUrl: "/in/login",
    forgotPasswordUrl: "/in/reset-password",
  },
};

type PageType = "login" | "reset-password" | "register";

const RegisterCountryDropdown = ({
  type = "register",
  onChange,
  pageType = "register",
  isCompact = false,
}: {
  country: string;
  type?: string;
  value?: string;
  onChange?: (countryValue: string) => void;
  pageType?: PageType;
  isCompact?: boolean;
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryKey | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const { updateAppCountry } = useAgentContext();
  const navigate = useNavigate();

  // Check if we should use the premium dark design
  const isPremiumDesign = pageType === "login" || pageType === "reset-password";

  const switchHref = (type: string, country: Country) => {
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

  // Premium Dark Design (for login/reset-password) - COMPACT VERSION
  if (isPremiumDesign) {
    return (
      <div className="relative inline-block text-left w-full md:w-auto">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`inline-flex items-center justify-between px-3 bg-transparent border-2 border-white/20 rounded-lg backdrop-blur-sm text-white hover:border-white/40 focus:border-white/60 focus:ring-2 focus:ring-amber-500/30 transition-all text-sm md:text-sm font-medium w-full md:w-auto ${
            isCompact ? "py-1.5 min-w-[140px]" : "py-2 min-w-[160px]"
          }`}
        >
          <div className="flex items-center gap-1.5">
            {selectedCountry ? (
              <>
                <img
                  src={countries[selectedCountry].imagePath}
                  alt={selectedCountry}
                  className="w-4 h-3"
                />
                <span className="text-sm">
                  {countries[selectedCountry].name}
                </span>
              </>
            ) : (
              <span className="text-white/70 text-sm">Select Country</span>
            )}
          </div>
          <svg
            className="w-3.5 h-3.5 ml-1.5 flex-shrink-0 text-white/70"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.2l3.71-3.97a.75.75 0 111.1 1.02l-4.25 4.54a.75.75 0 01-1.1 0L5.21 8.29a.75.75 0 01.02-1.06z" />
          </svg>
        </button>

        {open && (
          <>
            {/* Backdrop to close dropdown on click outside */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Dropdown Menu - Dark & Opaque */}
            <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border-2 border-white/30 rounded-xl shadow-2xl z-50 overflow-hidden">
              {Object.entries(countries).map(([key, country], index) => (
                <button
                  type="button"
                  key={key}
                  onClick={(e) => {
                    e.preventDefault();

                    updateAppCountry(country.value);
                    setSelectedCountry(key as CountryKey);

                    if (onChange) {
                      const countryId =
                        country.value === "ae"
                          ? "ee8a7c95-303d-4f55-bd6c-85063ff1cf48"
                          : "68ea1314-08ed-4bba-a2b1-af549946523d";
                      onChange(countryId);
                    }

                    const newUrl = switchHref(type, country);
                    navigate(newUrl);

                    setOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 text-sm text-white hover:bg-white/15 transition-all ${
                    index !== Object.entries(countries).length - 1
                      ? "border-b border-white/10"
                      : ""
                  }`}
                >
                  <img
                    src={country.imagePath}
                    alt={`${country.name} flag`}
                    className="w-5 h-4 mr-3 flex-shrink-0"
                  />
                  <span className="font-medium text-sm">{country.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Light Design (for register and other pages)
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all min-w-[140px] justify-between"
      >
        {selectedCountry ? (
          <div className="flex items-center gap-2">
            <img
              src={countries[selectedCountry].imagePath}
              alt={selectedCountry}
              className="w-5 h-4"
            />
            <span className="text-sm font-medium text-gray-900">
              {countries[selectedCountry].name}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Select Country</span>
        )}
        <svg
          className="w-4 h-4 ml-2 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.2l3.71-3.97a.75.75 0 111.1 1.02l-4.25 4.54a.75.75 0 01-1.1 0L5.21 8.29a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop for light design too */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            {Object.entries(countries).map(([key, country], index) => (
              <button
                type="button"
                key={key}
                onClick={(e) => {
                  e.preventDefault();

                  updateAppCountry(country.value);
                  setSelectedCountry(key as CountryKey);

                  if (onChange) {
                    const countryId =
                      country.value === "ae"
                        ? "ee8a7c95-303d-4f55-bd6c-85063ff1cf48"
                        : "68ea1314-08ed-4bba-a2b1-af549946523d";
                    onChange(countryId);
                  }

                  const newUrl = switchHref(type, country);
                  navigate(newUrl);

                  setOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-colors ${
                  index !== Object.entries(countries).length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <img
                  src={country.imagePath}
                  alt={`${country.name} flag`}
                  className="w-5 h-4 mr-2"
                />
                <span className="font-medium">{country.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RegisterCountryDropdown;
