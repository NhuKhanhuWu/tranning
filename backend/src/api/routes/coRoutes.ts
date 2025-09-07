/** @format */

import express from "express";
import {
  getMultCoController,
  getSingleCoController,
} from "../controller/coControllers/getCoController";
const coRouter = express.Router();

// get companies routes
coRouter.route("/").get(getMultCoController);
coRouter.route("/:id").get(getSingleCoController);

export default coRouter;
