import jwt from "jsonwebtoken";
interface payloadProps {
  id: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("No secret");
export const jwttoken = {
  sign: (payload: payloadProps) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
    } catch (error: unknown) {
      throw new Error("Failed to generate token");
    }
  },
  verify: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error: unknown) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Session error");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      }
      throw new Error("Unauthorized");
    }
  },
};
