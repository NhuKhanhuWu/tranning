/** @format */

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { IUserDocument } from "../interface/IUser";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be at most 50 characters"],
    },
    email: {
      type: String,
      required: [true, "User must have an email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "User must have a password"],
      minlength: [8, "Password must be at least 8 characters"],
      maxLength: [128, "Password must be at most 128 characters"],
      select: false, // don't return password by default
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (this: IUserDocument, el: string): boolean {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },

    profile_image: {
      type: String, // URL to avatar
      validate: {
        validator: (v: string) => !v || validator.isURL(v),
        message: "Invalid image URL",
      },
      default: "https://i.pravatar.cc/150",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Middleware to hash password before saving
userSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  // hash password before save
  this.password = await bcrypt.hash(this.password, 12);

  // removie password comfirm
  this.passwordConfirm = undefined;

  next();
});

// Indexes for quick lookups
userSchema.index({ email: 1 });
userSchema.index({ name: "text", email: "text" });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
