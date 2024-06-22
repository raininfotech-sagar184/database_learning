import mongoose from "mongoose";

const City_Schema = new mongoose.Schema({

  _id: { type: String, require: true },
  city: { type: String },
  city_ascii: { type: String },
  lat: {},
  lng: {},
  country: { type: String },
  iso2: { type: String },
  iso3: { type: String },
  admin_name: { type: String },
  capital: { type: String },
  population: {},


})

export const CityModel = mongoose.models.city || mongoose.model("city", City_Schema)