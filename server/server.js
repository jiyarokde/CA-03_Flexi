require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/students", require("./routes/students"));
app.get("/", (req, res) => res.send("Student Management API is running"));

mongoose
  .connect(process.env.MONGO_URI || process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => console.log(`Server on http://localhost:${process.env.PORT || 5000}`));
  })
  .catch((e) => console.error("MongoDB connection failed:", e.message));
