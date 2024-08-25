import { useEffect, useState } from 'react'

/**
 * Custom hook to manage loading messages
 * Displays random messages from a predefined list after a 5-second delay
 *
 * @returns {string} - The current loading message
 */
export function useLoadingMessages() {
  const [message, setMessage] = useState<string>('')
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  // Array of messages to show during loading
  const loadingMessages = [
    'Processing your data...',
    'Uploading your files...',
    'Almost there, please wait...',
    'This may take a moment...',
    'Thanks for your patience...',
  ]

  useEffect(() => {
    // Function to update the message randomly
    const updateMessage = () => {
      const randomIndex = Math.floor(Math.random() * loadingMessages.length)
      setMessage(loadingMessages[randomIndex])
    }

    // Start the message updates after a 5-second delay
    const delayId = setTimeout(() => {
      updateMessage() // Set the first message
      const id = setInterval(updateMessage, 10000) // Continue updating every 5 seconds
      setIntervalId(id)
    }, 5000) // Delay for 5 seconds

    // Cleanup function to clear the interval and timeout
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
      clearTimeout(delayId)
    }
  }, []) // Run only once on mount

  return message
}
