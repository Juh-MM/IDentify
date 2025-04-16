import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import Styles from "./Login.module.css"; // chamar o css dessa pagina
import "../global.css"; // chamar o css global
import { Header } from "../componentes/Header";

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
    <div>
      <Header /> {/* Chamar o componente (Header) */}
      <div className={Styles.loginContainer}>
        
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className={Styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Digite seu E-mail"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Digite sua senha"
          />
          <div className={Styles.buttonsArea}>
            <button type="submit">Entrar</button>
            {erro && <p className="erro">{erro}</p>}
          </div>
        </form>
      </div>
      <a href="">Esqueceu sua senha?</a>
    </div>
  );
}

export default Login;
