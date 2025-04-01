import express from "express";
import cors from "cors";

const app = express();
const port = process.env.SERVER_PORT;
app.use(
    cors({
        origin: [process.env.CLIENT_BASE_URL || "http://localhost:5173"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        optionsSuccessStatus: 204,
    }),
);

import { router as applicationsApiRoutes } from "./routes/applications";
app.use("/api/v1/applications", applicationsApiRoutes);

app.get("/", (req, res) => {
    res.send("Hello!!!!!!!!!!!!!!!!!!!!!!!!\n");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
