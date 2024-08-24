import mongoose from "mongoose";
mongoose
  .connect(process.env.DB_URL as string)
  .then(() => console.log("Connected with database"))
  .catch((err: any) => {
    console.error("Unable to connect with database = " + err.message);
    process.exit(1);
  });
