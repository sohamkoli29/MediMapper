import React from 'react';
import AIExpertChat from '../components/AIExpertChat';
import {Leaf} from 'lucide-react'
const AIAyurvedicExpert = () => {
  const expertConfig = {
    name: "AI Ayurvedic Expert",
    description: "Holistic health solutions based on ancient principles",
   icon: <Leaf className="w-12 h-12" />,
    colorScheme: "green",
    expertType: "ayurvedic",
    route: "/ai-ayurvedic-expert",
    welcomeMessage: "Namaste! I'm your AI Ayurvedic Expert. I can help with dosha balance, herbal remedies, daily routines, and holistic wellness based on ancient Ayurvedic wisdom.",
    quickSuggestions: [
      "What is my dosha type?",
      "Ayurvedic remedies for digestion",
      "Daily routine (Dinacharya) suggestions",
      "Herbal remedies for stress"
    ]
  };

  return <AIExpertChat expertConfig={expertConfig} />;
};

export default AIAyurvedicExpert;