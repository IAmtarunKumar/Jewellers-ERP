const { PineconeClient } = require("@pinecone-database/pinecone");
const axios = require("axios");

async function get_embedding(text) {
    try {
        const embedding = await axios.post(
            "http://139.84.168.68:12000/get-embeddings",
            { text: text }
        );
        // console.log(embedding.data.data)
        return embedding.data.data;
    } catch (error) {
        console.error(error);
    }
}
async function get_top_intent(user_input) {
    const pinecone = new PineconeClient();
    //  await pinecone.init({
    //   environment: "asia-southeast1-gcp",
    //  apiKey: "560e2a4e-1bc4-49b8-bef4-f47f4fc38959",
    // });
    await pinecone.init({
        environment: "gcp-starter", //veer api key
        apiKey: "82e8981f-8da7-4b19-8e3c-10bc444104f9", //veer api key
    });

    const pineconeIndex = pinecone.Index("intent-selection");
    const user_input_embedding = await get_embedding(user_input);
    const top_n_intents = 1;
    const queryRequest = {
        vector: user_input_embedding,
        topK: top_n_intents,
        includeValues: true,
    };
    const queryResponse = await pineconeIndex.query({ queryRequest });
    //console.log("query-response",queryResponse);
    return queryResponse.matches[0];
}

// async function updateUserPreferences(sessionId, preferences) {
//   const collection = client.db("chatbot").collection("users");
//   await collection.updateOne(
//     { sessionId },
//     { $set: { preferences: preferences } }
//   );
// }

module.exports = get_top_intent;
