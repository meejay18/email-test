import { google } from "googleapis";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import env from "dotenv";
import jwt from "jsonwebtoken";

env.config();

const GOOGLE_ID = process.env.GOOGLE_ID as string;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET as string;
const GOOGLE_URL = process.env.GOOGLE_URL as string;
const GOOGLE_TOKEN = process.env.GOOGLE_TOKEN as string;

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);

oAuth.setCredentials({ refresh_token: GOOGLE_TOKEN });

export const createAccountEmail = async (user: any) => {
  const accessToken: any = (await oAuth.getAccessToken()).token;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USER as string,
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      refreshToken: GOOGLE_TOKEN,
      accessToken,
    },
  });

  const token = jwt.sign({ id: user?._id }, "secret", {
    expiresIn: "2d",
  });

  const URL_value = `http://localhost:5174/auth/login${token}`;

  let pathFile = path.join(__dirname, "../views/createAccountEmail.ejs");
  const html = await ejs.renderFile(pathFile, {
    name: user?.name,
    url: URL_value,
  });

  console.log("send");

  const mailer = {
    to: user?.email,
    from: `Account creation <${process.env.MAIL_USER as string}>`,
    subject: "Account Verification",
    html,
  };

  transporter.sendMail(mailer).then(() => {
    console.log("send");
  });
};
export const forgetAccountPassword = async (user: any) => {
  const accessToken: any = (await oAuth.getAccessToken()).token;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USER as string,
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      refreshToken: GOOGLE_TOKEN,
      accessToken,
    },
  });

  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const URL_value = `http://localhost:5174/auth/reset-password${token}`;

  let pathFile = path.join(__dirname, "");
};
