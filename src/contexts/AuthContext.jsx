import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Tambahkan loading state

  // Ambil data user dari localStorage saat aplikasi dimuat
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user"); // Hapus data yang tidak valid
      }
    }
    setLoading(false); // Set loading ke false setelah selesai
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Simpan user ke localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Hapus user dari localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
