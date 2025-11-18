import React from 'react';
import { Truck, Package, Clock, Shield } from 'lucide-react';

const Delivery = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Medicine Delivery</h1>
          <p className="text-xl text-gray-600">
            Get your prescribed medicines delivered to your doorstep
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Truck className="w-24 h-24 text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-8">
            Our medicine delivery service is currently under development. 
            We're working hard to bring you a seamless delivery experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4">
              <Package className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Quick and reliable medicine delivery</p>
            </div>

            <div className="text-center p-4">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Authentic Medicines</h3>
              <p className="text-gray-600 text-sm">100% genuine and quality-checked</p>
            </div>

            <div className="text-center p-4">
              <Clock className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Service</h3>
              <p className="text-gray-600 text-sm">Round-the-clock delivery support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;