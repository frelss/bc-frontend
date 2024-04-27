const TaskSummary = ({ title, count }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="text-xl">{title}</div>
      </div>
      <div className="mt-2">
        <div className="text-3xl font-semibold">{count}</div>
      </div>
    </div>
  );
};

export default TaskSummary;
