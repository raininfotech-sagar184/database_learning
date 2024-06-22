import mongoose from "mongoose";

const Grade_Schema = new mongoose.Schema({
  grade: {},
  restaurant_id: {}
})

export const GradeModel = mongoose.models.grade || mongoose.model("grade", Grade_Schema)