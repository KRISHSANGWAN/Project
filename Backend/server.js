import express from "express";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import cors from 'cors';

// app configuration

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

app.use(cors({
  origin: 'https://prescripto-admin-gjvj.onrender.com', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors()); 

// Middle-wares

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
