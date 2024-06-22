import mongoose from "mongoose";

const Country_Schema = new mongoose.Schema({
  _id: { type: String, require: true },
  country: { type: String },
  countryCode: { type: String },
  2018: {},
  2019: {},
  2020: {},
  2021: {},
})

export const CountryModel = mongoose.models.country || mongoose.model("country", Country_Schema)