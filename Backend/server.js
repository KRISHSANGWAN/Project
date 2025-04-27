import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// app configuration

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares
app.use(cors({
  origin: '*',     // Allow all origins TEMPORARILY (for now)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization','token','dToken', 'aToken'],
}));
app.use(express.json());

// API Endpoint

app.use("/api/admin",adminRouter)
app.use("/api/doctor",doctorRouter);
app.use("/api/user",userRouter);

app.get("/", (req, res) => {
  res.send("API is fine");
});

app.listen(port, () => {
  console.log("Server is on : " + port);
});
