import type { QuoteData } from '../types/quote';

const peerIdPrefix = 'duuo-scan-';
const sendTimeoutMs = 20000;
const receivedMessage = 'received';
const licenseFields = [
  'firstName',
  'lastName',
  'dateOfBirth',
  'licenseNumber',
  'address',
  'city',
  'province',
  'postalCode',
  'licenseClass',
] as const;

// Anyone with the session link can connect, so only accept the fields a license scan produces.
function readLicenseData(message: unknown): Partial<QuoteData> | null {
  if (typeof message !== 'object' || message === null) return null;

  const values = message as Record<string, unknown>;
  const licenseData: Partial<QuoteData> = {};
  for (const field of licenseFields) {
    const value = values[field];
    if (typeof value === 'string') licenseData[field] = value;
  }

  return Object.keys(licenseData).length > 0 ? licenseData : null;
}

export async function openPhoneScanLink(onLicenseRead: (licenseData: Partial<QuoteData>) => void) {
  const { Peer } = await import('peerjs');
  const sessionId = crypto.randomUUID();
  const peer = new Peer(`${peerIdPrefix}${sessionId}`);
  let closed = false;

  peer.on('connection', (connection) => {
    connection.on('data', (message) => {
      const licenseData = readLicenseData(message);
      if (!licenseData) return;

      void connection.send(receivedMessage);
      onLicenseRead(licenseData);
    });
  });
  peer.on('disconnected', () => {
    if (!closed) peer.reconnect();
  });

  const close = () => {
    closed = true;
    // Reading a license closes the scanner, so leave time for the phone's confirmation to go out.
    setTimeout(() => peer.destroy(), 1000);
  };

  try {
    await new Promise<void>((resolve, reject) => {
      peer.once('open', () => resolve());
      peer.once('error', reject);
    });
  } catch (error) {
    close();
    throw error;
  }

  return { sessionId, close };
}

// Connects only when sending, because opening the phone's camera app can drop an earlier connection.
export async function sendLicenseToLaptop(sessionId: string, licenseData: Partial<QuoteData>) {
  const { Peer } = await import('peerjs');
  const peer = new Peer();
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    await new Promise<void>((resolve, reject) => {
      timeout = setTimeout(() => reject(new Error('The laptop did not respond.')), sendTimeoutMs);
      peer.once('error', reject);
      peer.once('open', () => {
        const connection = peer.connect(`${peerIdPrefix}${sessionId}`, { reliable: true });
        connection.once('open', () => void connection.send(licenseData));
        connection.once('data', () => resolve());
        connection.once('error', reject);
      });
    });
  } finally {
    clearTimeout(timeout);
    peer.destroy();
  }
}
