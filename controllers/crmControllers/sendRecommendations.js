//import all required dependencies
const Product = require('../../models/product');
const openAiCompletion = require('../../utils/openai');
const twilioClient = require('../../utils/twilio');
const { Customer } = require('../../models/customer');

async function sendRecommendations() {
    //search in a users collection to find all users
    const customers = await Customer.find({});
    console.log("customers", customers)
    //find out all products are available
    const Products = await Product.find({});

    //extract all product name from product collections
    let availableProducts = Products.map(product => product.productName).join(', ');

    //traverse all user one by one and send recommendation message to whatsapp
    for (let customer of customers) {

        //get user purchase history what user purchase
        if (customer.customerBought.length === 0 || customer.customerBought === null || !customer.customerBought) continue;

        let customerPurchaseHistory = customer.customerBought.map(object => object.productName).join(', ');

        //creating prompt to send openai
        let prompt = `Based on the previous purchase history of the user, which includes: ${customerPurchaseHistory}, and considering these available products in the store: ${availableProducts}, recommend one product to me.`;
        
        //getting response from openai from passing prompt
        let response = await openAiCompletion(prompt)

        //extract message from openai response
        let recommendation = response.data.choices[0].message.content;
        console.log("recommendation", recommendation)

        //generating message that sent to user whatsapp number
        let message = `Hello ${customer.name}! Based on your preferences, we recommend the new collection of ${recommendation}. Discover more at our store!`;
        console.log("message", message)
        //send message to user whatsapp number using twilio client
        await twilioClient.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:+91${customer.contact}`
        });
    }
}

//export this function so that reuse this code multiple times
module.exports = sendRecommendations;