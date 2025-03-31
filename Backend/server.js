import express from "express"
import 'dotenv/config';
import userRouter from "./Routes/userRoutes.js"

const app = express();
const PORT = 5000;


app.use(express.json());
app.use("/", userRouter)



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});