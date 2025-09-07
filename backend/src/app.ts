/** @format */

import express from "express";
import coRouter from "./api/routes/coRoutes";
import AppError from "./api/utils/AppError";
import tripRouter from "./api/routes/tripRouters";

const app = express();
app.use(express.json());

// ROUTER
app.use("/api/v1/companies", coRouter);
app.use("/api/v1/trips", tripRouter);

// ERROR
// must use /* not *
app.all(/.*/, (req, res, next) => {
  next(
    new AppError({
      message: `Can't find ${req.originalUrl}`,
      statusCode: 400,
    })
  );
});

export default app;
