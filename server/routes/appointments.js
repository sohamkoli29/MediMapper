import express from 'express';
import mongoose from "mongoose";
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

const router = express.Router();

// Create appointment
router.post('/', async (req, res) => {
  try {
    const { patientId, doctorId, date, time, symptoms } = req.body;

    // Validation
    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID, doctor ID, date, and time are required'
      });
    }

    // Check if patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date: new Date(date),
      time,
      symptoms
    });

    await appointment.save();

    // Populate the appointment with user details
    await appointment.populate('patient', 'name email profilePicture');
    await appointment.populate('doctor', 'name email profilePicture');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get appointments for patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.patientId })
      .populate('patient', 'name email profilePicture')
      .populate('doctor', 'name email profilePicture')
      .sort({ date: -1 });

    res.json({
      success: true,
      appointments
    });

  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get appointments for doctor
// server/routes/appointments.js - Fix the doctor appointments route
// Get appointments for doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;

    console.log('Fetching appointments for doctor:', doctorId);

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID format'
      });
    }

    // Verify doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get appointments for this doctor
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'name email profilePicture')
      .populate('doctor', 'name email profilePicture')
      .sort({ date: -1, time: -1 });

    console.log(`Found ${appointments.length} appointments for doctor ${doctorId}`);

    res.json({
      success: true,
      appointments: appointments || []
    });

  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching appointments',
      error: error.message
    });
  }
});

// Update appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('patient', 'name email profilePicture')
      .populate('doctor', 'name email profilePicture');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment status updated',
      appointment
    });

  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;