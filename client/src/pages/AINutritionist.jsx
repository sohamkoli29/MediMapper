import React from 'react';
import AIExpertChat from '../components/AIExpertChat';
import {Utensils} from 'lucide-react'
const AINutritionist = () => {
  const expertConfig = {
    name: "AI Nutritionist",
    description: "Personalized diet plans and nutritional guidance",
   icon: <Utensils className="w-12 h-12" />,
    colorScheme: "orange",
    expertType: "nutrition",
    route: "/ai-nutritionist",
    welcomeMessage: "Hello! I'm your AI Nutritionist. I can help with personalized diet plans, nutritional guidance, meal suggestions, and healthy eating habits tailored to your needs.",
    quickSuggestions: [
      "Create a balanced meal plan",
      "Foods to boost immunity",
      "Weight management tips",
      "Nutrition for energy and vitality"
    ]
  };

  return <AIExpertChat expertConfig={expertConfig} />;
};

export default AINutritionist;