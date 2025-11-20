import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Helper function to call Gemini API
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
        maxOutputTokens: 5024,
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000 // 30 seconds timeout
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

// AI Symptom Checker with Gemini
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
You are an experienced medical AI assistant. The user is experiencing the following symptoms: ${symptoms.join(', ')}

Please provide a comprehensive analysis in the following structured format:

**Possible Conditions:**
[List 2-3 most likely medical conditions based on the symptoms, ordered by probability]

**Recommended Actions:**
[Provide specific medical advice including:
- When to see a doctor immediately
- Self-care measures
- Warning signs to watch for]

**Medical Disclaimer:**
[Include a clear disclaimer that this is AI-generated advice and not a substitute for professional medical consultation]

Please be concise, accurate, and focus on practical advice. Use bullet points for readability.
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

// Home Remedies with Gemini
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
You are an Ayurvedic and natural remedies expert. The user is asking for home remedies for: ${disease}

Please provide comprehensive natural remedies in the following structured format:

**Ayurvedic Home Remedies:**
[Provide 3-5 specific, practical home remedies with step-by-step instructions]

**Dietary Recommendations:**
[Suggest foods to eat and avoid, including specific Indian dietary suggestions]

**Lifestyle Modifications:**
[Recommend daily routines, exercises, and lifestyle changes]

**Precautions & Warnings:**
[Include when to seek professional medical help and any contraindications]

**Medical Disclaimer:**
[Clearly state that these are traditional remedies and not a substitute for professional medical advice]

Focus on safe, evidence-based natural remedies commonly used in Indian households.
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

// Report Analysis with Gemini
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
You are a medical analysis AI. Analyze the following medical report and provide insights:

Medical Report:
${reportText}

Please provide analysis in this structured format:

**Report Summary:**
[Brief overview of key findings]

**Key Observations:**
[Highlight important values, patterns, or abnormalities]

**Clinical Interpretation:**
[Explain what the findings mean in simple terms]

**Recommended Next Steps:**
[Suggest specific actions including:
- Follow-up tests if needed
- Specialist consultations recommended
- Lifestyle changes
- Monitoring parameters]

**Questions for Healthcare Provider:**
[Suggest important questions the patient should ask their doctor]

**Medical Disclaimer:**
[Emphasize that this is AI analysis and professional medical consultation is essential]

Focus on clarity and actionable insights. Use simple language that patients can understand.
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

// New AI Chat Endpoint for General Health Queries
router.post('/health-chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Build context from conversation history
    const historyContext = conversationHistory
      .map(chat => `${chat.role}: ${chat.message}`)
      .join('\n');

    const prompt = `
You are MediMapper AI, a friendly and knowledgeable healthcare assistant. You're helping patients with their health queries.

Previous conversation:
${historyContext}

Current patient question: ${message}

Guidelines for your response:
- Be empathetic and supportive
- Provide accurate, evidence-based information
- Suggest consulting healthcare professionals when appropriate
- Use simple, clear language
- Include practical advice and next steps
- Always include a medical disclaimer

Please respond helpfully while maintaining professional boundaries.
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

// Mental Health Support Endpoint
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
You are a compassionate mental health first aid assistant. A user is experiencing: ${issue}

Severity level: ${severity}

Please provide support in this format:

**Immediate Coping Strategies:**
[Provide 3-5 practical techniques for immediate relief]

**Long-term Support:**
[Suggest ongoing practices and lifestyle changes]

**Professional Resources:**
[Recommend when and how to seek professional help]

**Crisis Support:**
[Include emergency contact information and crisis resources]

**Important Note:**
[Clearly state you're an AI and not a substitute for professional mental healthcare]

Be empathetic, non-judgmental, and focus on practical, actionable support.
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


// Add this route to your existing ai.js
router.post('/expert-chat', async (req, res) => {
  try {
    const { message, expertType, conversationHistory = [] } = req.body;

    if (!message || !expertType) {
      return res.status(400).json({
        success: false,
        message: 'Message and expert type are required'
      });
    }

    // Expert-specific prompts
    const expertPrompts = {
      medical: `You are an AI Medical Expert with advanced knowledge in medical diagnostics and treatment recommendations. 
Provide accurate, evidence-based medical advice while emphasizing the importance of consulting healthcare professionals for serious conditions.
Always include appropriate medical disclaimers.`,

      ayurvedic: `You are an AI Ayurvedic Expert with deep knowledge of traditional Ayurvedic medicine, herbal remedies, dosha balance, and holistic wellness practices. 
Provide guidance based on ancient Ayurvedic principles while emphasizing consultation with qualified practitioners for serious conditions.
Focus on natural remedies, dietary recommendations, and lifestyle modifications.`,

      nutrition: `You are an AI Nutritionist specializing in dietary planning, nutritional science, and healthy eating habits.
Provide personalized nutrition advice, meal planning suggestions, and evidence-based dietary recommendations.
Consider different dietary needs and preferences while emphasizing balanced nutrition.`,

      mental_health: `You are an AI Mental Health Expert providing supportive counseling, coping strategies, and mental wellbeing guidance.
Offer empathetic support, practical mental health strategies, and appropriate resources while emphasizing the importance of professional mental healthcare for serious conditions.
Be compassionate and non-judgmental in your responses.`
    };

    const systemPrompt = expertPrompts[expertType] || expertPrompts.medical;

    // Build context from conversation history
    const historyContext = conversationHistory
      .slice(-10)
      .map(chat => `${chat.role}: ${chat.message}`)
      .join('\n');

    const fullPrompt = `
${systemPrompt}

Previous conversation:
${historyContext}

Current user question: ${message}

Guidelines for your response:
- Be professional and empathetic
- Provide accurate, helpful information
- Include appropriate disclaimers
- Suggest professional consultation when needed
- Use clear, understandable language
- Keep responses concise but comprehensive

Please respond helpfully:
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
export default router;