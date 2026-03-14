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
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Essential Medicines <span className="text-primary-600">Faster</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              When every minute matters.
            </p>
            <p className="text-lg text-gray-500 mb-10 max-w-3xl mx-auto">
              MediFind AI helps you quickly find nearby pharmacies with required medicines,
              check stock availability in real-time, and get AI-powered substitute suggestions
              during emergencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
                data-testid="get-started-btn"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition"
                data-testid="login-btn"
              >
                Login
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
              The Problem We Solve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              People waste critical time searching multiple pharmacies for essential medicines,
              especially during emergencies, late-night hours, or medicine shortages.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Time Lost</h3>
              <p className="text-gray-600">
                Hours wasted calling and visiting multiple pharmacies to find a single medicine.
              </p>
            </div>
            <div className="bg-orange-50 p-8 rounded-xl border-2 border-orange-200">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fragmented Solutions</h3>
              <p className="text-gray-600">
                Existing solutions are chain-specific or delivery-focused, not emergency-first.
              </p>
            </div>
            <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Delays</h3>
              <p className="text-gray-600">
                Critical delays during medical emergencies when immediate access matters most.
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
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to find medicines quickly and safely.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center justify-center w-14 h-14 bg-primary-100 rounded-lg mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Medicine Search</h3>
              <p className="text-gray-600">
                Search by brand or generic name. Instantly see which nearby pharmacies have your medicine in stock.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center justify-center w-14 h-14 bg-healthcare-green/20 rounded-lg mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Stock Status</h3>
              <p className="text-gray-600">
                Check live inventory, pricing, and availability across multiple pharmacies from one dashboard.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center justify-center w-14 h-14 bg-purple-100 rounded-lg mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Substitute Suggestions</h3>
              <p className="text-gray-600">
                Get intelligent alternative medicine recommendations when your exact medicine isn't available.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-2 border-healthcare-red">
              <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-lg mb-4">
                <span className="text-3xl">🚨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Emergency Mode</h3>
              <p className="text-gray-600">
                Priority filtering for open pharmacies, nearest locations, and immediate availability during emergencies.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg mb-4">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Location-Based Search</h3>
              <p className="text-gray-600">
                Find pharmacies near you with accurate distance calculation and open/closed status.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex items-center justify-center w-14 h-14 bg-green-100 rounded-lg mb-4">
                <span className="text-3xl">🎫</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Reservations</h3>
              <p className="text-gray-600">
                Reserve medicines in advance with pickup time slots. Never arrive to find stock sold out.
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
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Find your medicine in 3 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Search Medicine</h3>
              <p className="text-gray-600">
                Enter the medicine name (brand or generic) you need
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">View Available Pharmacies</h3>
              <p className="text-gray-600">
                See nearby pharmacies with stock, pricing, and distance
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reserve & Collect</h3>
              <p className="text-gray-600">
                Reserve your medicine and pick it up at your convenience
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
                For Patients & Users
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Save hours by finding medicine instantly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Compare prices across pharmacies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Get AI-powered substitute recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Emergency-first features for urgent needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">24/7 availability information</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                For Pharmacies
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Increase visibility and customer reach</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Easy inventory management system</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Reduce phone inquiries with online stock visibility</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Manage reservations efficiently</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Analytics on popular medicines and trends</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Promo Section */}
      <section className="py-16 bg-gradient-to-br from-red-500 to-red-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🚨</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Emergency Mode
          </h2>
          <p className="text-xl md:text-2xl mb-8">
            When seconds count, our Emergency Mode prioritizes:
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-3xl mb-2">🏪</div>
              <div className="font-bold text-lg mb-1">Currently Open</div>
              <p className="text-sm">Only show pharmacies open right now</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-3xl mb-2">📍</div>
              <div className="font-bold text-lg mb-1">Nearest First</div>
              <p className="text-sm">Sorted by shortest distance</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-bold text-lg mb-1">In Stock</div>
              <p className="text-sm">Guaranteed availability</p>
            </div>
          </div>
          <Link
            to="/signup"
            className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-2xl"
          >
            Try Emergency Mode Now
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Find Your Medicine?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who trust MediFind AI for their medicine needs.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-primary-600 text-white px-10 py-4 rounded-lg text-xl font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MediFind AI</h3>
              <p className="text-gray-400">
                Find essential medicines faster, when every minute matters.
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
            <p>&copy; 2025 MediFind AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
