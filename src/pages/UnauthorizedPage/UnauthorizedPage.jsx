import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-color py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Unauthorized Access
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Seems like you don&apos;t have permission to view this page.
        </p>
        <div className="mt-5 flex justify-center">
          <Link to='/' className="px-5 py-3 font-medium text-black bg-text-color rounded-lg transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
