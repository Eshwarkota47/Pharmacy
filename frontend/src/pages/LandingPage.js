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
              AI Assistant for Healthcare Workers
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI Guidance for <span className="text-primary-600">Physical Work</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Real-time AI assistant for pharmacists, nurses, and clinic staff during medicine-handling tasks.
            </p>
            <p className="text-lg text-gray-500 mb-10 max-w-3xl mx-auto">
              MediGuide AI provides instant guidance while you dispense, verify, locate, and administer medicines in fast-paced healthcare settings. Like having an expert assistant at your side during every task.
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
              Challenges During Active Medicine Handling
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Healthcare workers face real-time challenges while performing physical medicine tasks—dispensing prescriptions, verifying substitutes, locating stock, and handling urgent requests.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dispensing Delays</h3>
              <p className="text-gray-600">
                Staff waste 3-5 minutes per prescription manually searching locations, verifying details, and checking alternatives during active dispensing.
              </p>
            </div>
            <div className="bg-orange-50 p-8 rounded-xl border-2 border-orange-200">
              <div className="text-4xl mb-4">❓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Substitution Confusion</h3>
              <p className="text-gray-600">
                Without real-time guidance, staff struggle to identify valid substitutes quickly, leading to delays or incorrect alternatives during critical moments.
              </p>
            </div>
            <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Inventory Fragmentation</h3>
              <p className="text-gray-600">
                Medicine stock scattered across multiple locations forces staff to make phone calls, walk between sites, or delay patient care to locate items.
              </p>
            </div>
            <div className="bg-orange-50 p-8 rounded-xl border-2 border-orange-200">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Medicine-Handling Errors</h3>
              <p className="text-gray-600">
                Under pressure, staff may select wrong dosages, miss contraindications, or dispense incorrect alternatives without verification support.
              </p>
            </div>
            <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Urgent Case Pressure</h3>
              <p className="text-gray-600">
                Critical situations demand instant decisions about availability and alternatives, but staff lack tools to get immediate, confident answers.
              </p>
            </div>
            <div className="bg-orange-50 p-8 rounded-xl border-2 border-orange-200">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Coordination Overhead</h3>
              <p className="text-gray-600">
                Staff spend excessive time coordinating with other departments, making calls, and waiting for information during active patient care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How AI Assists Physical Work */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How AI Assists You During Physical Tasks
            </h2>
            <p className="text-xl text-gray-600">
              MediGuide AI acts as your real-time assistant during medicine-handling work
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  💊
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">While Dispensing Prescriptions</h3>
                  <p className="text-gray-600 mb-3">
                    <span className="font-semibold">Scenario:</span> You're at the counter with a prescription in hand.
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">AI Guidance:</span> Instantly see which exact locations have the medicine in stock, verify dosage details, and get substitute options if unavailable—all in under 5 seconds.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">When Stock is Unavailable</h3>
                  <p className="text-gray-600 mb-3">
                    <span className="font-semibold">Scenario:</span> The prescribed medicine is out of stock.
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">AI Guidance:</span> AI analyzes composition, dosage, and therapeutic use to suggest clinically valid substitutes with reasoning—helping you make confident decisions without calling a pharmacist.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                  🏥
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">During Ward Rounds</h3>
                  <p className="text-gray-600 mb-3">
                    <span className="font-semibold">Scenario:</span> Nurse needs to administer medicine but unsure of availability.
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">AI Guidance:</span> Quickly check if medicine is available in ward pharmacy, main pharmacy, or emergency stock—without leaving patient bedside or making phone calls.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border-2 border-red-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
                  🚨
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">In Urgent Situations</h3>
                  <p className="text-gray-600 mb-3">
                    <span className="font-semibold">Scenario:</span> Emergency case needs immediate medicine access.
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">AI Guidance:</span> Urgent mode instantly highlights nearest available stock and fastest retrieval path—helping you act within seconds rather than minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real-Time Guidance Features
            </h2>
            <p className="text-xl text-gray-600">
              AI-powered assistance during your active medicine-handling work
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-2 border-primary-100">
              <div className="flex items-center justify-center w-14 h-14 bg-primary-100 rounded-lg mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Availability Check</h3>
              <p className="text-gray-600">
                Type medicine name while holding prescription. Get instant stock locations across all sites—no phone calls, no waiting, no delays.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-2 border-purple-200">
              <div className="flex items-center justify-center w-14 h-14 bg-purple-100 rounded-lg mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Substitute Guidance</h3>
              <p className="text-gray-600">
                When stock is out, AI suggests valid substitutes with clinical reasoning—same generic, similar composition, or therapeutic alternatives with confidence.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-2 border-green-200">
              <div className="flex items-center justify-center w-14 h-14 bg-green-100 rounded-lg mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">On-the-Spot Verification</h3>
              <p className="text-gray-600">
                Verify dosage, composition, and medicine details in real-time during dispensing. Reduce errors and increase confidence during physical work.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-2 border-red-200">
              <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-lg mb-4">
                <span className="text-3xl">🚨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Urgent Task Support</h3>
              <p className="text-gray-600">
                For critical cases, urgent mode instantly shows nearest stock and fastest path—helping you complete urgent dispensing in seconds.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-2 border-blue-200">
              <div className="flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg mb-4">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Site Inventory View</h3>
              <p className="text-gray-600">
                See stock across all pharmacy sites, ward dispensaries, and storage locations from one screen—no more walking or calling around.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-2 border-gray-200">
              <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-lg mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Work Queue Management</h3>
              <p className="text-gray-600">
                Track prescriptions in your dispensing queue, prioritize urgent cases, and manage workflow during busy periods efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Staff Workflow Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Staff Use MediGuide AI During Work
            </h2>
            <p className="text-xl text-gray-600">
              Seamlessly integrated into physical medicine-handling workflows
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Receive Task</h3>
              <p className="text-gray-600 text-sm">
                Prescription arrives or patient requests medicine
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Get AI Guidance</h3>
              <p className="text-gray-600 text-sm">
                Check availability, verify details, get substitutes if needed
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Execute Task</h3>
              <p className="text-gray-600 text-sm">
                Dispense, administer, or process with confidence
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Complete</h3>
              <p className="text-gray-600 text-sm">
                Task done faster, safer, and with fewer errors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Benefits for Healthcare Operations
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">For Pharmacies</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">60% faster prescription fulfillment during peak hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Reduce dispensing errors with AI verification support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Handle urgent cases more efficiently with priority mode</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Less staff time wasted searching and coordinating</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">For Clinics & Hospitals</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Nurses get instant guidance during medicine administration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Reduce coordination overhead between departments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Multi-site inventory visibility from any location</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Support safer medicine-handling practices</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">For Healthcare Staff</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Work with more confidence during physical tasks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Get expert-level guidance in seconds, not minutes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Reduce stress during urgent and high-pressure situations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <span className="text-lg">Focus on patient care instead of administrative tasks</span>
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
            Urgent Task Support
          </h2>
          <p className="text-xl md:text-2xl mb-8">
            When handling critical cases during emergencies or high-pressure situations:
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold text-lg mb-1">Instant Results</div>
              <p className="text-sm">AI prioritizes nearest available stock locations first</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-bold text-lg mb-1">Fastest Path</div>
              <p className="text-sm">Shows quickest retrieval route and location</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-bold text-lg mb-1">Confirmed Stock</div>
              <p className="text-sm">Only displays verified in-stock items</p>
            </div>
          </div>
          <Link
            to="/signup"
            className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-2xl"
          >
            Experience Urgent Mode
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Get AI Guidance During Physical Work
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join healthcare teams using MediGuide AI for faster, safer, more confident medicine handling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-block bg-primary-600 text-white px-10 py-4 rounded-lg text-xl font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <a
              href="#"
              className="inline-block bg-white text-primary-600 px-10 py-4 rounded-lg text-xl font-semibold border-2 border-primary-600 hover:bg-primary-50 transition"
            >
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MediGuide AI</h3>
              <p className="text-gray-400">
                AI guidance for physical medicine-handling work in healthcare settings.
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
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition">Documentation</Link></li>
                <li><Link to="/" className="hover:text-white transition">Training</Link></li>
                <li><Link to="/" className="hover:text-white transition">Support</Link></li>
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
