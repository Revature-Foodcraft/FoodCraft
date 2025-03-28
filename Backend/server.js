
import express from "express"
import 'dotenv/config';

const app = express();
const PORT = 5000;


app.use(express.json());



app.get("/", async (req, res) => {
  const response = await getUserByUsername("admin");
  console.log(response)
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});