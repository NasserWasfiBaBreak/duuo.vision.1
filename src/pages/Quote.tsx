import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { QuoteData } from '../types/quote';
import { initialQuoteData } from '../types/quote';
import ProgressBar from '../components/ProgressBar';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';

const CANADIAN_PROVINCES = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
];

const LICENSE_CLASSES = [
  { value: 'G', label: 'Class G (Full License)' },
  { value: 'G2', label: 'Class G2' },
  { value: 'G1', label: 'Class G1' },
  { value: 'Other', label: 'Other' },
];

const PRIMARY_USE_OPTIONS = [
  { value: 'commute', label: 'Commuting to Work' },
  { value: 'pleasure', label: 'Pleasure/Personal' },
  { value: 'business', label: 'Business Use' },
];

const ANNUAL_KM_OPTIONS = [
  { value: '0-5000', label: '0 - 5,000 km' },
  { value: '5000-10000', label: '5,000 - 10,000 km' },
  { value: '10000-15000', label: '10,000 - 15,000 km' },
  { value: '15000-20000', label: '15,000 - 20,000 km' },
  { value: '20000+', label: '20,000+ km' },
];

const PARKING_OPTIONS = [
  { value: 'garage', label: 'Garage' },
  { value: 'driveway', label: 'Driveway' },
  { value: 'street', label: 'Street' },
  { value: 'parking-lot', label: 'Parking Lot' },
];

const COVERAGE_OPTIONS = [
  { value: 'liability', label: 'Liability Only' },
  { value: 'collision', label: 'Collision' },
  { value: 'comprehensive', label: 'Comprehensive' },
  { value: 'full', label: 'Full Coverage' },
];

const DEDUCTIBLE_OPTIONS = [
  { value: '250', label: '$250' },
  { value: '500', label: '$500' },
  { value: '1000', label: '$1,000' },
  { value: '2500', label: '$2,500' },
];

