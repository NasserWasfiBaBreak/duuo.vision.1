export interface QuoteData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;

  // Address
  address: string;
  city: string;
  province: string;
  postalCode: string;

  // Driver Information
  licenseNumber: string;
  licenseClass: string;
  yearsLicensed: string;

  // Vehicle Information
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vin: string;

  // Usage Information
  primaryUse: string;
  annualKilometers: string;
  parkingLocation: string;

  // Coverage
  coverageType: string;
  deductible: string;
}

export const initialQuoteData: QuoteData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  licenseNumber: '',
  licenseClass: '',
  yearsLicensed: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  vin: '',
  primaryUse: '',
  annualKilometers: '',
  parkingLocation: '',
  coverageType: '',
  deductible: '',
};
