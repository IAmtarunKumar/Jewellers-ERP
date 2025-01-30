const express = require("express");
const { Sales } = require("../models/sales");
const Product = require("../models/product");

const router = express.Router();

// router.get("/", getAllProducts);  //veer code

router.get("/monthlySales", async (req, res) => {
  try {
    const currentDate = new Date();

    // Set the time zone to Indian Standard Time (IST, UTC+5:30)
    const options = { timeZone: "Asia/Kolkata" };
    const istDate = new Date(currentDate.toLocaleString("en-US", options));

    // Calculate the first day of the current month in IST
    const firstDayOfMonth = new Date(
      istDate.getFullYear(),
      istDate.getMonth(),
      1
    );

    // Calculate the last day of the current month in IST
    const lastDayOfMonth = new Date(
      istDate.getFullYear(),
      istDate.getMonth() + 1,
      0
    );

    // Format the first and last day of the month for comparison in IST
    // Format the first and last day of the month for comparison in IST
    const formatDateForComparison = (date) =>
      date.toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

    const firstDayOfMonthString = formatDateForComparison(firstDayOfMonth);
    const lastDayOfMonthString = formatDateForComparison(lastDayOfMonth);
    // //console.log("First day of the month in IST:", firstDayOfMonthString);
    // //console.log("Last day of the month in IST:", lastDayOfMonthString);

    // Query the sales collection for records within the current month
    const result = await Sales.aggregate([
      {
        $match: {
          saleDate: {
            $gte: firstDayOfMonthString,
            $lte: lastDayOfMonthString,
          },
        },
      },
      {
        $group: {
          _id: "$saleDate",
          totalItemsSold: { $sum: { $toInt: "$quantity" } },
        },
      },
    ]);

    // //console.log("result", result);

    // Process the result to group records by saleDate and sum totalItemsSold
    const groupedResult = result.map((record) => ({
      saleDate: record._id.split(",")[0].trim(),
      totalItemsSold: record.totalItemsSold,
    }));

    // //console.log("groupedResult", groupedResult);
    const outputResult = [];

    const groupedSales = {};

    groupedResult.forEach((record) => {
      const saleDate = record.saleDate;
      const totalItemsSold = record.totalItemsSold;

      if (groupedSales[saleDate]) {
        // If the date is already in the object, update the totalItemsSold
        groupedSales[saleDate].totalItemsSold += totalItemsSold;
      } else {
        // If the date is not in the object, add it
        groupedSales[saleDate] = { saleDate, totalItemsSold };
      }
    });

    // Convert the object values to an array
    outputResult.push(...Object.values(groupedSales));
    function compareSaleDates(a, b) {
      const dateA = new Date(a.saleDate.split('/').reverse().join('-'));
      const dateB = new Date(b.saleDate.split('/').reverse().join('-'));

      return dateA - dateB;
    }

    // Sort the array in increasing order of 'saleDate'
    outputResult.sort(compareSaleDates);
    // //console.log("outputResult", outputResult);
    res.status(200).send(outputResult);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/monthlyProductSales", async (req, res) => {
  try {
    const currentDate = new Date();

    // Set the time zone to Indian Standard Time (IST, UTC+5:30)
    const options = { timeZone: "Asia/Kolkata" };
    const istDate = new Date(currentDate.toLocaleString("en-US", options));

    // Calculate the first day of the current month in IST
    const firstDayOfMonth = new Date(
      istDate.getFullYear(),
      istDate.getMonth(),
      1
    );

    // Calculate the last day of the current month in IST
    const lastDayOfMonth = new Date(
      istDate.getFullYear(),
      istDate.getMonth() + 1,
      0
    );

    // Format the first and last day of the month for comparison in IST
    const formatDateForComparison = (date) =>
      date.toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

    const firstDayOfMonthString = formatDateForComparison(firstDayOfMonth);
    const lastDayOfMonthString = formatDateForComparison(lastDayOfMonth);
    //console.log("First day of the month in IST:", firstDayOfMonthString);
    //console.log("Last day of the month in IST:", lastDayOfMonthString);

    // Query the sales collection for records within the current month
    const result = await Sales.aggregate([
      {
        $match: {
          saleDate: {
            $gte: firstDayOfMonthString,
            $lte: lastDayOfMonthString,
          },
        },
      },
      {
        $group: {
          _id: "$productId",

          totalItemsSold: { $sum: { $toInt: "$quantity" } },
        },
      },
    ]);

    //console.log("result", result);
    //before the first step iam going to take the name also to add in the array for each element
    const newResultArray = [];
    //console.log(
    //   "logging new array before everything",
    //   newResultArray
    // );
    for (const r of result) {
      const productFound = await Product.findOne({ productId: r._id });
      //console.log("product found", productFound)
      if (productFound) {
        const object = {};
        //console.log("object before pushing", object)

        object._id = r._id;
        object.totalItemsSold = r.totalItemsSold;
        object.name = productFound.productName;
        // //console.log("object before pushing", object)
        newResultArray.push(object);
      }
    }
    //console.log(
    //   "logging new array before moving to grouped result",
    //   newResultArray
    // );

    // Process the result to group records by saleDate and sum totalItemsSold
    const groupedResult = newResultArray.map((record) => ({
      productName: record.name,
      totalItemsSold: record.totalItemsSold,
    }));
    groupedResult.sort((a, b) => b.totalItemsSold - a.totalItemsSold);
    //console.log("groupedResult", groupedResult);

    res.status(200).send(groupedResult);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/quarterlySales", async (req, res) => {
  //console.log("we are giving the quarterly sales data");
  try {
    const currentDate1 = new Date();

    // Set the time zone to Indian Standard Time (IST, UTC+5:30)
    const options = { timeZone: "Asia/Kolkata" };
    const istDate = new Date(currentDate1.toLocaleString("en-US", options));
    // Calculate the first day of July in IST
    const firstDayOfJuly = new Date(
      istDate.getFullYear(),
      currentDate1.getMonth() - 2, // July is month 6 in JavaScript (0-based index)
      1
    );

    // Calculate the last day of September in IST
    const lastDayOfSeptember = new Date(
      istDate.getFullYear(),
      currentDate1.getMonth(), // September is month 8 in JavaScript (0-based index)
      currentDate1.getDate(),
      23, // Set the hour to 23 for 11 PM
      59, // Set the minute to 59
      59 // Set the second to 59
    );

    // Format the first and last day for comparison in IST
    const formatDateForComparison = (date) =>
      date.toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

    const firstDayOfJulyString = formatDateForComparison(firstDayOfJuly);
    const lastDayOfSeptemberString =
      formatDateForComparison(lastDayOfSeptember);
    //console.log("First day of July in IST:", firstDayOfJulyString);
    //console.log("Last day of September in IST:", lastDayOfSeptemberString);

    // Query the sales collection for records within the current month
    const result = await Sales.aggregate([
      {
        $match: {
          saleDate: {
            $gte: firstDayOfJulyString,
            $lte: lastDayOfSeptemberString,
          },
        },
      },
      {
        $group: {
          _id: "$saleDate",
          totalItemsSold: { $sum: { $toInt: "$quantity" } },
        },
      },
    ]);

    // //console.log("result", result);   //its not getting segregated based on the above mentioned dates (prvious three months ) so in last we are doing that again

    // Process the result to group records by saleDate and sum totalItemsSold
    const groupedResult = result.map((record) => ({
      saleDate: record._id.split(",")[0].trim(),
      totalItemsSold: record.totalItemsSold,
    }));

    // //console.log("groupedResult", groupedResult);
    const outputResult = [];

    const groupedSales = {};

    groupedResult.forEach((record) => {
      const saleDate = record.saleDate;
      const totalItemsSold = record.totalItemsSold;

      if (groupedSales[saleDate]) {
        // If the date is already in the object, update the totalItemsSold
        groupedSales[saleDate].totalItemsSold += totalItemsSold;
      } else {
        // If the date is not in the object, add it
        groupedSales[saleDate] = { saleDate, totalItemsSold };
      }
    });

    // Convert the object values to an array
    outputResult.push(...Object.values(groupedSales));

    //console.log("outputResult", outputResult);
    // Define the start and end date for your desired range
    const currentDate = new Date();

    // Calculate two months ago from the current month
    const twoMonthsAgo = new Date(currentDate);
    twoMonthsAgo.setMonth(currentDate.getMonth() - 2);

    // Set the start date as the 1st day of two months ago in IST
    const startDate = new Date(
      twoMonthsAgo.getFullYear(),
      twoMonthsAgo.getMonth(),
      1,
      0, // Hour
      0, // Minute
      0, // Second
      0 // Millisecond
    );

    // Calculate the last day of the current month in IST
    const lastDayOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Set the end date as the last day of the current month in IST
    const endDate = new Date(
      lastDayOfCurrentMonth.getFullYear(),
      lastDayOfCurrentMonth.getMonth(),
      lastDayOfCurrentMonth.getDate(),
      23, // Hour
      59, // Minute
      59, // Second
      999 // Millisecond
    );

    // Format the start date and end date in ISO 8601 format (yyyy-mm-ddTHH:MM:SS.sssZ)
    //console.log("Start Date (IST):", startDate.toISOString());
    //console.log("End Date (IST):", endDate.toISOString());
    // Filter the array to keep only the objects within the desired date range
    const filteredResult = outputResult.filter((item) => {
      const saleDate = new Date(
        item.saleDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")
      );
      return saleDate >= startDate && saleDate <= endDate;
    }); // now the 3 monthss problem is solved. we will now solve the problem of weekly addition

    //console.log("filtered result", filteredResult);

    //sorting them in increasing order of the date
    filteredResult.forEach((item) => {
      const [day, month, year] = item.saleDate.split("/");
      item.saleDate = new Date(`${year}-${month}-${day}`);
    });

    // Sort the data by date in increasing order
    filteredResult.sort((a, b) => a.saleDate - b.saleDate);
    //console.log("againfiltered result", filteredResult);

    //
    //
    //
    //
    //we are further segregating it on a weekly basis. we are just looping over everyproduct and saving in week1 to week 12
    // Find the earliest and latest dates in the data
    const earliestDate = new Date(
      Math.min(...filteredResult.map((item) => item.saleDate))
    );
    const latestDate = new Date(
      Math.max(...filteredResult.map((item) => item.saleDate))
    );

    // Initialize an array to store the weekly data
    const weeklyData = [];

    // Start from the earliest date and create weekly segments
    let currentWeekStart = new Date(earliestDate);
    while (currentWeekStart <= latestDate) {
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekEnd.getDate() + 6); // End of the week is 6 days later

      // Filter data for the current week
      const currentWeekData = filteredResult.filter(
        (item) =>
          item.saleDate >= currentWeekStart && item.saleDate <= currentWeekEnd
      );

      // Store the weekly segment in the array
      weeklyData.push({
        weekStartDate: new Date(currentWeekStart),
        weekEndDate: new Date(currentWeekEnd),
        data: currentWeekData,
      });

      // Move to the next week
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    //console.log(weeklyData);
    const newWeeklyData = [];
    weeklyData.forEach((item) => {
      //console.log(item); // This will log each object within the data array
      if (item.data.length > 1) {
        //console.log("we found a data whose length is greater than 1");
        const totalItemsSold = item.data.reduce(
          (total, item) => total + item.totalItemsSold,
          0
        );

        // Merge the objects into one
        const mergedWeekData = {
          weekStartDate: item.weekStartDate,
          weekEndDate: item.weekEndDate,
          totalItemsSold: totalItemsSold,
        };
        newWeeklyData.push(mergedWeekData);
      } else {
        //console.log("we are in the else block of the data");
        const totalItemsSold = item.data.reduce(
          (total, item) => total + item.totalItemsSold,
          0
        );
        const mergedWeekData = {
          weekStartDate: item.weekStartDate,
          weekEndDate: item.weekEndDate,
          totalItemsSold: totalItemsSold,
        };
        newWeeklyData.push(mergedWeekData);
      }
    });
    //console.log("newweeklydata", newWeeklyData);
    //
    //
    //
    //
    res.status(200).send(newWeeklyData);
  } catch (error) {
    res.status(500).send(error.message);
    //console.log("error", error.message);
  }
});
router.get("/yearlySales", async (req, res) => {
  //console.log("we are giving the yearly sales data");
  try {
    const currentDate1 = new Date();

    // Set the time zone to Indian Standard Time (IST, UTC+5:30)
    const options = { timeZone: "Asia/Kolkata" };
    const istDate = new Date(currentDate1.toLocaleString("en-US", options));
    // Calculate the first day of July in IST
    const firstDayOfYear = new Date(
      istDate.getFullYear(),
      0, // July is month 6 in JavaScript (0-based index)
      1
    );

    // Calculate the last day of September in IST
    const lastDayOfCurrentMonth1 = new Date(
      istDate.getFullYear(),
      currentDate1.getMonth(), // September is month 8 in JavaScript (0-based index)
      currentDate1.getDate(),
      23, // Set the hour to 23 for 11 PM
      59, // Set the minute to 59
      59 // Set the second to 59
    );

    // Format the first and last day for comparison in IST
    const formatDateForComparison = (date) =>
      date.toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

    const firstDayOfyearString = formatDateForComparison(firstDayOfYear);
    const lastDayOfCurrentMonth1String = formatDateForComparison(
      lastDayOfCurrentMonth1
    );
    //console.log("First day of July in IST:", firstDayOfyearString);
    //console.log("Last day of September in IST:", lastDayOfCurrentMonth1String);

    // Query the sales collection for records within the current month
    const result = await Sales.aggregate([
      {
        $match: {
          saleDate: {
            $gte: firstDayOfyearString,
            $lte: lastDayOfCurrentMonth1String,
          },
        },
      },
      {
        $group: {
          _id: "$saleDate",
          totalItemsSold: { $sum: { $toInt: "$quantity" } },
        },
      },
    ]);

    // //console.log("result", result);   //its not getting segregated based on the above mentioned dates (prvious three months ) so in last we are doing that again

    // Process the result to group records by saleDate and sum totalItemsSold
    const groupedResult = result.map((record) => ({
      saleDate: record._id.split(",")[0].trim(),
      totalItemsSold: record.totalItemsSold,
    }));

    // //console.log("groupedResult", groupedResult);
    const outputResult = [];

    const groupedSales = {};

    groupedResult.forEach((record) => {
      const saleDate = record.saleDate;
      const totalItemsSold = record.totalItemsSold;

      if (groupedSales[saleDate]) {
        // If the date is already in the object, update the totalItemsSold
        groupedSales[saleDate].totalItemsSold += totalItemsSold;
      } else {
        // If the date is not in the object, add it
        groupedSales[saleDate] = { saleDate, totalItemsSold };
      }
    });

    // Convert the object values to an array
    outputResult.push(...Object.values(groupedSales));

    //console.log("outputResult", outputResult);
    // Define the start and end date for your desired range

    //sorting them in increasing order of the date
    outputResult.forEach((item) => {
      const [day, month, year] = item.saleDate.split("/");
      item.saleDate = new Date(`${year}-${month}-${day}`);
    });

    // Sort the data by date in increasing order
    outputResult.sort((a, b) => a.saleDate - b.saleDate);
    //console.log("againoutput result", outputResult);

    //
    //
    //
    //
    //we are further segregating it on a yearly basis
    const finalYearlyArray = [
      { month: "January", totalItemsSold: 0 },
      { month: "February", totalItemsSold: 0 },
      { month: "March", totalItemsSold: 0 },
      { month: "April", totalItemsSold: 0 },
      { month: "May", totalItemsSold: 0 },
      { month: "June", totalItemsSold: 0 },
      { month: "July", totalItemsSold: 0 },
      { month: "August", totalItemsSold: 0 },
      { month: "September", totalItemsSold: 0 },
      { month: "October", totalItemsSold: 0 },
      { month: "November", totalItemsSold: 0 },
      { month: "December", totalItemsSold: 0 },
    ];
    for (const object of outputResult) {
      const saleDateStr = object.saleDate.toISOString().split("T")[0];
      switch (true) {
        case /^.*-01-.*$/.test(saleDateStr):
          // Handle cases where saleDate includes "-01-"
          //console.log(
          //   "we are here some sale is in January and object is",
          //   object
          // );
          finalYearlyArray[0].totalItemsSold += object.totalItemsSold;
          break;
        case /^.*-02-.*$/.test(saleDateStr):
          // Handle cases where saleDate includes "-02-"
          //console.log(
          // "we are here some sale is in February and object is",
          //   object
          // );
          finalYearlyArray[1].totalItemsSold += object.totalItemsSold;
          break;
        case /^.*-03-.*$/.test(saleDateStr):
          // Handle cases where saleDate includes "-01-"
          //console.log(
          // "we are here some sale is in march and object is",
          // object
          //         );
          finalYearlyArray[2].totalItemsSold += object.totalItemsSold;
          break;

        case /^.*-04-.*$/.test(saleDateStr):
          // Handle cases where saleDate includes "-02-"
          //console.log(
          // "we are here some sale is in april and object is",
          // object
          //         );
          finalYearlyArray[3].totalItemsSold += object.totalItemsSold;
          break;
        case /^.*-05-.*$/.test(saleDateStr):
          // Handle cases where saleDate includes "-01-"
          //console.log("we are here some sale is in may and object is", object);
          finalYearlyArray[4].totalItemsSold += object.totalItemsSold;
          break;

        case /^.*-06-.*$/.test(saleDateStr):
          // Handle cases where saleDate includes "-02-"
          //console.log("we are here some sale is in june and object is", object);
          finalYearlyArray[5].totalItemsSold += object.totalItemsSold;
          break;
        case /^.*-07-.*$/.test(saleDateStr):
          // Handle cases where saleDate includes "-01-"
          //console.log("we are here some sale is in july and object is", object);
          finalYearlyArray[6].totalItemsSold += object.totalItemsSold;
          break;

        case /^.*-08-.*$/.test(saleDateStr):
          // Handle cases where saleDate includes "-02-"
          //console.log(
          // "we are here some sale is in august and object is",
          // object
          //         );
          finalYearlyArray[7].totalItemsSold += object.totalItemsSold;

          break;
        case /^.*-09-.*$/.test(saleDateStr):
          // Handle cases where saleDate includes "-01-"
          //console.log(
          // "we are here some sale is in september and object is",
          // object
          //         );
          finalYearlyArray[8].totalItemsSold += object.totalItemsSold;
          break;

        case /^.*-10-.*$/.test(saleDateStr):
          // Handle cases where saleDate includes "-02-"
          //console.log(
          // "we are here some sale is in october and object is",
          // object
          //         );
          finalYearlyArray[9].totalItemsSold += object.totalItemsSold;

          break;
        case /^.*-11-.*$/.test(saleDateStr):
          // Handle cases where saleDate includes "-01-"
          //console.log(
          // "we are here some sale is in november and object is",
          // object
          // );
          finalYearlyArray[10].totalItemsSold += object.totalItemsSold;
          break;

        case /^.*-12-.*$/.test(saleDateStr):
          // Handle cases where saleDate includes "-02-"
          //console.log(
          // "we are here some sale is in december and object is",
          // object
          //         );
          finalYearlyArray[11].totalItemsSold += object.totalItemsSold;

          break;
      }
    }
    console.log("finalyearly array after loop", finalYearlyArray);

    //
    //
    //
    res.status(200).send(finalYearlyArray);
  } catch (error) {
    res.status(500).send(error.message);
    console.log("error", error.message);
  }
});

module.exports = router;
