import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h1>Bem-vindo, {user.username}!</h1>
      <p>Cargo: {user.cargo}</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default Home;
