type SpinnerProps = {
  color?: string // Optional color prop for text color
  additionalClass?: string // Optional additional class prop
}

export default function Spinner({
  color = 'text-white', // Default color is 'text-white'
  additionalClass = '', // Default additional class is empty
}: SpinnerProps) {
  return (
    <div>
      <svg
        className={`w-5 h-5 ml-2 animate-spin ${color} ${additionalClass}`} // Apply props dynamically
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  )
}
