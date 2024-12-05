import { connect } from "mongoose";

export const dbConfig = async () => {
  try {
    await connect(process.env.MONGO_URL as string).then((res) => {
      console.clear();
      console.log("Connected to mongodb ❤️❤️❤️🚀🚀🚀🚀");
    });
  } catch (error) {
    return error;
  }
};
