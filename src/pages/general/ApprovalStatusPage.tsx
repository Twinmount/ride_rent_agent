import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

type ApprovalStatusPageProps = {
  status: 'PENDING' | 'REJECTED'
  rejectionReason?: string
}

export default function ApprovalStatusPage({
  status,
  rejectionReason,
}: ApprovalStatusPageProps) {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="max-w-md p-6 text-center bg-white rounded-lg shadow-lg mt-44 h-fit">
        {status === 'REJECTED' && (
          <>
            <h1 className="mb-4 text-2xl font-semibold text-red-600">
              Registration Rejected
            </h1>
            <p className="text-lg text-gray-700">
              Unfortunately, your company registration has been rejected. Please
              review the rejection reason below and consider reapplying.
            </p>
            {rejectionReason && (
              <div className="p-3 mt-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
                <strong>Reason:</strong> {rejectionReason}
              </div>
            )}
            <div className="mt-6">
              <span className="inline-block px-4 py-2 text-white bg-red-500 rounded-full">
                Registration Rejected
              </span>
            </div>
            <div className="flex justify-center mt-6">
              <Link
                to={'/help'}
                className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 rounded-full hover:bg-green-600"
              >
                <MessageCircle size={20} />
                Contact Support
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
