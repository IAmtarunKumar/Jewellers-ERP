const express = require("express");
const { Sales } = require("../models/sales");
const { Repair } = require("../models/repairs");
const { RawMaterial } = require("../models/rawMaterial");
const { JobWork } = require("../models/jobWork");
const Product = require("../models/product");
const { ContentAndApprovalsListInstance } = require("twilio/lib/rest/content/v1/contentAndApprovals");


const router = express.Router();

router.get('/totalRevenue', async (req, res) => {
    try {
        console.log("we are in total revenue block")
        const totalSalesProduct = await Sales.aggregate([
            {
                $lookup: {
                    from: 'products', // Replace with the actual name of your products collection
                    localField: 'productId',
                    foreignField: 'productId',
                    as: 'productInfo'
                }
            },
            {
                $unwind: '$productInfo'
            },
            {
                $project: {
                    _id: 1,
                    customerId: 1,
                    productId: 1,
                    saleDate: 1,
                    quantity: 1,
                    totalAmount: {
                        $multiply: [
                            { $toDecimal: '$productInfo.price' },
                            { $toInt: '$quantity' }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSalesAmount: { $sum: '$totalAmount' }
                }
            }
        ])



            .exec() // Remove the callback function
        let totalAmount;
        if (totalSalesProduct.length > 0) {
            totalAmount = totalSalesProduct[0].totalSalesAmount.toString();
            console.log('Total Sales Amount:', totalAmount);
        } else {
            console.log('No sales data found.');
        }
        //now we are adding repair revenues in it as well
        const repairsTotal = await Repair.aggregate([
            {
                $group: {
                    _id: null,
                    totalRepairCost: { $sum: { $toInt: "$repairCost" } }
                }
            }
        ])
            .exec()
        let totalCost
        if (repairsTotal.length > 0) {
            totalCost = repairsTotal[0].totalRepairCost.toString();
            console.log('Total Repair Cost:', totalCost);
        } else {
            // code by tarun
            totalCost = 0
            console.log('No repair data found.');

        }

        console.log("total repair", repairsTotal)
        console.log("total cost :", totalCost)

        const grandTotal = parseInt(totalAmount, 10) + parseInt(totalCost, 10);



        console.log("totalamount of addition", grandTotal)
        res.status(200).send(`${grandTotal}`)
    } catch (error) {
        res.status(500).send(error.message);
    }
});
router.get('/totalExpense', async (req, res) => {
    console.log("we are in the total expense block")
    try {

        let totalPriceRawMaterial = 0
        // let totalPriceRawMaterial=0
        const allRawMaterial = await RawMaterial.find()
        console.log("all raw material", allRawMaterial)
        if (!allRawMaterial || allRawMaterial.length === 0) {
            return res.status(400).send("Raw Material not found")
        } else {


            allRawMaterial.forEach((doc) => {
                doc.rawMaterialEntryArray.forEach((item) => {
                    totalPriceRawMaterial = +totalPriceRawMaterial + +item.price
                })

            })

            console.log("total raw material price", totalPriceRawMaterial)




        }

        // console.log("total price raw material" , totalPriceRawMaterial)
        // const rawMaterialTotalExpense = await RawMaterial.aggregate([
        //     {
        //         $group: {
        //             _id: null,
        //             totalRawMaterialPrice: { $sum: { $toInt: "$price" } }
        //         }
        //     }
        // ])
        //     .exec()
        // let totalPriceRawMaterial
        // if (rawMaterialTotalExpense.length > 0) {
        //     totalPriceRawMaterial = rawMaterialTotalExpense[0].totalRawMaterialPrice.toString();
        //     console.log('Total Raw Material Price:', totalPriceRawMaterial);
        // } else {
        //     console.log('No raw material data found.');
        // }





        //now we are finding the job work expense
        const jobWorkTotalExpense = await JobWork.aggregate([
            {
                $group: {
                    _id: null,
                    totalJobWorkPrice: { $sum: { $toInt: "$priceDecided" } }
                }
            }
        ])
            .exec()
        let totalPriceJobWork
        if (jobWorkTotalExpense.length > 0) {
            totalPriceJobWork = jobWorkTotalExpense[0].totalJobWorkPrice.toString();
            console.log('Total jobwork Price:', totalPriceJobWork);
        } else {
            // code by tarun 
            totalPriceJobWork = 0
            console.log('No jobwork data found.');
        }
        const grandTotal = parseInt(totalPriceRawMaterial, 10) + parseInt(totalPriceJobWork, 10);
        console.log("totalamount of expenditure", grandTotal)
        res.status(200).send(`${grandTotal}`)
    }
    catch (err) {
        console.log("error is", err.message)
        res.status(500).send(`error occured-${err.message}`)
    }
});
router.get("/allYearly", async (req, res) => {
    console.log("we are giving the yearly sales data");
    try {
        const sales = await Sales.find({})

        if(sales.length != 0){
            return res.status(200).send("sales not found!")
        }

        // Creating arrays for each month separately
        const january = [];
        const february = [];
        const march = [];
        const april = [];
        const may = [];
        const june = [];
        const july = [];
        const august = [];
        const september = [];
        const october = [];
        const november = [];
        const december = [];
        for (const sale of sales) {
            const saleDateStr = sale.saleDate.split("T")[0];
            console.log("saledatestring", saleDateStr)
            switch (true) {
                case /\/01\//.test(saleDateStr):
                    // January
                    // console.log("Sale in January:", sale);
                    january.push(sale);
                    break;
                case /\/02\//.test(saleDateStr):
                    // February
                    // console.log("Sale in February:", sale);
                    february.push(sale);
                    break;
                case /\/03\//.test(saleDateStr):
                    // March
                    // console.log("Sale in March:", sale);
                    march.push(sale);
                    break;
                case /\/04\//.test(saleDateStr):
                    // April
                    // console.log("Sale in April:", sale);
                    april.push(sale);
                    break;
                case /\/05\//.test(saleDateStr):
                    // May
                    // console.log("Sale in May:", sale);
                    may.push(sale);
                    break;
                case /\/06\//.test(saleDateStr):
                    // June
                    // console.log("Sale in June:", sale);
                    june.push(sale);
                    break;
                case /\/07\//.test(saleDateStr):
                    // July
                    // console.log("Sale in July:", sale);
                    july.push(sale);
                    break;
                case /\/08\//.test(saleDateStr):
                    // August
                    // console.log("Sale in August:", sale);
                    august.push(sale);
                    break;
                case /\/09\//.test(saleDateStr):
                    // September
                    // console.log("Sale in September:", sale);
                    september.push(sale);
                    break;
                case /\/10\//.test(saleDateStr):
                    // October
                    // console.log("Sale in October:", sale);
                    october.push(sale);
                    break;
                case /\/11\//.test(saleDateStr):
                    // November
                    // console.log("Sale in November:", sale);
                    november.push(sale);
                    break;
                case /\/12\//.test(saleDateStr):
                    // December
                    // console.log("Sale in December:", sale);
                    december.push(sale);
                    break;
                default:
                    // Handle cases where the month is not matched
                    console.log("Sale with unknown month:", sale);
                    break;
            }
        }
        // here we are done for the sales now we are starting the repairs 
        const januaryRepairs = [];
        const februaryRepairs = [];
        const marchRepairs = [];
        const aprilRepairs = [];
        const mayRepairs = [];
        const juneRepairs = [];
        const julyRepairs = [];
        const augustRepairs = [];
        const septemberRepairs = [];
        const octoberRepairs = [];
        const novemberRepairs = [];
        const decemberRepairs = [];

        const repairs = await Repair.find({})
        for (const repair of repairs) {
            const repairDateStr = repair.repairDate.split("T")[0];
            console.log("repair date string", repairDateStr)
            switch (true) {
                case /-01-/.test(repairDateStr):
                    // January
                    // console.log("Repair in January:", repair);
                    januaryRepairs.push(repair);
                    break;
                case /-02-/.test(repairDateStr):
                    // February
                    // console.log("Repair in February:", repair);
                    februaryRepairs.push(repair);
                    break;
                case /-03-/.test(repairDateStr):
                    // March
                    // console.log("Repair in March:", repair);
                    marchRepairs.push(repair);
                    break;
                case /-04-/.test(repairDateStr):
                    // April
                    // console.log("Repair in April:", repair);
                    aprilRepairs.push(repair);
                    break;
                case /-05-/.test(repairDateStr):
                    // May
                    // console.log("Repair in May:", repair);
                    mayRepairs.push(repair);
                    break;
                case /-06-/.test(repairDateStr):
                    // June
                    // console.log("Repair in June:", repair);
                    juneRepairs.push(repair);
                    break;
                case /-07-/.test(repairDateStr):
                    // July
                    // console.log("Repair in July:", repair);
                    julyRepairs.push(repair);
                    break;
                case /-08-/.test(repairDateStr):
                    // August
                    // console.log("Repair in August:", repair);
                    augustRepairs.push(repair);
                    break;
                case /-09-/.test(repairDateStr):
                    // September
                    // console.log("Repair in September:", repair);
                    septemberRepairs.push(repair);
                    break;
                case /-10-/.test(repairDateStr):
                    // October
                    // console.log("Repair in October:", repair);
                    octoberRepairs.push(repair);
                    break;
                case /-11-/.test(repairDateStr):
                    // November
                    // console.log("Repair in November:", repair);
                    novemberRepairs.push(repair);
                    break;
                case /-12-/.test(repairDateStr):
                    // December
                    // console.log("Repair in December:", repair);
                    decemberRepairs.push(repair);
                    break;
                default:
                    // Handle cases where the month is not matched
                    // console.log("Repair with unknown month:", repair);
                    break;
            }
        }
        //
        //
        //
        const allDataArray = []  // this should be the array which we are sending in the backend. //first object will contain the data about january and further it will contain revenue, expenditure and on other indexes the values will be with the same method.
        let januaryObject = {};
        let februaryObject = {};
        let marchObject = {};
        let aprilObject = {};
        let mayObject = {};
        let juneObject = {};
        let julyObject = {};
        let augustObject = {};
        let septemberObject = {};
        let octoberObject = {};
        let novemberObject = {};
        let decemberObject = {};
        //we will start for january 

        let additionOfRevenuejanuary = 0
        for (const sale of january) {
            //for first sale we will fetch the productId and search for it

            const correspondingProduct = await Product.findOne({ productId: sale.productId })
            if (correspondingProduct) {
                const priceOfCorrespondingProduct = correspondingProduct.price
                // console.log(`price of corresponding product of this - ${sale}`, priceOfCorrespondingProduct)

                const totalPriceEarnedFromThisSale = parseInt(priceOfCorrespondingProduct, 10) * parseInt(sale.quantity, 10)
                // console.log("totalpriceearned", totalPriceEarnedFromThisSale)
                additionOfRevenuejanuary += totalPriceEarnedFromThisSale
            }
        }
        // console.log("addition of price january after the sales only", additionOfRevenuejanuary)
        //we are now addding the revenue by repairs in it as well
        for (const repairSale of januaryRepairs) {
            let repairPrice = repairSale.repairCost
            additionOfRevenuejanuary += parseInt(repairPrice, 10)
        }
        // console.log("addition of price january after the sales and repair both", additionOfRevenuejanuary)
        januaryObject.totalSale = additionOfRevenuejanuary
        allDataArray[0] = januaryObject//setting the first part of array as january object which contains only one object totalSale. we will now save totalexpense in january object and again define allDataArray[0] which wont be  problem
        //
        //
        let additionOfRevenuefebruary = 0
        for (const sale of february) {
            //for first sale we will fetch the productId and search for it

            const correspondingProduct = await Product.findOne({ productId: sale.productId })
            if (correspondingProduct) {
                const priceOfCorrespondingProduct = correspondingProduct.price
                //console.log(`price of corresponding product of this - ${sale}`, priceOfCorrespondingProduct)

                const totalPriceEarnedFromThisSale = parseInt(priceOfCorrespondingProduct, 10) * parseInt(sale.quantity, 10)
                //console.log("totalpriceearned", totalPriceEarnedFromThisSale)
                additionOfRevenuefebruary += totalPriceEarnedFromThisSale
            }
        }
        //console.log("addition of price february after the sales only", additionOfRevenuefebruary)
        //we are now addding the revenue by repairs in it as well
        for (const repairSale of februaryRepairs) {
            let repairPrice = repairSale.repairCost
            additionOfRevenuefebruary += parseInt(repairPrice, 10)
        }
        //console.log("addition of price february after the sales and repair both", additionOfRevenuefebruary)
        februaryObject.totalSale = additionOfRevenuefebruary
        allDataArray[1] = februaryObject
        //
        //
        let additionOfRevenuemarch = 0
        for (const sale of march) {
            //for first sale we will fetch the productId and search for it

            const correspondingProduct = await Product.findOne({ productId: sale.productId })
            if (correspondingProduct) {
                const priceOfCorrespondingProduct = correspondingProduct.price
                //console.log(`price of corresponding product of this - ${sale}`, priceOfCorrespondingProduct)

                const totalPriceEarnedFromThisSale = parseInt(priceOfCorrespondingProduct, 10) * parseInt(sale.quantity, 10)
                //console.log("totalpriceearned", totalPriceEarnedFromThisSale)
                additionOfRevenuemarch += totalPriceEarnedFromThisSale
            }
        }
        //console.log("addition of price march after the sales only", additionOfRevenuemarch)
        //we are now addding the revenue by repairs in it as well
        for (const repairSale of marchRepairs) {
            let repairPrice = repairSale.repairCost
            additionOfRevenuemarch += parseInt(repairPrice, 10)
        }
        //console.log("addition of price march after the sales and repair both", additionOfRevenuemarch)
        marchObject.totalSale = additionOfRevenuemarch
        allDataArray[2] = marchObject
        //
        //
        let additionOfRevenueapril = 0
        for (const sale of april) {
            //for first sale we will fetch the productId and search for it

            const correspondingProduct = await Product.findOne({ productId: sale.productId })
            if (correspondingProduct) {
                const priceOfCorrespondingProduct = correspondingProduct.price
                //console.log(`price of corresponding product of this - ${sale}`, priceOfCorrespondingProduct)

                const totalPriceEarnedFromThisSale = parseInt(priceOfCorrespondingProduct, 10) * parseInt(sale.quantity, 10)
                //console.log("totalpriceearned", totalPriceEarnedFromThisSale)
                additionOfRevenueapril += totalPriceEarnedFromThisSale
            }
        }
        //console.log("addition of price april after the sales only", additionOfRevenueapril)
        //we are now addding the revenue by repairs in it as well
        for (const repairSale of aprilRepairs) {
            let repairPrice = repairSale.repairCost
            additionOfRevenueapril += parseInt(repairPrice, 10)
        }
        //console.log("addition of price april after the sales and repair both", additionOfRevenueapril)
        aprilObject.totalSale = additionOfRevenueapril
        allDataArray[3] = aprilObject
        //
        //
        let additionOfRevenuemay = 0
        for (const sale of may) {
            //for first sale we will fetch the productId and search for it

            const correspondingProduct = await Product.findOne({ productId: sale.productId })
            if (correspondingProduct) {
                const priceOfCorrespondingProduct = correspondingProduct.price
                //console.log(`price of corresponding product of this - ${sale}`, priceOfCorrespondingProduct)

                const totalPriceEarnedFromThisSale = parseInt(priceOfCorrespondingProduct, 10) * parseInt(sale.quantity, 10)
                //console.log("totalpriceearned", totalPriceEarnedFromThisSale)
                additionOfRevenuemay += totalPriceEarnedFromThisSale
            }
        }
        //console.log("addition of price may after the sales only", additionOfRevenuemay)
        //we are now addding the revenue by repairs in it as well
        for (const repairSale of mayRepairs) {
            let repairPrice = repairSale.repairCost
            additionOfRevenuemay += parseInt(repairPrice, 10)
        }
        //console.log("addition of price may after the sales and repair both", additionOfRevenuemay)
        mayObject.totalSale = additionOfRevenuemay
        allDataArray[4] = mayObject
        //
        //
        let additionOfRevenuejune = 0
        for (const sale of june) {
            //for first sale we will fetch the productId and search for it

            const correspondingProduct = await Product.findOne({ productId: sale.productId })
            if (correspondingProduct) {
                const priceOfCorrespondingProduct = correspondingProduct.price
                //console.log(`price of corresponding product of this - ${sale}`, priceOfCorrespondingProduct)

                const totalPriceEarnedFromThisSale = parseInt(priceOfCorrespondingProduct, 10) * parseInt(sale.quantity, 10)
                //console.log("totalpriceearned", totalPriceEarnedFromThisSale)
                additionOfRevenuejune += totalPriceEarnedFromThisSale
            }
        }
        //console.log("addition of price june after the sales only", additionOfRevenuejune)
        //we are now addding the revenue by repairs in it as well
        for (const repairSale of juneRepairs) {
            let repairPrice = repairSale.repairCost
            additionOfRevenuejune += parseInt(repairPrice, 10)
        }
        //console.log("addition of price june after the sales and repair both", additionOfRevenuejune)
        juneObject.totalSale = additionOfRevenuejune
        allDataArray[5] = juneObject
        //
        //
        let additionOfRevenuejuly = 0
        for (const sale of july) {
            //for first sale we will fetch the productId and search for it

            const correspondingProduct = await Product.findOne({ productId: sale.productId })
            if (correspondingProduct) {
                const priceOfCorrespondingProduct = correspondingProduct.price
                //console.log(`price of corresponding product of this - ${sale}`, priceOfCorrespondingProduct)

                const totalPriceEarnedFromThisSale = parseInt(priceOfCorrespondingProduct, 10) * parseInt(sale.quantity, 10)
                //console.log("totalpriceearned", totalPriceEarnedFromThisSale)
                additionOfRevenuejuly += totalPriceEarnedFromThisSale
            }
        }
        //console.log("addition of price july after the sales only", additionOfRevenuejuly)
        //we are now addding the revenue by repairs in it as well
        for (const repairSale of julyRepairs) {
            let repairPrice = repairSale.repairCost
            additionOfRevenuejuly += parseInt(repairPrice, 10)
        }
        //console.log("addition of price july after the sales and repair both", additionOfRevenuejuly)
        julyObject.totalSale = additionOfRevenuejuly
        allDataArray[6] = julyObject
        //
        //
        let additionOfRevenueaugust = 0
        for (const sale of august) {
            //for first sale we will fetch the productId and search for it

            const correspondingProduct = await Product.findOne({ productId: sale.productId })
            if (correspondingProduct) {
                const priceOfCorrespondingProduct = correspondingProduct.price
                //console.log(`price of corresponding product of this - ${sale}`, priceOfCorrespondingProduct)

                const totalPriceEarnedFromThisSale = parseInt(priceOfCorrespondingProduct, 10) * parseInt(sale.quantity, 10)
                //console.log("totalpriceearned", totalPriceEarnedFromThisSale)
                additionOfRevenueaugust += totalPriceEarnedFromThisSale
            }
        }
        //console.log("addition of price august after the sales only", additionOfRevenueaugust)
        //we are now addding the revenue by repairs in it as well
        for (const repairSale of augustRepairs) {
            let repairPrice = repairSale.repairCost
            additionOfRevenueaugust += parseInt(repairPrice, 10)
        }
        //console.log("addition of price august after the sales and repair both", additionOfRevenueaugust)
        augustObject.totalSale = additionOfRevenueaugust
        allDataArray[7] = augustObject
        //
        //
        let additionOfRevenueseptember = 0
        for (const sale of september) {
            //for first sale we will fetch the productId and search for it

            const correspondingProduct = await Product.findOne({ productId: sale.productId })
            if (correspondingProduct) {
                const priceOfCorrespondingProduct = correspondingProduct.price
                //console.log(`price of corresponding product of this - ${sale}`, priceOfCorrespondingProduct)

                const totalPriceEarnedFromThisSale = parseInt(priceOfCorrespondingProduct, 10) * parseInt(sale.quantity, 10)
                //console.log("totalpriceearned", totalPriceEarnedFromThisSale)
                additionOfRevenueseptember += totalPriceEarnedFromThisSale
            }
        }
        //console.log("addition of price september after the sales only", additionOfRevenueseptember)
        //we are now addding the revenue by repairs in it as well
        for (const repairSale of septemberRepairs) {
            let repairPrice = repairSale.repairCost
            additionOfRevenueseptember += parseInt(repairPrice, 10)
        }
        //console.log("addition of price september after the sales and repair both", additionOfRevenueseptember)
        septemberObject.totalSale = additionOfRevenueseptember
        allDataArray[8] = septemberObject
        //
        //
        let additionOfRevenueoctober = 0
        for (const sale of october) {
            //for first sale we will fetch the productId and search for it

            const correspondingProduct = await Product.findOne({ productId: sale.productId })
            if (correspondingProduct) {
                const priceOfCorrespondingProduct = correspondingProduct.price
                //console.log(`price of corresponding product of this - ${sale}`, priceOfCorrespondingProduct)

                const totalPriceEarnedFromThisSale = parseInt(priceOfCorrespondingProduct, 10) * parseInt(sale.quantity, 10)
                //console.log("totalpriceearned", totalPriceEarnedFromThisSale)
                additionOfRevenueoctober += totalPriceEarnedFromThisSale
            }
        }
        //console.log("addition of price october after the sales only", additionOfRevenueoctober)
        //we are now addding the revenue by repairs in it as well
        for (const repairSale of octoberRepairs) {
            let repairPrice = repairSale.repairCost
            additionOfRevenueoctober += parseInt(repairPrice, 10)
        }
        //console.log("addition of price october after the sales and repair both", additionOfRevenueoctober)
        octoberObject.totalSale = additionOfRevenueoctober
        allDataArray[9] = octoberObject
        //
        //
        let additionOfRevenuenovember = 0
        for (const sale of november) {
            //for first sale we will fetch the productId and search for it

            const correspondingProduct = await Product.findOne({ productId: sale.productId })
            if (correspondingProduct) {
                const priceOfCorrespondingProduct = correspondingProduct.price
                //console.log(`price of corresponding product of this - ${sale}`, priceOfCorrespondingProduct)

                const totalPriceEarnedFromThisSale = parseInt(priceOfCorrespondingProduct, 10) * parseInt(sale.quantity, 10)
                //console.log("totalpriceearned", totalPriceEarnedFromThisSale)
                additionOfRevenuenovember += totalPriceEarnedFromThisSale
            }
        }
        //console.log("addition of price november after the sales only", additionOfRevenuenovember)
        //we are now addding the revenue by repairs in it as well
        for (const repairSale of novemberRepairs) {
            let repairPrice = repairSale.repairCost
            additionOfRevenuenovember += parseInt(repairPrice, 10)
        }
        //console.log("addition of price november after the sales and repair both", additionOfRevenuenovember)
        novemberObject.totalSale = additionOfRevenuenovember
        allDataArray[10] = novemberObject
        //
        //
        let additionOfRevenuedecember = 0
        for (const sale of december) {
            //for first sale we will fetch the productId and search for it

            const correspondingProduct = await Product.findOne({ productId: sale.productId })
            if (correspondingProduct) {
                const priceOfCorrespondingProduct = correspondingProduct.price
                //console.log(`price of corresponding product of this - ${sale}`, priceOfCorrespondingProduct)

                const totalPriceEarnedFromThisSale = parseInt(priceOfCorrespondingProduct, 10) * parseInt(sale.quantity, 10)
                //console.log("totalpriceearned", totalPriceEarnedFromThisSale)
                additionOfRevenuedecember += totalPriceEarnedFromThisSale
            }
        }
        //console.log("addition of price december after the sales only", additionOfRevenuedecember)
        //we are now addding the revenue by repairs in it as well
        for (const repairSale of decemberRepairs) {
            let repairPrice = repairSale.repairCost
            additionOfRevenuedecember += parseInt(repairPrice, 10)
        }
        //console.log("addition of price december after the sales and repair both", additionOfRevenuedecember)
        decemberObject.totalSale = additionOfRevenuedecember
        allDataArray[11] = decemberObject

        console.log("ddddemapber obj", decemberObject)
        //
        //
        console.log("alldataarray after adding revenue", allDataArray)
        //
        //
        //
        //
        //now we are starting the logic of expenditure
        const januaryRawMaterials = [];
        const februaryRawMaterials = [];
        const marchRawMaterials = [];
        const aprilRawMaterials = [];
        const mayRawMaterials = [];
        const juneRawMaterials = [];
        const julyRawMaterials = [];
        const augustRawMaterials = [];
        const septemberRawMaterials = [];
        const octoberRawMaterials = [];
        const novemberRawMaterials = [];
        const decemberRawMaterials = [];

        const rawMaterials = await RawMaterial.find({})
        for (const rawMaterial of rawMaterials) {
            const rawMaterialDateStr = rawMaterial.initialStockDate.split("T")[0];
            console.log("rawmaterial date string", rawMaterialDateStr)
            switch (true) {
                case /-01-/.test(rawMaterialDateStr):
                    // January
                    //console.log("Raw material added in January:", rawMaterial);
                    januaryRawMaterials.push(rawMaterial);
                    break;
                case /-02-/.test(rawMaterialDateStr):
                    // February
                    //console.log("Raw material added in February:", rawMaterial);
                    februaryRawMaterials.push(rawMaterial);
                    break;
                case /-03-/.test(rawMaterialDateStr):
                    // March
                    //console.log("Raw material added in March:", rawMaterial);
                    marchRawMaterials.push(rawMaterial);
                    break;
                case /-04-/.test(rawMaterialDateStr):
                    // April
                    //console.log("Raw material added in April:", rawMaterial);
                    aprilRawMaterials.push(rawMaterial);
                    break;
                case /-05-/.test(rawMaterialDateStr):
                    // May
                    //console.log("Raw material added in May:", rawMaterial);
                    mayRawMaterials.push(rawMaterial);
                    break;
                case /-06-/.test(rawMaterialDateStr):
                    // June
                    //console.log("Raw material added in June:", rawMaterial);
                    juneRawMaterials.push(rawMaterial);
                    break;
                case /-07-/.test(rawMaterialDateStr):
                    // July
                    //console.log("Raw material added in July:", rawMaterial);
                    julyRawMaterials.push(rawMaterial);
                    break;
                case /-08-/.test(rawMaterialDateStr):
                    // August
                    //console.log("Raw material added in August:", rawMaterial);
                    augustRawMaterials.push(rawMaterial);
                    break;
                case /-09-/.test(rawMaterialDateStr):
                    // September
                    //console.log("Raw material added in September:", rawMaterial);
                    septemberRawMaterials.push(rawMaterial);
                    break;
                case /-10-/.test(rawMaterialDateStr):
                    // October
                    //console.log("Raw material added in October:", rawMaterial);
                    octoberRawMaterials.push(rawMaterial);
                    break;
                case /-11-/.test(rawMaterialDateStr):
                    // November
                    //console.log("Raw material added in November:", rawMaterial);
                    novemberRawMaterials.push(rawMaterial);
                    break;
                case /-12-/.test(rawMaterialDateStr):
                    // December
                    //console.log("Raw material added in December:", rawMaterial);
                    decemberRawMaterials.push(rawMaterial);
                    break;
                default:
                    // Handle cases where the month is not matched
                    //console.log("Raw material with unknown month:", rawMaterial);
                    break;
            }
        }
        //
        //writing the logic for jobworks here
        const januaryJobWorks = [];
        const februaryJobWorks = [];
        const marchJobWorks = [];
        const aprilJobWorks = [];
        const mayJobWorks = [];
        const juneJobWorks = [];
        const julyJobWorks = [];
        const augustJobWorks = [];
        const septemberJobWorks = [];
        const octoberJobWorks = [];
        const novemberJobWorks = [];
        const decemberJobWorks = [];

        const jobWorks = await JobWork.find({})
        for (const jobWorkSale of jobWorks) {
            const jobWorkSaleDateStr = jobWorkSale.givenDate.split("T")[0];
            console.log("jobWorkSale date string", jobWorkSaleDateStr)
            switch (true) {
                case /-01-/.test(jobWorkSaleDateStr):
                    // January
                    //console.log("Job work sale added in January:", jobWorkSale);
                    januaryJobWorks.push(jobWorkSale);
                    break;
                case /-02-/.test(jobWorkSaleDateStr):
                    // February
                    //console.log("Job work sale added in February:", jobWorkSale);
                    februaryJobWorks.push(jobWorkSale);
                    break;
                case /-03-/.test(jobWorkSaleDateStr):
                    // March
                    //console.log("Job work sale added in March:", jobWorkSale);
                    marchJobWorks.push(jobWorkSale);
                    break;
                case /-04-/.test(jobWorkSaleDateStr):
                    // April
                    //console.log("Job work sale added in April:", jobWorkSale);
                    aprilJobWorks.push(jobWorkSale);
                    break;
                case /-05-/.test(jobWorkSaleDateStr):
                    // May
                    //console.log("Job work sale added in May:", jobWorkSale);
                    mayJobWorks.push(jobWorkSale);
                    break;
                case /-06-/.test(jobWorkSaleDateStr):
                    // June
                    //console.log("Job work sale added in June:", jobWorkSale);
                    juneJobWorks.push(jobWorkSale);
                    break;
                case /-07-/.test(jobWorkSaleDateStr):
                    // July
                    //console.log("Job work sale added in July:", jobWorkSale);
                    julyJobWorks.push(jobWorkSale);
                    break;
                case /-08-/.test(jobWorkSaleDateStr):
                    // August
                    //console.log("Job work sale added in August:", jobWorkSale);
                    augustJobWorks.push(jobWorkSale);
                    break;
                case /-09-/.test(jobWorkSaleDateStr):
                    // September
                    //console.log("Job work sale added in September:", jobWorkSale);
                    septemberJobWorks.push(jobWorkSale);
                    break;
                case /-10-/.test(jobWorkSaleDateStr):
                    // October
                    //console.log("Job work sale added in October:", jobWorkSale);
                    octoberJobWorks.push(jobWorkSale);
                    break;
                case /-11-/.test(jobWorkSaleDateStr):
                    // November
                    //console.log("Job work sale added in November:", jobWorkSale);
                    novemberJobWorks.push(jobWorkSale);
                    break;
                case /-12-/.test(jobWorkSaleDateStr):
                    // December
                    //console.log("Job work sale added in December:", jobWorkSale);
                    decemberJobWorks.push(jobWorkSale);
                    break;
                default:
                    // Handle cases where the month is not matched
                    //console.log("Job work sale with unknown month:", jobWorkSale);
                    break;
            }
        }
        //
        //
        let additionOfExpensejanuary = 0
        // for (const rawmaterial of januaryRawMaterials) {
        //     let rawMaterialPrice = rawmaterial.price
        //     additionOfExpensejanuary += parseInt(rawMaterialPrice, 10)
        // }

        januaryRawMaterials.forEach((doc, index) => {
            let rawMaterialPrice = 0
            doc.rawMaterialEntryArray.forEach((item) => {
                rawMaterialPrice = +item.price
                console.log("price", rawMaterialPrice)
                console.log("added item", rawMaterialPrice)
                additionOfExpensejanuary += parseInt(rawMaterialPrice, 10)
            })
        })


        //console.log("addition of price january after the raw material only", additionOfExpensejanuary)
        //we are now addding the revenue by repairs in it as well
        for (const jobWork of januaryJobWorks) {
            let jobWorkPrice = jobWork.priceDecided
            additionOfExpensejanuary += parseInt(jobWorkPrice, 10)
        }
        //console.log("addition of expense january after the raw material and jobwork both", additionOfExpensejanuary)
        januaryObject.totalExpense = additionOfExpensejanuary
        januaryObject.totalProfit = januaryObject.totalSale - januaryObject.totalExpense
        allDataArray[0] = januaryObject
        //
        //
        let additionOfExpensefebruary = 0
        // for (const rawmaterial of februaryRawMaterials) {
        //     let rawMaterialPrice = rawmaterial.price
        //     additionOfExpensefebruary += parseInt(rawMaterialPrice, 10)
        // }

        februaryRawMaterials.forEach((doc, index) => {
            let rawMaterialPrice = 0
            doc.rawMaterialEntryArray.forEach((item) => {
                rawMaterialPrice = +item.price
                console.log("price", rawMaterialPrice)
                console.log("added item", rawMaterialPrice)
                additionOfExpensefebruary += parseInt(rawMaterialPrice, 10)
            })
        })




        //console.log("addition of price february after the raw material only", additionOfExpensefebruary)
        //we are now addding the revenue by repairs in it as well
        for (const jobWork of februaryJobWorks) {
            let jobWorkPrice = jobWork.priceDecided
            additionOfExpensefebruary += parseInt(jobWorkPrice, 10)
        }
        //console.log("addition of expense february after the raw material and jobwork both", additionOfExpensefebruary)
        februaryObject.totalExpense = additionOfExpensefebruary
        februaryObject.totalProfit = februaryObject.totalSale - februaryObject.totalExpense
        allDataArray[1] = februaryObject
        //
        //
        let additionOfExpensemarch = 0
        // for (const rawmaterial of marchRawMaterials) {
        //     let rawMaterialPrice = rawmaterial.price
        //     additionOfExpensemarch += parseInt(rawMaterialPrice, 10)
        // }


        marchRawMaterials.forEach((doc, index) => {
            let rawMaterialPrice = 0
            doc.rawMaterialEntryArray.forEach((item) => {
                rawMaterialPrice = +item.price
                console.log("price", rawMaterialPrice)
                console.log("added item", rawMaterialPrice)
                additionOfExpensemarch += parseInt(rawMaterialPrice, 10)
            })
        })





        //console.log("addition of price march after the raw material only", additionOfExpensemarch)
        //we are now addding the revenue by repairs in it as well
        for (const jobWork of marchJobWorks) {
            let jobWorkPrice = jobWork.priceDecided
            additionOfExpensemarch += parseInt(jobWorkPrice, 10)
        }
        //console.log("addition of expense march after the raw material and jobwork both", additionOfExpensemarch)
        marchObject.totalExpense = additionOfExpensemarch
        marchObject.totalProfit = marchObject.totalSale - marchObject.totalExpense
        allDataArray[2] = marchObject
        //
        //
        let additionOfExpenseapril = 0
        // for (const rawmaterial of aprilRawMaterials) {
        //     let rawMaterialPrice = rawmaterial.price
        //     additionOfExpenseapril += parseInt(rawMaterialPrice, 10)
        // }

        aprilRawMaterials.forEach((doc, index) => {
            let rawMaterialPrice = 0
            doc.rawMaterialEntryArray.forEach((item) => {
                rawMaterialPrice = +item.price
                console.log("price", rawMaterialPrice)
                console.log("added item", rawMaterialPrice)
                additionOfExpenseapril += parseInt(rawMaterialPrice, 10)
            })
        })




        //console.log("addition of price april after the raw material only", additionOfExpenseapril)
        //we are now addding the revenue by repairs in it as well
        for (const jobWork of aprilJobWorks) {
            let jobWorkPrice = jobWork.priceDecided
            additionOfExpenseapril += parseInt(jobWorkPrice, 10)
        }
        //console.log("addition of expense april after the raw material and jobwork both", additionOfExpenseapril)
        aprilObject.totalExpense = additionOfExpenseapril
        aprilObject.totalProfit = aprilObject.totalSale - aprilObject.totalExpense
        allDataArray[3] = aprilObject
        //
        //
        let additionOfExpensemay = 0
        // for (const rawmaterial of mayRawMaterials) {
        //     let rawMaterialPrice = rawmaterial.price
        //     additionOfExpensemay += parseInt(rawMaterialPrice, 10)
        // }

        mayRawMaterials.forEach((doc, index) => {
            let rawMaterialPrice = 0
            doc.rawMaterialEntryArray.forEach((item) => {
                rawMaterialPrice = +item.price
                console.log("price", rawMaterialPrice)
                console.log("added item", rawMaterialPrice)
                additionOfExpensemay += parseInt(rawMaterialPrice, 10)
            })
        })




        //console.log("addition of price may after the raw material only", additionOfExpensemay)
        //we are now addding the revenue by repairs in it as well
        for (const jobWork of mayJobWorks) {
            let jobWorkPrice = jobWork.priceDecided
            additionOfExpensemay += parseInt(jobWorkPrice, 10)
        }
        //console.log("addition of expense may after the raw material and jobwork both", additionOfExpensemay)
        mayObject.totalExpense = additionOfExpensemay
        mayObject.totalProfit = mayObject.totalSale - mayObject.totalExpense
        allDataArray[4] = mayObject
        //
        //
        let additionOfExpensejune = 0
        // for (const rawmaterial of juneRawMaterials) {
        //     let rawMaterialPrice = rawmaterial.price
        //     additionOfExpensejune += parseInt(rawMaterialPrice, 10)
        // }

        juneRawMaterials.forEach((doc, index) => {
            let rawMaterialPrice = 0
            doc.rawMaterialEntryArray.forEach((item) => {
                rawMaterialPrice = +item.price
                console.log("price", rawMaterialPrice)
                console.log("added item", rawMaterialPrice)
                additionOfExpensejune += parseInt(rawMaterialPrice, 10)
            })
        })


        //console.log("addition of price june after the raw material only", additionOfExpensejune)
        //we are now addding the revenue by repairs in it as well
        for (const jobWork of juneJobWorks) {
            let jobWorkPrice = jobWork.priceDecided
            additionOfExpensejune += parseInt(jobWorkPrice, 10)
        }
        //console.log("addition of expense june after the raw material and jobwork both", additionOfExpensejune)
        juneObject.totalExpense = additionOfExpensejune
        juneObject.totalProfit = juneObject.totalSale - juneObject.totalExpense
        allDataArray[5] = juneObject
        //
        //
        let additionOfExpensejuly = 0
        // for (const rawmaterial of julyRawMaterials) {
        //     let rawMaterialPrice = rawmaterial.price
        //     additionOfExpensejuly += parseInt(rawMaterialPrice, 10)
        // }

        julyRawMaterials.forEach((doc, index) => {
            let rawMaterialPrice = 0
            doc.rawMaterialEntryArray.forEach((item) => {
                rawMaterialPrice = +item.price
                console.log("price", rawMaterialPrice)
                console.log("added item", rawMaterialPrice)
                additionOfExpensejuly += parseInt(rawMaterialPrice, 10)
            })
        })
        //console.log("addition of price july after the raw material only", additionOfExpensejuly)
        //we are now addding the revenue by repairs in it as well
        for (const jobWork of julyJobWorks) {
            let jobWorkPrice = jobWork.priceDecided
            additionOfExpensejuly += parseInt(jobWorkPrice, 10)
        }
        //console.log("addition of expense july after the raw material and jobwork both", additionOfExpensejuly)
        julyObject.totalExpense = additionOfExpensejuly
        julyObject.totalProfit = julyObject.totalSale - julyObject.totalExpense
        allDataArray[6] = julyObject
        //
        //
        let additionOfExpenseaugust = 0
        // for (const rawmaterial of augustRawMaterials) {
        //     let rawMaterialPrice = rawmaterial.price
        //     additionOfExpenseaugust += parseInt(rawMaterialPrice, 10)
        // }

        // let additionOfExpenseseptember = 0
        augustRawMaterials.forEach((doc, index) => {
            let rawMaterialPrice = 0
            doc.rawMaterialEntryArray.forEach((item) => {
                rawMaterialPrice = +item.price
                console.log("price", rawMaterialPrice)
                console.log("added item", rawMaterialPrice)
                additionOfExpenseaugust += parseInt(rawMaterialPrice, 10)
            })
        })


        //console.log("addition of price august after the raw material only", additionOfExpenseaugust)
        //we are now addding the revenue by repairs in it as well
        for (const jobWork of augustJobWorks) {
            let jobWorkPrice = jobWork.priceDecided
            additionOfExpenseaugust += parseInt(jobWorkPrice, 10)
        }
        //console.log("addition of expense august after the raw material and jobwork both", additionOfExpenseaugust)
        augustObject.totalExpense = additionOfExpenseaugust
        augustObject.totalProfit = augustObject.totalSale - augustObject.totalExpense
        allDataArray[7] = augustObject
        //
        //

        // let additionOfExpenseseptember = 0
        // for (const rawmaterial of septemberRawMaterials) {
        //     let rawMaterialPrice = rawmaterial.price
        //     additionOfExpenseseptember += parseInt(rawMaterialPrice, 10)
        // }

        let additionOfExpenseseptember = 0
        septemberRawMaterials.forEach((doc, index) => {
            let rawMaterialPrice = 0
            doc.rawMaterialEntryArray.forEach((item) => {
                rawMaterialPrice = +item.price
                console.log("price", rawMaterialPrice)
                console.log("added item", rawMaterialPrice)
                additionOfExpenseseptember += parseInt(rawMaterialPrice, 10)
            })
        })



        //console.log("addition of price september after the raw material only", additionOfExpenseseptember)
        //we are now addding the revenue by repairs in it as well
        for (const jobWork of septemberJobWorks) {
            let jobWorkPrice = jobWork.priceDecided
            additionOfExpenseseptember += parseInt(jobWorkPrice, 10)
        }
        //console.log("addition of expense september after the raw material and jobwork both", additionOfExpenseseptember)
        septemberObject.totalExpense = additionOfExpenseseptember
        septemberObject.totalProfit = septemberObject.totalSale - septemberObject.totalExpense
        allDataArray[8] = septemberObject
        //
        //
        // let additionOfExpenseoctober = 0
        // for (const rawmaterial of octoberRawMaterials) {
        //     let rawMaterialPrice = rawmaterial.price
        //     additionOfExpenseoctober += parseInt(rawMaterialPrice, 10)
        // }

        let additionOfExpenseoctober = 0
        octoberRawMaterials.forEach((doc, index) => {
            let rawMaterialPrice = 0
            doc.rawMaterialEntryArray.forEach((item) => {
                rawMaterialPrice = +item.price
                console.log("price", rawMaterialPrice)
                console.log("added item", rawMaterialPrice)
                additionOfExpenseoctober += parseInt(rawMaterialPrice, 10)
            })
        })




        //console.log("addition of price october after the raw material only", additionOfExpenseoctober)
        //we are now addding the revenue by repairs in it as well


        for (const jobWork of octoberJobWorks) {
            let jobWorkPrice = jobWork.priceDecided
            additionOfExpenseoctober += parseInt(jobWorkPrice, 10)
        }




        //console.log("addition of expense october after the raw material and jobwork both", additionOfExpenseoctober)
        octoberObject.totalExpense = additionOfExpenseoctober
        octoberObject.totalProfit = octoberObject.totalSale - octoberObject.totalExpense
        allDataArray[9] = octoberObject
        //
        //
        // console.log("nov data" , novemberRawMaterials)

        // for (const rawmaterial of novemberRawMaterials) {
        //     let rawMaterialPrice = rawmaterial.price

        //     console.log("price" , rawmaterial.rawMaterialEntryArray)

        //     console.log(rawMaterialPrice)
        //     additionOfExpensenovember += parseInt(rawMaterialPrice, 10)

        //     console.log("add exp 1" ,additionOfExpensenovember )
        // }
        let additionOfExpensenovember = 0
        novemberRawMaterials.forEach((doc, index) => {
            let rawMaterialPrice = 0
            doc.rawMaterialEntryArray.forEach((item) => {
                rawMaterialPrice = +item.price

                additionOfExpensenovember += parseInt(rawMaterialPrice, 10)
            })

            console.log("additional exp", additionOfExpensenovember)

        })



        //console.log("addition of price november after the raw material only", additionOfExpensenovember)
        //we are now addding the revenue by repairs in it as well
        for (const jobWork of novemberJobWorks) {
            let jobWorkPrice = jobWork.priceDecided
            additionOfExpensenovember += parseInt(jobWorkPrice, 10)
        }
        //console.log("addition of expense november after the raw material and jobwork both", additionOfExpensenovember)
        novemberObject.totalExpense = additionOfExpensenovember
        // console.log("total exprens" , additionOfExpensenovember)
        novemberObject.totalProfit = novemberObject.totalSale - novemberObject.totalExpense
        // console.log("nov data" , novemberObject)
        allDataArray[10] = novemberObject
        //
        //
        // let additionOfExpensedecember = 0
        // for (const rawmaterial of decemberRawMaterials) {
        //     let rawMaterialPrice = rawmaterial.price
        //     additionOfExpensedecember += parseInt(rawMaterialPrice, 10)
        // }

        let additionOfExpensedecember = 0
        decemberRawMaterials.forEach((doc, index) => {
            let rawMaterialPrice = 0
            doc.rawMaterialEntryArray.forEach((item) => {
                rawMaterialPrice = +item.price
                console.log("price", rawMaterialPrice)
                console.log("added item", rawMaterialPrice)
                additionOfExpensedecember += parseInt(rawMaterialPrice, 10)
            })
        })





        //console.log("addition of price december after the raw material only", additionOfExpensedecember)
        //we are now addding the revenue by repairs in it as well
        for (const jobWork of decemberJobWorks) {
            let jobWorkPrice = jobWork.priceDecided
            additionOfExpensedecember += parseInt(jobWorkPrice, 10)

        }
        //console.log("addition of expense december after the raw material and jobwork both", additionOfExpensedecember)
        decemberObject.totalExpense = additionOfExpensedecember

        decemberObject.totalProfit = decemberObject.totalSale - decemberObject.totalExpense

        allDataArray[11] = decemberObject
        //
        //
        console.log("alldataarray after adding revenue and expenditure both", allDataArray)
        res.status(200).send(allDataArray);
    } catch (error) {
        console.log("error", error.message);
        res.status(500).send(`error occured-${error.message}`)
    }
});
module.exports = router;