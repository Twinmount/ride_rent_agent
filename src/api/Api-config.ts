// src/api/Api-Config.ts
// import { Config } from "@/config/Config";

// Basic configuration interface for your project.
interface Config {
  readonly MODE: string;
  readonly API_URL: string;
}

// A utility function to get environment variables with a fallback to a default value.
const getConfigValue = <T>(key: string, defaultValue: T): T => {
  return import.meta.env[key] ? (import.meta.env[key] as T) : defaultValue;
};

// Define the base configuration using environment variables or default values.
const BaseConfig: Config = {
  MODE: getConfigValue<string>("MODE", "development"),
  // API_URL: getConfigValue<string>(
  //   "VITE_BASE_URL",
  //   appCountry === "in"
  //     ? import.meta.env.VITE_API_URL_INDIA
  //     : import.meta.env.VITE_API_URL_UAE
  // ),
  API_URL: import.meta.env.VITE_API_URL,
};

console.log("BaseConfig: ", BaseConfig);

// Export the configuration as a readonly object to prevent modification.
export const Config: Readonly<Config> = { ...BaseConfig };

/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  
  baseURL: string;

  /**
   * Milliseconds before the request times out.
   */
  timeout: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseURL: Config.API_URL, // Set the base URL for the API.
  timeout: 2000, 
};
