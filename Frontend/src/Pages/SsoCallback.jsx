import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

const SsoCallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-emerald-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">Authenticating...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we log you in</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
};

export default SsoCallback;