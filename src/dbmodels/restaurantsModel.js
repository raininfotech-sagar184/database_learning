import mongoose from "mongoose";

const Restaurant_Schema = new mongoose.Schema({

  "address": {},
  "borough": {},
  "cuisine": {},
  "grades": {},
  "name": {},
  "restaurant_id": {}
})

export const RestaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", Restaurant_Schema)