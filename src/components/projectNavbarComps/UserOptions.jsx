import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/userSlice";
import { useEffect, useState } from "react";
import HelpModal from "./HelpModal";
import AccountSettingsModal from "./AccountSettingsModal";

const UserOptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setDropdownOpen(false);
  };

  const toggleSettingsModal = () => {
    setIsSettingsModalOpen(!isSettingsModalOpen);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("activeProjectId");
    navigate("/");
    setDropdownOpen(false);
  };

  useEffect(() => {
    const closeDropdown = (event) => {
      if (!event.target.closest(".user-options-container")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <div className="relative group z-30 ml-5 flex items-center user-options-container">
      <button
        className="w-7 h-7 rounded-2xl bg-gray-600 text-xs text-white"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {user?.name.slice(0, 2)}
      </button>
      {dropdownOpen && (
        <div className="absolute top-full right-0 z-50 min-w-[160px] bg-gray-800 text-white rounded-md shadow-lg overflow-hidden mt-2 opacity-100 transition-opacity duration-200">
          <div className="px-4 py-2">
            <span className="block text-sm">{user?.name}</span>
            <span className="block text-xs opacity-75">
              {user.role === "admin"
                ? "Admin"
                : user.role === "pr_manager"
                ? "Project Manager"
                : "user"}
            </span>
          </div>
          <div className="h-px bg-gray-700"></div>
          <ul className="text-sm">
            {user.role === "admin" && (
              <li>
                <Link
                  to="/adminConsole"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Admin Console
                </Link>
              </li>
            )}
            <li>
              <button
                onClick={toggleModal}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Help
              </button>
            </li>
            <li>
              <button
                onClick={toggleSettingsModal}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Account Settings
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700"
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}

      <HelpModal isOpen={isModalOpen} onClose={toggleModal} role={user?.role} />
      <AccountSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={toggleSettingsModal}
      />
    </div>
  );
};

export default UserOptions;
