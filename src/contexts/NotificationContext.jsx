/* eslint-disable react/prop-types */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socketRef.current = io("https://18.142.54.194:5000");

      if (user.role === "admin") {
        socketRef.current.emit("admin-login");
      }

      socketRef.current.on("new-reservation", (data) => {
        if (user.role === "admin") {
          setNotifications((prev) => [data, ...prev]);
          setUnreadCount((prev) => prev + 1);

          toast("Ada reservasi baru", {
            type: "success",
            duration: 5000,
          });
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [user]);

  // Fungsi untuk menandai notifikasi sebagai sudah dibaca
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );

    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  // Fungsi untuk menandai semua notifikasi sebagai sudah dibaca
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  // Fungsi untuk menghapus notifikasi
  const removeNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  // Menggunakan useMemo agar tidak menyebabkan re-render berulang
  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      removeNotification,
    }),
    [notifications, unreadCount]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
