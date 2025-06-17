import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import CustomerLayout from "./layouts/CustomerLayout";
import HomePage from "./pages/customer/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import CreateReservationPage from "./pages/customer/reservations/CreateReservationPage";
import ReservationsPage from "./pages/customer/reservations/ReservationPage";
import HistoryPage from "./pages/customer/history/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import UnauthorizedPage from "./pages/errors/UnauthorizedPage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminReservationPage from "./pages/admin/AdminReservationPage";
import AdminHistoryPage from "./pages/admin/AdminHistoryPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import PublicLayout from "./layouts/PublicLayout";
import LandingPage from "./pages/LadingPage";
import AdminSymptomPage from "./pages/admin/AdminSymptomPage";
import AdminMechanicPage from "./pages/admin/AdminMechanicPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      {
        path: "home",
        element: (
          <ProtectedRoute roles={["customer", "admin"]}>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "reservations",
        element: (
          <ProtectedRoute roles={["customer", "admin"]}>
            <ReservationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "reservations/create",
        element: (
          <ProtectedRoute roles={["customer", "admin"]}>
            <CreateReservationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "history",
        element: (
          <ProtectedRoute roles={["customer", "admin"]}>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute roles={`["admin", "frontdesk"]`}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "reservations",
        element: (
          <ProtectedRoute roles={["admin", "frontdesk"]}>
            <AdminReservationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "history",
        element: (
          <ProtectedRoute roles={["admin", "frontdesk"]}>
            <AdminHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute roles={["admin", "frontdesk"]}>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "symptoms",
        element: (
          <ProtectedRoute roles={["admin", "frontdesk"]}>
            <AdminSymptomPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "mechanics",
        element: (
          <ProtectedRoute roles={["admin", "frontdesk"]}>
            <AdminMechanicPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

const App = () => (
  <AuthProvider>
    <ThemeProvider defaultTheme="system" storageKey="motor-service-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </AuthProvider>
);

export default App;
