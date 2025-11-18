import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, AlertCircle, Download } from 'lucide-react';

const ReportAnalysis = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const analyzeReport = async () => {
    if (!file) {
      alert('Please select a PDF file first');
      return;
    }

    setLoading(true);
    try {
      // For now, we'll use mock analysis since we don't have actual PDF parsing
      // In a real app, you'd upload the file and process it on the backend
      const response = await axios.post('/api/ai/report-analysis', {
        reportText: 'Medical report analysis placeholder'
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Medical Report Analysis</h1>
          <p className="text-xl text-gray-600">
            Upload your medical reports for AI-powered insights and recommendations
          </p>
        </div>

        {!analysis ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Medical Report
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your PDF report here, or click to browse
              </p>
              
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer inline-block"
              >
                Choose File
              </label>

              <p className="text-sm text-gray-500 mt-4">
                Supported format: PDF only
              </p>
            </div>

            {/* File Info */}
            {file && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900">File Selected</h4>
                    <p className="text-green-700 text-sm">{file.name}</p>
                    <p className="text-green-600 text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex space-x-4 justify-center">
              <button
                onClick={analyzeReport}
                disabled={!file || loading}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>{loading ? 'Analyzing...' : 'Analyze Report'}</span>
              </button>

              <button
                onClick={resetForm}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">PDF Reports</h4>
                <p className="text-gray-600 text-sm">
                  Upload blood tests, lab reports, and medical documents
                </p>
              </div>

              <div className="text-center p-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
                <p className="text-gray-600 text-sm">
                  Get insights and identify potential health concerns
                </p>
              </div>

              <div className="text-center p-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Action Plan</h4>
                <p className="text-gray-600 text-sm">
                  Receive personalized recommendations and next steps
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              <button
                onClick={resetForm}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Analyze Another Report
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Medical Disclaimer</h4>
                  <p className="text-yellow-700 text-sm">
                    This analysis is AI-generated and for informational purposes only. 
                    It is not a substitute for professional medical advice. 
                    Always consult with qualified healthcare providers for diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 bg-gray-50 p-6 rounded-lg">
                {analysis.analysis}
              </pre>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Recommended Actions</h4>
                <ul className="text-blue-800 space-y-2">
                  <li>• Consult with your healthcare provider</li>
                  <li>• Follow up with recommended tests</li>
                  <li>• Monitor your health parameters</li>
                  <li>• Maintain regular check-ups</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-3">Healthy Lifestyle Tips</h4>
                <ul className="text-green-800 space-y-2">
                  <li>• Maintain balanced nutrition</li>
                  <li>• Exercise regularly</li>
                  <li>• Get adequate sleep</li>
                  <li>• Manage stress effectively</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportAnalysis;