import { useState } from "react";
import { api } from "../api";

export default function Login({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const d = await api(`/auth/${mode}`, "POST", f);
      onAuth(d.token, d.user);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <main className="auth">
      <section className="auth-art">
        <h1>Every student record, in one place.</h1>
        <p>Add, find and update student details without touching a spreadsheet.</p>
        <ul>
          <li>Search by name, roll number or course</li>
          <li>Edit details the moment they change</li>
          <li>Open a full profile in one click</li>
        </ul>
      </section>
      <section className="auth-form">
        <form onSubmit={submit}>
          <h2>{mode === "login" ? "Log in" : "Create your account"}</h2>
          <p className="muted">{mode === "login" ? "Welcome back. Enter your details to continue." : "It takes under a minute."}</p>
          {err && <div className="alert" role="alert">{err}</div>}
          {mode === "register" && (<label>Full name<input required value={f.name} onChange={set("name")} autoComplete="name" /></label>)}
          <label>Email<input required type="email" value={f.email} onChange={set("email")} autoComplete="email" /></label>
          <label>Password<input required type="password" minLength={6} value={f.password} onChange={set("password")} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
          <button className="btn primary wide" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}</button>
          <p className="switch">
            {mode === "login" ? "New here?" : "Already registered?"}{" "}
            <button type="button" className="link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(""); }}>
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}
