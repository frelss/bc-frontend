import { Form, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { register } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = () => {
  const termsModalRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isPrivacyPolicyChecked: false,
  });

  const isDarkMode = useSelector((state) => state.user.isDarkMode);

  const handleTermsClickOutside = useCallback((event) => {
    if (
      termsModalRef.current &&
      !termsModalRef.current.contains(event.target)
    ) {
      closeTermsModal();
    }
  }, []);

  const openTermsModal = () => {
    setIsTermsModalOpen(true);
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  };

  const closeTermsModal = () => {
    setIsTermsModalOpen(false);
    document.body.style.overflow = "visible";
    document.body.style.paddingRight = "";
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setRegistrationData((prev) => ({
      ...prev,
      [name]: e.target.type === "checkbox" ? checked : value,
    }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, isPrivacyPolicyChecked } =
      registrationData;
    if (!name || !email || !password || !confirmPassword) {
      setRegistrationError("All fields are mandatory!");
      return;
    }

    if (!isPrivacyPolicyChecked) {
      setRegistrationError("Acceptance of the privacy policy is mandatory!");
      return;
    }

    if (password !== confirmPassword) {
      setRegistrationError("The passwords do not match!");
      return;
    }

    if (password.length < 8) {
      setRegistrationError("The password must be at least 8 characters long!");
      return;
    }

    setIsLoading(true);
    setRegistrationError("");

    try {
      const actionResult = await dispatch(
        register({ name, email, password, confirmPassword })
      );

      if (register.fulfilled.match(actionResult)) {
        //ha sikeres
        navigate("/bejelentkezes");
        toast.success(
          "Successful registration. Verify link sent to the email.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
      } else {
        //ha valami hiba tortent
        const responseErrorMessage = actionResult.payload?.message;
        if (
          responseErrorMessage ===
          "The provided email address is already in use."
        ) {
          setRegistrationError("The provided email address is already in use.");
        } else {
          setRegistrationError(
            responseErrorMessage || "Registration unsuccessful!"
          );
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during registration.";
      setRegistrationError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousedown", handleTermsClickOutside);
      document.body.style.overflow = "visible";
      document.body.style.paddingRight = "";
    };
  }, [handleTermsClickOutside]);

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
          <h2
            className={`text-2xl font-bold mb-6 text-center ${
              isDarkMode ? "text-blue-500" : "text-blue-600"
            }`}
          >
            Sign up
          </h2>
          <Form action="/regisztracio" onSubmit={handleRegistration}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Username:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className={`mt-1 p-2 w-full border ${
                  isDarkMode
                    ? "border-gray-700 bg-gray-700 text-gray-300"
                    : "bg-white bg-opacity-50 text-gray-900"
                } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                value={registrationData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                E-mail address:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={`mt-1 p-2 w-full border ${
                  isDarkMode
                    ? "border-gray-700 bg-gray-700 text-gray-300"
                    : "bg-white bg-opacity-50 text-gray-900"
                } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                value={registrationData.email}
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
                  className={`p-2 w-full border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-700 text-gray-300"
                      : "bg-white bg-opacity-50 text-gray-900"
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  value={registrationData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3  flex items-center text-gray-400  ${
                    isDarkMode ? "hover:text-gray-200" : "hover:text-gray-600"
                  } `}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Confirm password:
              </label>
              <div className="relative mt-1 w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  className={`mt-1 p-2 w-full border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-700 text-gray-300"
                      : "bg-white bg-opacity-50 text-gray-900"
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  value={registrationData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 top-2 flex items-center text-gray-400  ${
                    isDarkMode ? "hover:text-gray-200" : "hover:text-gray-600"
                  } `}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </button>
              </div>
              <div className="flex items-center mt-5">
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  name="isPrivacyPolicyChecked"
                  style={{
                    backgroundColor: isDarkMode ? "#1a202c" : "transparent", // transparent or a light color for light mode
                    borderColor: isDarkMode ? "gray" : "black",
                  }}
                  checked={registrationData.isPrivacyPolicyChecked}
                  onChange={handleChange}
                />

                <label
                  htmlFor="terms-checkbox"
                  className={`ml-2 text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  I agree with the{" "}
                  <a
                    onClick={openTermsModal}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    terms and conditions
                  </a>
                  .
                </label>
                {isTermsModalOpen && (
                  <div
                    className="fixed inset-0 z-50 flex justify-center items-center"
                    onClick={handleTermsClickOutside}
                  >
                    <div
                      ref={termsModalRef}
                      className={`relative p-2 sm:p-2 w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto rounded-lg shadow overflow-y-auto max-h-[90vh] ${
                        isDarkMode ? "bg-zinc-900" : "bg-gray-400"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className={`relative rounded-lg shadow ${
                          isDarkMode ? "bg-gray-700" : "bg-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                          <h3
                            className={`text-lg sm:text-xl font-semibold ${
                              isDarkMode
                                ? "text-gray-400 hover:text-gray-300"
                                : "text-gray-700 hover:text-white"
                            }`}
                          >
                            Terms of Use
                          </h3>
                          <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="static-modal"
                            onClick={closeTermsModal}
                          >
                            <svg
                              className="w-3 h-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 14"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                              />
                            </svg>
                          </button>
                        </div>
                        <div
                          className={`p-4 sm:p-6 space-y-4 text-base sm:text-lg leading-relaxed ${
                            isDarkMode ? "text-gray-400" : "text-black"
                          }`}
                        >
                          <p>General Provisions</p>
                          <p>
                            These terms of use govern the use of our project
                            management platform. Please read them carefully
                            before using the site.
                          </p>

                          <p>**1. Usage Rights and Restrictions**</p>
                          <p>
                            1.1. Our project management platform may only be
                            used for business or personal project management
                            purposes. Engaging in any unlawful or illegal
                            activities on the site is strictly prohibited.
                          </p>
                          <p>
                            1.2. You are responsible for all content,
                            information, or data that you upload or share on the
                            site. Uploading or sharing content that violates the
                            personal rights of others, infringes on laws, or
                            breaches ethical norms is prohibited.
                          </p>

                          <p>**2. Services and Warranties**</p>
                          <p>
                            2.1. The operator provides a warranty for the
                            operation and availability of the project management
                            platform. However, we reserve the right to make
                            changes to the services without prior notice, or
                            even temporarily or permanently discontinue them.
                          </p>

                          <p>**3. Limitation of Liability**</p>
                          <p>
                            3.1. The operator shall not be liable for any direct
                            or indirect damages arising from the use of the
                            site, including data loss, loss of revenue, or any
                            other losses.
                          </p>
                          <p>
                            3.2. You acknowledge that you use the site at your
                            own risk and assume responsibility for all your
                            activities and content.
                          </p>
                          <p>**4. Other Provisions**</p>
                          <p>
                            4.1. The operator reserves the right to modify the
                            terms of use. We will provide notification of any
                            such modifications, and they will become effective
                            after the notification is posted.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              {registrationError && (
                <p className="mb-4 text-center text-red-600">
                  {registrationError}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-full hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transform transition-transform duration-200 hover:scale-105 shadow-lg"
                onClick={handleRegistration}
                disabled={isLoading}
              >
                {isLoading ? "Registration in progress..." : "Sign up"}{" "}
              </button>
            </div>
          </Form>
          <div className="mt-4 text-center">
            <Link
              to="/"
              className={`text-blue-600 hover:text-blue-800 ${
                isDarkMode ? "hover:text-blue-400" : ""
              }`}
            >
              ← Back to the homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
