/** @format */ import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/userModel";
import PendingEmailsModel from "../../models/pendingEmailModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import { otpEmail } from "../../utils/email/emailTemplate";
import { sendTokenEmail } from "../../utils/email/emailService";
import signToken from "../../utils/token/signToken";
import validator from "validator";
import getToken from "../../utils/token/getToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import createSendToken from "../../utils/token/createSendToken";

interface DecodedToken extends JwtPayload {
  email: string;
}

// 1. send verification email (otp)
export const sendSignUpOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. get & check email
    const { email } = req.body as { email?: string };
    if (!email) return next(new AppError("Email required", 400));

    if (!validator.isEmail(email))
      return next(new AppError("Invalid email", 400));

    // 1.1 check if already in use
    const userExists = await UserModel.findOne({ email });
    if (userExists) return next(new AppError("Email already in use", 400));

    // 2. create otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 10 mins

    // 3. save request to db
    await PendingEmailsModel.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { upsert: true, new: true }
    );

    // 4. send email
    const emailMessage = otpEmail(otp);

    // 5. send email & response
    await sendTokenEmail(
      {
        email,
        subject: "Your sign up OTP (valid for 5 mins)",
        htmlMessage: emailMessage,
      },
      res,
      next
    );
  }
);

// 2. check otp
export const checkOtp = catchAsync(async (req, res, next) => {
  // 1. check if otp and email is sended
  const { otp, email } = req.body;
  if (!otp || !email) return next(new AppError("Otp and email required", 400));

  // 2. check if otp is valid
  const pendingEmail = await PendingEmailsModel.findOne({ email });

  if (!pendingEmail || pendingEmail.otpExpires.getTime() < Date.now())
    return next(new AppError("Invalid email", 400));
  if (pendingEmail.otp !== otp) return next(new AppError("Invalid otp", 400));

  // 3. create jwt
  const token = signToken({ email }, "5m");

  // 4. send result
  res.status(200).json({
    status: "success",
    token,
    message: "OTP valid!",
  });
});

// 3. create user
export const createUser = catchAsync(async (req, res, next) => {
  // get email from token
  const token = getToken(req);
  // chek if token is sended
  if (!token)
    return next(
      new AppError("Please validate your email before execute this action", 401)
    );

  // check email
  // const { email } = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as DecodedToken;
  const { email } = decoded;

  const existsUser = await UserModel.findOne({ email });
  if (existsUser) return next(new AppError("Email already in used", 401));

  // create user
  const newUser = await UserModel.create({
    name: req.body.name,
    // role: req.body.role,
    email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // delete request in PendingUser
  await PendingEmailsModel.findOneAndDelete({ email });

  createSendToken(newUser, 200, res);
});
