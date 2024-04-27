const ErrorElement = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <svg
        className="w-24 h-24 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M19.428 15.51a8 8 0 113.002-11.418"
        ></path>
      </svg>
      <p className="text-9xl font-bold text-red-600">404</p>
      <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:mt-4 sm:text-6xl">
        Oops! Page not found.
      </h1>
      <p className="mt-2 text-base text-gray-600 sm:text-lg">
        The page you are looking for does not seem to exist. Check the URL, or
        return home.
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-6 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
      >
        Go Back
      </button>
    </div>
  );
};

export default ErrorElement;
