import { useLocation, useNavigate } from 'react-router-dom';
import type { QuoteData } from '../types/quote';
import { useEffect, useState } from 'react';

export default function Summary() {
  const location = useLocation();
  const navigate = useNavigate();
  const quoteData = location.state?.quoteData as QuoteData;
  const [quote, setQuote] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'recommended' | 'premium'>('recommended');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!quoteData) {
      navigate('/');
      return;
    }

    // Simulate quote calculation
    setTimeout(() => {
      const baseRate = 1200;
      const ageMultiplier = calculateAgeMultiplier(quoteData.dateOfBirth);
      const vehicleMultiplier = calculateVehicleMultiplier(quoteData.vehicleYear);
      const usageMultiplier = calculateUsageMultiplier(quoteData.annualKilometers);
      const coverageMultiplier = calculateCoverageMultiplier(quoteData.coverageType);

      // Calculate recommended price (base calculation)
      const recommendedQuote = Math.round(
        baseRate * ageMultiplier * vehicleMultiplier * usageMultiplier * coverageMultiplier
      );

      setQuote(recommendedQuote);
    }, 1500);
  }, [quoteData, navigate]);

  const calculateAgeMultiplier = (dob: string): number => {
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 25) return 1.5;
    if (age < 35) return 1.0;
    if (age < 50) return 0.9;
    return 0.85;
  };

  const calculateVehicleMultiplier = (year: string): number => {
    const age = new Date().getFullYear() - parseInt(year);
    if (age < 3) return 1.2;
    if (age < 7) return 1.0;
    return 0.9;
  };

  const calculateUsageMultiplier = (km: string): number => {
    if (km.includes('20000+')) return 1.3;
    if (km.includes('15000-20000')) return 1.15;
    if (km.includes('10000-15000')) return 1.0;
    return 0.9;
  };

  const calculateCoverageMultiplier = (coverage: string): number => {
    switch (coverage) {
      case 'full': return 1.5;
      case 'comprehensive': return 1.3;
      case 'collision': return 1.1;
      default: return 0.8;
    }
  };

  if (!quoteData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Navigation Bar - Same as Landing */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1
            className={`text-2xl font-bold transition-colors duration-300 cursor-pointer ${
              scrolled ? 'text-ford-blue' : 'text-white'
            }`}
            onClick={() => {
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            DUUO
          </h1>
          <button
            onClick={() => navigate('/')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
              scrolled
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-white text-ford-blue hover:bg-gray-100'
            }`}
          >
            Back to Home
          </button>
        </div>
      </nav>

      {/* Hero Section with Ford Branding - Same as Landing */}
      <div className="relative bg-gradient-to-br from-ford-darkblue via-ford-blue to-ford-lightblue text-white py-32 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="animate-fadeInUp">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
              DUUO
            </h1>
            <div className="h-1 w-32 bg-white mx-auto mb-8"></div>
          </div>
          <p className="text-2xl md:text-3xl font-light mb-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Your Insurance Quote
          </p>
          <p className="text-lg text-white/80 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            {quote === null ? 'Calculating your personalized quote...' : 'Your personalized quote is ready!'}
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Content with Better Design */}
      <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 transform -mt-20 relative z-10 animate-fadeInUp">

          {quote === null ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-20 w-20 border-b-4 border-ford-blue mb-6"></div>
              <p className="text-xl text-gray-600 font-medium">Calculating your personalized quote...</p>
              <p className="text-sm text-gray-500 mt-2">This will only take a moment</p>
            </div>
          ) : (
            <>
              <div className="mb-8 animate-fadeInUp">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Choose Your Coverage Plan</h3>
                <p className="text-gray-600 text-center mb-6">Select the plan that best fits your needs</p>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Basic Plan */}
                  <div
                    onClick={() => setSelectedPlan('basic')}
                    className={`relative bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedPlan === 'basic'
                        ? 'border-ford-blue shadow-2xl'
                        : 'border-gray-200 hover:border-ford-lightblue shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {selectedPlan === 'basic' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-ford-blue text-white px-4 py-1 rounded-full text-xs font-semibold">
                        Selected
                      </div>
                    )}
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">Basic</h4>
                      <p className="text-gray-600 text-sm mb-4">Essential coverage</p>
                      <div className="mb-4">
                        <p className="text-4xl font-bold text-gray-800">${Math.round(quote * 0.75).toLocaleString()}</p>
                        <p className="text-gray-600 text-sm">/year</p>
                        <p className="text-gray-500 text-xs mt-1">or ${Math.round((quote * 0.75) / 12).toLocaleString()}/month</p>
                      </div>
                      <div className="border-t border-gray-200 pt-4 space-y-2 text-left text-sm">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>$1M Liability Coverage</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>$1,000 Deductible</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Standard Roadside Assistance</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-400">No Rental Car Coverage</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Plan */}
                  <div
                    onClick={() => setSelectedPlan('recommended')}
                    className={`relative bg-gradient-to-br from-ford-blue to-ford-lightblue text-white rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                      selectedPlan === 'recommended' ? 'ring-4 ring-yellow-400' : ''
                    }`}
                  >
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-xs font-bold">
                      RECOMMENDED
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-bold mb-2">Recommended</h4>
                      <p className="text-white/80 text-sm mb-4">Best value coverage</p>
                      <div className="mb-4">
                        <p className="text-5xl font-bold">${quote.toLocaleString()}</p>
                        <p className="text-white/80 text-sm">/year</p>
                        <p className="text-white/70 text-xs mt-1">or ${Math.round(quote / 12).toLocaleString()}/month</p>
                      </div>
                      <div className="border-t border-white/20 pt-4 space-y-2 text-left text-sm">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>$2M Liability Coverage</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>$500 Deductible</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Premium Roadside Assistance</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Rental Car Coverage (30 days)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Accident Forgiveness</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Premium Plan */}
                  <div
                    onClick={() => setSelectedPlan('premium')}
                    className={`relative bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedPlan === 'premium'
                        ? 'border-ford-blue shadow-2xl'
                        : 'border-gray-200 hover:border-ford-lightblue shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {selectedPlan === 'premium' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-ford-blue text-white px-4 py-1 rounded-full text-xs font-semibold">
                        Selected
                      </div>
                    )}
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">Premium</h4>
                      <p className="text-gray-600 text-sm mb-4">Maximum protection</p>
                      <div className="mb-4">
                        <p className="text-4xl font-bold text-gray-800">${Math.round(quote * 1.35).toLocaleString()}</p>
                        <p className="text-gray-600 text-sm">/year</p>
                        <p className="text-gray-500 text-xs mt-1">or ${Math.round((quote * 1.35) / 12).toLocaleString()}/month</p>
                      </div>
                      <div className="border-t border-gray-200 pt-4 space-y-2 text-left text-sm">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>$5M Liability Coverage</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>$250 Deductible</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>24/7 Concierge Roadside</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Rental Car Coverage (60 days)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Full Accident Forgiveness</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Gap Insurance Coverage</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>New Vehicle Replacement</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Quote Summary</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h4 className="font-bold text-ford-blue mb-4 text-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Personal Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600 font-medium">Name:</span> {quoteData.firstName} {quoteData.lastName}</p>
                      <p><span className="text-gray-600 font-medium">Email:</span> {quoteData.email}</p>
                      <p><span className="text-gray-600 font-medium">Phone:</span> {quoteData.phone}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h4 className="font-bold text-ford-blue mb-4 text-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Address
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>{quoteData.address}</p>
                      <p>{quoteData.city}, {quoteData.province}</p>
                      <p>{quoteData.postalCode}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h4 className="font-bold text-ford-blue mb-4 text-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      Vehicle
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600 font-medium">Year:</span> {quoteData.vehicleYear}</p>
                      <p><span className="text-gray-600 font-medium">Make:</span> {quoteData.vehicleMake}</p>
                      <p><span className="text-gray-600 font-medium">Model:</span> {quoteData.vehicleModel}</p>
                      <p><span className="text-gray-600 font-medium">VIN:</span> {quoteData.vin}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h4 className="font-bold text-ford-blue mb-4 text-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Coverage
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600 font-medium">Type:</span> {quoteData.coverageType.charAt(0).toUpperCase() + quoteData.coverageType.slice(1)}</p>
                      <p><span className="text-gray-600 font-medium">Deductible:</span> ${quoteData.deductible}</p>
                      <p><span className="text-gray-600 font-medium">Primary Use:</span> {quoteData.primaryUse.charAt(0).toUpperCase() + quoteData.primaryUse.slice(1)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-ford-blue p-8 rounded-xl mb-8 shadow-md animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <h4 className="font-bold text-ford-blue mb-4 text-xl flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Next Steps
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>You'll receive your policy documents via email</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Coverage can begin as soon as tomorrow</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mb-8 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate('/quote', { state: { quoteData } })}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Quote
                  </button>
                  <button
                    onClick={() => {
                      navigate('/checkout', {
                        state: {
                          quoteData,
                          selectedPlan,
                          quote
                        }
                      });
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Proceed to Checkout
                  </button>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  Return Home
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-white border-2 border-ford-blue hover:bg-ford-blue hover:text-white text-ford-blue font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Quote
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-8">
                Quote reference: DUUO-{Date.now().toString(36).toUpperCase()}
              </p>
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
