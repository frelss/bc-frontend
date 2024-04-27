import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const isDarkMode = useSelector((state) => state.user.isDarkMode);

  const modalRef = useRef(null);
  const termsModalRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  //modals
  const openModal = () => {
    setIsModalOpen(true);
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "visible";
    document.body.style.paddingRight = "";
  };

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

  //click outsides
  const handleClickOutside = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  }, []);

  const handleTermsClickOutside = useCallback((event) => {
    if (
      termsModalRef.current &&
      !termsModalRef.current.contains(event.target)
    ) {
      closeTermsModal();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleTermsClickOutside);
      document.body.style.overflow = "visible";
      document.body.style.paddingRight = "";
    };
  }, [handleClickOutside, handleTermsClickOutside]);

  return (
    <footer
      className={`${
        isDarkMode ? "bg-gray-700 text-gray-400" : "bg-blue text-gray-700"
      } py-16`}
    >
      <div className="container mx-auto max-w-screen-xl text-center">
        <p className="mb-5">
          ©2024. All rights reserved, Project Management Application.
        </p>
        <div className="flex justify-center space-x-5">
          <button
            onClick={openModal}
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-700 hover:text-white"
            }`}
          >
            Privacy Policy
          </button>
          {isModalOpen && (
            <div
              className="fixed inset-0 z-50 flex justify-center items-center"
              onClick={handleClickOutside}
            >
              <div
                ref={modalRef}
                className={`relative p-2 sm:p-2 w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto rounded-lg shadow overflow-y-auto max-h-[90vh] ${
                  isDarkMode ? "bg-zinc-800" : "bg-gray-400"
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
                        isDarkMode ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      Privacy Policy
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="static-modal"
                      onClick={closeModal}
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
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  <div
                    className={`p-4 sm:p-6 space-y-4 text-base sm:text-lg leading-relaxed ${
                      isDarkMode ? "text-gray-400" : "text-black"
                    }`}
                  >
                    <p>
                      Our Project Management platform is committed to protect
                      your personal data. We follow the principles of the
                      General Data Protection Regulation (GDPR) and are
                      dedicated to transparency. Our goal is to inform you
                      clearly and comprehensibly about the handling of personal
                      data you provide.
                    </p>
                    <p>
                      To protect your data, we implement strict security
                      measures. These include data encryption, the use of
                      security protocols, and regular security reviews. In case
                      of a data breach, we are committed to promptly informing
                      you if the incident could pose a significant risk to your
                      personal rights or freedoms.
                    </p>
                    <p>
                      We respect your data protection rights, including the
                      rights to access, rectify, delete, or restrict the
                      processing of data. You can request information about the
                      handling of your data at any time, and you have the right
                      to object to the processing of your data.
                    </p>
                    <p>
                      For further information about our data processing
                      practices, please read our Privacy Policy. If you have any
                      questions or would like to learn more about your rights
                      and how to exercise them, please contact us.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={openTermsModal}
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-700 hover:text-white"
            }`}
          >
            Terms of Use
          </button>
          {isTermsModalOpen && (
            <div
              className="fixed inset-0 z-50 flex justify-center items-center"
              onClick={handleTermsClickOutside}
            >
              <div
                ref={termsModalRef}
                className={`relative p-2 sm:p-2 w-max max-w-md sm:max-w-lg md:max-w-2xl mx-auto rounded-lg overflow-y-auto max-h-[90vh] ${
                  isDarkMode ? "bg-zinc-800" : "bg-gray-400"
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
                      className={`text-lg sm:text-xl font-semibold  ${
                        isDarkMode ? "text-gray-400" : "text-gray-900"
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
                      management platform. Please read them carefully before
                      using the site.
                    </p>

                    <p>**1. Usage Rights and Restrictions**</p>
                    <p>
                      1.1. Our project management platform may only be used for
                      business or personal project management purposes. Engaging
                      in any unlawful or illegal activities on the site is
                      strictly prohibited.
                    </p>
                    <p>
                      1.2. You are responsible for all content, information, or
                      data that you upload or share on the site. Uploading or
                      sharing content that violates the personal rights of
                      others, infringes on laws, or breaches ethical norms is
                      prohibited.
                    </p>

                    <p>**2. Services and Warranties**</p>
                    <p>
                      2.1. The operator provides a warranty for the operation
                      and availability of the project management platform.
                      However, we reserve the right to make changes to the
                      services without prior notice, or even temporarily or
                      permanently discontinue them.
                    </p>

                    <p>**3. Limitation of Liability**</p>
                    <p>
                      3.1. The operator shall not be liable for any direct or
                      indirect damages arising from the use of the site,
                      including data loss, loss of revenue, or any other losses.
                    </p>
                    <p>
                      3.2. You acknowledge that you use the site at your own
                      risk and assume responsibility for all your activities and
                      content.
                    </p>
                    <p>**4. Other Provisions**</p>
                    <p>
                      4.1. The operator reserves the right to modify the terms
                      of use. We will provide notification of any such
                      modifications, and they will become effective after the
                      notification is posted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
