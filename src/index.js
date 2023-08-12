import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/users";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", userRoutes);

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
