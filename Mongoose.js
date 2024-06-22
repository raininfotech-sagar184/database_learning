//     find By any field of table:

//     Find All 
//             await CityModel.find()
//     Search 
//             await CityModel.find({ country: { $regex: new RegExp("japan", "i") } })
//     Filter
//             await CityModel.find({ population: { $gt: 37731999, $lt: 37732001, $eq: 37732000 },country: { $in: ['Indonesia', 'talking'] } })
//     All 
//             await CityModel.find({ country: { $regex: new RegExp("japan", "i") }, population: { $gt: 37731999, $lt: 37732001, $eq: 37732000 },country: { $in: ['Indonesia', 'talking'] } })


// With a JSON doc
await Person.
        find({
                occupation: { $regex: new RegExp("host", "i") },    //Search
                'name.last': 'Ghost',
                age: { $gt: 17, $lt: 66 },                          //Filter
                likes: { $in: ['vaporizing', 'talking'] }           //Filter
        }).
        limit(10).                                                  //Pagination argument(records)
        skip(1).                                                              // argument(records*pageNumber)
        sort({ occupation: -1 }).                                   //Sort
        select({ name: 1, occupation: 1 }).                         //Show Selected Field
        exec().
        lean();                                                     // remove unneccessary default field

// Using query builder
await Person.
        find({ occupation: { $regex: new RegExp("host", "i") } }).
        where('name.last').equals('Ghost').
        where('age').gt(17).lt(66).
        where('likes').in(['vaporizing', 'talking']).
        limit(10).
        sort('-occupation').
        select('name occupation').
        exec();