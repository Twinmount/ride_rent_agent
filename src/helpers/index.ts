type ApprovalStatusType = 'APPROVED' | 'UNDER_REVIEW' | 'REJECTED' | 'PENDING'

// Function to get descriptive message based on approval status
export function getApprovalStatusDescription(status: ApprovalStatusType) {
  switch (status) {
    case 'APPROVED':
      return 'These are vehicles that are currently live.'
    case 'UNDER_REVIEW':
      return 'These are registration completed vehicles, but it is currently under review. It will be live soon as the admin approves it.'
    case 'REJECTED':
      return 'These vehicles have been rejected. Please check the details and resubmit or contact support for further assistance.'
    case 'PENDING':
      return 'These are vehicles for which the vehicle registration form completion is pending, or vehicle registration is incomplete.'
    default:
      return 'Unknown status'
  }
}
