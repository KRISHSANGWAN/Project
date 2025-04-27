import express from "express";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Allow all origins temporarily
app.use(cors());
app.options('*', cors());

app.use(express.json());

// API Endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API is fine");
});

app.listen(port, () => {
  console.log("Server is on : " + port);
});
