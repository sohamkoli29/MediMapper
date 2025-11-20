// src/components/Layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Stethoscope className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl">MediMapper</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Smart healthcare solutions for everyone. Instant consultations, AI-powered diagnostics, 
              and seamless medicine delivery.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-1 text-gray-300">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Your Health, Our Priority</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/consultation" className="text-gray-300 hover:text-white transition-colors">Consultation</Link></li>
              <li><Link to="/symptom-checker" className="text-gray-300 hover:text-white transition-colors">Symptom Checker</Link></li>
              <li><Link to="/home-remedies" className="text-gray-300 hover:text-white transition-colors">Home Remedies</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>support@medimapper.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-HELP</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-300">
                <MapPin className="w-4 h-4 mt-1" />
                <span>24/7 Online Healthcare</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 MediMapper. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;