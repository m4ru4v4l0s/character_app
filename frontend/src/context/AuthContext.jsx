import { createContext, useContext, useState, useEffect } from "react";
import { getMe, logout as logoutService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    getMe()
      .then((res) => setUser(res.data.user))
      .catch(() => { localStorage.removeItem("token"); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await logoutService();
    localStorage.removeItem("token");
    setUser(null);
  };

  // ✅ se expone isAdmin para usar en componentes
  const isAdmin = user?.rol === "Admin";

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);