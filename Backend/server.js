import express from "express"
import 'dotenv/config';
import userRouter from "./Routes/userRoutes.js"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./util/swagger.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/",userRouter);



app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});