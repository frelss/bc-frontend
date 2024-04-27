import { Form, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { login } from "../../redux/userSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const isDarkMode = useSelector((state) => state.user.isDarkMode);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //login
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;
    if (!email || !password) {
      setLoginError("E-mail address and password are required!");
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      const actionResult = await dispatch(login(loginData));
      const resultData = actionResult.payload;

      if (login.fulfilled.match(actionResult)) {
        if (rememberMe) {
          localStorage.setItem("savedEmail", loginData.email);
          localStorage.setItem("savedPassword", loginData.password);
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
        }
        toast.success("You have successfully logged in.");
        navigate("/projekt");
      } else {
        setLoginError(resultData.message || "An error occurred during login.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during login.";
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setLoginData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  return (
    <div
      className={`${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-200"}`}
    >
      <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-gray-300"
          } max-w-md w-full p-8 rounded-lg shadow-lg`}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
            Log in
          </h2>
          <Form action="/bejelentkezes" method="post">
            <div className="mb-4">
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email address:
              </label>
              <input
                type="text"
                id="email"
                name="email"
                required
                className={`mt-1 p-2 w-full border ${
                  isDarkMode
                    ? "border-gray-700 bg-gray-700 text-gray-300"
                    : "bg-white bg-opacity-50 text-gray-900"
                } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                value={loginData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password:
              </label>
              <div className="relative mt-1 w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  className={`mt-1 p-2 w-full border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-700 text-gray-300"
                      : "bg-white bg-opacity-50 text-gray-900"
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  value={loginData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 top-2 flex items-center text-gray-400  ${
                    isDarkMode ? "hover:text-gray-200" : "hover:text-gray-600"
                  } `}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleCheckboxChange}
                  style={{
                    backgroundColor: isDarkMode ? "#1a202c" : "#e6e6e6",
                    borderColor: isDarkMode ? "gray" : "black",
                  }}
                />

                <label
                  htmlFor="remember-me-checkbox"
                  className={`ml-2 text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-900 "
                  }`}
                >
                  Remember Me
                </label>
              </div>

              <div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgotten password?
                </Link>
              </div>
            </div>
            {loginError && (
              <p className="mb-4 text-center text-red-600">{loginError}</p>
            )}
            <div className="mb-4">
              <button
                type="submit"
                onClick={handleLogin}
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-3 px-4 rounded-full hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transform transition-transform duration-200 hover:scale-105 shadow-lg ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Login in progress..." : "Log in"}
              </button>
            </div>
          </Form>
          <div className="mt-4 text-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              ← Back to the homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
