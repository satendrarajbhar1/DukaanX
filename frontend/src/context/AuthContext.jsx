import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const register = async (formData) => {
    const res = await axios.post(`${serverUrl}/api/auth/register`, formData, {
      withCredentials: true,
    });

    setUser(res.data.user);
    setIsAuthenticated(true);

    return res;
  };

  const login = async (formData) => {
    const res = await axios.post(`${serverUrl}/api/auth/login`, formData, {
      withCredentials: true,
    });

    setUser(res.data.user);
    setIsAuthenticated(true);

    return res;
  };

  const logout = async () => {
    // fail hone pe error throw hota hai taaki UI "Logout Failed" dikha sake
    await axios.post(
      `${serverUrl}/api/auth/logout`,
      {},
      { withCredentials: true },
    );

    setUser(null);
    setIsAuthenticated(false);
  };

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/getcurrentuser`, {
        withCredentials: true,
      });

      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        serverUrl,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        register,
        login,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);