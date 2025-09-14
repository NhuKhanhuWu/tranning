/** @format */

import express from "express";
import {
  checkOtp,
  sendSignUpOtp,
  createUser,
} from "../controller/authControllers/signUpController";
const userRouter = express.Router();

// sign up route
userRouter.post("/signup", sendSignUpOtp);
userRouter.post("/signup/verify", checkOtp);
userRouter.post("/signup/create-user", createUser);

export default userRouter;
