const axios = require("axios");

const NLP_URL = "http://localhost:5001/analyze";


const analyzeText = async (text) => {

  // Ignore empty text
  if (!text || typeof text !== "string" || !text.trim()) {
    return null;
  }

  try {

    const response = await axios.post(
      NLP_URL,
      {
        text: text.trim()
      }
    );

    return response.data.result;

  } catch (error) {

    console.error(
      "NLP service error:",
      error.response?.status,
      error.response?.data || error.message
    );

    return null;
  }
};


module.exports = {
  analyzeText
};