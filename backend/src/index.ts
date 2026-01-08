import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        message: "Smart Academy API is running",
    });
});

app.get("/api", (req: Request, res: Response) => {
    res.status(200).json({ message: "Smart Academy API v1.0" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
