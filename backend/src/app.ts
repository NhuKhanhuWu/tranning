/** @format */

import express from "express";
import coRouter from "./api/routes/coRoutes";
import AppError from "./api/utils/AppError";

const app = express();
app.use(express.json());

// ROUTER
app.use("/api/v1/companies", coRouter);

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
