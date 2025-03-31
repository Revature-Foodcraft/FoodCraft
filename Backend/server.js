import express from "express"
import dotenv from 'dotenv';
dotenv.config({ override: true });
import userRouter from "./Routes/userRoutes.js"
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors())
app.use(express.json());
app.use("/", userRouter)



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});