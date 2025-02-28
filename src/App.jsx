import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import PublicLayout from "./layouts/PublicLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import CreateReservationPage from "./pages/reservations/CreateReservationPage";
import ReservationsPage from "./pages/reservations/ReservationPage";
import HistoryPage from "./pages/history/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import UnauthorizedPage from "./pages/errors/UnauthorizedPage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import LandingPage from "./pages/LadingPage";
import AdminReservationPage from "./pages/admin/AdminReservationPage";
import AdminHistoryPage from "./pages/admin/AdminHistoryPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
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
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "reservations",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminReservationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "history",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminUsersPage />
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
