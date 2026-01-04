import express from "express";
import routes from "./routes/routes.mjs";
import { errorHandler } from "./middlewares/error_handler.mjs";
import cors from "cors";

const app = express();

// app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/web", express.static("web"));
app.use("/api", routes);

app.use(errorHandler);

export default app;
