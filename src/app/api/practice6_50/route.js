// Q.85. Write a MongoDB query to find the top 5 restaurants with the highest average score for each cuisine type, along with their average scores.
import { NextResponse } from "next/server";
import DB_Connect from "@/utills/dbConnect/dbConnect"
import { RestaurantModel } from "@/dbmodels/restaurantsModel"

export async function POST(request, response) {
  DB_Connect()
  try {
    const params = Object.fromEntries(new URLSearchParams(request.nextUrl.search).entries());
    const { que } = params
    console.time("database")

    let data
    let count = 0
    let query = {}

    if (que == 6) {
      data = await RestaurantModel.find({ "borough": /Bronx/ }).
        select({ borough: 1 }).
        limit(5)
    } else if (que == 7) {
      data = await RestaurantModel.find({ "borough": /Bronx/ }).
        select({ borough: 1 }).
        limit(5).
        skip(5)
    } else if (que == 8) {
      data = await RestaurantModel.find({ "grades.score": { $gt: 90 } })
        .select({ grades: 1 })
    } else if (que == 9) {
      data = await RestaurantModel.find({ "grades.score": { $gt: 80, $lt: 100 } })
        .select({ grades: 1 })
    } else if (que == 10) {
      data = await RestaurantModel.find({ "address.coord": { $lt: -95.754168 } })
        .select({ address: { coord: 1 } })
    } else if (que == 11) {
      data = await RestaurantModel.find({ $and: { "cuisine": { $ne: "American " }, "grades.score": { $gt: 70 }, "address.coord": { $lt: -65.754168 } } })
        .select({ address: { coord: 1 }, cuisine: 1, grades: 1 })
    } else if (que == 12) {
      data = await RestaurantModel.find({ "cuisine": { $ne: "American " }, "grades.score": { $gt: 70 }, "address.coord": { $lt: -65.754168 } })
        .select({ address: { coord: 1 }, cuisine: 1, grades: 1 })
    } else if (que == 13) {
      data = await RestaurantModel.find({ "cuisine": { $ne: "American " }, "grades.grade": /A/, "borough": /Brooklyn/ })
        .select({ address: { coord: 1 }, cuisine: 1, grades: 1 })
        .sort({ cuisine: -1 })
    } else if (que == 14) {
      data = await RestaurantModel.find({ "name": new RegExp(/^Wil/, 'i') }, { "name": 1, "cuisine": 1, "borough": 1 })
    } else if (que == 15) {
      data = await RestaurantModel.find({ "name": new RegExp(/ces$/, 'i') }, { "name": 1, "cuisine": 1, "borough": 1 })
    } else if (que == 16) {
      data = await RestaurantModel.find({ "name": new RegExp(/.*Reg.*/, 'i') }, { "name": 1, "cuisine": 1, "borough": 1 })
    } else if (que == 17) {
      query = { "borough": "Bronx", $or: [{ "cuisine": "American " }, { "cuisine": "Chinese" }] }
    } else if (que == 18) {
      query = { "borough": { $in: ["Staten Island", "Queens", "Bronx", "Brooklyn"] } }
    } else if (que == 19) {
      query = { "borough": { $nin: ["Staten Island", "Queens", "Brooklyn"] } };
    } else if (que == 20) {
      query = { "grades.score": { $not: { $gt: 10 } } };
    } else if (que == 21) {
      query = { $or: [{ name: /^Wil/ }, { cuisine: { $nin: ["Chinees", "American "] } }] };
    } else if (que == 22) {
      query = { "grades.date": "2014-09-06T00:00:00.000Z", "grades.grade": "A", "grades.score": 11 }
      data = "Not working"
    } else if (que == 23) {
      query = { "grades.1.date": ISODate("2014-08-11T00:00:00Z"), "grades.1.grade": "A", "grades.1.score": 9 }
      data = "Not working"
    } else if (que == 24) {
      query = { "address.coord.1": { $gt: 42, $lte: 54 } }
    } else if (que == 25) {
      data = await RestaurantModel.find({}).sort({ "name": 1 });
    } else if (que == 26) {
      data = await RestaurantModel.find({ "cuisine": 1, "borough": 1 }).sort({ "cuisine": 1, "borough": -1, });
    } else if (que == 30) {
      query = {
        "grades.score":
          { $mod: [7, 0] }
      }
    } else {
      data = {}
      count = 0
    }
    const projection = { "cuisine": 1, "grades": 1 };
    count = await RestaurantModel.countDocuments(query);
    data = await RestaurantModel.find(query, projection);
    //------------------------------------------------------------------------------------------------------------
    console.timeEnd("database")

    //. Write a MongoDB query to find the top 5 restaurants in each borough with the highest number of "A" grades.

    return NextResponse.json({ message: "Hello", data: data, count: count }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Error", error }, { status: 400 });
  }
}


const data = {
  "address": {
    "building": "1007",
    "coord": [-73.856077, 40.848447],
    "street": "Morris Park Ave",
    "zipcode": "10462"
  },
  "borough": "Bronx",
  "cuisine": "Bakery",
  "grades": [
    { "date": { "$date": 1393804800000 }, "grade": "A", "score": 2 },
    { "date": { "$date": 1378857600000 }, "grade": "A", "score": 6 },
    { "date": { "$date": 1358985600000 }, "grade": "A", "score": 10 },
    { "date": { "$date": 1322006400000 }, "grade": "A", "score": 9 },
    { "date": { "$date": 1299715200000 }, "grade": "B", "score": 14 }
  ],
  "name": "Morris Park Bake Shop",
  "restaurant_id": "30075445"
}