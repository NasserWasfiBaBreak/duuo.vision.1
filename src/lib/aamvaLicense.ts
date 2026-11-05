import type { QuoteData } from '../types/quote';

const CANADIAN_PROVINCE_CODES = new Set([
  'AB',
  'BC',
  'MB',
  'NB',
  'NL',
  'NS',
  'ON',
  'PE',
  'QC',
  'SK',
]);

function getAamvaFields(barcodeText: string) {
  const fields = new Map<string, string>();
  const lines: string[] = [];
  let currentLine = '';

  for (const character of barcodeText) {
    const code = character.charCodeAt(0);
    if (character === '\r' || character === '\n' || (code >= 0x1c && code <= 0x1f)) {
      if (currentLine.trim()) lines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += character;
    }
  }
  if (currentLine.trim()) lines.push(currentLine);

  for (const line of lines) {
    // The first field follows the header and subfile type, as in "ANSI ...DLDAQ123".
    const fieldLine = line.trim().replace(/^(?:(?:ANSI |AAMVA).*?)?(?:DL|ID)(?=D[A-Z]{2})/, '');
    const match = fieldLine.match(/^([A-Z]{3})(.*)$/);
    if (match) {
      fields.set(match[1], match[2].trim());
    }
  }

  return fields;
}

function formatAamvaDate(value: string) {
  if (!/^\d{8}$/.test(value)) return undefined;

  const dateOrders = [
    { month: value.slice(0, 2), day: value.slice(2, 4), year: value.slice(4, 8) },
    { month: value.slice(4, 6), day: value.slice(6, 8), year: value.slice(0, 4) },
  ];

  for (const date of dateOrders) {
    const parsedDate = new Date(`${date.year}-${date.month}-${date.day}T00:00:00Z`);
    if (
      parsedDate.getUTCFullYear() === Number(date.year)
      && parsedDate.getUTCMonth() + 1 === Number(date.month)
      && parsedDate.getUTCDate() === Number(date.day)
    ) {
      return `${date.year}-${date.month}-${date.day}`;
    }
  }

  return undefined;
}

// Barcodes can pad postal codes, so keep only the standard "A1A 1A1" part.
function formatPostalCode(value: string) {
  const match = value.toUpperCase().replace(/[^A-Z0-9]/g, '').match(/^([A-Z]\d[A-Z])(\d[A-Z]\d)/);
  return match ? `${match[1]} ${match[2]}` : value;
}

export function parseAamvaLicense(barcodeText: string): Partial<QuoteData> | null {
  const fields = getAamvaFields(barcodeText);
  const parsed: Partial<QuoteData> = {};

  const firstName = fields.get('DAC')?.split('$')[0]?.trim();
  const lastName = fields.get('DCS')?.split('$')[0]?.trim();
  const dateOfBirth = fields.get('DBB');
  const licenseNumber = fields.get('DAQ');
  const address = fields.get('DAG');
  const city = fields.get('DAI');
  const province = fields.get('DAJ')?.toUpperCase();
  const postalCode = fields.get('DAK');
  const licenseClass = fields.get('DCA')?.toUpperCase();

  if (firstName) parsed.firstName = firstName;
  if (lastName) parsed.lastName = lastName;
  const formattedDateOfBirth = dateOfBirth && formatAamvaDate(dateOfBirth);
  if (formattedDateOfBirth) parsed.dateOfBirth = formattedDateOfBirth;
  if (licenseNumber) parsed.licenseNumber = licenseNumber;
  if (address) parsed.address = address;
  if (city) parsed.city = city;
  if (province && CANADIAN_PROVINCE_CODES.has(province)) parsed.province = province;
  if (postalCode) parsed.postalCode = formatPostalCode(postalCode);
  if (licenseClass) {
    parsed.licenseClass = ['G', 'G1', 'G2'].includes(licenseClass) ? licenseClass : 'Other';
  }

  return Object.keys(parsed).length > 0 ? parsed : null;
}
