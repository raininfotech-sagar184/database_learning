// Q.85. Write a MongoDB query to find the top 5 restaurants with the highest average score for each cuisine type, along with their average scores.
import { NextResponse } from "next/server";
import DB_Connect from "@/utills/dbConnect/dbConnect"
import { CityModel } from "@/dbmodels/cityModel"
import { CountryModel } from "@/dbmodels/countryModel"
import { GradeModel } from "@/dbmodels/gradeModel"
import { RestaurantModel } from "@/dbmodels/restaurantsModel"
import { skip } from "node:test";
import { Query51, Query52 } from "../../../utills/quaries/practice51_70";




export async function POST(request, response) {
  DB_Connect()
  try {
    const params = Object.fromEntries(new URLSearchParams(request.nextUrl.search).entries());
    const { que } = params
    console.time("database")

    let data
    let count = 0
    let query = {}

    if (que == 51) {
      query = Query51
    } else if (que == 52) {
      query = Query52
    } else {
      data = {}
      count = 0
    }
    count = await RestaurantModel.countDocuments(query);
    data = await RestaurantModel.aggregate(query);
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