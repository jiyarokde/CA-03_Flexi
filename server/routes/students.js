const router = require("express").Router();
const Student = require("../models/Student");
const auth = require("../middleware/auth");
router.use(auth);

const fail = (res, e) =>
  res.status(e.code === 11000 ? 409 : e.name === "ValidationError" ? 400 : 500)
    .json({ message: e.code === 11000 ? "A student with this roll number already exists" : e.message });

// List + search
router.get("/", async (req, res) => {
  try {
    const s = (req.query.search || "").trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = s ? { $or: ["name", "rollNo", "email", "course"].map((f) => ({ [f]: new RegExp(s, "i") })) } : {};
    res.json(await Student.find(filter).sort({ createdAt: -1 }));
  } catch (e) { fail(res, e); }
});
router.get("/:id", async (req, res) => {
  try {
    const st = await Student.findById(req.params.id);
    st ? res.json(st) : res.status(404).json({ message: "Student not found" });
  } catch (e) { fail(res, e); }
});
router.post("/", async (req, res) => { try { res.status(201).json(await Student.create(req.body)); } catch (e) { fail(res, e); } });
router.put("/:id", async (req, res) => {
  try {
    const st = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    st ? res.json(st) : res.status(404).json({ message: "Student not found" });
  } catch (e) { fail(res, e); }
});
router.delete("/:id", async (req, res) => {
  try {
    const st = await Student.findByIdAndDelete(req.params.id);
    st ? res.json({ message: "Student deleted" }) : res.status(404).json({ message: "Student not found" });
  } catch (e) { fail(res, e); }
});

module.exports = router;
