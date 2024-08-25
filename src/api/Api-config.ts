// src/api/Api-Config.ts

// Basic configuration interface for your project.
interface Config {
  readonly MODE: string
  readonly API_URL: string
}

// A utility function to get environment variables with a fallback to a default value.
const getConfigValue = <T>(key: string, defaultValue: T): T => {
  return import.meta.env[key] ? (import.meta.env[key] as T) : defaultValue
}

// Define the base configuration using environment variables or default values.
const BaseConfig: Config = {
  MODE: getConfigValue<string>('MODE', 'development'),
  API_URL: getConfigValue<string>(
    'VITE_BASE_URL',
    import.meta.env.VITE_API_URL
  ),
}

// Export the configuration as a readonly object to prevent modification.
export const Config: Readonly<Config> = { ...BaseConfig }

/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The base URL of the API.
   */
  baseURL: string

  /**
   * Milliseconds before the request times out.
   */
  timeout: number
}

// Set the default API configuration using the BaseConfig values.
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseURL: Config.API_URL, // Set the base URL for the API.
  timeout: 30000, // Set a default timeout for requests (e.g., 30 seconds).
}
