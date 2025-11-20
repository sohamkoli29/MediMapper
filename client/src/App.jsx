// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Consultation from './pages/Consultation';
import SymptomChecker from './pages/SymptomChecker';
import ReportAnalysis from './pages/ReportAnalysis';
import HomeRemedies from './pages/HomeRemedies';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import DoctorDashboard from './pages/DoctorDashboard';
import Delivery from './pages/Delivery';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DoctorAppointments from './pages/DoctorAppointments';
import PatientAppointments from './pages/PatientAppointments';
import AIMedicalExpert from './pages/AIMedicalExpert';
import AIAyurvedicExpert from './pages/AIAyurvedicExpert';
import AINutritionist from './pages/AINutritionist';
import AIMentalHealthExpert from './pages/AIMentalHealthExpert';


function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Patient Routes */}
                <Route path="/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
                <Route path="/symptom-checker" element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>} />
                <Route path="/report-analysis" element={<ProtectedRoute><ReportAnalysis /></ProtectedRoute>} />
                <Route path="/home-remedies" element={<ProtectedRoute><HomeRemedies /></ProtectedRoute>} />
                <Route path="/chat/:userId?" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/delivery" element={<ProtectedRoute><Delivery /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/patient-appointments" element={ <ProtectedRoute><PatientAppointments /></ProtectedRoute>} />

                 {/* AI Expert Routes */}
                <Route path="/ai-medical-expert" element={<AIMedicalExpert />} />
                <Route path="/ai-ayurvedic-expert" element={<AIAyurvedicExpert />} />
                <Route path="/ai-nutritionist" element={<AINutritionist />} />
                <Route path="/ai-mental-health-expert" element={<AIMentalHealthExpert />} />
                {/* Doctor Routes */}
                <Route 
                  path="/doctor-dashboard" 
                  element={
                    <ProtectedRoute doctorOnly={true}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/doctor-appointments" 
                  element={
                    <ProtectedRoute doctorOnly={true}>
                      <DoctorAppointments />
                    </ProtectedRoute>
                  } 
                />
               
              </Routes>
            </div>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;