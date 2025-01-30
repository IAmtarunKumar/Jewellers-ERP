//import dependencies
const axios = require('axios');  

//openAiCompletion function
const openAiCompletion = async (prompt) => {

    //post request openai Url
    let reqUrl = 'https://api.openai.com/v1/chat/completions';
    
    //openai post request headers
    let reqHeaders = {
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };
    
    //openai post request body
    let reqBody = {
        "model": "gpt-4",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": 150,
        "temperature": 0.5,
    }

    //error handling
    try {
        //openai post request 
        let response = await axios.post(reqUrl, reqBody, reqHeaders);
        return response;
    } catch (error) {
        //handling error
        console.error("OpenAI Error:", error.response.data);
        throw error;
    }
}

//export openaiCompletion function to reuse it multiple times
module.exports = openAiCompletion;