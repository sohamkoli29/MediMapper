// client/src/pages/Consultation.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Star,
  MessageCircle
} from 'lucide-react';
import AppointmentModal from '../components/AppointmentModal';

const Consultation = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('online');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/users/doctors');
      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const openAppointmentModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentModal(true);
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedDoctor(null);
  };

  const bookAppointment = async (appointmentData) => {
    if (!selectedDoctor || !user) return;

    try {
      const response = await axios.post('/api/appointments', {
        patientId: user.id,
        doctorId: selectedDoctor.user?._id,
        date: appointmentData.date,
        time: appointmentData.time,
        symptoms: appointmentData.symptoms
      });

      if (response.data.success) {
        alert('Appointment booked successfully! The doctor will review your request.');
        closeAppointmentModal();
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Healthcare Consultation</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your preferred consultation method and connect with our expert healthcare professionals
          </p>
        </div>

        {/* Consultation Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div 
            className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${
              selectedType === 'online' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
            onClick={() => setSelectedType('online')}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-900">Online Consultation</h3>
                <p className="text-gray-600">Virtual appointments from anywhere</p>
              </div>
            </div>
          </div>

          <div 
            className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${
              selectedType === 'offline' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 bg-white hover:border-green-300'
            }`}
            onClick={() => setSelectedType('offline')}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-900">Offline Consultation</h3>
                <p className="text-gray-600">In-person clinic visits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Doctors */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Doctors ({selectedType === 'online' ? 'Online' : 'Offline'})
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{doctors.length} doctors available</span>
            </div>
          </div>

          {doctors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Doctors Available</h3>
              <p className="text-gray-600">Please check back later for available doctors.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={doctor.user?.profilePicture || '/default-avatar.png'}
                      alt={doctor.user?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{doctor.user?.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{doctor.rating || '4.5'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {doctor.availability || '9 AM - 5 PM'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {doctor.qualification}
                    </div>
                    <div className="text-sm text-gray-600">
                      {doctor.experience} years experience
                    </div>
                  </div>

                  {/* Different buttons based on consultation type */}
                  <div className="flex space-x-2">
                    {selectedType === 'online' ? (
                      // Online Consultation - Only Chat Button
                      <Link
                        to={`/chat/${doctor.user?._id}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center space-x-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat Now</span>
                      </Link>
                    ) : (
                      // Offline Consultation - Only Book Appointment Button
                      <button
                        onClick={() => openAppointmentModal(doctor)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Book Appointment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointment Modal */}
        <AppointmentModal
          doctor={selectedDoctor}
          isOpen={showAppointmentModal}
          onClose={closeAppointmentModal}
          onBookAppointment={bookAppointment}
        />

        {/* Consultation Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Choose Online Consultation?</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• No travel required</li>
              <li>• Consult from anywhere</li>
              <li>• Quick appointments</li>
              <li>• Secure and private</li>
              <li>• Digital prescriptions</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">When to Choose Offline Consultation?</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Physical examination needed</li>
              <li>• Diagnostic tests required</li>
              <li>• Complex medical conditions</li>
              <li>• Surgical consultations</li>
              <li>• Emergency situations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;