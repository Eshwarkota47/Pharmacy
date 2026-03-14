import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
              AI-Powered Workflow Assistant for Healthcare Teams
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Real-time AI Guidance for <span className="text-primary-600">Pharmacy Workflows</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Assist pharmacists, nurses, and clinical staff during live operations.
            </p>
            <p className="text-lg text-gray-500 mb-10 max-w-3xl mx-auto">
              MediGuide AI helps healthcare workers perform medicine-related tasks faster and more accurately—from prescription fulfillment to inventory lookup, substitute verification, and urgent dispensing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
                data-testid="get-started-btn"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition"
                data-testid="login-btn"
              >
                Staff Login
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10 opacity-10">
          <div className="w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10 opacity-10">
          <div className="w-96 h-96 bg-healthcare-green rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Workflow Challenges We Solve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Healthcare workers waste time during critical dispensing workflows—searching for medicines, checking substitutes, verifying inventory, and handling urgent requests.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Time Lost During Dispensing</h3>
              <p className="text-gray-600">
                Staff spend minutes per prescription searching multiple locations, checking stock, and verifying substitutes manually.
              </p>
            </div>
            <div className="bg-orange-50 p-8 rounded-xl border-2 border-orange-200">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dispensing Errors</h3>
              <p className="text-gray-600">
                Manual lookups and lack of real-time guidance increase the risk of incorrect substitutes and stock errors.
              </p>
            </div>
            <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Urgent Cases Delayed</h3>
              <p className="text-gray-600">
                Critical prescriptions get delayed when staff can't quickly identify available stock or valid alternatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Workflow Features
            </h2>
            <p className="text-xl text-gray-600">
              Built specifically for pharmacy and clinical staff during live operations.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center justify-center w-14 h-14 bg-primary-100 rounded-lg mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Medicine Lookup</h3>
              <p className="text-gray-600">
                Search by brand or generic name during prescription fulfillment. See real-time availability across all inventory locations instantly.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-2 border-purple-200">
              <div className="flex items-center justify-center w-14 h-14 bg-purple-100 rounded-lg mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Substitute Guidance</h3>
              <p className="text-gray-600">
                Get intelligent substitute recommendations with clinical context when the exact medicine is unavailable—powered by advanced AI.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center justify-center w-14 h-14 bg-green-100 rounded-lg mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Medicine Verification</h3>
              <p className="text-gray-600">
                Verify medicine details, dosage, composition, and alternatives quickly during dispensing to reduce errors.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-2 border-red-200">
              <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-lg mb-4">
                <span className="text-3xl">🚨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Urgent Dispensing Mode</h3>
              <p className="text-gray-600">
                Priority mode for critical cases—instantly shows nearest available stock and fastest fulfillment options.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Location Inventory</h3>
              <p className="text-gray-600">
                Check stock levels across multiple pharmacy locations, departments, or branches from one interface.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center justify-center w-14 h-14 bg-green-100 rounded-lg mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Prescription Queue Management</h3>
              <p className="text-gray-600">
                Manage prescription fulfillment workflow with queue tracking, status updates, and priority handling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Staff Use MediGuide AI
            </h2>
            <p className="text-xl text-gray-600">
              Seamlessly integrated into daily pharmacy and clinical workflows
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Receive Prescription</h3>
              <p className="text-gray-600">
                Staff receives prescription or dispensing request from patient or provider
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Check Availability & Guidance</h3>
              <p className="text-gray-600">
                Lookup medicine availability, get AI substitute suggestions if needed, verify details
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fulfill & Dispense</h3>
              <p className="text-gray-600">
                Complete dispensing workflow with confidence, accuracy, and speed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                For Pharmacists & Dispensary Staff
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Reduce prescription fulfillment time by up to 60%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">AI-powered substitute guidance reduces dispensing errors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Real-time inventory visibility across all locations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Handle urgent cases faster with priority mode</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Verify medicine details instantly during workflow</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                For Nurses & Clinical Staff
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Quick medicine availability checks during ward rounds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Identify valid substitutes when stock is unavailable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Support accurate medicine administration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Coordinate with pharmacy on urgent medicine needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Reduce phone calls and manual coordination time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Mode Section */}
      <section className="py-16 bg-gradient-to-br from-red-500 to-red-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🚨</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Urgent Dispensing Mode
          </h2>
          <p className="text-xl md:text-2xl mb-8">
            For critical cases where every second counts:
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-3xl mb-2">📍</div>
              <div className="font-bold text-lg mb-1">Nearest Stock First</div>
              <p className="text-sm">Instantly shows closest available location</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold text-lg mb-1">Priority Routing</div>
              <p className="text-sm">Optimized for fastest fulfillment path</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-bold text-lg mb-1">Guaranteed Availability</div>
              <p className="text-sm">Only shows confirmed in-stock items</p>
            </div>
          </div>
          <Link
            to="/signup"
            className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-2xl"
          >
            Try Urgent Mode
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Enhance Your Workflow?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join healthcare teams using MediGuide AI to improve dispensing accuracy and speed.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-primary-600 text-white px-10 py-4 rounded-lg text-xl font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MediGuide AI</h3>
              <p className="text-gray-400">
                Real-time AI guidance for pharmacy and clinical workflows.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition">Features</Link></li>
                <li><Link to="/" className="hover:text-white transition">How It Works</Link></li>
                <li><Link to="/" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="/" className="hover:text-white transition">Contact</Link></li>
                <li><Link to="/" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition">Help Center</Link></li>
                <li><Link to="/" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MediGuide AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
