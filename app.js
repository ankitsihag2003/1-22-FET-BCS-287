import express from 'express';
import TopUserRoute from './routes/TopUser.route.js';
import postRoute from './routes/postRoute.js';
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
  }));

//apis
app.use("/",TopUserRoute)
app.use("",postRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})