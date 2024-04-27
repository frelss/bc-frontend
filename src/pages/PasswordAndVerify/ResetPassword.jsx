import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../redux/userSlice";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown((passwordShown) => !passwordShown);
  };

  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown((confirmPasswordShown) => !confirmPasswordShown);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    dispatch(resetPassword({ token, password, confirmPassword }))
      .unwrap()
      .then(() => {
        toast.success(
          "Password reset successfully. Please log in with your new password."
        );
        navigate("/bejelentkezes");
      })
      .catch((error) => {
        toast.error(error || "Failed to reset password.");
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Please enter your new password.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex top-6 items-center text-sm leading-5">
                  {passwordShown ? (
                    <FiEyeOff
                      onClick={togglePasswordVisiblity}
                      className="text-gray-400 hover:text-gray-100 cursor-pointer"
                    />
                  ) : (
                    <FiEye
                      onClick={togglePasswordVisiblity}
                      className="text-gray-400 hover:text-gray-100 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300"
              >
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={confirmPasswordShown ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex top-6 items-center text-sm leading-5">
                  {confirmPasswordShown ? (
                    <FiEyeOff
                      onClick={toggleConfirmPasswordVisiblity}
                      className="text-gray-400 hover:text-gray-100 cursor-pointer"
                    />
                  ) : (
                    <FiEye
                      onClick={toggleConfirmPasswordVisiblity}
                      className="text-gray-400 hover:text-gray-100  cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
