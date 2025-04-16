import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

import { useAuth } from "./context/AuthContext";

import './global.css';

function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={!token ? <Login /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" />} />
      <Route
      path="/home"
      element={token ? <Home /> : <Navigate to="/login" replace />}
      />
    </Routes>
    
  );
}

export default App;
