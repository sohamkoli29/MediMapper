// client/src/pages/PatientAppointments.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Calendar, Clock, User, CheckCircle, XCircle, MessageCircle, AlertCircle } from 'lucide-react';

const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/appointments/patient/${user.id}`);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await axios.patch(`${API_BASE_URL}/api/appointments/${appointmentId}/status`, { 
        status: 'cancelled' 
      });
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    filter === 'all' || apt.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Appointments</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAppointments}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-2">Track and manage your healthcare appointments</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{appointments.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {appointments.filter(apt => apt.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {appointments.filter(apt => apt.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(apt => apt.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex space-x-2 overflow-x-auto">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status} ({status === 'all' ? appointments.length : appointments.filter(apt => apt.status === status).length})
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {filter === 'all' ? 'All Appointments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
            </h3>
          </div>
          
          <div className="p-6">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? "You don't have any appointments yet." 
                    : `No ${filter} appointments found.`
                  }
                </p>
                {filter === 'all' && (
                  <a
                    href="/consultation"
                    className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Book Your First Appointment
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={appointment.doctor?.profilePicture || '/default-avatar.png'}
                          alt={appointment.doctor?.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">Dr. {appointment.doctor?.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(appointment.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                          {appointment.symptoms && (
                            <p className="text-sm text-gray-500 mt-2">
                              <strong>Symptoms:</strong> {appointment.symptoms}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)} flex items-center space-x-1`}>
                          {getStatusIcon(appointment.status)}
                          <span>{appointment.status}</span>
                        </span>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                            <button
                              onClick={() => cancelAppointment(appointment._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          
                          {/* Chat Button */}
                          <a
                            href={`/chat/${appointment.doctor?._id}`}
                            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                            title="Chat with Doctor"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Appointment ID:</strong> {appointment._id}
                      </div>
                      <div>
                        <strong>Booked On:</strong> {new Date(appointment.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Status-specific messages */}
                    {appointment.status === 'pending' && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          ⏳ Your appointment is pending confirmation from the doctor. 
                          You will be notified once it's confirmed.
                        </p>
                      </div>
                    )}

                    {appointment.status === 'confirmed' && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm">
                          ✅ Your appointment has been confirmed! Please be available at the scheduled time.
                        </p>
                      </div>
                    )}

                    {appointment.status === 'completed' && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">
                          ✔️ This appointment has been completed. Thank you for choosing MediMapper!
                        </p>
                      </div>
                    )}

                    {appointment.status === 'cancelled' && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">
                          ❌ This appointment has been cancelled.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;