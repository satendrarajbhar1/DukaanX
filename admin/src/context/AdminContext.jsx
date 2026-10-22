import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";

export const adminDataContext = createContext();

function AdminContext({ children }) {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { serverUrl } = useContext(authDataContext);

  const getAdmin = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/getadmin`, {
        withCredentials: true,
      });

      setAdminData(result.data.success ? result.data : null);
    } catch (error) {
      setAdminData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);

  return (
    <adminDataContext.Provider
      value={{ adminData, setAdminData, getAdmin, loading, serverUrl }}
    >
      {children}
    </adminDataContext.Provider>
  );
}

export default AdminContext;