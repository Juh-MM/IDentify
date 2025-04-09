import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const res = await api.post("/auth/login", { email, password });

      login({
        token: res.data.user.token,
        username: res.data.user.username,
        cargo: res.data.user.cargo,
      });

      navigate("/");
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao logar.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
        {erro && <p className="erro">{erro}</p>}
      </form>
    </div>
  );
}

export default Login;
