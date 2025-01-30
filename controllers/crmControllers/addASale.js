const { Customer } = require("../../models/customer");
const { Income } = require("../../models/income");
const Product = require("../../models/product");
const { Sales } = require("../../models/sales");

const { Liability } = require("../../models/liabilities");




const addSale = async (req, res) => {
  console.log("logging what came in body", req.body);
  const { customerId, productId, quantity, gst } = req.body;
  try {
    if (!customerId || !productId || !quantity)
      return res.status(400).send("Enter complete required Details!");
    const foundCustomer = await Customer.findOne({ customerId });
    if (!foundCustomer)
      return res
        .status(400)
        .send(
          "Customer with the desired ID is not found! Please get it checked!"
        );
    const foundProduct = await Product.findOne({ productId });
    console.log("foundProduct", foundProduct);
    if (!foundProduct)
      return res
        .status(400)
        .send(
          "Product with the desired ID is not found! Please get it checked!"
        );
    if (foundProduct.currentStock === "Define In CRM")
      return res
        .status(400)
        .send(
          "Cannot add a sale. Product stock is not updated. kindly update the current stock and try again later!"
        );
    //we change the product stock before adding a new sale
    const quantityNumber = parseInt(quantity, 10);
    console.log("quantitynumber", quantityNumber);
    console.log("founcproductcurrentstock", foundProduct.currentStock);
    const currentQuantity = parseInt(foundProduct.currentStock, 10);
    console.log("currentquantitu", currentQuantity);
    const updatedQuantity = currentQuantity - quantityNumber;
    console.log("updatedQuantity", updatedQuantity);
    if (updatedQuantity < 0)
      return res
        .status(400)
        .send(
          "Cannot add a sale. Stock is not sufficient as per your sale needs! you need to add more products."
        );
    updatedQuantity.toString(); //converting it to string again before updating
    console.log("updatedQuantityaftertostring", updatedQuantity);

    const updatedProduct = await Product.findOneAndUpdate(
      { productId },
      {
        $set: {
          currentStock: updatedQuantity,
        },
      },
      { new: true }
    );
    console.log("updated product", updatedProduct);
    const date = new Date();


    // Format the date as a string in the desired format
    const formattedDate = date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    console.log(formattedDate);
    //we are updating customerBoughtSchema
    let customerBoughtArray = [];
    customerBoughtArray = foundCustomer.customerBought;
    console.log("customerbought", customerBoughtArray);
    if (customerBoughtArray === undefined) {
      console.log("yes we are in this");
      customerBoughtArray = [];
    }

    const object = {};
    object.productName = foundProduct.productName;
    object.productDescription = foundProduct.productDescription;
    object.dateBought = formattedDate;
    object.productQty = quantity;
    console.log("customer bought array before pushing", customerBoughtArray);
    customerBoughtArray.push(object);

    console.log(
      "logging the array before updating the customer".customerBoughtArray
    );
    const updatedCustomer = await Customer.findOneAndUpdate(
      { customerId },
      {
        $set: {
          customerBought: customerBoughtArray,
        },
      },
      { new: true }
    );
    console.log("updated customer", updatedCustomer);
    const newSale = Sales({
      customerId,
      productId,
      quantity,
      saleDate: formattedDate,
    });
    await newSale.save();
    //
    // tarun code reviewed by D
    const getProduct = await Product.findOne({ productId }) //first we are getting product via product ID
    console.log("get product by product id", getProduct)
    console.log("product price", getProduct.price)

    if (!getProduct)
      return res
        .status(400)
        .send(
          "Product with the desired ID is not found! Please get it checked!"
        );
    const creditedPrice = getProduct.price * quantity


    //find customer with customer id
    // partyName 
    const getCustomer = await Customer.findOne({ customerId })
    console.log("get customer", getCustomer)
    console.log("partyName", getCustomer.name)
    if (!getCustomer)
      return res
        .status(400)
        .send(
          "Customer with the desired ID is not found! Please get it checked!"
        );

    const customerName = getCustomer.name



    //////
    const allIncomes = await Income.find()

    if (!allIncomes || allIncomes.length === 0) {
      const newIncome = new Income({ type: "Sales", date: formattedDate, credit: creditedPrice, balance: creditedPrice, receivedBy: "Own", partyName: customerName, reference: "Other", picture: picture2 });
      await newIncome.save();

      return res.status(200).send("the Sale has been added successfully!");
    }


    console.log("show all incomes", allIncomes)
    let lastBalance
    //last expense bal
    if (allIncomes[allIncomes.length - 1].balance) {
      lastBalance = +(allIncomes[allIncomes.length - 1].balance)
    } else {
      lastBalance = 0
    }
    const newBalance = lastBalance + +creditedPrice
    console.log("newbal", newBalance)
    const newIncome = Income({
      // add Data work is done 

      type: "Sales",
      date: formattedDate, // You should use the appropriate date format
      debit: "",
      credit: creditedPrice,
      balance: newBalance,
      receivedBy: "Own",
      givenTo: "",
      partyName: customerName,
      reference: "Other",
      description: "",
      picture: ""


    });
    await newIncome.save();

    /////////////////////////////////////////////
    //code by tarun
    //add in duty and taxes

    const allLaibility = await Liability.find()

    if (!allLaibility || allLaibility.length === 0) {
      const newLiability = new Liability({ type: "Duty and taxes", date: formattedDate, debit: gst, balance: -`${gst}`, receivedBy: "Own", partyName: customerName, reference: "Other", picture: picture2 });
      await newLiability.save();

      return res.status(200).send("the Duty and Taxes has been added successfully!");
    }


    console.log("show all liablity", allLaibility)
    const lastLiabilityBalance = +(allLaibility[allLaibility.length - 1].balance)
    console.log("last bal", lastLiabilityBalance)
    const newLabilityBalance = lastLiabilityBalance - +gst
    console.log("newbal", newLabilityBalance)
    const newLiability = new Liability({
      // add Data work is done 

      type: "Duty and taxes",
      date: formattedDate, // You should use the appropriate date format
      debit: gst,
      credit: "",
      balance: newLabilityBalance,
      receivedBy: "Own",
      givenTo: "",
      partyName: customerName,
      reference: "Other",
      description: "",
      picture: ""


    });
    await newLiability.save();


    /////////////////////////////////////////

    //
    //end
    //
    //
    return res.status(200).send("the Sale has been added successfully!");
  } catch (error) {
    console.log("something went wrong", error.message);
    return res.status(500).send(`internal server error - ${error.message}`);
  }
};
module.exports = addSale;
