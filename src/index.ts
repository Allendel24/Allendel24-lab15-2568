import express, { type Request, type Response } from "express";
import morgan from 'morgan';
import { students } from "./db/db.js";
import { success } from "zod";

import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "lab 15 API service successfully"
  });
});

app.get("/me", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Student Information",
    data: {
      studentId: "670610720",
      firstName: "Phavit",
      lastName: "Wongdao",
      prodram: "CPE",
      section: "001"
    }
  })
});

app.use("/api/v2", studentRoutes);
app.use("/api/v2", courseRoutes)

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

export default app;
