import React from 'react'

interface VehicleStatusOverlayProps {
  approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | 'UNDER_REVIEW'
  isDisabled: boolean
  disabledBy?: 'admin' | 'seller'
}

const VehicleStatusOverlay: React.FC<VehicleStatusOverlayProps> = ({
  approvalStatus,
  isDisabled,
  disabledBy,
}) => {
  let message = ''
  let textColor = 'text-yellow'

  if (approvalStatus === 'PENDING') {
    message = 'Pending Vehicle form completion'
  } else if (approvalStatus === 'UNDER_REVIEW') {
    message = 'Under Review'
  } else if (approvalStatus === 'REJECTED') {
    message = 'Rejected'
    textColor = 'text-red-500'
  } else if (approvalStatus === 'APPROVED' && isDisabled) {
    message = disabledBy === 'admin' ? 'Disabled by Admin' : 'Disabled'
    textColor = 'text-red-500'
  }

  if (!message) return null

  return (
    <div className="absolute inset-0 z-10 bg-black/50 flex-center">
      <div
        className={`px-2 py-1 flex-col flex-center text-center text-lg font-semibold rounded-bl-lg ${textColor}`}
      >
        <span> {message}</span>
      </div>
    </div>
  )
}

export default VehicleStatusOverlay
