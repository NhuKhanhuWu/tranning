/** @format */
// The shape required when creating a new user
import { Document, Types } from "mongoose";

export interface IUserInput {
  name: string;
  email: string;
  password: string; // required when creating
  role?: "user" | "admin" | "moderator"; // optional, defaults to "user"
  profile_image?: string;
}

export interface IUserDocument extends Document {
  _id: Types.ObjectId; // MongoDB always uses ObjectId
  name: string;
  email: string;
  password?: string | undefined; // select: false makes it optional
  passwordConfirm?: string | undefined; // deleted after creation => optional
  role: "user" | "admin" | "moderator";
  profile_image?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}
