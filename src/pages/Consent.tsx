import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Consent() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
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

  const handleContinue = () => {
    if (agreed) {
      navigate('/quote');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Floating Navigation Bar - Same as Landing Page */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg py-4' : 'bg-white/95 backdrop-blur-sm shadow-md py-4'
      }`}>
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-ford-blue cursor-pointer" onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            DUUO
          </h1>
          <button
            onClick={() => {
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Back to Home
          </button>
        </div>
      </nav>

      {/* Main Content - Full Height */}
      <div className="flex-1 pt-20 pb-4 px-4 flex items-center justify-center overflow-hidden">
        <div className="max-w-5xl w-full h-full flex flex-col py-4">
          {/* Header */}
          <div className="text-center mb-4 animate-fadeInUp flex-shrink-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 px-2">
              Do you agree to consent?
            </h2>
            <div className="h-1 w-24 bg-ford-blue mx-auto"></div>
          </div>

          {/* Main Content Card - Flexible Height */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp flex-1 flex flex-col" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1 overflow-hidden">
              {/* Left Column - Key Visual Points */}
              <div className="bg-gradient-to-br from-ford-blue to-ford-lightblue text-white p-4 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
                <div>
                  <div className="mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Your Privacy is Protected</h3>
                    <p className="text-white/90 text-xs sm:text-sm">We are committed to protecting your personal information in accordance with our privacy policy.</p>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm mb-0.5">Transparent Process</h4>
                        <p className="text-[10px] sm:text-xs text-white/80">Clear information about how we use your data</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm mb-0.5">Your Control</h4>
                        <p className="text-[10px] sm:text-xs text-white/80">Withdraw consent anytime with reasonable notice</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm mb-0.5">Fraud Prevention</h4>
                        <p className="text-[10px] sm:text-xs text-white/80">Your information helps us maintain service integrity</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm mb-0.5">60-Day Auto-Delete</h4>
                        <p className="text-[10px] sm:text-xs text-white/80">Unproceed quotes are automatically deleted</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-white/20">
                  <p className="text-[10px] sm:text-xs text-white/70">
                    🔒 Co-operators General Insurance Company
                  </p>
                </div>
              </div>

              {/* Right Column - Consent Text with Scroll */}
              <div className="p-4 sm:p-6 flex flex-col overflow-hidden">
                {/* Scrollable Consent Text */}
                <div className="flex-1 overflow-y-auto mb-3 sm:mb-4 pr-2 custom-scrollbar">
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                      <strong>Co-operators General Insurance Company ("Co-operators")</strong>, collects, uses, and discloses the personal information provided by you, and by third parties, to assess your insurance needs, offer you an insurance quote, analyze the use of this quote service, and prevent fraud, in accordance with Co-operators' privacy policy.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                      If you provide the personal information of others as part of this quote, you confirm that they consent to our collection, use and disclosure of their personal information as described above.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                      By clicking the box 'I agree' you consent to the collection, use and disclosure by Co-operators, as set out above.
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-ford-blue p-3 rounded">
                    <p className="text-xs text-gray-700">
                      <strong>Important:</strong> Quotes not proceeded with will be deleted in 60 days. You may withdraw your consent at any time, with reasonable notice and subject to legal and contractual obligations that Co-operators must fulfill. If you do not agree, this will prevent Co-operators from providing an insurance quote.
                    </p>
                  </div>
                </div>

                {/* Checkbox - Fixed at Bottom */}
                <div className="flex-shrink-0 mb-2 sm:mb-3">
                  <label className="flex items-start cursor-pointer group bg-gray-50 hover:bg-gray-100 p-2 sm:p-3 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 h-4 w-4 text-ford-blue border-gray-300 rounded focus:ring-ford-blue focus:ring-2 cursor-pointer flex-shrink-0"
                    />
                    <span className="ml-2 text-gray-700 font-medium text-xs sm:text-sm">
                      I agree to the consent terms outlined above and authorize Co-operators to collect, use, and disclose my personal information as described.
                    </span>
                  </label>
                </div>

                {/* Action Buttons - Fixed at Bottom */}
                <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all duration-200 border border-gray-300 text-xs sm:text-sm"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={!agreed}
                    className={`flex-1 font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all duration-300 text-xs sm:text-sm ${
                      agreed
                        ? 'bg-ford-blue hover:bg-ford-darkblue text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-3 text-xs text-gray-500 animate-fadeInUp flex-shrink-0" style={{ animationDelay: '0.4s' }}>
            <p>Questions about privacy? Contact us at <span className="text-ford-blue font-medium">privacy@duuo.ca</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
