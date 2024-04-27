import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/userSlice";
import { CiLight, CiDark } from "react-icons/ci";
import projectImg from "../../pics/project-management.png";

const Navbar = () => {
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDarkMode = useSelector((state) => state.user.isDarkMode);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <nav className={`${isDarkMode ? "bg-gray-800" : "bg-blue"} shadow-md`}>
      <div className="container mx-auto max-w-full flex items-center p-6 flex-wrap">
        <a
          className={`flex items-center ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          <img src={projectImg} alt="logo" className="w-9 h-9 mr-2" />
          Project Management
        </a>

        <button
          className="text-gray-800 dark:text-gray-400 hover:opacity-500 transition-opacity ml-5 text-2xl "
          onClick={handleThemeToggle}
        >
          {isDarkMode ? <CiDark /> : <CiLight />}
        </button>

        <button className="md:hidden ml-auto" onClick={toggleMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m4 6H4"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        <div
          className={`${
            isDarkMode ? "bg-gray-600" : "bg-gray-300"
          } fixed top-20 inset-x-0 border border-gray-400 shadow-md z-10 md:hidden transition-all ease-in-out duration-300 ${
            isMenuOpen ? "block" : "hidden"
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="p-5">
            <button
              onClick={() => {
                scrollToSection("hirlevel");
                setIsMenuOpen(false);
              }}
              className={`${
                isDarkMode
                  ? "text-white hover:text-black"
                  : "text-black hover:text-white"
              }  mr-5 block w-full text-left`}
            >
              Subscription
            </button>
            <button
              onClick={() => {
                scrollToSection("funkciok");
                setIsMenuOpen(false);
              }}
              className={`${
                isDarkMode
                  ? "text-white hover:text-black"
                  : "text-black hover:text-white"
              }  mr-5 block w-full text-left`}
            >
              Features
            </button>
            <Link
              to="/bejelentkezes"
              onClick={() => setIsMenuOpen(false)}
              className={`${
                isDarkMode
                  ? "text-white hover:text-black"
                  : "text-black hover:text-white"
              }  mr-5 block w-full text-left`}
            >
              Log in
            </Link>
            <Link
              to="/regisztracio"
              onClick={() => setIsMenuOpen(false)}
              className={`${
                isDarkMode
                  ? "text-white hover:text-black"
                  : "text-black hover:text-white"
              }  mr-5 block w-full text-left`}
            >
              Sign up
            </Link>
          </div>
        </div>

        <div className="hidden md:flex flex-grow justify-center ml-5">
          <button
            onClick={() => scrollToSection("hirlevel")}
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } hover:text-gray-400 mr-5`}
          >
            Subscription
          </button>
          <button
            onClick={() => scrollToSection("funkciok")}
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } hover:text-gray-400 mr-5`}
          >
            Features
          </button>
        </div>
        <div className="hidden md:flex items-center ml-auto">
          <Link
            to="/bejelentkezes"
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } hover:text-gray-400`}
          >
            Log in
          </Link>
          <Link
            to="/regisztracio"
            className={`ml-4 ${
              isDarkMode ? "bg-gray-700" : "bg-blue-600"
            } text-white px-5 py-2 rounded-lg hover:${
              isDarkMode ? "bg-gray-600" : "bg-blue-700"
            }`}
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
