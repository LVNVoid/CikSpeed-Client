import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Check,
  Trash2,
  Calendar,
  Clock,
  Car,
  User,
  ChevronRight,
} from "lucide-react";
import { useNotification } from "@/contexts/NotificationContext";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const NotificationDropdown = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotification();
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    if (notification.type === "new-reservation") {
      navigate(`/admin/reservations/`);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy HH:mm", { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  // Function to get time elapsed since notification
  const getTimeElapsed = (timestamp) => {
    try {
      const now = new Date();
      const notifTime = new Date(timestamp);
      const diffMs = now - notifTime;

      const minutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days} hari yang lalu`;
      if (hours > 0) return `${hours} jam yang lalu`;
      if (minutes > 0) return `${minutes} menit yang lalu`;
      return "Baru saja";
    } catch (error) {
      return "";
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "new-reservation":
        return <Calendar className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  // Get notification title based on type
  const getNotificationTitle = (type) => {
    switch (type) {
      case "new-reservation":
        return "Reservasi Baru";
      default:
        return "Notifikasi";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-bounce">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-0 rounded-lg shadow-lg border border-border"
      >
        <div className="flex items-center justify-between p-3 bg-primary/5">
          <h3 className="font-semibold text-primary">Notifikasi</h3>
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => markAllAsRead()}
            >
              <Check className="h-3 w-3 mr-1" />
              Tandai semua dibaca
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Bell className="h-12 w-12 text-muted-foreground/30" />
            <p>Tidak ada notifikasi</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b last:border-b-0 hover:bg-muted transition-colors duration-200 ${
                  !notification.read
                    ? "bg-primary/5 border-l-4 border-l-primary"
                    : ""
                }`}
              >
                <div
                  className="grid grid-cols-[auto_1fr_auto] gap-3"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {getNotificationTitle(notification.type)}
                      </p>
                      {!notification.read && (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary text-xs py-0 h-5"
                        >
                          Baru
                        </Badge>
                      )}
                    </div>

                    <div className="mt-1 space-y-1">
                      <div className="flex items-center text-sm gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>{notification.customerName}</span>
                      </div>

                      <div className="flex items-center text-sm gap-1">
                        <Car className="h-3 w-3 text-muted-foreground" />
                        <span>{notification.vehicleName}</span>
                      </div>

                      <div className="flex items-center text-sm gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(notification.date)}</span>
                      </div>

                      {notification.time && (
                        <div className="flex items-center text-sm gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{notification.time}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                      {getTimeElapsed(notification.timestamp)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      title="Hapus notifikasi"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(notification);
                      }}
                      title="Lihat detail"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="p-2 bg-muted/30 text-center">
            <Button
              variant="ghost"
              className="text-xs w-full h-8 text-primary"
              onClick={() => navigate("/admin/notifications")}
            >
              Lihat Semua Notifikasi
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
