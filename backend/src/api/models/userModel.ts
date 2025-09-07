/** @format */

import mongoose from "mongoose";
import validator from "validator";

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

// Indexes for quick lookups
userSchema.index({ email: 1 });
userSchema.index({ name: "text", email: "text" });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
