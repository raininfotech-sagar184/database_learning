//86. Write a MongoDB query to find the top 5 restaurants in each borough with the highest number of "A" grades.


import { NextResponse } from "next/server";
import DB_Connect from "@/utills/dbConnect/dbConnect"
import { CityModel } from "@/dbmodels/cityModel"
import { CountryModel } from "@/dbmodels/countryModel"
import { GradeModel } from "@/dbmodels/gradeModel"
import { RestaurantModel } from "@/dbmodels/restaurantsModel"

function getTop5RestaurantsByAGrades(restaurants) {
  // Min-heap implementation
  class MinHeap {
    constructor() {
      this.heap = [];
    }

    insert(val) {
      this.heap.push(val);
      this.heapifyUp(this.heap.length - 1);
    }

    remove() {
      const top = this.heap[0];
      const end = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = end;
        this.heapifyDown(0);
      }
      return top;
    }

    heapifyUp(index) {
      let parent = Math.floor((index - 1) / 2);
      while (index > 0 && this.heap[index].aGradeCount < this.heap[parent].aGradeCount) {
        [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
        index = parent;
        parent = Math.floor((index - 1) / 2);
      }
    }

    heapifyDown(index) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;

      if (left < this.heap.length && this.heap[left].aGradeCount < this.heap[smallest].aGradeCount) {
        smallest = left;
      }
      if (right < this.heap.length && this.heap[right].aGradeCount < this.heap[smallest].aGradeCount) {
        smallest = right;
      }
      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        this.heapifyDown(smallest);
      }
    }

    size() {
      return this.heap.length;
    }
  }

  // Create a map to store the min-heaps by borough
  const boroughs = {};

  // Iterate through the restaurants to count the number of "A" grades
  restaurants.forEach((restaurant) => {
    const borough = restaurant.borough;
    const aGradeCount = restaurant.grades.reduce((count, grade) => {
      return grade.grade === "A" ? count + 1 : count;
    }, 0);

    if (!boroughs[borough]) {
      boroughs[borough] = new MinHeap();
    }

    const heap = boroughs[borough];
    heap.insert({
      aGradeCount: aGradeCount,
      restaurant_id: restaurant.restaurant_id
    });

    // Maintain only top 5 in the heap
    if (heap.size() > 5) {
      heap.remove();
    }
  });

  // Extract top 5 from each borough's heap and format the result
  const top5RestaurantsByBorough = {};
  Object.keys(boroughs).forEach((borough) => {
    const heap = boroughs[borough];
    top5RestaurantsByBorough[borough] = [];
    while (heap.size() > 0) {
      top5RestaurantsByBorough[borough].push(heap.remove());
    }
    // Reverse to get the highest first
    top5RestaurantsByBorough[borough].reverse();
  });

  return top5RestaurantsByBorough;
}


export async function POST(request, response) {
  DB_Connect()
  try {
    console.time("database")
    //------------------------------------------------------------------------------------------------------------
    // console.log("1. achive by function *********************************")
    // const data = await RestaurantModel.find({})
    // const data = getTop5RestaurantsByAGrades(rawdata)
    //----------------------------------------------------------------------------------------------------------------

    // console.log("2. achive by query(compare time====1) ==========================")
    // const data = await RestaurantModel.aggregate([
    //   { $unwind: "$grades" },
    //   { $match: { "grades.grade": "A" } },
    //   {
    //     $group: {
    //       _id: { borough: "$borough", restaurant_id: "$restaurant_id" },
    //       gradeCount: { $sum: 1 }
    //     }
    //   },
    //   {
    //     $sort: {
    //       "_id.borough": 1,
    //       gradeCount: -1
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: "$_id.borough",
    //       topRestaurants: { $push: { restaurant_id: "$_id.restaurant_id", gradeCount: "$gradeCount" } }
    //     }
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       borough: "$_id",
    //       topRestaurants: { $slice: ["$topRestaurants", 5] }
    //     }
    //   }
    // ])

    //----------------------------------------------------------------------------------------------------------------

    console.log("3. achive by joining by lockup(compare time=====2) --------------------------->")
    const data = await RestaurantModel.aggregate([
      {
        $lookup: {
          from: "grades",
          localField: "restaurant_id",
          foreignField: "restaurant_id",
          as: "grades"
        }
      },
      {
        $unwind: "$grades"
      },
      {
        $group: {
          _id: "$borough",
          topRestaurants: {
            $push: {
              restaurant_id: "$restaurant_id",
              gradeCount: { $size: "$grades.grades" },

            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          borough: "$_id",
          topRestaurants:
          {
            $slice: [
              "$topRestaurants",
              5
            ]
          },

        }
      }
    ]);

    // ------------------------------------------------------------------------------------------------------------
    // console.log("3.1 achive by joining by lockup--------------------------->")
    // const data = await RestaurantModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "grades",
    //       localField: "restaurant_id",
    //       foreignField: "restaurant_id",
    //       as: "grades"
    //     }
    //   },
    //   {
    //     $unwind: "$grades"
    //   },
    //   {
    //     $group: {
    //       _id: "$borough",
    //       topRestaurants: {
    //         $push: {
    //           restaurant_id: "$restaurant_id",
    //           gradeCount: { $size: "$grades.grades" },

    //         }
    //       }
    //     }
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       borough: "$_id",
    //       topRestaurants:
    //       {
    //         $slice: [
    //           "$topRestaurants", 5
    //         ],
    //       },
    //     }
    //   },
    //   {
    //     $sort: {
    //       "topRestaurants.gradeCount": -1
    //     }
    //   },

    // ]);


    // ------------------------------------------------------------------------------------------------------------
    console.timeEnd("database")



    return NextResponse.json({ message: "Hello", data: data, }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Error", error }, { status: 400 });
  }
}


