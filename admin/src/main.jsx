
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import App from "./App.jsx";
import AuthContext from "./context/AuthContext.jsx";
import AdminContext from "./context/AdminContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContext>
      <AdminContext>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="light"
        />
      </AdminContext>
    </AuthContext>
  </BrowserRouter>
);

