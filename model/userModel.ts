import { model, Schema } from "mongoose";

interface iUser {
  name: string;
  password: string;
  email: string;
  avatar: string;
  avatarId: string;
  isverified: boolean;
  isverifiedToken: string;
}

interface iUserData extends iUser, Document {}

const userModel = new Schema<iUserData>(
  {
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    avatar: {
      type: String,
    },
    avatarId: {
      type: String,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    isverifiedToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model<iUserData>("users", userModel);
