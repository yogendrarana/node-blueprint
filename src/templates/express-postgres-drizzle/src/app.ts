import path from "path";
import routers from "./routers.js";
import cookieParser from "cookie-parser";
import express, { type Request, type Response } from "express";

const __dirname = getDirname(import.meta.url);

// middlewares
import ErrorMiddleware from "./middlewares/error.middleware.js";
import MorganMiddleware from "./middlewares/morgan.middleware.js";
import { getDirname } from "./utils/path.js";

export const createExpressApp = () => {
    const app = express();

    // set view engine
    app.set("view engine", "ejs");
    app.set("views", "views");
    app.use(express.static(path.join(__dirname, "./public")));

    // middleware
    app.use(express.json());
    app.use(cookieParser());
    app.use(MorganMiddleware);
    app.use(express.urlencoded({ extended: true }));

    // use ejs
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));

    // routes
    app.get("/", (req: Request, res: Response) => {
        res.render("home", { title: "Express Postgres Drizzle Project" });
    });
    app.use("/api/v1", ...Object.values(routers));

    // error middleware
    app.use(ErrorMiddleware);

    return app;
};
