import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getRoleBadgeVariant = (role) => {
  switch (role) {
    case "admin":
      return "info";
    case "frontdesk":
      return "warning";
    case "customer":
      return "success";
    default:
      return "default";
  }
};

export const getServiceTypeBadgeVariant = (type) => {
  switch (type) {
    case "major":
      return "info";
    case "regular":
      return "purple";
    default:
      return "default";
  }
};

export const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "success":
      return "success";
    default:
      return "default";
  }
};

export const getTranslatedServiceType = (type) => {
  const typeLower = type.toLowerCase();
  switch (typeLower) {
    case "major":
      return "Servis Besar";
    case "minor":
      return "Servis Kecil";
    case "regular":
      return "Servis Regular";
    default:
      return type;
  }
};

export const getTranslatedStatus = (status) => {
  switch (status) {
    case "pending":
      return "Menunggu Antrian";
    case "success":
      return "Dikonfirmasi";
    default:
      return status;
  }
};
