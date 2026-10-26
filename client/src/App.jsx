import { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const logIn = (token, u) => { localStorage.setItem("token", token); localStorage.setItem("user", JSON.stringify(u)); setUser(u); };
  const logOut = () => { localStorage.clear(); setUser(null); };
  return user ? <Dashboard user={user} onLogout={logOut} /> : <Login onAuth={logIn} />;
}
