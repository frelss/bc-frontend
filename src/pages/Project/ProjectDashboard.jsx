import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TaskSummary from "../../components/dashboardDistict/TaskSummary";
import ChartComponent from "../../components/dashboardDistict/Chart";

const ProjectDashboard = () => {
  const BASE_URL = "https://prmanagement-api.onrender.com/api";

  const [tasksData, setTasksData] = useState({
    completed: 0,
    incomplete: 0,
    overdue: 0,
    total: 0,
    tasksPerMonth: [],
    months: [],
  });

  const activeProjectId = useSelector(
    (state) => state.projects.activeProjectId
  );

  //chart
  useEffect(() => {
    if (activeProjectId) {
      fetch(`${BASE_URL}/projects/${activeProjectId}/allTasks`)
        .then((response) => response.json())
        .then((tasks) => {
          const now = new Date();
          const completed = tasks.filter((task) => task.isCompleted).length;
          const overdue = tasks.filter(
            (task) => new Date(task.dueDate) < now && !task.isCompleted
          ).length;
          const total = tasks.length;
          const incomplete = total - completed;

          const tasksByMonth = tasks.reduce((acc, task) => {
            const month = new Date(task.dueDate).getMonth();
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {});

          const months = Array.from({ length: 12 }, (_, i) =>
            new Date(0, i).toLocaleString("en-US", { month: "short" })
          );

          const tasksPerMonth = months.map((_, i) => tasksByMonth[i] || 0);

          setTasksData({
            completed,
            incomplete,
            overdue,
            total,
            tasksPerMonth,
            months,
          });
        })
        .catch((error) => console.error("Error fetching tasks:", error));
    }
  }, [activeProjectId, BASE_URL]);

  return (
    <div className="flex flex-col min-h-screen mt-10">
      <div className="flex-grow">
        <div className="w-full bg-gray-900 p-5 min-h-screen space-x-5">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
              <TaskSummary
                title="Completed Tasks"
                count={tasksData.completed.toString()}
              />
              <TaskSummary
                title="Incomplete Tasks"
                count={tasksData.incomplete.toString()}
              />
              <TaskSummary
                title="Overdue Tasks"
                count={tasksData.overdue.toString()}
              />
              <TaskSummary
                title="Total Tasks"
                count={tasksData.total.toString()}
              />
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex justify-center items-center">
                <ChartComponent
                  chartId="taskStatusChart"
                  data={{
                    labels: ["Completed", "Incomplete", "Overdue"],
                    values: [
                      tasksData.completed,
                      tasksData.incomplete,
                      tasksData.overdue,
                    ],
                  }}
                />
              </div>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex justify-center items-center left-10">
                <ChartComponent
                  chartId="tasksByMonthChart"
                  data={{
                    labels: tasksData.months,
                    values: tasksData.tasksPerMonth,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
