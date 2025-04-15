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

const app = express();
const PORT = 5000;

const corsOptions = {
  origin: "http://localhost:5173", // Specify your front-end origin
  credentials: true, // Allow credentials (cookies, headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/", userRouter);
app.use("/fridge", fridgeRoutes);
app.use("/recipes", recipeRoutes);
app.use("/ingredients", ingredientRouter);



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});