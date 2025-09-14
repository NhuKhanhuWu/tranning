/** @format */

import express from "express";
import coRouter from "./api/routes/coRoutes";
import AppError from "./api/utils/AppError";
import tripRouter from "./api/routes/tripRouters";
import globalErrHandler from "./api/controller/errorController";
import userRouter from "./api/routes/userRouter";

const app = express();
app.use(express.json());

// ROUTER
app.use("/api/v1/companies", coRouter);
app.use("/api/v1/trips", tripRouter);
app.use("/api/v1/auth", userRouter);

// ERROR
// must use /* not *
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 400));
});

app.use(globalErrHandler);

export default app;
