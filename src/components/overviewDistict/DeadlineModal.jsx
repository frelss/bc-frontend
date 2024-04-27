const DeadlineModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl transition-all transform duration-300 scale-100">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">
          Deadline Alert!
        </h2>
        <p className="text-md text-gray-300 mb-8">
          The project deadline will be in three days. Please ensure all tasks
          are on track to meet the deadline.
        </p>
        <button
          onClick={onClose}
          className="inline-block mt-4 p-3 bg-red-700 text-white font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-red-800 hover:shadow-lg focus:bg-red-800 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-900 active:shadow-lg transition duration-150 ease-in-out w-full text-center"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default DeadlineModal;
