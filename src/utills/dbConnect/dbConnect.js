import mongoose from "mongoose";

const DB_Connect = () => {
  try {
    mongoose.connect("mongodb://localhost:27017/Practice")
    console.log("Database connected")
  } catch (error) {
    console.log("ERROR IN DATABASE CONNECTION", error)
  }

}

export default DB_Connect