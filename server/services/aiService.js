// server/services/aiService.js
const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  async predictDisease(symptoms) {
    try {
      const prompt = `
Suppose you are an Indian doctor. Based on the following symptoms, strictly reply in this format:

Predicted Disease: [Disease Name]
Medicines Preferred: [List of Medicines]

Symptoms: ${symptoms.join(", ")}
`;

      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      throw new Error('AI service unavailable');
    }
  }

  async getHomeRemedies(disease) {
    try {
      const prompt = `
Suppose you are an Ayurvedic expert. Based on the following disease, provide Ayurvedic home remedies:

Disease: ${disease}
Provide remedies in a structured format with clear sections.
`;

      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      throw new Error('AI service unavailable');
    }
  }
}

module.exports = new AIService();