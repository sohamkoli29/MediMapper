// client/src/pages/Chat.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import ChatWindow from '../components/Chat/ChatWindow';
import { Search, Users, MessageCircle, User, Stethoscope, Calendar } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, activeTab]);

  const fetchConversations = async () => {
    try {
      let users = [];
      
      if (user.role === 'patient') {
        // Patients can chat with all available doctors
        const response = await axios.get('/api/users/doctors');
        users = (response.data.doctors || []).map(doctor => ({
          ...doctor.user,
          id: doctor.user?._id || doctor.user?.id,
          _id: doctor.user?._id || doctor.user?.id,
          specialization: doctor.specialization,
          qualification: doctor.qualification,
          experience: doctor.experience,
          role: 'doctor'
        }));
      } else {
        // Doctors can see both: all patients AND their appointment patients
        if (activeTab === 'available') {
          // Show all patients (for new conversations)
          try {
            const patientsResponse = await axios.get('/api/users/patients');
            users = (patientsResponse.data.patients || []).map(patient => ({
              ...patient,
              id: patient._id || patient.id,
              _id: patient._id || patient.id,
              role: 'patient'
            }));
          } catch (error) {
            console.error('Error fetching patients, trying fallback:', error);
            // Fallback: get all users and filter patients
            try {
              const usersResponse = await axios.get('/api/users');
              users = (usersResponse.data.users || [])
                .filter(u => u.role === 'patient')
                .map(patient => ({
                  ...patient,
                  id: patient._id || patient.id,
                  _id: patient._id || patient.id,
                  role: 'patient'
                }));
            } catch (fallbackError) {
              console.error('Fallback also failed:', fallbackError);
              users = [];
            }
          }
        } else {
          // Show patients from appointments
          try {
            const appointmentsResponse = await axios.get(`/api/appointments/doctor/${user.id || user._id}`);
            const appointments = appointmentsResponse.data.appointments || [];
            
            // Extract unique patients
            const patientIds = new Set();
            users = appointments
              .filter(apt => apt.patient && !patientIds.has(apt.patient._id || apt.patient.id))
              .map(apt => {
                const patientId = apt.patient._id || apt.patient.id;
                patientIds.add(patientId);
                return {
                  ...apt.patient,
                  id: patientId,
                  _id: patientId,
                  role: 'patient',
                  lastAppointment: apt.date,
                  symptoms: apt.symptoms,
                  hasAppointment: true
                };
              });
          } catch (error) {
            console.error('Error fetching appointments:', error);
            users = [];
          }
        }
      }
      
      setConversations(users);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (conversation) => {
    const selectedUserWithId = {
      ...conversation,
      id: conversation.id || conversation._id,
      _id: conversation.id || conversation._id
    };
    setSelectedUser(selectedUserWithId);
  };

  const filteredConversations = conversations.filter(conversation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      conversation.name?.toLowerCase().includes(searchLower) ||
      (conversation.specialization?.toLowerCase().includes(searchLower)) ||
      (conversation.email?.toLowerCase().includes(searchLower))
    );
  });

  const getRoleIcon = (role) => {
    return role === 'doctor' ? 
      <Stethoscope className="w-4 h-4 text-blue-600" /> : 
      <User className="w-4 h-4 text-green-600" />;
  };

  const getRoleBadge = (role) => {
    const styles = {
      doctor: 'bg-blue-100 text-blue-800',
      patient: 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>
        {role}
      </span>
    );
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            {user.role === 'doctor' ? 'Chat with patients' : 'Chat with doctors'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg h-[600px] flex">
          {/* Conversations List */}
          <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              {/* Doctor Tabs */}
              {user.role === 'doctor' && (
                <div className="flex space-x-2 mb-3">
                  <button
                    onClick={() => setActiveTab('available')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'available'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Patients
                  </button>
                  <button
                    onClick={() => setActiveTab('patients')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'patients'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    My Patients
                  </button>
                </div>
              )}
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={
                    user.role === 'doctor' 
                      ? `Search ${activeTab === 'available' ? 'patients' : 'my patients'}...`
                      : 'Search doctors...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {user.role === 'doctor' 
                      ? activeTab === 'patients' 
                        ? 'No patients from appointments yet.'
                        : 'No patients found.'
                      : 'No doctors available.'
                    }
                  </p>
                  {user.role === 'doctor' && activeTab === 'patients' && (
                    <p className="text-sm text-gray-500 mt-2">
                      Patients will appear here after they book appointments with you.
                    </p>
                  )}
                </div>
              ) : (
                filteredConversations.map(conversation => (
                  <div
                    key={conversation.id || conversation._id}
                    onClick={() => handleSelectUser(conversation)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      selectedUser?.id === (conversation.id || conversation._id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={conversation.profilePicture || '/default-avatar.png'}
                        alt={conversation.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {conversation.name}
                          </h4>
                          {getRoleBadge(conversation.role)}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {getRoleIcon(conversation.role)}
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.specialization || 'Patient'}
                            {conversation.qualification && ` • ${conversation.qualification}`}
                          </p>
                        </div>
                        {conversation.symptoms && (
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {conversation.symptoms}
                          </p>
                        )}
                        {conversation.hasAppointment && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Calendar className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-600">Has appointment</span>
                          </div>
                        )}
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        conversation.online ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <ChatWindow receiver={selectedUser} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {user.role === 'doctor' 
                      ? 'Select a patient' 
                      : 'Select a doctor'
                    }
                  </h3>
                  <p className="text-gray-600">
                    {user.role === 'doctor'
                      ? 'Choose a patient from the list to start chatting'
                      : 'Choose a doctor from the list to start chatting'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;