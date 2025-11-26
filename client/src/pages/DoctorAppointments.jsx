// client/src/pages/DoctorAppointments.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  MessageCircle, 
  AlertCircle,
  Filter,
  ChevronDown
} from 'lucide-react';

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/appointments/doctor/${user.id}`);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/appointments/${appointmentId}/status`, { status });
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment status');
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
      case 'pending': return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'confirmed': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'completed': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'cancelled': return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    filter === 'all' || apt.status === filter
  );

  const filterOptions = [
    { value: 'all', label: 'All Appointments', count: appointments.length },
    { value: 'pending', label: 'Pending', count: appointments.filter(apt => apt.status === 'pending').length },
    { value: 'confirmed', label: 'Confirmed', count: appointments.filter(apt => apt.status === 'confirmed').length },
    { value: 'completed', label: 'Completed', count: appointments.filter(apt => apt.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: appointments.filter(apt => apt.status === 'cancelled').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Error Loading Appointments</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={fetchAppointments}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your patient appointments</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{appointments.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-yellow-600">
              {appointments.filter(apt => apt.status === 'pending').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">
              {appointments.filter(apt => apt.status === 'confirmed').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              {appointments.filter(apt => apt.status === 'completed').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {filterOptions.find(opt => opt.value === filter)?.label}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showMobileFilter ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Mobile Filter Dropdown */}
            {showMobileFilter && (
              <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilter(option.value);
                      setShowMobileFilter(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
                      filter === option.value
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.label}</span>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs min-w-6 text-center">
                        {option.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Filter Tabs */}
          <div className="hidden md:flex space-x-2 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                  filter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {filter === 'all' ? 'All Appointments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
              <span className="text-gray-500 text-sm font-normal ml-2">
                ({filteredAppointments.length})
              </span>
            </h3>
          </div>
          
          <div className="p-4 sm:p-6">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Appointments</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {filter === 'all' 
                    ? "You don't have any appointments yet." 
                    : `No ${filter} appointments found.`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment._id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <img
                          src={appointment.patient?.profilePicture || '/default-avatar.png'}
                          alt={appointment.patient?.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {appointment.patient?.name}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 mt-1 space-y-1 sm:space-y-0">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{new Date(appointment.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                          {appointment.symptoms && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2">
                              <strong>Symptoms:</strong> {appointment.symptoms}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)} flex items-center space-x-1 justify-center sm:justify-start`}>
                          {getStatusIcon(appointment.status)}
                          <span className="hidden xs:inline">{appointment.status}</span>
                        </span>
                        
                        {/* Action Buttons Based on Status */}
                        <div className="flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-end">
                          {appointment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                                className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-green-700 transition-colors flex items-center space-x-1 flex-1 sm:flex-none justify-center min-w-[80px]"
                              >
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                                className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-700 transition-colors flex items-center space-x-1 flex-1 sm:flex-none justify-center min-w-[80px]"
                              >
                                <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                          
                          {appointment.status === 'confirmed' && (
                            <>
                              <button
                                onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                                className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700 transition-colors flex-1 sm:flex-none justify-center min-w-[120px]"
                              >
                                Mark Complete
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                                className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-700 transition-colors flex-1 sm:flex-none justify-center min-w-[80px]"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          
                          {/* Chat Button */}
                       <Link
  to={`/chat/${appointment.patient?._id}`}
  className="bg-blue-600 text-white p-1 sm:p-2 rounded hover:bg-blue-700 transition-colors flex-shrink-0 flex items-center justify-center"
  title="Chat with Patient"
>
  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
</Link>
                        </div>
                      </div>
                    </div>

                    {/* Status-specific messages */}
                    {appointment.status === 'pending' && (
                      <div className="mt-3 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-xs sm:text-sm">
                          ⏳ Waiting for your action. Please accept or reject this appointment request.
                        </p>
                      </div>
                    )}

                    {appointment.status === 'confirmed' && (
                      <div className="mt-3 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-xs sm:text-sm">
                          ✅ Appointment confirmed. Patient is expecting the consultation.
                        </p>
                      </div>
                    )}

                    {appointment.status === 'completed' && (
                      <div className="mt-3 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-xs sm:text-sm">
                          ✔️ This appointment has been completed successfully.
                        </p>
                      </div>
                    )}

                    {appointment.status === 'cancelled' && (
                      <div className="mt-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-xs sm:text-sm">
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

export default DoctorAppointments;