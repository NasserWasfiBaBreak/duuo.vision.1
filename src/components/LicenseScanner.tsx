import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { BarcodeScanner as DynamsoftBarcodeScanner } from 'dynamsoft-barcode-reader-bundle';
import { parseAamvaLicense } from '../lib/aamvaLicense';
import type { QuoteData } from '../types/quote';

type DynamsoftBundle = typeof import('dynamsoft-barcode-reader-bundle');

let dynamsoftInitialization: Promise<void> | null = null;

interface LicenseScannerProps {
  onCancel: () => void;
  onUseManualEntry: () => void;
  onLicenseRead: (licenseData: Partial<QuoteData>) => void;
}

const licenseKey = import.meta.env.VITE_DYNAMSOFT_LICENSE_KEY;
// Starts at consent because the phone is a new session. The scanner is the first quote step, so nothing is lost.
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const phoneOrigin = (isLocalhost && import.meta.env.VITE_DEV_PHONE_ORIGIN) || window.location.origin;
const phoneUrl = `${phoneOrigin}${import.meta.env.BASE_URL}#/consent`;
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
const photoTemplate = 'ReadBarcodes_ReadRateFirst';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'An unexpected scanner error occurred.';
}

function initializeDynamsoft(
  bundle: Pick<DynamsoftBundle, 'CoreModule' | 'LicenseManager'>,
  key: string,
) {
  if (!dynamsoftInitialization) {
    bundle.CoreModule.engineResourcePaths.rootDirectory = 'https://cdn.jsdelivr.net/npm/';
    dynamsoftInitialization = (async () => {
      await bundle.LicenseManager.initLicense(key, true);
      await bundle.CoreModule.loadWasm();
    })().catch((error: unknown) => {
      dynamsoftInitialization = null;
      throw error;
    });
  }

  return dynamsoftInitialization;
}

