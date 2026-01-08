import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Toronto, ON",
      text: "DUUO made getting insurance so easy! The quote process was incredibly fast and the rates were better than I expected.",
      rating: 5
    },
    {
      name: "Michael Chen",
      location: "Vancouver, BC",
      text: "Best insurance experience I've had. The customer service is outstanding and the coverage options are comprehensive.",
      rating: 5
    },
    {
      name: "Emma Williams",
      location: "Montreal, QC",
      text: "I saved over $400 switching to DUUO. The whole process took less than 10 minutes. Highly recommend!",
      rating: 5
    }
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "$2M+", label: "Claims Processed" },
    { number: "24/7", label: "Support Available" }
  ];

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
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            DUUO
          </h1>
          <button
            onClick={() => navigate('/consent')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
              scrolled
                ? 'bg-ford-blue text-white hover:bg-ford-darkblue'
                : 'bg-white text-ford-blue hover:bg-gray-100'
            }`}
          >
            Get Quote
          </button>
        </div>
      </nav>

      {/* Hero Section with Video Background Effect */}
      <div className="relative bg-gradient-to-br from-ford-darkblue via-ford-blue to-ford-lightblue text-white py-20 sm:py-24 md:py-32 lg:py-40 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="animate-fadeInUp">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 sm:mb-4 tracking-tight">
              DUUO
            </h1>
            <div className="h-0.5 sm:h-1 w-20 sm:w-24 md:w-32 bg-white mx-auto mb-6 sm:mb-8"></div>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-4 sm:mb-6 animate-fadeInUp px-2" style={{ animationDelay: '0.2s' }}>
            Premium Insurance Solutions
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto mb-8 sm:mb-10 animate-fadeInUp px-4" style={{ animationDelay: '0.4s' }}>
            Your trusted partner for comprehensive vehicle insurance across Canada
          </p>
          <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={() => navigate('/consent')}
              className="bg-white text-ford-blue hover:bg-gray-100 font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-2xl text-base sm:text-lg group"
            >
              Get Your Free Quote
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
            </button>
            <p className="text-xs sm:text-sm mt-3 sm:mt-4 text-white/70 px-2">✓ No credit card required  ✓ 2-minute process  ✓ Instant results</p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Trust Badges - Animated Stats */}
      <div className="py-8 sm:py-10 md:py-12 px-4 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-110 transition-transform duration-300"
                style={{ animation: `fadeInUp 0.8s ease-out ${index * 0.1}s forwards`, opacity: 0 }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ford-blue mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-gray-600 text-xs sm:text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Benefits Section with Hover Effects */}
      <div className="py-12 sm:py-14 md:py-16 lg:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fadeInUp">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
              Get Covered in 3 Simple Steps
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                title: "Quick Quote Process",
                time: "2min",
                description: "Get an instant quote in just 2 minutes with our streamlined application",
                icon: "⚡",
                delay: "0s"
              },
              {
                title: "Customer Support",
                time: "24/7",
                description: "Our dedicated team is always available to assist you whenever you need",
                icon: "💬",
                delay: "0.2s"
              },
              {
                title: "Secure & Confidential",
                time: "100%",
                description: "Your personal information is protected with industry-leading security",
                icon: "🔒",
                delay: "0.4s"
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 sm:p-7 md:p-8 bg-white border-2 border-gray-200 rounded-xl hover:border-ford-blue hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer"
                style={{ animation: `fadeInUp 0.8s ease-out ${benefit.delay} forwards`, opacity: 0 }}
              >
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 transform group-hover:scale-125 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <div className="text-ford-blue text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 group-hover:text-ford-lightblue transition-colors">
                  {benefit.time}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image/Video Section - Simulated with gradient and car icon */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-r from-ford-blue to-ford-lightblue text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-6 sm:mb-8">
            <svg className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 animate-bounce-slow" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">
            Protection You Can Trust
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            We understand that your vehicle is more than just transportation—it's your freedom, your livelihood, and your peace of mind. That's why we're committed to providing coverage that truly protects what matters most.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">A+ Rating</div>
              <div className="text-sm sm:text-base text-white/80">Industry Recognition</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Licensed</div>
              <div className="text-sm sm:text-base text-white/80">All Provinces</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg sm:col-span-2 md:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Fast Claims</div>
              <div className="text-sm sm:text-base text-white/80">Same-Day Processing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Testimonials Carousel */}
      <div className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ford-blue mb-3 sm:mb-4 px-2">
              What Our Customers Say
            </h2>
            <div className="h-0.5 sm:h-1 w-20 sm:w-24 bg-ford-blue mx-auto mb-4 sm:mb-6"></div>
          </div>

          <div className="relative bg-gray-50 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute inset-0 p-6 sm:p-8 md:p-10 lg:p-12'
                }`}
              >
                <div className="flex justify-center mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 text-center mb-4 sm:mb-6 italic px-2">
                  "{testimonial.text}"
                </p>
                <div className="text-center">
                  <p className="font-semibold text-ford-blue text-base sm:text-lg">{testimonial.name}</p>
                  <p className="text-gray-500 text-xs sm:text-sm">{testimonial.location}</p>
                </div>
              </div>
            ))}

            <div className="flex justify-center gap-2 mt-6 sm:mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'bg-ford-blue w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose DUUO Section with Icons */}
      <div className="py-12 sm:py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ford-blue mb-3 sm:mb-4 px-2">
              Why Choose DUUO?
            </h2>
            <div className="h-0.5 sm:h-1 w-20 sm:w-24 bg-ford-blue mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We partner with leading auto agencies across Canada to bring you the best coverage at competitive rates
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              { title: "Competitive Rates", desc: "Access exclusive rates through our extensive network of trusted insurance partners", icon: "M5 13l4 4L19 7" },
              { title: "Complete Protection", desc: "Comprehensive coverage options to protect you, your vehicle, and your loved ones", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
              { title: "Instant Coverage", desc: "Get covered quickly with our streamlined approval process", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { title: "Trusted Network", desc: "Partnered with multiple auto agencies across all Canadian provinces", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
              { title: "Flexible Options", desc: "Customize your coverage with flexible deductibles and payment plans", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title: "No Hidden Fees", desc: "Transparent pricing with no surprises - what you see is what you get", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-3 sm:gap-4 bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ford-blue rounded-lg flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 group-hover:text-ford-blue transition-colors">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coverage Types Section */}
      <div className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ford-blue mb-3 sm:mb-4 px-2">
              Coverage Options
            </h2>
            <div className="h-0.5 sm:h-1 w-20 sm:w-24 bg-ford-blue mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Choose the protection that's right for you and your vehicle
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: "Liability", features: ["Third-party liability", "Legal protection", "Provincial minimum"], popular: false },
              { title: "Collision", features: ["Accident coverage", "Vehicle repairs", "Replacement value"], popular: false },
              { title: "Comprehensive", features: ["Theft protection", "Weather damage", "Vandalism coverage"], popular: false },
              { title: "Full Coverage", features: ["All of the above", "Best value", "Maximum protection"], popular: true }
            ].map((coverage, index) => (
              <div
                key={index}
                className={`bg-white p-4 sm:p-5 md:p-6 rounded-xl border-2 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${
                  coverage.popular ? 'border-ford-blue shadow-xl sm:scale-105' : 'border-gray-200'
                }`}
              >
                {coverage.popular && (
                  <div className="inline-block bg-ford-blue text-white text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full mb-2 animate-pulse-slow">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg sm:text-xl font-bold text-ford-blue mb-2 sm:mb-3">{coverage.title}</h3>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                  {coverage.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-ford-blue mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section - Animated Steps */}
      <div className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ford-blue mb-3 sm:mb-4 px-2">
              How It Works
            </h2>
            <div className="h-0.5 sm:h-1 w-20 sm:w-24 bg-ford-blue mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Getting insured with DUUO is quick and easy
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-ford-blue via-ford-lightblue to-ford-blue" style={{ top: '32px' }}></div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative">
              {[
                { step: 1, title: "Fill Out Form", desc: "Provide your vehicle and driver information in our secure online form", icon: "📝" },
                { step: 2, title: "Get Instant Quote", desc: "Receive your personalized insurance quote immediately", icon: "⚡" },
                { step: 3, title: "Review & Confirm", desc: "Our team will contact you to finalize your coverage details", icon: "✓" },
                { step: 4, title: "Get Covered", desc: "Start driving with confidence knowing you're fully protected", icon: "🚗" }
              ].map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-ford-blue text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 shadow-lg transform hover:scale-125 transition-all duration-300 hover:rotate-12 relative z-10">
                    {item.step}
                  </div>
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{item.icon}</div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 px-2">{item.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm px-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-ford-blue mb-4">
              Frequently Asked Questions
            </h2>
            <div className="h-1 w-24 bg-ford-blue mx-auto mb-6"></div>
          </div>

          <div className="space-y-4">
            {[
              { q: "How quickly can I get coverage?", a: "Coverage can start as soon as tomorrow! Once your application is approved, you'll receive your policy documents immediately." },
              { q: "Can I cancel anytime?", a: "Yes, you can cancel your policy at any time. We offer flexible terms with no long-term commitments required." },
              { q: "What payment methods do you accept?", a: "We accept all major credit cards, debit cards, and direct bank transfers. Monthly payment plans are available." },
              { q: "Do you offer discounts?", a: "Yes! We offer various discounts including multi-vehicle, safe driver, and loyalty discounts. Get a quote to see what you qualify for." }
            ].map((faq, index) => (
              <details key={index} className="group bg-gray-50 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition-colors">
                <summary className="flex justify-between items-center font-semibold text-lg text-gray-800 list-none">
                  {faq.q}
                  <span className="text-ford-blue text-2xl group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section with Animation */}
      <div className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-r from-ford-blue to-ford-lightblue text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full gradient-shimmer"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fadeInUp px-2">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-white/90 px-4">
            Join thousands of satisfied Canadian drivers who trust DUUO for their insurance needs
          </p>
          <button
            onClick={() => navigate('/consent')}
            className="bg-white text-ford-blue hover:bg-gray-100 font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-2xl text-base sm:text-lg group"
          >
            Get Your Free Quote Now
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
          </button>
          <p className="text-xs sm:text-sm mt-4 sm:mt-6 text-white/80 px-2">✓ No obligations  ✓ Takes 2 minutes  ✓ 100% secure</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-ford-darkblue text-white py-8 sm:py-10 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">DUUO</h3>
              <p className="text-white/80">
                Premium insurance solutions through our trusted network of partners across Canada.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/80">
                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Coverage Options</li>
                <li className="hover:text-white cursor-pointer transition-colors">FAQ</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-white/80">
                <li>📞 1-800-DUUO-INS</li>
                <li>📧 info@duuo.ca</li>
                <li>🕐 Available 24/7</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                  <div key={social} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-all duration-300 transform hover:scale-110">
                    <span className="text-sm">f</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2026 DUUO Insurance Solutions. All rights reserved.</p>
            <p className="mt-2">Proudly serving Canadian drivers from coast to coast</p>
          </div>
        </div>
      </div>
    </div>
  );
}
