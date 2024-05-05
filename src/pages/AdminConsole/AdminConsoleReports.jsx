import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../redux/projectSlice";
import { Doughnut, Bar } from "react-chartjs-2";
import { fetchUsers } from "../../redux/userSlice";
import { createSelector } from "@reduxjs/toolkit";
import "chart.js/auto";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "../../components/vfs_fonts";

pdfMake.vfs = pdfFonts;

const AdminConsoleReports = () => {
  const BASE_URL = "https://prmanagement-api.onrender.com/api";

  const dispatch = useDispatch();

  //selectors
  const selectUserList = (state) => state.user.userList;
  const projects = useSelector((state) => state.projects.projectsItems);
  const selectPrManagers = createSelector([selectUserList], (userList) =>
    userList.filter((user) => user.role === "pr_manager")
  );
  const prManagers = useSelector(selectPrManagers);

  //states
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [tasksData, setTasksData] = useState({
    completed: 0,
    incomplete: 0,
    overdue: 0,
    total: 0,
    tasksPerMonth: [],
    months: [],
  });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUsers({ role: "pr_manager" }));
  }, [dispatch]);

  //fecthing
  useEffect(() => {
    if (selectedProject) {
      fetch(`${BASE_URL}/projects/${selectedProject}/allTasks`)
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
          const tasksPerMonth = months?.map((_, i) => tasksByMonth[i] || 0);

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
  }, [selectedProject, BASE_URL]);

  //date
  useEffect(() => {
    if (selectedProject) {
      let url = `${BASE_URL}/projects/${selectedProject}/allTasks`;
      let startDate, endDate;

      if (selectedMonth !== "all") {
        const year = new Date().getFullYear();
        startDate = new Date(
          year,
          parseInt(selectedMonth) - 1,
          1
        ).toISOString();
        endDate = new Date(year, parseInt(selectedMonth), 0).toISOString();
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const filteredTasks =
            selectedMonth === "all"
              ? data
              : data.filter((task) => {
                  const taskDate = new Date(task.dueDate);
                  return (
                    taskDate >= new Date(startDate) &&
                    taskDate <= new Date(endDate)
                  );
                });
          setTasks(filteredTasks);
        })
        .catch((error) => console.error("Error fetching tasks:", error));
    }
  }, [selectedProject, selectedMonth, BASE_URL]);

  //handlers
  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  //chart
  const tasksBarData = {
    labels: ["Total Tasks", "Completed", "Incomplete"],
    datasets: [
      {
        label: "Tasks Overview",
        data: [tasksData.total, tasksData.completed, tasksData.incomplete],
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  //pdf
  const generatePdf = () => {
    const selectedProjectData = projects.find((p) => p._id === selectedProject);
    const reportTitle = selectedProjectData?.title || "Project Report";
    const projectStatus = selectedProjectData?.status || "Not specified";
    const projectStartDate = selectedProjectData?.startDate
      ? new Date(selectedProjectData.startDate).toLocaleDateString()
      : "Not specified";
    const projectEndDate = selectedProjectData?.endDate
      ? new Date(selectedProjectData.endDate).toLocaleDateString()
      : "Not specified";
    const projectDescription =
      selectedProjectData?.description || "No description provided";
    const projectManagerIds = new Set(
      selectedProjectData?.prManager.map((manager) => manager._id) || []
    );
    const prManagersNames =
      prManagers
        .filter((manager) => projectManagerIds.has(manager._id))
        .map((manager) => manager.name)
        .join(", ") || "N/A";

    const monthOrAll =
      selectedMonth === "all" ? "All Data" : `Month: ${selectedMonth}`;

    const tasksContent = tasks.map((task) => [
      { text: task.title || "N/A", style: "tableContent" },
      {
        text: task.isCompleted ? "Completed" : "Incomplete",
        style: "tableContent",
      },
      {
        text:
          task.assignedTo && task.assignedTo.length > 0
            ? task.assignedTo
                .map((user) => (user.name ? user.name : "No name"))
                .join(", ")
            : "No users assigned",
        style: "tableContent",
      },
      {
        text: task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "N/A",
        style: "tableContent",
      },
      { text: task.description || "N/A", style: "tableContent" },
    ]);

    const documentDefinition = {
      content: [
        { text: `Report for project: ${reportTitle}`, style: "header" },
        { text: `Project Managers: ${prManagersNames}`, style: "subheader" },
        { text: `Project Status: ${projectStatus}`, style: "subheader" },
        { text: `Start Date: ${projectStartDate}`, style: "subheader" },
        { text: `End Date: ${projectEndDate}`, style: "subheader" },
        { text: `Description: ${projectDescription}`, style: "subheader" },
        { text: `Total Tasks: ${tasks.length}`, style: "subheader" },
        {
          style: "tableExample",
          table: {
            widths: ["auto", "auto", "*", "auto", "*"],
            body: [
              [
                { text: "Task", style: "tableHeader" },
                { text: "Status", style: "tableHeader" },
                { text: "Assigned To", style: "tableHeader" },
                { text: "Due Date", style: "tableHeader" },
                { text: "Description", style: "tableHeader" },
              ],
              ...tasksContent,
            ],
          },
          layout: "lightHorizontalLines",
        },
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 20],
          color: "navy",
        },
        subheader: {
          fontSize: 16,
          bold: false,
          margin: [0, 20, 0, 10],
          color: "black",
        },
        tableExample: {
          margin: [0, 20, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 14,
          color: "black",
          fillColor: "#dddddd",
          margin: [0, 5, 0, 5],
        },
        tableContent: {
          margin: [0, 2, 0, 2],
          fontSize: 12,
        },
      },
      defaultStyle: {
        columnGap: 20,
      },
    };

    pdfMake
      .createPdf(documentDefinition)
      .download(`${reportTitle}-${monthOrAll}.pdf`);
  };

  return (
    <div className="text-black overflow-auto">
      <h2 className="text-2xl font-bold mb-6">Reports Dashboard</h2>
      <div className="mb-6">
        <label
          htmlFor="project-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Project
        </label>
        <select
          id="project-select"
          value={selectedProject}
          onChange={handleProjectChange}
          className="block w-ful text-black pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>
      {selectedProject && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">
                    Tasks Completed
                  </h4>
                  <h3 className="text-3xl font-bold">{tasksData.completed}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">
                    All Tasks
                  </h4>
                  <h3 className="text-3xl font-bold">{tasksData.total}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">
                    Incomplete Tasks
                  </h4>
                  <h3 className="text-3xl font-bold">{tasksData.incomplete}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-3">Generate Custom Report</h3>
            <div className="bg-white p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
              <div>
                <label
                  htmlFor="month-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Month
                </label>
                <select
                  id="month-select"
                  name="month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="block w-full md:w-auto pl-3 pr-10 py-2  border-2 border-slate-800 text-base  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <optgroup label="Monthly Data">
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </optgroup>
                  <optgroup label="Comprehensive Data">
                    <option value="all">ALL DATA</option>
                  </optgroup>
                </select>
              </div>
              <button
                onClick={generatePdf}
                className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Generate PDF Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow items-center justify-center">
              <h4 className="font-bold text-lg mb-3">Task By Month</h4>
              <div className="flex justify-center items-center h-96 w-100 bg-gray-100 rounded">
                <Doughnut
                  data={{
                    labels: tasksData.months,
                    datasets: [
                      {
                        data: tasksData.tasksPerMonth,
                        backgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#4BC0C0",
                          "#9966FF",
                          "#FF9933",
                          "#669933",
                          "#FF6699",
                          "#663399",
                          "#FF3333",
                          "#3399FF",
                          "#99FF33",
                        ],
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                      tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        titleColor: "#ffffff",
                        bodyColor: "#ffffff",
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-bold text-lg mb-3">
                Project Progress Overview
              </h4>
              <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
                <Bar data={tasksBarData} options={options} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConsoleReports;
