import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { load, save, StorageKeys, remove } from '../utils/storage'
import { API } from '@/api/ApiService'
import { Slug } from '@/api/Api-Endpoints'

export interface DecodedAccessToken {
  email: string | null
  sessionId: string
  exp: number // Expiration time of the token
  iat: number
  id: string
}

export interface DecodedRefreshToken {
  userId: string
  sessionId: string
  exp: number // Expiration time of the refresh token
  iat: number
}

interface RefreshResponse {
  result: {
    refreshToken: string
    token: string
  }
}

/**
 * Checks if the token is expired or will expire within a given time buffer.
 * @param exp - The expiration time of the token (in seconds).
 * @param bufferInMinutes - The buffer time before the actual expiration (in minutes).
 * @returns True if the token is expired or within the buffer time, false otherwise.
 */
const isTokenExpired = (exp: number, bufferInMinutes: number = 10): boolean => {
  const currentTime = Math.floor(Date.now() / 1000) // Current time in seconds
  const bufferTime = bufferInMinutes * 60 // Convert buffer time to seconds
  return exp - bufferTime < currentTime // Returns true if the token is considered expired
}

/**
 * Attempts to refresh the access token using the refresh token.
 * @returns True if the token was successfully refreshed, false otherwise.
 */
const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN) // Load the refresh token from storage

  if (!refreshToken) {
    return false
  }

  try {
    // Decode the refresh token to check its expiration time
    const decodedRefreshToken = jwtDecode<DecodedRefreshToken>(refreshToken)

    if (isTokenExpired(decodedRefreshToken.exp)) {
      return false
    }

    // Make an API request to refresh the access token
    const data = await API.post<RefreshResponse>({
      slug: Slug.REFRESH,
      body: { refreshToken },
    })

    if (!data || !data.result) {
      return false
    }

    // Save the new access and refresh tokens
    save(StorageKeys.ACCESS_TOKEN, data.result.token)
    save(StorageKeys.REFRESH_TOKEN, data.result.refreshToken)
    return true
  } catch (error) {
    console.error('Error during token refresh:', error)
    return false
  }
}

/**
 * The ProtectedRoute component checks if the user is authorized to access the route.
 * If the access token is expired, it tries to refresh it using the refresh token.
 * If the refresh fails, the user is redirected to the login page.
 */
const ProtectedRoute = () => {
  const navigate = useNavigate() // React Router's hook for navigation

  useEffect(() => {
    const checkAuthorization = async () => {
      const accessToken = load<string>(StorageKeys.ACCESS_TOKEN) // Load the access token from storage
      const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN) // Load the refresh token from storage

      if (!accessToken || !refreshToken) {
        remove(StorageKeys.ACCESS_TOKEN)
        remove(StorageKeys.REFRESH_TOKEN)
        navigate('/login', { replace: true }) // Redirect to login page
        return
      }

      try {
        // Decode the access token to check its expiration time
        const decodedAccessToken = jwtDecode<DecodedAccessToken>(accessToken)

        if (isTokenExpired(decodedAccessToken.exp)) {
          const refreshed = await refreshAccessToken() // Attempt to refresh the access token

          if (!refreshed) {
            remove(StorageKeys.ACCESS_TOKEN)
            remove(StorageKeys.REFRESH_TOKEN)
            navigate('/login', { replace: true }) // Redirect to login page
          }
        }
      } catch (error) {
        console.error('Unexpected error during token validation:', error)
        remove(StorageKeys.ACCESS_TOKEN)
        remove(StorageKeys.REFRESH_TOKEN)
        navigate('/login', { replace: true }) // Redirect to login page
      }
    }

    checkAuthorization() // Run the authorization check when the component mounts
  }, [navigate]) // Dependency array ensures this effect runs when the component mounts

  return <Outlet /> // Render the protected route's children if authorized
}

export default ProtectedRoute
