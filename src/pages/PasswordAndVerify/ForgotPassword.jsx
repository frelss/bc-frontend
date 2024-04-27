import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { forgotPassword } from "../../redux/userSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isDarkMode = useSelector((state) => state.user.isDarkMode);

  //handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await dispatch(forgotPassword(email)).unwrap();
      toast.success("Password reset email sent. Please check your inbox.", {
        theme: isDarkMode ? "dark" : "light",
      });
      navigate("/bejelentkezes");
    } catch (error) {
      setError(
        error.message ||
          "Failed to send password reset email. Please try again. (You need to verify your email first!)"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          className={`mt-6 text-center text-3xl font-extrabold ${
            isDarkMode ? "text-gray-300" : "text-gray-900"
          }`}
        >
          Forgot Password?
        </h2>
        <p
          className={`mt-2 text-center text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className={`py-8 px-4 shadow sm:rounded-lg sm:px-10 ${
            isDarkMode
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-300 text-gray-900"
          }`}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    isDarkMode ? "border-gray-600" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    isDarkMode
                      ? "bg-gray-600 text-white"
                      : "bg-white text-gray-900"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <div className="text-center text-m text-red-500">{error}</div>
            )}
            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                  isDarkMode
                    ? "text-gray-900 bg-indigo-400"
                    : "text-white bg-indigo-600"
                } hover:${
                  isDarkMode ? "bg-indigo-500" : "bg-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
              <div className="mt-2">
                <Link
                  to="/bejelentkezes"
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                    isDarkMode
                      ? "text-gray-900 bg-sky-500/50"
                      : "text-white bg-sky-500/75"
                  } hover:${
                    isDarkMode ? "bg-indigo-500" : "bg-indigo-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Go back
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
