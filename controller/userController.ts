import { Request, Response } from "express";
import userModel from "../model/userModel";
import bcrypt from "bcrypt";
import crypto from "crypto";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { createAccountEmail } from "../utils/email";

env.config();

export const createAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(4);
    const hashed = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(3).toString("hex");

    const user = await userModel.create({
      name,
      email,
      password: hashed,
      verifiedToken: token,
    });

    createAccountEmail(user);
    return res.status(200).json({
      message: "Account created successfully",
      data: user,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error creating account",
      status: 404,
    });
  }
};

export const loginAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
      const check = await bcrypt.compare(password, user?.password);

      if (check) {
        if (user?.isverified && user?.isverifiedToken === "") {
          const token = jwt.sign(
            { id: user?._id },
            process.env.JWT_SECRET as string,
            {
              expiresIn: process.env.JWT_EXPIRES as string,
            }
          );
          return res.status(200).json({
            message: "Login successful",
            status: 200,
            data: token,
          });
        } else {
          return res.status(404).json({
            message: "Error verifying account",
            status: 404,
          });
        }
      } else {
        return res.status(404).json({
          message: "Error with password",
          status: 404,
        });
      }
    } else {
      return res.status(404).json({
        message: "Error with email",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error logging into this account",
      status: 404,
    });
  }
};

export const readOneAccont = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;

    const user = await userModel.findById({ userID });
    return res.status(200).json({
      message: "Account found successfully",
      status: 200,
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error finding this account",
      status: 404,
    });
  }
};

export const readAllAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.find();
    return res.status(201).json({
      message: "Accunts successfully found",
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error finding accounts",
      status: 404,
    });
  }
};

export const forgetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    const token = crypto.randomBytes(4).toString("hex");

    if (user) {
      await userModel.findByIdAndUpdate(
        user?._id,
        {
          verifiedToken: token,
        },
        { new: true }
      );

      return res.status(200).json({
        message: "A reset password email has been sent to your email",
        status: 200,
      });
    } else {
      return res.status(404).json({
        message: "No account with this email",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "error verifying account",
      status: 404,
    });
  }
};

export const verifyAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;

    const user = await userModel.findByIdAndUpdate(
      userID,
      {
        isverified: true,
        verifiedToken: "",
      },
      { new: true }
    );

    return res.status(200).json({
      message: "verification successful",
      data: user,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying account",
      status: "404",
    });
  }
};

export const changeAccountPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const { password } = req.body;

    const salt = await bcrypt.genSalt(5);
    const hashed = await bcrypt.hash(password, salt);

    if (userID) {
      await userModel.findByIdAndUpdate(
        userID,
        {
          password: hashed,
          verifyToken: "",
        },
        { new: true }
      );
      return res.status(200).json({
        message: "Password successfully changed",
        status: 200,
      });
    } else {
      return res.status(404).json({
        message: "no user with this account",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error changing password",
      status: 404,
    });
  }
};
