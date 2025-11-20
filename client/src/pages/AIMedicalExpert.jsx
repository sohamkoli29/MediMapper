import React from 'react';
import AIExpertChat from '../components/AIExpertChat';
import {Stethoscope} from 'lucide-react'
const AIMedicalExpert = () => {
  const expertConfig = {
    name: "AI Medical Expert",
    description: "Advanced medical diagnostics and treatment recommendations",
    icon: <Stethoscope className="w-12 h-12" />,
    colorScheme: "blue",
    expertType: "medical",
    route: "/ai-medical-expert",
    welcomeMessage: "Hello! I'm your AI Medical Expert assistant. I can help with medical diagnostics, treatment recommendations, and health advice. How can I assist you today?",
    quickSuggestions: [
      "What are the symptoms of diabetes?",
      "How to manage high blood pressure?",
      "When should I see a doctor for a fever?",
      "Explain my blood test results"
    ]
  };

  return <AIExpertChat expertConfig={expertConfig} />;
};

export default AIMedicalExpert;