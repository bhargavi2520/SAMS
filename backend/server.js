const express = require('express');
const bodyParse = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const app = express()
const AuthRouter = require('./Routes/authRouter');
const DataRouter = require('./Routes/dataRouter');
const cors = require('cors');


const PORT = process.env.PORT || 5000;


const allowedOrigins = [
  'http://localhost:5173', // Your local frontend dev server
  'https://bhargavi2520.github.io' // Your deployed frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allows cookies to be sent
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
// --- END of new CORS configuration ---

// --- START of new GET routes ---
app.get("/", (req, res) => {
  res.send("🚀 Backend is LIVE! Welcome to SAMS");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "UP", message: "All good, No worries!" });
});
// --- END of new GET routes ---

app.use(express.urlencoded({ extended: true }))
app.use(bodyParse.json())
app.use('/auth', AuthRouter)
app.use('/getData', DataRouter)


app.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})


const mongoUri = process.env.mongoUri
mongoose.connect(mongoUri)
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));
