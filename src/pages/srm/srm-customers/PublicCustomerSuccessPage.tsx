export default function PublicCustomerSuccessPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-6 text-center space-y-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Submission Successful ✅
        </h1>
        <p className="text-sm text-gray-600">
          Thank you! Your form has been successfully submitted. You can now
          safely close this page.
        </p>
      </div>
    </div>
  );
}
