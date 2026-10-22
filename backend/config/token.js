import jwt from "jsonwebtoken";

export const genToken = (userId) => {
  return jwt.sign(
    { userId: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};



//generate token for adminlogin





export const genToken1 = (email) => {
  return jwt.sign(
    { email },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};