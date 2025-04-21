import express from "express"
import dotenv from 'dotenv';
dotenv.config({ override: true });
import userRouter from "./Routes/userRoutes.js"
import { fridgeRoutes } from "./Routes/fridgeRoutes.js"
import cors from "cors";
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./util/swagger.js";
import recipeRoutes from "./Routes/recipeRoutes.js"
import ingredientRouter from "./Routes/ingredientRoute.js"
import s3Router from './Routes/s3Router.js';
const app = express();
const PORT = 5000;



const allowedOrigins = [
  "http://localhost:5173",
  "http://my-frontend-react-prod.s3-website.us-east-2.amazonaws.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));




app.use(express.json());
app.use("/", userRouter);
app.use("/fridge", fridgeRoutes);
app.use("/recipes", recipeRoutes);
app.use("/ingredients", ingredientRouter);
app.use('/s3', s3Router);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});