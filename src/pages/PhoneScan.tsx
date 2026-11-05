import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LicenseScanner from '../components/LicenseScanner';
import { sendLicenseToLaptop } from '../lib/phoneScanLink';
import type { QuoteData } from '../types/quote';

export default function PhoneScan() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();
  const [licenseData, setLicenseData] = useState<Partial<QuoteData> | null>(null);
  const [sendState, setSendState] = useState<'sending' | 'sent' | 'failed'>('sending');

  const sendLicense = useCallback(async (scannedLicense: Partial<QuoteData>) => {
    setLicenseData(scannedLicense);
    setSendState('sending');
    try {
      await sendLicenseToLaptop(sessionId, scannedLicense);
      setSendState('sent');
    } catch {
      setSendState('failed');
    }
  }, [sessionId]);

  if (!licenseData) {
    return (
      <LicenseScanner
        onCancel={() => navigate('/')}
        onLicenseRead={sendLicense}
        privacyNote="Your license is read on this phone and sent directly to your laptop."
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-ford-blue">DUUO</h1>
        {sendState === 'sending' && (
          <p className="text-lg font-semibold text-gray-800">Sending to your laptop...</p>
        )}
        {sendState === 'sent' && (
          <>
            <p className="text-xl font-bold text-gray-800">License sent</p>
            <p className="mt-2 text-gray-600">Continue on your laptop. You can close this page.</p>
          </>
        )}
        {sendState === 'failed' && (
          <>
            <p role="alert" className="text-gray-800">
              We couldn&apos;t reach your laptop. Keep the scan screen open there, then try again.
            </p>
            <button
              type="button"
              onClick={() => void sendLicense(licenseData)}
              className="mt-5 w-full rounded-lg bg-ford-blue px-6 py-3 font-semibold text-white hover:opacity-90"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
