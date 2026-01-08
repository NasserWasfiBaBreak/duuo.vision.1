import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quoteData, selectedPlan, quote } = location.state || {};
  const [scrolled, setScrolled] = useState(false);

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
    if (!quoteData || !selectedPlan || !quote) {
      navigate('/');
    }
  }, [quoteData, selectedPlan, quote, navigate]);

  if (!quoteData || !selectedPlan || !quote) {
    return null;
  }

  // Calculate price based on selected plan
  const planPrice = selectedPlan === 'basic'
    ? Math.round(quote * 0.75)
    : selectedPlan === 'recommended'
    ? quote
    : Math.round(quote * 1.35);

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Navigation Bar */}
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

      {/* Hero Section with Ford Branding */}
      <div className="relative bg-gradient-to-br from-ford-darkblue via-ford-blue to-ford-lightblue text-white py-32 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="animate-fadeInUp">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 sm:mb-4 tracking-tight">
              DUUO
            </h1>
            <div className="h-0.5 sm:h-1 w-20 sm:w-24 md:w-32 bg-white mx-auto mb-6 sm:mb-8"></div>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-3 sm:mb-4 animate-fadeInUp px-2" style={{ animationDelay: '0.2s' }}>
            Complete Your Purchase
          </p>
          <p className="text-lg text-white/80 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            Secure your coverage in just a few clicks
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 transform -mt-20 relative z-10 animate-fadeInUp">

            {/* Payment Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Purchase</h3>

              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-ford-blue rounded-2xl p-8 shadow-xl">
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Selected Plan Summary</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">
                      {selectedPlan === 'basic' ? 'Basic Plan' : selectedPlan === 'recommended' ? 'Recommended Plan' : 'Premium Plan'}
                    </span>
                    <span className="text-2xl font-bold text-ford-blue">
                      ${planPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    or ${Math.round(planPrice / 12).toLocaleString()}/month
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="text-md font-bold text-gray-800 mb-4">Choose Payment Method</h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {/* Apple Pay */}
                    <button className="bg-black hover:bg-gray-800 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-2">
                      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      <span className="text-xs font-semibold">Apple Pay</span>
                    </button>

                    {/* Google Pay */}
                    <button className="bg-white hover:bg-gray-50 border-2 border-gray-200 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-2">
                      <svg className="w-10 h-10" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                      </svg>
                      <span className="text-xs font-semibold text-gray-700">Google Pay</span>
                    </button>

                    {/* Samsung Pay */}
                    <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-2">
                      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm16 10H5V7h14v10z"/>
                        <path d="M11 9h2v6h-2zm-4 2h2v4H7zm8 0h2v4h-2z"/>
                      </svg>
                      <span className="text-xs font-semibold">Samsung Pay</span>
                    </button>

                    {/* Credit/Debit Card */}
                    <button className="bg-gradient-to-br from-ford-blue to-ford-lightblue hover:from-ford-darkblue hover:to-ford-blue text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-2">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                      </svg>
                      <span className="text-xs font-semibold">Card</span>
                    </button>
                  </div>

                  <div className="bg-blue-50 border border-ford-lightblue rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-ford-blue flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm">
                        <p className="font-semibold text-ford-blue mb-1">Secure Payment Processing</p>
                        <p className="text-gray-700">Your payment information is encrypted and secure. We never store your full card details.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate('/summary', { state: { quoteData } })}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Summary
                  </button>
                  <button
                    onClick={() => {
                      alert('Payment processing would be implemented here. This is a demo.');
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Complete Purchase
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
