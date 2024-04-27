import { useRouteError, Link } from "react-router-dom";

const Error = () => {
  const error = useRouteError();

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100 px-4">
      {error.status === 404 ? (
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-8xl font-bold text-indigo-400">404</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">
            The page cannot be found.
          </h1>
          <p className="mt-4 text-lg">The requested page does not exist.</p>
          <Link
            to="/"
            className="mt-6 inline-block rounded bg-indigo-600 py-2 px-4 text-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Back to the homepage
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <h4 className="text-4xl font-bold">There was an error</h4>
        </div>
      )}
    </main>
  );
};

export default Error;
