/** @format */

import jwt from "jsonwebtoken";

const signToken = (
  payload: unknown,
  expiresIn = process.env.JWT_EXPIRES_IN
) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

export default signToken;
