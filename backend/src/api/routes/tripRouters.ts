/** @format */

import express from "express";
import {
  getMultTrip,
  getSingleTrip,
} from "../controller/tripControllers/getTripController";
const tripRouter = express.Router();

// get companies routes
tripRouter.route("/").get(getMultTrip);
tripRouter.route("/:id").get(getSingleTrip);

export default tripRouter;
