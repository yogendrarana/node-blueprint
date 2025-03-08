import path from "path";
import router from "./router.js";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import express, { type Request, type Response } from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// middlewares
import ErrorMiddleware from "./middlewares/error.middleware.js";

// create express app instance
const app = express();

// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "./public")));

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// use ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// routes
app.get("/", (req: Request, res: Response) => {
    res.render("index", { title: "Node Blueprint Starter" });
});
app.use(router);

// error middleware
app.use(ErrorMiddleware);

// export express app
export default app;