export default function Quote() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [entryMethod, setEntryMethod] = useState<'scan' | 'manual' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuoteData>(initialQuoteData);
  const [drivingRecord, setDrivingRecord] = useState<{
    claims: Array<{ date: string; type: string; amount: string }>;
    violations: Array<{ date: string; type: string; points: number }>;
    suspensions: Array<{ date: string; reason: string; duration: string }>;
    isLoading: boolean;
    isLoaded: boolean;
  }>({
    claims: [],
    violations: [],
    suspensions: [],
    isLoading: false,
    isLoaded: false,
  });
  const [vehicleEntryMethod, setVehicleEntryMethod] = useState<'vin' | 'manual' | null>(null);
  const [isLookingUpVin, setIsLookingUpVin] = useState(false);
  const [vehicleLoadedFromVin, setVehicleLoadedFromVin] = useState(false);

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

  const stepLabels = ['Personal Info', 'Vehicle', 'Coverage'];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    // If on VIN lookup screen, trigger VIN lookup instead of moving to next step
    if (currentStep === 2 && vehicleEntryMethod === 'vin' && !formData.vehicleYear) {
      lookupVehicleByVin(formData.vin);
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/summary', { state: { quoteData: formData } });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setEntryMethod(null);
    }
  };

  const fetchDrivingRecord = (licenseNumber: string) => {
    setDrivingRecord(prev => ({ ...prev, isLoading: true }));

    // Simulate API call with 2 second delay
    setTimeout(() => {
      // Simulate response based on license number
      const mockRecord = {
        claims: [
          { date: '2023-03-15', type: 'Minor Collision', amount: '$3,200' },
          { date: '2021-08-22', type: 'Windshield Damage', amount: '$850' },
        ],
        violations: [
          { date: '2024-01-10', type: 'Speeding (15 km/h over)', points: 3 },
        ],
        suspensions: [],
        isLoading: false,
        isLoaded: true,
      };

      setDrivingRecord(mockRecord);
    }, 2000);
  };

  const lookupVehicleByVin = (vin: string) => {
    setIsLookingUpVin(true);

    // Simulate VIN lookup API call
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        vehicleYear: '2020',
        vehicleMake: 'Ford',
        vehicleModel: 'F-150 XLT SuperCrew',
      }));
      setIsLookingUpVin(false);
      setVehicleEntryMethod('manual');
      setVehicleLoadedFromVin(true);
    }, 2000);
  };

  const handleScanLicense = () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // After scan completes, fill form with placeholder data
    setTimeout(() => {
      const licenseNum = 'S1234-56789-01234';
      setFormData({
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '1990-05-15',
        email: 'john.smith@email.com',
        phone: '(416) 555-0123',
        address: '123 Main Street',
        city: 'Toronto',
        province: 'ON',
        postalCode: 'M5V 3A8',
        licenseNumber: licenseNum,
        licenseClass: 'G',
        yearsLicensed: '8',
        vehicleYear: '2020',
        vehicleMake: 'Ford',
        vehicleModel: 'F-150',
        vin: '1FTFW1E84LFA12345',
        primaryUse: 'commute',
        annualKilometers: '10000-15000',
        parkingLocation: 'garage',
        coverageType: 'full',
        deductible: '500',
      });
      setIsScanning(false);
      setEntryMethod('manual');
      // Fetch driving record after form is filled
      fetchDrivingRecord(licenseNum);
    }, 3000);
  };

  // Scanner Screen
  if (isScanning) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Floating Navigation Bar */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg py-4' : 'bg-white/95 backdrop-blur-sm shadow-md py-4'
        }`}>
          <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-ford-blue cursor-pointer" onClick={() => navigate('/')}>
              DUUO
            </h1>
            <button
              onClick={() => {
                setIsScanning(false);
                setScanProgress(0);
              }}
              className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </nav>

        {/* Scanner Interface */}
        <div className="flex-1 pt-20 pb-4 px-4 flex items-center justify-center overflow-hidden">
          <div className="max-w-2xl w-full h-full flex flex-col justify-center py-4">
            <div className="text-center mb-4 animate-fadeInUp flex-shrink-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Scanning Driver's License
              </h2>
              <div className="h-1 w-24 bg-ford-blue mx-auto mb-2"></div>
              <p className="text-gray-600">Please hold your license steady in the frame</p>
            </div>

            {/* Scanner Frame */}
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 animate-fadeInUp flex-shrink-0" style={{ animationDelay: '0.2s' }}>
              {/* Scanner Viewfinder */}
              <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-[16/10] mb-3">
                {/* Scanning Line Animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full relative">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800 to-transparent opacity-50"></div>

                    {/* License Card Outline */}
                    <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
                      <div className="border-4 border-dashed border-ford-lightblue rounded-lg w-full max-w-md aspect-[1.6/1] relative">
                        {/* Corner markers */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 md:w-8 md:h-8 border-t-4 border-l-4 border-ford-blue"></div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 border-t-4 border-r-4 border-ford-blue"></div>
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 md:w-8 md:h-8 border-b-4 border-l-4 border-ford-blue"></div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 border-b-4 border-r-4 border-ford-blue"></div>

                        {/* Scanning line */}
                        <div
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ford-lightblue to-transparent transition-all duration-300"
                          style={{ top: `${scanProgress}%`, boxShadow: '0 0 20px rgba(45, 150, 205, 0.8)' }}
                        ></div>
                      </div>
                    </div>

                    {/* Camera icon */}
                    <div className="absolute top-3 left-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-ford-blue/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-700">Scanning Progress</span>
                  <span className="text-xs font-bold text-ford-blue">{Math.round(scanProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-ford-blue to-ford-lightblue h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Messages */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className={`flex-shrink-0 ${scanProgress > 20 ? 'text-green-500' : 'text-gray-400'}`}>
                    {scanProgress > 20 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-ford-blue rounded-full animate-spin"></div>
                    )}
                  </div>
                  <span className="text-xs">Detecting license format...</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <div className={`flex-shrink-0 ${scanProgress > 50 ? 'text-green-500' : 'text-gray-400'}`}>
                    {scanProgress > 50 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : scanProgress > 20 ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-ford-blue rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs">Reading barcode data...</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <div className={`flex-shrink-0 ${scanProgress > 80 ? 'text-green-500' : 'text-gray-400'}`}>
                    {scanProgress > 80 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : scanProgress > 50 ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-ford-blue rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs">Verifying information...</span>
                </div>
              </div>

              {/* Success message at 100% */}
              {scanProgress === 100 && (
                <div className="bg-green-50 border-l-4 border-green-500 p-2.5 rounded animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold text-green-800 text-xs">Scan Complete!</p>
                      <p className="text-xs text-green-700">Information extracted successfully.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center mt-3 text-xs text-gray-500 animate-fadeInUp flex-shrink-0" style={{ animationDelay: '0.4s' }}>
              <p>🔒 Your license data is processed securely and not stored</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Entry Method Selection Screen
  if (entryMethod === null) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
        {/* Floating Navigation Bar */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg py-4' : 'bg-white/95 backdrop-blur-sm shadow-md py-4'
        }`}>
          <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-ford-blue cursor-pointer" onClick={() => navigate('/')}>
              DUUO
            </h1>
            <button
              onClick={() => navigate('/consent')}
              className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Back
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12 animate-fadeInUp">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                How would you like to get started?
              </h2>
              <div className="h-1 w-24 bg-ford-blue mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Choose your preferred method to provide your information</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              {/* Scan License Option */}
              <div
                onClick={handleScanLicense}
                className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-ford-blue group"
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-ford-blue to-ford-lightblue rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-ford-blue transition-colors">
                    Scan Driver's License
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Quick and easy! Scan the barcode on your driver's license to automatically fill in your information.
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-ford-blue flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Fastest method (30 seconds)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-ford-blue flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Auto-fills your information</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-ford-blue flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Accurate data entry</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <span className="inline-block bg-ford-blue text-white text-sm px-4 py-2 rounded-full font-semibold">
                      Recommended
                    </span>
                  </div>
                </div>
              </div>

              {/* Manual Entry Option */}
              <div
                onClick={() => setEntryMethod('manual')}
                className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-ford-blue group"
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-ford-blue transition-colors">
                    Enter Manually
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Prefer to type? Fill out the form manually at your own pace with our easy-to-use interface.
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Complete control over entry</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Step-by-step guidance</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Takes about 2 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8 text-sm text-gray-500 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <p>🔒 Your information is secure and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form Screen (Manual Entry or After Scan)
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
            Get Your Insurance Quote
          </p>
          <p className="text-lg text-white/80 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            Step {currentStep} of 3: {stepLabels[currentStep - 1]}
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Form Content with Better Design */}
      <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 transform -mt-20 relative z-10 animate-fadeInUp">

            <ProgressBar
              currentStep={currentStep}
              totalSteps={3}
              stepLabels={stepLabels}
            />

            <form onSubmit={handleNext}>
              {/* Step 1: Personal Information & Address */}
              {currentStep === 1 && (
                <div>
                  {entryMethod !== null && (
                    <div className="flex justify-end mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEntryMethod(null);
                          setIsScanning(false);
                          setFormData(initialQuoteData);
                          setDrivingRecord({
                            claims: [],
                            violations: [],
                            suspensions: [],
                            isLoading: false,
                            isLoaded: false,
                          });
                        }}
                        className="text-ford-blue hover:text-ford-darkblue text-sm font-medium inline-flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Change Method
                      </button>
                    </div>
                  )}

                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <InputField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <InputField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <InputField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-6 mt-8">
                    Address Information
                  </h3>
                  <InputField
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <SelectField
                      label="Province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      options={CANADIAN_PROVINCES}
                      required
                    />
                  </div>
                  <InputField
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    placeholder="A1A 1A1"
                    pattern="[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d"
                  />

                  <h3 className="text-xl font-semibold text-gray-800 mb-6 mt-8">
                    Driver's License Information
                  </h3>
                  <InputField
                    label="Driver's License Number"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <SelectField
                      label="License Class"
                      name="licenseClass"
                      value={formData.licenseClass}
                      onChange={handleInputChange}
                      options={LICENSE_CLASSES}
                      required
                    />
                    <InputField
                      label="Years Licensed"
                      name="yearsLicensed"
                      type="number"
                      value={formData.yearsLicensed}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="80"
                    />
                  </div>

                  {/* Driving Record Section */}
                  {formData.licenseNumber && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Driving Record
                        </h3>
                        {!drivingRecord.isLoaded && !drivingRecord.isLoading && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => fetchDrivingRecord(formData.licenseNumber)}
                              className="px-4 py-2 bg-ford-blue text-white rounded-lg hover:bg-ford-darkblue transition-colors text-sm font-semibold"
                            >
                              Auto-Check Record
                            </button>
                            <button
                              type="button"
                              onClick={() => setDrivingRecord(prev => ({ ...prev, isLoaded: true }))}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
                            >
                              Enter Manually
                            </button>
                          </div>
                        )}
                      </div>

                      {drivingRecord.isLoading && (
                        <div className="bg-blue-50 border border-ford-lightblue rounded-xl p-6 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-6 h-6 border-3 border-ford-lightblue border-t-ford-blue rounded-full animate-spin"></div>
                            <p className="text-ford-blue font-medium">Retrieving driving record...</p>
                          </div>
                        </div>
                      )}

                      {drivingRecord.isLoaded && (
                        <div className="space-y-4">
                          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                              {/* Previous Claims */}
                              <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Previous Claims ({drivingRecord.claims.length})
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDrivingRecord(prev => ({
                                        ...prev,
                                        claims: [...prev.claims, { date: '', type: '', amount: '' }]
                                      }));
                                    }}
                                    className="text-ford-blue hover:text-ford-darkblue text-sm font-medium flex items-center gap-1"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Claim
                                  </button>
                                </div>
                                {drivingRecord.claims.length === 0 ? (
                                  <p className="text-sm text-gray-500 text-center py-4">No claims added. Click "Add Claim" to add one.</p>
                                ) : (
                                  <div className="space-y-3">
                                    {drivingRecord.claims.map((claim, index) => (
                                      <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                                          <InputField
                                            label="Date"
                                            name={`claim-date-${index}`}
                                            type="date"
                                            value={claim.date}
                                            onChange={(e) => {
                                              const newClaims = [...drivingRecord.claims];
                                              newClaims[index].date = e.target.value;
                                              setDrivingRecord(prev => ({ ...prev, claims: newClaims }));
                                            }}
                                            required
                                          />
                                          <InputField
                                            label="Type"
                                            name={`claim-type-${index}`}
                                            value={claim.type}
                                            onChange={(e) => {
                                              const newClaims = [...drivingRecord.claims];
                                              newClaims[index].type = e.target.value;
                                              setDrivingRecord(prev => ({ ...prev, claims: newClaims }));
                                            }}
                                            placeholder="e.g., Minor Collision"
                                            required
                                          />
                                          <InputField
                                            label="Amount"
                                            name={`claim-amount-${index}`}
                                            value={claim.amount}
                                            onChange={(e) => {
                                              const newClaims = [...drivingRecord.claims];
                                              newClaims[index].amount = e.target.value;
                                              setDrivingRecord(prev => ({ ...prev, claims: newClaims }));
                                            }}
                                            placeholder="e.g., $3,200"
                                            required
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setDrivingRecord(prev => ({
                                              ...prev,
                                              claims: prev.claims.filter((_, i) => i !== index)
                                            }));
                                          }}
                                          className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                                        >
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                          Remove
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Traffic Violations */}
                              <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                                    </svg>
                                    Traffic Violations ({drivingRecord.violations.length})
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDrivingRecord(prev => ({
                                        ...prev,
                                        violations: [...prev.violations, { date: '', type: '', points: 0 }]
                                      }));
                                    }}
                                    className="text-ford-blue hover:text-ford-darkblue text-sm font-medium flex items-center gap-1"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Violation
                                  </button>
                                </div>
                                {drivingRecord.violations.length === 0 ? (
                                  <p className="text-sm text-gray-500 text-center py-4">No violations added. Click "Add Violation" to add one.</p>
                                ) : (
                                  <div className="space-y-3">
                                    {drivingRecord.violations.map((violation, index) => (
                                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                                          <InputField
                                            label="Date"
                                            name={`violation-date-${index}`}
                                            type="date"
                                            value={violation.date}
                                            onChange={(e) => {
                                              const newViolations = [...drivingRecord.violations];
                                              newViolations[index].date = e.target.value;
                                              setDrivingRecord(prev => ({ ...prev, violations: newViolations }));
                                            }}
                                            required
                                          />
                                          <InputField
                                            label="Type"
                                            name={`violation-type-${index}`}
                                            value={violation.type}
                                            onChange={(e) => {
                                              const newViolations = [...drivingRecord.violations];
                                              newViolations[index].type = e.target.value;
                                              setDrivingRecord(prev => ({ ...prev, violations: newViolations }));
                                            }}
                                            placeholder="e.g., Speeding"
                                            required
                                          />
                                          <InputField
                                            label="Demerit Points"
                                            name={`violation-points-${index}`}
                                            type="number"
                                            value={String(violation.points)}
                                            onChange={(e) => {
                                              const newViolations = [...drivingRecord.violations];
                                              newViolations[index].points = parseInt(e.target.value) || 0;
                                              setDrivingRecord(prev => ({ ...prev, violations: newViolations }));
                                            }}
                                            min="0"
                                            max="12"
                                            required
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setDrivingRecord(prev => ({
                                              ...prev,
                                              violations: prev.violations.filter((_, i) => i !== index)
                                            }));
                                          }}
                                          className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                                        >
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                          Remove
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* License Suspensions */}
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    License Suspensions ({drivingRecord.suspensions.length})
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDrivingRecord(prev => ({
                                        ...prev,
                                        suspensions: [...prev.suspensions, { date: '', reason: '', duration: '' }]
                                      }));
                                    }}
                                    className="text-ford-blue hover:text-ford-darkblue text-sm font-medium flex items-center gap-1"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Suspension
                                  </button>
                                </div>
                                {drivingRecord.suspensions.length === 0 ? (
                                  <p className="text-sm text-gray-500 text-center py-4">No suspensions added. Click "Add Suspension" to add one.</p>
                                ) : (
                                  <div className="space-y-3">
                                    {drivingRecord.suspensions.map((suspension, index) => (
                                      <div key={index} className="bg-red-100 border border-red-300 rounded-lg p-3">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                                          <InputField
                                            label="Date"
                                            name={`suspension-date-${index}`}
                                            type="date"
                                            value={suspension.date}
                                            onChange={(e) => {
                                              const newSuspensions = [...drivingRecord.suspensions];
                                              newSuspensions[index].date = e.target.value;
                                              setDrivingRecord(prev => ({ ...prev, suspensions: newSuspensions }));
                                            }}
                                            required
                                          />
                                          <InputField
                                            label="Reason"
                                            name={`suspension-reason-${index}`}
                                            value={suspension.reason}
                                            onChange={(e) => {
                                              const newSuspensions = [...drivingRecord.suspensions];
                                              newSuspensions[index].reason = e.target.value;
                                              setDrivingRecord(prev => ({ ...prev, suspensions: newSuspensions }));
                                            }}
                                            placeholder="e.g., DUI"
                                            required
                                          />
                                          <InputField
                                            label="Duration"
                                            name={`suspension-duration-${index}`}
                                            value={suspension.duration}
                                            onChange={(e) => {
                                              const newSuspensions = [...drivingRecord.suspensions];
                                              newSuspensions[index].duration = e.target.value;
                                              setDrivingRecord(prev => ({ ...prev, suspensions: newSuspensions }));
                                            }}
                                            placeholder="e.g., 30 days"
                                            required
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setDrivingRecord(prev => ({
                                              ...prev,
                                              suspensions: prev.suspensions.filter((_, i) => i !== index)
                                            }));
                                          }}
                                          className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                                        >
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                          Remove
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  This information may affect your insurance premium.
                                </p>
                              </div>
                            </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Vehicle Information */}
              {currentStep === 2 && (
                <div>
                  {/* Vehicle Entry Method Selection */}
                  {vehicleEntryMethod === null ? (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                        How would you like to enter vehicle information?
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* VIN Lookup Option */}
                        <div
                          onClick={() => {
                            setVehicleEntryMethod('vin');
                            setVehicleLoadedFromVin(false);
                            setFormData(prev => ({
                              ...prev,
                              vehicleYear: '',
                              vehicleMake: '',
                              vehicleModel: '',
                              vin: '',
                            }));
                          }}
                          className="bg-gradient-to-br from-ford-blue to-ford-lightblue text-white rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                          <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-bold mb-2">Lookup by VIN</h4>
                            <p className="text-sm text-white/90 mb-4">
                              Enter your Vehicle Identification Number to automatically retrieve vehicle details.
                            </p>
                            <div className="space-y-2 text-left">
                              <div className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Quick and accurate</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Auto-fills vehicle details</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <span className="inline-block bg-white text-ford-blue text-xs px-3 py-1 rounded-full font-semibold">
                                Recommended
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Manual Entry Option */}
                        <div
                          onClick={() => {
                            setVehicleEntryMethod('manual');
                            setVehicleLoadedFromVin(false);
                            setFormData(prev => ({
                              ...prev,
                              vehicleYear: '',
                              vehicleMake: '',
                              vehicleModel: '',
                              vin: '',
                            }));
                          }}
                          className="bg-white border-2 border-gray-300 rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:border-ford-blue hover:shadow-xl"
                        >
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-800 mb-2">Enter Manually</h4>
                            <p className="text-sm text-gray-600 mb-4">
                              Fill in your vehicle details manually if you prefer or don't have your VIN handy.
                            </p>
                            <div className="space-y-2 text-left">
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Step-by-step guidance</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Complete control</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : vehicleEntryMethod === 'vin' && !formData.vehicleYear ? (
                    /* VIN Lookup Screen */
                    <div>
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Vehicle Lookup
                        </h3>
                        <p className="text-gray-600">Enter your 17-character VIN to retrieve vehicle details</p>
                      </div>

                      {isLookingUpVin ? (
                        <div className="bg-blue-50 border border-ford-lightblue rounded-xl p-8 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-ford-lightblue border-t-ford-blue rounded-full animate-spin"></div>
                            <div>
                              <p className="text-ford-blue font-semibold text-lg">Looking up vehicle...</p>
                              <p className="text-gray-600 text-sm mt-1">Retrieving vehicle information from database</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                          <InputField
                            label="VIN (Vehicle Identification Number)"
                            name="vin"
                            value={formData.vin}
                            onChange={handleInputChange}
                            placeholder="17-character VIN"
                            pattern="[A-HJ-NPR-Z0-9]{17}"
                            maxLength={17}
                          />
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="text-sm text-gray-700 mb-2 flex items-start gap-2">
                              <svg className="w-5 h-5 text-ford-blue flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <span><strong>Where to find your VIN:</strong> Look on the driver's side dashboard (visible through windshield), driver's door jamb, or vehicle registration.</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Manual Entry Form (after VIN lookup or direct manual selection) */
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Vehicle Information
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setVehicleEntryMethod(null);
                            setVehicleLoadedFromVin(false);
                            setFormData(prev => ({
                              ...prev,
                              vehicleYear: '',
                              vehicleMake: '',
                              vehicleModel: '',
                              vin: '',
                            }));
                          }}
                          className="text-ford-blue hover:text-ford-darkblue text-sm font-medium inline-flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Change Method
                        </button>
                      </div>

                      {vehicleLoadedFromVin && (
                        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-6 animate-fadeIn">
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <p className="font-semibold text-green-800 text-sm">Vehicle Details Retrieved</p>
                              <p className="text-xs text-green-700">Review and adjust the information below if needed.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField
                          label="Year"
                          name="vehicleYear"
                          type="number"
                          value={formData.vehicleYear}
                          onChange={handleInputChange}
                          required
                          min="1900"
                          max={String(new Date().getFullYear() + 1)}
                        />
                        <InputField
                          label="Make"
                          name="vehicleMake"
                          value={formData.vehicleMake}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., Ford"
                        />
                      </div>
                      <InputField
                        label="Model"
                        name="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., F-150"
                      />
                      <InputField
                        label="VIN (Vehicle Identification Number)"
                        name="vin"
                        value={formData.vin}
                        onChange={handleInputChange}
                        required
                        placeholder="17-character VIN"
                        pattern="[A-HJ-NPR-Z0-9]{17}"
                        maxLength={17}
                      />
                      <SelectField
                        label="Primary Use"
                        name="primaryUse"
                        value={formData.primaryUse}
                        onChange={handleInputChange}
                        options={PRIMARY_USE_OPTIONS}
                        required
                      />
                      <SelectField
                        label="Annual Kilometers Driven"
                        name="annualKilometers"
                        value={formData.annualKilometers}
                        onChange={handleInputChange}
                        options={ANNUAL_KM_OPTIONS}
                        required
                      />
                      <SelectField
                        label="Parking Location"
                        name="parkingLocation"
                        value={formData.parkingLocation}
                        onChange={handleInputChange}
                        options={PARKING_OPTIONS}
                        required
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Coverage Selection */}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Coverage Options
                  </h3>
                  <SelectField
                    label="Coverage Type"
                    name="coverageType"
                    value={formData.coverageType}
                    onChange={handleInputChange}
                    options={COVERAGE_OPTIONS}
                    required
                  />
                  <SelectField
                    label="Deductible"
                    name="deductible"
                    value={formData.deductible}
                    onChange={handleInputChange}
                    options={DEDUCTIBLE_OPTIONS}
                    required
                  />
                  <div className="bg-blue-50 border-l-4 border-ford-blue p-4 rounded">
                    <p className="text-sm text-gray-700">
                      Your quote will be calculated based on the information provided.
                      Final rates may vary based on additional underwriting review.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={currentStep === 2 && vehicleEntryMethod === 'vin' && !formData.vehicleYear && formData.vin.length !== 17}
                  className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
                    currentStep === 2 && vehicleEntryMethod === 'vin' && !formData.vehicleYear && formData.vin.length !== 17
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-ford-blue hover:bg-ford-darkblue text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  }`}
                >
                  {currentStep === 3 ? 'Get Quote' : currentStep === 2 && vehicleEntryMethod === 'vin' && !formData.vehicleYear ? 'VIN Lookup' : 'Next'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
