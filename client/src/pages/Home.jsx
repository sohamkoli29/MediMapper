import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Activity, 
  FileText, 
  Sprout, 
  Truck,
  MessageCircle,
  Leaf,
  Brain,
  Utensils,
  Shield,
  Clock,
  Users
} from 'lucide-react';


const Home = () => {
  const services = [
    {
      icon: <Stethoscope className="w-12 h-12" />,
      title: "Consultation",
      description: "Connect with healthcare professionals online or offline",
      link: "/consultation",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Activity className="w-12 h-12" />,
      title: "Symptom Checker",
      description: "AI-powered symptom analysis and disease prediction",
      link: "/symptom-checker",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: "Report Analysis",
      description: "Upload medical reports for AI-powered insights",
      link: "/report-analysis",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <Sprout className="w-12 h-12" />,
      title: "Home Remedies",
      description: "Natural treatment options and Ayurvedic solutions",
      link: "/home-remedies",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: <Truck className="w-12 h-12" />,
      title: "Medicine Delivery",
      description: "Get medicines delivered to your doorstep",
      link: "/delivery",
      color: "bg-red-100 text-red-600"
    }
  ];

  const aiExperts = [
    {
      icon: <Stethoscope className="w-16 h-16" />,
      title: "AI Medical Expert",
      description: "Advanced medical diagnostics and treatment recommendations",
      link: "/ai-medical-expert"
    },
    {
      icon: <Leaf className="w-16 h-16" />,
      title: "AI Ayurvedic Expert",
      description: "Holistic health solutions based on ancient principles",
      link: "/ai-ayurvedic-expert"
    },
    {
      icon: <Utensils className="w-16 h-16" />,
      title: "AI Nutritionist",
      description: "Personalized diet plans and nutritional guidance",
      link: "/ai-nutritionist"
    },
    {
      icon: <Brain className="w-16 h-16" />,
      title: "AI Mental Health Expert",
      description: "Supportive counseling and mental wellbeing strategies",
      link: "/ai-mental-health-expert"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Availability",
      description: "Access healthcare services anytime, anywhere"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Doctors",
      description: "Connect with qualified healthcare professionals"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">MEDI MAPPER</h1>
          <p className="text-xl mb-8">Smart Healthcare, Simplified</p>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Instant doctor consultations, AI health advice, and easy medicine ordering—anytime, anywhere
          </p>
          <div className="mt-10">
            <Link
              to="/symptom-checker"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className={`${service.color} w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{service.title}</h3>
                <p className="text-gray-600 text-center">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Experts Section */}
<section id='ai-experts' className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-center mb-12">AI Health Experts</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {aiExperts.map((expert, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 p-6 text-center border border-gray-100"
        >
          <div className="text-blue-600 mb-4 flex justify-center">
            {expert.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{expert.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{expert.description}</p>
          <Link 
            to={expert.link}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm inline-block"
          >
            Chat Now
          </Link>
        </div>
      ))}
    </div>
  </div>
</section>
    </div>
  );
};

export default Home;