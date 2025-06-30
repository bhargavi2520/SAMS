const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const AuthRouter = require("./Routes/authRouter");
const DataRouter = require("./Routes/dataRouter");
const SubjectRouter = require("./Routes/subjectRouter");
const AttendanceRouter = require("./Routes/attendanceRouter");
const ClassRouter = require("./Routes/classRouter");
const DashboardRouter = require("./Routes/dashboardRouter");
const DepartmentAssignmentRouter = require("./Routes/departmentAssignRouter");

const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again after 5 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://bhargavi2520.github.io",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy blocks this origin"), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(" Backend is LIVE! Welcome to SAMS");
});
app.get("/api/health", (req, res) => {
  res.json({ status: "UP", message: "All good, No worries!" });
});
app.get("/api/test", (req, res) => {
  res.json({ status: "UP", message: "Backend connection successful" });
});
app.use("/auth", AuthRouter);
app.use("/userData", DataRouter);
app.use("/subjectData", SubjectRouter);
app.use("/attendance", AttendanceRouter);
app.use("/class", ClassRouter);
app.use("/dashboard", DashboardRouter);
app.use("/department", DepartmentAssignmentRouter);

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});

const mongoUri = process.env.mongoUri;
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));