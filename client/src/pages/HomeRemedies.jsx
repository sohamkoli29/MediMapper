import React, { useState } from 'react';
import axios from 'axios';
import { Search, Leaf, Clock, AlertCircle } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer'
const HomeRemedies = () => {
  const [disease, setDisease] = useState('');
  const [remedies, setRemedies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const commonDiseases = [
    'common cold', 'fever', 'cough', 'headache', 'sore throat',
    'indigestion', 'constipation', 'insomnia', 'stress', 'acne',
    'allergies', 'arthritis', 'asthma', 'back pain', 'diabetes',
    'hypertension', 'migraine', 'skin rash', 'stomach ache'
  ];
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleDiseaseInput = (value) => {
    setDisease(value);
    if (value.length > 2) {
      const filtered = commonDiseases.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const getRemedies = async () => {
    if (!disease.trim()) {
      alert('Please enter a disease or health condition');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/ai/home-remedies`, {
        disease: disease.trim()
      });
      setRemedies(response.data);
    } catch (error) {
      console.error('Remedies error:', error);
      alert('Failed to get remedies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDisease('');
    setRemedies(null);
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Home Remedies</h1>
          <p className="text-xl text-gray-600">
            Discover natural Ayurvedic remedies for common health conditions
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Disease Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Health Condition or Disease
            </label>
            <div className="relative">
              <input
                type="text"
                value={disease}
                onChange={(e) => handleDiseaseInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && getRemedies()}
                placeholder="e.g., common cold, headache, indigestion..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {suggestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDisease(item);
                        setSuggestions([]);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={getRemedies}
              disabled={loading || !disease.trim()}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Clock className="w-5 h-5 animate-spin" />
              ) : (
                <Leaf className="w-5 h-5" />
              )}
              <span>{loading ? 'Searching...' : 'Find Remedies'}</span>
            </button>

            <button
              onClick={resetForm}
              className="bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        {remedies && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ayurvedic Remedies</h2>
            
          

            <div className="prose max-w-none">
          
                <MarkdownRenderer content={remedies.remedies}/>
     
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Safety Guidelines</h4>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li>• Start with small quantities</li>
                  <li>• Monitor for any allergic reactions</li>
                  <li>• Discontinue if discomfort occurs</li>
                  <li>• Consult doctor for persistent symptoms</li>
                  <li>• Maintain proper hygiene</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-3">Ayurvedic Principles</h4>
                <ul className="text-green-800 space-y-2 text-sm">
                  <li>• Balance mind, body, and spirit</li>
                  <li>• Use natural ingredients</li>
                  <li>• Consider individual constitution</li>
                  <li>• Follow seasonal routines</li>
                  <li>• Practice moderation</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Common Diseases Quick Access */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Common Health Conditions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {commonDiseases.map((diseaseItem, index) => (
              <button
                key={index}
                onClick={() => setDisease(diseaseItem)}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors text-center"
              >
                {diseaseItem}
              </button>
            ))}
          </div>
        </div>

        {/* Ayurvedic Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Natural Healing</h4>
            <p className="text-gray-600 text-sm">
              Uses natural ingredients from plants, herbs, and minerals
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Time-Tested</h4>
            <p className="text-gray-600 text-sm">
              Traditional remedies practiced for thousands of years
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Holistic Approach</h4>
            <p className="text-gray-600 text-sm">
              Focuses on overall wellbeing and preventive care
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeRemedies;