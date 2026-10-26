import { useEffect, useState } from "react";
import { api } from "../api";

const empty = { name: "", rollNo: "", email: "", phone: "", course: "", year: "1", address: "" };
const fields = [["name", "Full name"], ["rollNo", "Roll number"], ["email", "Email", "email"], ["phone", "Phone", "tel"], ["course", "Course"]];

export default function Dashboard({ user, onLogout }) {
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // {mode: add | edit | view, data}
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");

  const load = async () => {
    try { setStudents(await api(`/students?search=${encodeURIComponent(q)}`)); }
    catch (e) { if (e.status === 401) onLogout(); else setErr(e.message); }
    setLoading(false);
  };
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [q]);

  const open = (mode, data = empty) => { setForm(data); setErr(""); setModal({ mode, data }); };
  const close = () => setModal(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault(); setErr("");
    try {
      modal.mode === "add" ? await api("/students", "POST", form) : await api(`/students/${form._id}`, "PUT", form);
      close(); load();
    } catch (e) { setErr(e.message); }
  };
  const remove = async (s) => {
    if (!window.confirm(`Delete ${s.name}? This cannot be undone.`)) return;
    try { await api(`/students/${s._id}`, "DELETE"); load(); } catch (e) { setErr(e.message); }
  };

  return (
    <div className="shell">
      <header className="top">
        <strong className="brand">Student Management</strong>
        <div className="who"><span>{user.name}</span><button className="btn" onClick={onLogout}>Log out</button></div>
      </header>

      <main className="page">
        <div className="bar">
          <div>
            <h1>Students</h1>
            <p className="muted">{students.length} {students.length === 1 ? "record" : "records"}{q && ` matching "${q}"`}</p>
          </div>
          <div className="actions">
            <input className="search" type="search" placeholder="Search name, roll no, email or course" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search students" />
            <button className="btn primary" onClick={() => open("add")}>Add student</button>
          </div>
        </div>

        {!modal && err && <div className="alert">{err}</div>}

        {loading ? <p className="muted">Loading students...</p> : students.length === 0 ? (
          <div className="empty">
            <h3>{q ? "No students match your search" : "No students yet"}</h3>
            <p className="muted">{q ? "Try a different name or roll number." : "Add your first student to get started."}</p>
            {!q && <button className="btn primary" onClick={() => open("add")}>Add student</button>}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Roll no</th><th>Course</th><th>Year</th><th>Email</th><th></th></tr></thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td data-l="Name"><b>{s.name}</b></td>
                    <td data-l="Roll no">{s.rollNo}</td>
                    <td data-l="Course">{s.course}</td>
                    <td data-l="Year">{s.year}</td>
                    <td data-l="Email">{s.email}</td>
                    <td className="row-actions">
                      <button className="btn sm" onClick={() => open("view", s)}>View</button>
                      <button className="btn sm" onClick={() => open("edit", s)}>Edit</button>
                      <button className="btn sm danger" onClick={() => remove(s)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {modal && (
        <div className="overlay" onClick={close}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            {modal.mode === "view" ? (
              <>
                <h2>{form.name}</h2>
                <dl>
                  {[["Roll number", form.rollNo], ["Course", form.course], ["Year", form.year], ["Email", form.email], ["Phone", form.phone], ["Address", form.address || "Not provided"], ["Added on", new Date(form.createdAt).toLocaleDateString()]].map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
                </dl>
                <div className="foot"><button className="btn" onClick={close}>Close</button><button className="btn primary" onClick={() => open("edit", form)}>Edit student</button></div>
              </>
            ) : (
              <form onSubmit={save}>
                <h2>{modal.mode === "add" ? "Add student" : "Edit student"}</h2>
                {err && <div className="alert" role="alert">{err}</div>}
                <div className="grid">
                  {fields.map(([k, label, type]) => (<label key={k}>{label}<input required type={type || "text"} value={form[k]} onChange={set(k)} /></label>))}
                  <label>Year<select value={form.year} onChange={set("year")}>{[1, 2, 3, 4].map((y) => <option key={y}>{y}</option>)}</select></label>
                </div>
                <label>Address<textarea rows="2" value={form.address} onChange={set("address")} /></label>
                <div className="foot"><button type="button" className="btn" onClick={close}>Cancel</button><button className="btn primary">{modal.mode === "add" ? "Add student" : "Save changes"}</button></div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
