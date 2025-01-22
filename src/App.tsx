import React, { useEffect, useState } from 'react';
import {
  Shield,
  Scale,
  Clock,
  FileText,
  MessageSquare,
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  Brain,
  Menu,
  X
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id') || '';

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-indigo-600 animate-float" />
              <span className="text-xl font-bold gradient-text">LegalFinanceAI</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="#features" className={`nav-link ${activeSection === 'features' ? 'text-indigo-600' : ''}`}>Features</a>
              <a href="#security" className={`nav-link ${activeSection === 'security' ? 'text-indigo-600' : ''}`}>Security</a>
              <a href="#stats" className={`nav-link ${activeSection === 'stats' ? 'text-indigo-600' : ''}`}>Stats</a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                Get Started
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <a href="#features" className="block py-2 text-gray-600 hover:text-indigo-600">Features</a>
              <a href="#security" className="block py-2 text-gray-600 hover:text-indigo-600">Security</a>
              <a href="#stats" className="block py-2 text-gray-600 hover:text-indigo-600">Stats</a>
              <button className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight fade-in">
              AI-Powered Assistant for
              <span className="block gradient-text">Legal & Finance Professionals</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto fade-in" style={{ animationDelay: '0.2s' }}>
              Streamline your workflow with intelligent document analysis, compliance tracking, and client management tools designed for Indian professionals.
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 fade-in" style={{ animationDelay: '0.4s' }}>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300 flex items-center justify-center">
                Book Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Comprehensive Solutions for Your Practice
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-indigo-600" />}
              title="Document Analysis"
              description="Extract key insights from legal and financial documents with 95%+ accuracy"
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-indigo-600" />}
              title="Multilingual Chatbot"
              description="Handle client queries in English, Hindi, Gujarati, and Tamil"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-indigo-600" />}
              title="Compliance Tracking"
              description="Automated tracking for GST, Income Tax, and ROC filings"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-indigo-600" />}
              title="Analytics Dashboard"
              description="Generate detailed insights and reports for better decision making"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-indigo-600" />}
              title="Client Management"
              description="Secure client information management with role-based access"
            />
            <FeatureCard
              icon={<Scale className="w-8 h-8 text-indigo-600" />}
              title="Legal References"
              description="Access and analyze Indian case laws and legal precedents"
            />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Enterprise-Grade Security
              </h2>
              <div className="space-y-6">
                <SecurityFeature
                  title="AES-256 Encryption"
                  description="Your data is protected with military-grade encryption"
                />
                <SecurityFeature
                  title="Role-Based Access"
                  description="Granular control over user permissions and data access"
                />
                <SecurityFeature
                  title="Audit Logging"
                  description="Comprehensive audit trails for all system activities"
                />
                <SecurityFeature
                  title="99.9% Uptime"
                  description="Reliable service with continuous monitoring"
                />
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Shield className="w-64 h-64 text-indigo-600 opacity-90 animate-float" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat number="95%" label="Document Analysis Accuracy" />
            <Stat number="4" label="Supported Languages" />
            <Stat number="99.9%" label="System Uptime" />
            <Stat number="500ms" label="Response Time" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; 2024 LegalFinanceAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function SecurityFeature({ title, description }) {
  return (
    <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm">
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-indigo-100">{label}</div>
    </div>
  );
}

export default App;