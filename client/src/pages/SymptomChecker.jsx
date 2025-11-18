import React, { useState } from 'react';
import axios from 'axios';
import { Search, AlertCircle, Clock, RefreshCw } from 'lucide-react';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Common symptoms for suggestions
  const commonSymptoms = [
    'headache', 'fever', 'cough', 'fatigue', 'nausea', 'dizziness',
    'chest pain', 'shortness of breath', 'abdominal pain', 'joint pain',
    'muscle pain', 'sore throat', 'runny nose', 'rash', 'vomiting'
  ];

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim().toLowerCase())) {
      setSymptoms(prev => [...prev, currentSymptom.trim().toLowerCase()]);
      setCurrentSymptom('');
      setSuggestions([]);
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setSymptoms(prev => prev.filter(s => s !== symptomToRemove));
  };

  const handleSymptomInput = (value) => {
    setCurrentSymptom(value);
    if (value.length > 2) {
      const filtered = commonSymptoms.filter(symptom =>
        symptom.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const predictDisease = async () => {
    if (symptoms.length === 0) {
      alert('Please add at least one symptom');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/ai/symptom-checker', {
        symptoms
      });
      setPredictions(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Failed to get predictions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSymptoms([]);
    setPredictions(null);
    setCurrentSymptom('');
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Symptom Checker</h1>
          <p className="text-xl text-gray-600">
            Enter your symptoms to get AI-powered health insights
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Symptom Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Symptoms
            </label>
            <div className="relative">
              <input
                type="text"
                value={currentSymptom}
                onChange={(e) => handleSymptomInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
                placeholder="Type a symptom (e.g., headache, fever)..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {suggestions.map((symptom, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSymptom(symptom);
                        setSuggestions([]);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={addSymptom}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Symptom
            </button>
          </div>

          {/* Selected Symptoms */}
          {symptoms.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Selected Symptoms:</h3>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{symptom}</span>
                    <button
                      onClick={() => removeSymptom(symptom)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={predictDisease}
              disabled={loading || symptoms.length === 0}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Clock className="w-5 h-5 animate-spin" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{loading ? 'Analyzing...' : 'Check Symptoms'}</span>
            </button>

            <button
              onClick={resetForm}
              className="bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Results */}
        {predictions && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Results</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Symptoms Analyzed:</h3>
              <p className="text-gray-700">{predictions.symptoms}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
                  <p className="text-yellow-700 text-sm">
                    This is an AI-powered analysis for informational purposes only. 
                    It is not a substitute for professional medical advice, diagnosis, or treatment. 
                    Always consult with a qualified healthcare provider for medical concerns.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-800">
                {predictions.analysis}
              </pre>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Recommended Next Steps:</h4>
              <ul className="text-blue-800 space-y-1">
                <li>• Consult with a healthcare professional for accurate diagnosis</li>
                <li>• Monitor your symptoms and note any changes</li>
                <li>• Follow prescribed medications and treatments</li>
                <li>• Maintain a healthy lifestyle and diet</li>
              </ul>
            </div>
          </div>
        )}

        {/* Common Symptoms Guide */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Common Symptoms Guide</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {commonSymptoms.map((symptom, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!symptoms.includes(symptom)) {
                    setSymptoms(prev => [...prev, symptom]);
                  }
                }}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors text-center"
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;