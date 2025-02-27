import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import PublicLayout from "./layouts/PublicLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import CreateReservationPage from "./pages/reservations/CreateReservationPage";
import ReservationsPage from "./pages/reservations/ReservationPage";
import HistoryPage from "./pages/history/HistoryPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "reservations", element: <ReservationsPage /> },
      { path: "reservations/create", element: <CreateReservationPage /> },
      { path: "history", element: <HistoryPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="motor-service-theme">
    <RouterProvider router={router} />
  </ThemeProvider>
);

export default App;
