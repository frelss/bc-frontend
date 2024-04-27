import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";

import {
  Error,
  Register,
  Landing,
  Login,
  ProjectLayout,
  ProjectDashboard,
  ProjectTasks,
  ProjectTemplates,
  AdminConsole,
  AdminConsoleReports,
} from "./pages";

import ProjectLanding from "./pages/Project/ProjectLanding";
import ProjectOverview from "./pages/Project/ProjectOverview";
import AdminLayout from "./pages/AdminConsole/AdminLayout";
import AdminConsoleProjects from "./pages/AdminConsole/AdminConsoleProjects";
import ForgotPassword from "./pages/PasswordAndVerify/ForgotPassword";
import ResetPassword from "./pages/PasswordAndVerify/ResetPassword";
import VerifyEmail from "./pages/PasswordAndVerify/VerifyEmail";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <Error />,
  },
  {
    path: "/bejelentkezes",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/regisztracio",
    element: <Register />,
    errorElement: <Error />,
  },
  {
    path: "/verifyEmail/:token",
    element: <VerifyEmail />,
    errorElement: <Error />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <Error />,
  },
  {
    path: "/resetPassword/:token",
    element: <ResetPassword />,
    errorElement: <Error />,
  },
  {
    path: "/projekt",
    element: <ProjectLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <ProjectLanding /> },
      {
        path: ":projectId",
        children: [
          { index: true, element: <ProjectLanding /> },
          {
            path: "projektOverview",
            element: <ProjectOverview />,
          },
          {
            path: "dashboard",
            element: <ProjectDashboard />,
          },
          {
            path: "projektTasks",
            element: <ProjectTasks />,
          },
          {
            path: "templates",
            element: <ProjectTemplates />,
          },
          {
            path: "templates",
            element: <ProjectTemplates />,
          },
        ],
      },
      {
        path: "myTasks",
        element: <ProjectTasks />,
      },
    ],
  },

  {
    path: "/adminConsole",
    element: <AdminLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <AdminConsole /> },
      {
        path: "adminProjects",
        element: <AdminConsoleProjects />,
      },
      {
        path: "adminReports",
        element: <AdminConsoleReports />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ToastContainer theme="dark" autoClose={2000} />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
