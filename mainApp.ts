import { Application } from "express";
import user from "./route/userRouter";

export const mainApp = async (app: Application) => {
  app.use("/api", user);
  try {
  } catch (error) {
    return error;
  }
};
