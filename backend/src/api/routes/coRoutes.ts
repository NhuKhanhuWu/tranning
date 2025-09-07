/** @format */

import express from "express";
import {
  getMultCo,
  getSingleCo,
} from "../controller/coControllers/getCoController";
const coRouter = express.Router();

// get companies routes
coRouter.route("/").get(getMultCo);
coRouter.route("/:id").get(getSingleCo);

export default coRouter;