export default function LicenseScanner({
  onCancel,
  onUseManualEntry,
  onLicenseRead,
}: LicenseScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<DynamsoftBarcodeScanner | null>(null);
  const [status, setStatus] = useState('Preparing the license scanner...');
  const [error, setError] = useState('');
  const [phoneQrCode, setPhoneQrCode] = useState('');
  const [isReadingPhoto, setIsReadingPhoto] = useState(false);

  // Photos keep the camera's full resolution, which dense license barcodes often need.
  const handlePhotoSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0];
    event.target.value = '';
    if (!photo || !licenseKey) return;

    setError('');
    setIsReadingPhoto(true);
    try {
      const bundle = await import('dynamsoft-barcode-reader-bundle');
      await initializeDynamsoft(bundle, licenseKey);

      const router = await bundle.CaptureVisionRouter.createInstance();
      try {
        const settings = await router.getSimplifiedSettings(photoTemplate);
        settings.barcodeSettings.barcodeFormatIds = bundle.EnumBarcodeFormat.BF_PDF417;
        await router.updateSettings(photoTemplate, settings);

        const result = await router.capture(photo, photoTemplate);
        const barcodeText = result.decodedBarcodesResult?.barcodeResultItems?.[0]?.text;
        const licenseData = barcodeText ? parseAamvaLicense(barcodeText) : null;
        if (licenseData) {
          onLicenseRead(licenseData);
        } else {
          setError('No license barcode was found in that photo. Try again in good light, without glare, with the barcode filling most of the picture.');
        }
      } finally {
        router.dispose();
      }
    } catch (photoError) {
      setError(`Unable to read that photo: ${getErrorMessage(photoError)}`);
    } finally {
      setIsReadingPhoto(false);
    }
  };

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let active = true;
    void import('qrcode')
      .then(({ toDataURL }) => toDataURL(phoneUrl, { margin: 1, width: 224 }))
      .then((qrCode) => {
        if (active) setPhoneQrCode(qrCode);
      })
      .catch(() => {
        // The QR code is optional, so the camera and upload options still work without it.
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const startScanner = async () => {
      if (!licenseKey) {
        setError('The Dynamsoft license is not configured. Set VITE_DYNAMSOFT_LICENSE_KEY or enter your information manually.');
        return;
      }

      try {
        const {
          BarcodeScanner,
          CoreModule,
          EnumBarcodeFormat,
          EnumScanMode,
          LicenseManager,
        } = await import('dynamsoft-barcode-reader-bundle');
        await initializeDynamsoft({ CoreModule, LicenseManager }, licenseKey);

        if (!active || !containerRef.current) return;

        const scanner = new BarcodeScanner({
          license: licenseKey,
          container: containerRef.current,
          // onUniqueBarcodeScanned only fires in this mode; SM_SINGLE reports through launch().
          scanMode: EnumScanMode.SM_MULTI_UNIQUE,
          // License PDF417 codes are dense, and the default preset gives up after 500ms per frame.
          utilizedTemplateNames: { multi_unique: 'ReadDenseBarcodes' },
          autoStartCapturing: true,
          showResultView: false,
          showPoweredByDynamsoft: false,
          // Fixed-focus laptop webcams blur at close range, so let people pick a sharper camera.
          scannerViewConfig: { cameraSwitchControl: 'listAll' },
          barcodeFormats: EnumBarcodeFormat.BF_PDF417,
          onInitReady: ({ cameraEnhancer }) => {
            const resolution = isTouchDevice ? { width: 3840, height: 2160 } : { width: 1920, height: 1080 };
            cameraEnhancer.setResolution(resolution).catch(() => {
              // Keep the camera's default resolution if it can't provide this one.
            });
          },
          onCameraOpen: () => {
            if (active) setStatus('Camera ready. Center the barcode on the back of your license.');
          },
          onCameraOpenFailed: (cameraError) => {
            if (active) setError(`Unable to open the camera: ${cameraError.message}`);
          },
          onUniqueBarcodeScanned: (barcode) => {
            if (!active) return;

            const licenseData = parseAamvaLicense(barcode.text);
            if (!licenseData) {
              setError('A driver license barcode was not recognized. Try again with the PDF417 barcode on the back of your license.');
              return;
            }

            onLicenseRead(licenseData);
          },
        });

        scannerRef.current = scanner;
        setStatus('Opening camera...');
        await scanner.launch();
      } catch (scannerError) {
        if (active) setError(`Unable to start the license scanner: ${getErrorMessage(scannerError)}`);
      }
    };

    void startScanner();

    return () => {
      active = false;
      scannerRef.current?.dispose();
      scannerRef.current = null;
    };
  }, [onLicenseRead]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 shadow-md py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-ford-blue">DUUO</h1>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </nav>

      <main className="flex-1 pt-24 pb-8 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-5">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Scan Driver&apos;s License
            </h2>
            <p className="text-gray-600">{status}</p>
          </div>

          <div
            ref={containerRef}
            className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-900"
          />

          <label
            className={`mt-4 block w-full rounded-lg bg-ford-blue px-6 py-3 text-center font-semibold text-white ${
              isReadingPhoto ? 'opacity-60' : 'cursor-pointer hover:opacity-90'
            }`}
          >
            {isReadingPhoto && 'Reading photo...'}
            {!isReadingPhoto && (isTouchDevice ? 'Take a photo of the barcode' : 'Upload a photo of the barcode')}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              disabled={isReadingPhoto}
              onChange={(event) => void handlePhotoSelected(event)}
            />
          </label>

          {error && (
            <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {phoneQrCode && (
            <div className="mt-4 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left">
              <img
                src={phoneQrCode}
                alt="QR code to continue on your phone"
                className="h-28 w-28 shrink-0"
              />
              <div>
                <p className="font-semibold text-gray-800">Scanning is easier on your phone</p>
                <p className="mt-1 text-sm text-gray-600">
                  Laptop cameras often can&apos;t focus on the barcode. Scan this code with your phone to continue there.
                </p>
              </div>
            </div>
          )}


          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={onUseManualEntry}
              className="text-ford-blue font-semibold hover:underline"
            >
              Enter information manually instead
            </button>
          </div>
          <p className="text-center mt-4 text-xs text-gray-500">
            Your license data is processed in this browser and is not stored by the scanner.
          </p>
        </div>
      </main>
    </div>
  );
}
