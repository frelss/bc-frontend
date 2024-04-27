const TaskCard = ({ title, description, dueDate, isCompleted }) => {
  //dates
  const isValidDate = dueDate && !isNaN(new Date(dueDate).getTime());

  const formattedDueDate = isValidDate
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(dueDate))
    : "No deadline";

  return (
    <div className="task-card bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 relative transition duration-200 ease-in-out">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span
            className={`inline-block ${
              isCompleted ? "bg-green-500" : "bg-red-500"
            } text-xs font-semibold mr-2 px-2.5 py-0.5 rounded`}
          >
            {isCompleted ? "Completed" : "Pending"}
          </span>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>

      <p className="text-gray-400">{description}</p>
      <div className="mt-2">
        <span className="text-xs">{formattedDueDate}</span>
      </div>
    </div>
  );
};

export default TaskCard;
