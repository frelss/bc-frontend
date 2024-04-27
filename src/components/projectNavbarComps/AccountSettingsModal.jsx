import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillMessage,
} from "react-icons/ai";
import { MdSend } from "react-icons/md";
import axios from "axios";

const AccountSettingsModal = ({ isOpen, onClose }) => {
  const BASE_URL = "http://localhost:3000/api";

  const modalRef = useRef(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Contact form states
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubject, setContactSubject] = useState("");

  // General state
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?.user?.id);
  const user = useSelector((state) => state.user?.user);

  const messageMaxLength = 500;

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, onClose]);

  //handlers
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      await dispatch(
        updatePassword({
          userId,
          currentPassword,
          newPassword,
        })
      ).unwrap();

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update password. Please try again."
      );
    }
  };

  const handleContactUs = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/users/send-contact-email`,
        {
          email: user.email,
          subject: contactSubject,
          message: contactMessage,
        }
      );

      if (response.data.status === "success") {
        toast.info("Email sent successfully");
        setContactMessage("");
        setContactSubject("");
      } else {
        throw new Error(response.data.message || "Failed to send email");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred, please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
    >
      <div
        ref={modalRef}
        className="bg-gray-800 p-8 rounded-lg shadow-xl text-white w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          {/* Password fields */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-semibold text-gray-300"
            >
              Current Password
            </label>
            <div className="relative mt-2">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full py-3 px-3 rounded-md bg-gray-700 text-white border-0 shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-200"
              >
                {showCurrentPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-semibold text-gray-300"
            >
              New Password
            </label>
            <div className="relative mt-2">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full py-3 px-3 rounded-md bg-gray-700 text-white border-0 shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-200"
              >
                {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-300"
            >
              Confirm New Password
            </label>
            <div className="relative mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full py-3 px-3 rounded-md bg-gray-700 text-white border-0 shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-200"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md border border-gray-700 text-gray-400 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Contact Us Form */}
        <form onSubmit={handleContactUs} className="space-y-2 mt-6">
          <label
            htmlFor="contactMessage"
            className="flex items-center text-sm font-semibold text-gray-300"
          >
            <AiFillMessage className="mr-2" /> Contact Us
          </label>
          <div>
            <label
              htmlFor="contactSubject"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="contactSubject"
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              placeholder="Enter the subject here..."
              className="block w-full py-2 px-3 rounded-md bg-gray-700 text-white border-0 shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <textarea
            id="contactMessage"
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            className="block w-full py-2 px-3 rounded-md bg-gray-700 text-white border-0 shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here..."
            rows="4"
            maxLength={messageMaxLength}
          ></textarea>
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>
              {contactMessage.length} / {messageMaxLength}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="inline-flex items-center px-4 py-2 text-gray-700 rounded-md bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <MdSend className="mr-2" /> Send Message
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AccountSettingsModal;
