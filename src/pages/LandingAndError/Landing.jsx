import { Link } from "react-router-dom";
import { Footer, Navbar } from "../../components";
import { useSelector } from "react-redux";
import { landingPanels } from "../../data/data.js";
import { useState } from "react";
import axios from "axios";

const Landing = () => {
  const isDarkMode = useSelector((state) => state.user.isDarkMode);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");

  //newsLetter
  const subscribeToNewsletter = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/subscribe",
        {
          email,
        }
      );
      setSubscriptionStatus(response.data.status);
      setMessage(response.data.message);
    } catch (error) {
      setSubscriptionStatus("error");
      setMessage(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
    setEmail("");
  };

  return (
    <div
      className={`font-sans transition-all ${
        isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-200"
      }`}
    >
      <Navbar />
      <section
        className={`${
          isDarkMode ? "bg-gray-700" : "bg-blue-600"
        } text-white py-12 sm:py-20 md:py-28`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:max-w-screen-xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5">
            Efficient project management in one place.
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
            Collaboration, task management, and much more!
          </p>
          <Link
            to="/regisztracio"
            className={`${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-600 text-white "
                : "bg-white"
            } text-blue-600 px-4 py-2 sm:px-5 sm:py-2 rounded-lg hover:bg-gray-200 text-sm sm:text-base`}
          >
            Sign Up now
          </Link>
        </div>
      </section>

      <section id="funkciok" className="bg-blue py-8 sm:py-16">
        <div className="container mx-auto px-4">
          <h2
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10`}
          >
            Main features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 justify-center items-center">
            {landingPanels.map((panel) => {
              const { id, imageUrl, altText, title, text } = panel;
              return (
                <div
                  key={id}
                  className="flex flex-col items-center justify-between text-center"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mb-4 sm:mb-5 bg-gray-600 p-3 sm:p-4 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                    <img
                      src={imageUrl}
                      alt={altText}
                      className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                  </div>
                  <h3
                    className={`mb-3 sm:mb-4 text-xl sm:text-2xl font-medium ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-900"
                    } text-sm sm:text-base`}
                  >
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="hirlevel"
        className={`${
          isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-900"
        } py-28`}
      >
        <div className="container mx-auto max-w-screen-xl text-center">
          <h2 className="text-3xl font-bold mb-8">Stay up-to-date!</h2>
          <p className="mb-8">
            Subscribe to our newsletter and get informed about new features,
            promotions, and updates.
          </p>
          <form onSubmit={subscribeToNewsletter}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className={`${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              } border p-3 rounded-l w-64 focus:outline-none`}
              required
            />
            <button
              type="submit"
              className={`${
                isDarkMode
                  ? "bg-gray-600 hover:bg-gray-500"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white p-3 rounded-r transition-colors`}
            >
              Subscribe
            </button>
          </form>
        </div>
        {message && (
          <div className="flex justify-center">
            <p
              className={`mt-4 w-full text-center ${
                subscriptionStatus === "success"
                  ? "text-green-500"
                  : subscriptionStatus === "info"
                  ? "text-blue-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
