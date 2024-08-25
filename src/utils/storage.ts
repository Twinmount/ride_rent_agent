// src/utils/storage.ts

export enum StorageKeys {
  /**
   * Key for storing user authentication token.
   */
  ACCESS_TOKEN = 'accessToken',

  /**
   * Key for storing refresh token.
   */
  REFRESH_TOKEN = 'refreshToken',

  /**
   * Key for storing user profile data.
   */
  USER_DATA = 'userData',

  /**
   * Key for storing user authentication status.
   */
  AUTH_STATUS = 'authStatus',
  /**
   * Key for storing vehicle id after the submission of primary phase form
   * so that it can be used in the phase 2 and phase 3
   */
  VEHICLE_ID = 'vehicleId',
  /**
   * Key for storing category id after the submission of primary phase form
   * so that it can be used in the phase 2 and phase 3
   */
  CATEGORY_ID = 'categoryId',
}

export function load<T>(key: string): T | undefined {
  try {
    const storedValue = localStorage.getItem(key)
    if (!storedValue) throw new Error('Value not found in storage')
    return JSON.parse(storedValue) as T
  } catch (error) {
    console.error(`Error loading from storage using key "${key}":`, error)
    return undefined
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving to storage using key "${key}":`, error)
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from storage using key "${key}":`, error)
  }
}

export function clear(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Error clearing storage:', error)
  }
}
