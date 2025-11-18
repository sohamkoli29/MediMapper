import express from 'express';
import axios from 'axios';

const router = express.Router();

// AI Symptom Checker
router.post('/symptom-checker', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Symptoms array is required'
      });
    }

    // For now, return mock data since we don't have Gemini API key
    // In production, you would call the Gemini API here
    const mockResponse = `
Predicted Disease: Common Cold
Medicines Preferred: 
- Paracetamol 500mg (for fever and pain)
- Chlorpheniramine (for runny nose)
- Guaifenesin (for cough)

Recommended Actions:
1. Get plenty of rest
2. Drink warm fluids
3. Use a humidifier
4. Gargle with warm salt water

Note: This is AI-generated advice. Please consult a doctor for proper diagnosis.
    `;

    // Simulate API delay
    setTimeout(() => {
      res.json({
        success: true,
        analysis: mockResponse.trim(),
        symptoms: symptoms.join(', ')
      });
    }, 1000);

  } catch (error) {
    console.error('Symptom checker error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error in AI service'
    });
  }
});

// Home Remedies
router.post('/home-remedies', async (req, res) => {
  try {
    const { disease } = req.body;

    if (!disease) {
      return res.status(400).json({
        success: false,
        message: 'Disease name is required'
      });
    }

    // Mock response for home remedies
    const mockRemedies = `
Disease: ${disease}
Ayurvedic Remedies (Step-by-Step):
1. Drink warm water with honey and lemon
2. Use turmeric in warm milk
3. Practice steam inhalation with eucalyptus oil
4. Apply ginger paste on forehead for headaches

Dietary Recommendations:
- Eat light, easily digestible foods
- Include plenty of fruits and vegetables
- Drink herbal teas (chamomile, ginger)
- Avoid cold and processed foods

Lifestyle Advice:
- Get adequate sleep
- Practice deep breathing exercises
- Maintain proper hygiene
- Stay hydrated throughout the day

Disclaimer: These are general suggestions. Consult a healthcare professional for personalized advice.
    `;

    // Simulate API delay
    setTimeout(() => {
      res.json({
        success: true,
        remedies: mockRemedies.trim()
      });
    }, 1000);

  } catch (error) {
    console.error('Home remedies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error in AI service'
    });
  }
});

// Report Analysis (Mock)
router.post('/report-analysis', async (req, res) => {
  try {
    const { reportText } = req.body;

    if (!reportText) {
      return res.status(400).json({
        success: false,
        message: 'Report text is required'
      });
    }

    const mockAnalysis = `
Report Analysis Summary:

Key Findings:
- Normal blood pressure range
- Slightly elevated cholesterol levels
- Healthy blood sugar levels

Recommendations:
- Diet you should follow: Low-fat, high-fiber diet with plenty of vegetables
- Medicine: Consider cholesterol medication if levels don't improve in 3 months
- Exercise: 30 minutes of moderate exercise daily

Follow-up:
- Schedule next checkup in 6 months
- Monitor blood pressure weekly
- Maintain healthy lifestyle habits

Note: This analysis is AI-generated. Please consult with your healthcare provider.
    `;

    setTimeout(() => {
      res.json({
        success: true,
        analysis: mockAnalysis.trim()
      });
    }, 1500);

  } catch (error) {
    console.error('Report analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error in AI service'
    });
  }
});

export default router;