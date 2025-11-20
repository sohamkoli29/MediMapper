import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Helper function to call Gemini API with concise output
const callGeminiAPI = async (prompt) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await axios.post(API_URL, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800, // Reduced from 5024 to limit response length
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000 // Reduced timeout
    });

    if (response.data && response.data.candidates && response.data.candidates[0]) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error(`AI service error: ${error.response?.data?.error?.message || error.message}`);
  }
};

// AI Symptom Checker - CONCISE VERSION
router.post('/symptom-checker', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Symptoms array is required'
      });
    }

    const prompt = `
Briefly analyze these symptoms: ${symptoms.join(', ')}

Respond in this exact format:
**Possible Conditions:** [2-3 most likely conditions]
**Immediate Actions:** [2-3 key recommendations]
**See Doctor If:** [2-3 warning signs]

Keep response under 150 words. Be direct and practical.
    `;

    const analysis = await callGeminiAPI(prompt);

    res.json({
      success: true,
      analysis: analysis.trim(),
      symptoms: symptoms.join(', ')
    });

  } catch (error) {
    console.error('Symptom checker error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error in AI service'
    });
  }
});

// Home Remedies - CONCISE VERSION
router.post('/home-remedies', async (req, res) => {
  try {
    const { disease } = req.body;

    if (!disease) {
      return res.status(400).json({
        success: false,
        message: 'Disease name is required'
      });
    }

    const prompt = `
Provide 3-4 simple home remedies for: ${disease}

Format:
**Top Remedies:** [3-4 bullet points max]
**Diet Tips:** [2-3 food suggestions]
**Avoid:** [2-3 things to avoid]

Keep under 120 words. Focus on common household items.
    `;

    const remedies = await callGeminiAPI(prompt);

    res.json({
      success: true,
      remedies: remedies.trim()
    });

  } catch (error) {
    console.error('Home remedies error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error in AI service'
    });
  }
});

// Report Analysis - CONCISE VERSION
router.post('/report-analysis', async (req, res) => {
  try {
    const { reportText, reportType = 'general' } = req.body;

    if (!reportText) {
      return res.status(400).json({
        success: false,
        message: 'Report text is required'
      });
    }

    const prompt = `
Briefly analyze this medical report: ${reportText.substring(0, 500)}

Format:
**Key Findings:** [2-3 main points]
**Next Steps:** [2-3 actions]
**Consult Doctor For:** [2-3 specific concerns]

Keep under 100 words. Be clear and actionable.
    `;

    const analysis = await callGeminiAPI(prompt);

    res.json({
      success: true,
      analysis: analysis.trim(),
      reportType: reportType
    });

  } catch (error) {
    console.error('Report analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error in AI service'
    });
  }
});

// Expert Chat - CONCISE VERSION
router.post('/expert-chat', async (req, res) => {
  try {
    const { message, expertType, conversationHistory = [] } = req.body;

    if (!message || !expertType) {
      return res.status(400).json({
        success: false,
        message: 'Message and expert type are required'
      });
    }

    // Expert-specific concise prompts
    const expertPrompts = {
      medical: `As a medical expert, give brief, practical advice. Focus on 2-3 key points. Keep under 100 words.`,
      ayurvedic: `As an Ayurvedic expert, suggest 2-3 simple remedies. Use common ingredients. Keep under 100 words.`,
      nutrition: `As a nutritionist, give 2-3 dietary tips. Be practical. Keep under 100 words.`,
      mental_health: `As a mental health expert, offer 2-3 supportive strategies. Be empathetic but concise. Under 100 words.`
    };

    const systemPrompt = expertPrompts[expertType] || expertPrompts.medical;

    const fullPrompt = `
${systemPrompt}

User question: ${message}

Respond briefly and helpfully:
    `;

    const response = await callGeminiAPI(fullPrompt);

    res.json({
      success: true,
      response: response.trim(),
      expertType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Expert chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error in expert chat service'
    });
  }
});

// Health Chat - CONCISE VERSION
router.post('/health-chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const prompt = `
Answer this health question briefly: "${message}"

Provide 2-3 key points maximum. Keep response under 80 words. Be direct and helpful.
    `;

    const response = await callGeminiAPI(prompt);

    res.json({
      success: true,
      response: response.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Health chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error in AI chat service'
    });
  }
});

// Mental Health Support - CONCISE VERSION
router.post('/mental-health-support', async (req, res) => {
  try {
    const { issue, severity = 'mild' } = req.body;

    if (!issue) {
      return res.status(400).json({
        success: false,
        message: 'Issue description is required'
      });
    }

    const prompt = `
Provide brief mental health support for: ${issue}

Give 2-3 practical coping strategies. Keep under 100 words. Be supportive but concise.
    `;

    const support = await callGeminiAPI(prompt);

    res.json({
      success: true,
      support: support.trim(),
      severity: severity
    });

  } catch (error) {
    console.error('Mental health support error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error in mental health support service'
    });
  }
});

export default router;