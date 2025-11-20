import React from 'react';
import AIExpertChat from '../components/AIExpertChat';
import { Brain } from 'lucide-react';
const AIMentalHealthExpert = () => {
  const expertConfig = {
    name: "AI Mental Health Expert",
    description: "Supportive counseling and mental wellbeing strategies",
   icon: <Brain className="w-12 h-12" />,
    colorScheme: "purple",
    expertType: "mental_health",
    route: "/ai-mental-health-expert",
    welcomeMessage: "Hello! I'm your AI Mental Health Expert. I'm here to provide supportive counseling, coping strategies, and mental wellbeing guidance in a safe, non-judgmental space.",
    quickSuggestions: [
      "Coping strategies for anxiety",
      "Improving sleep quality",
      "Stress management techniques",
      "Building healthy habits"
    ]
  };

  return <AIExpertChat expertConfig={expertConfig} />;
};

export default AIMentalHealthExpert;