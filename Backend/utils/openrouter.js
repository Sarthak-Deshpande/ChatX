import 'dotenv/config';

const getOpenRouterAPIResponse = async (messages) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
            model: "cohere/north-mini-code:free",
            messages: messages
        })
    };

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
        const data = await response.json();
        return data.choices[0].message.content;
    }
    catch (err) {
        console.error(err);
        throw err; 
    }
}

export default getOpenRouterAPIResponse;