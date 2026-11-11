import type { QuoteData } from '../types/quote';

// A relay reaches any network. Direct phone-to-laptop connections fail between most networks.
const relayUrl = 'https://ntfy.sh';
const topicPrefix = 'duuo-scan-';
const sendTimeoutMs = 20000;
const encryption = { name: 'AES-GCM', length: 256 };

const getLicenseTopic = (sessionId: string) => `${relayUrl}/${topicPrefix}${sessionId}`;
const getReceivedTopic = (sessionId: string) => `${getLicenseTopic(sessionId)}-received`;

async function encryptLicense(key: CryptoKey, licenseData: Partial<QuoteData>) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const text = new TextEncoder().encode(JSON.stringify(licenseData));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: encryption.name, iv }, key, text));
  return btoa(String.fromCharCode(...iv, ...encrypted));
}

async function decryptLicense(key: CryptoKey, message: string): Promise<Partial<QuoteData>> {
  const bytes = Uint8Array.from(atob(message), (character) => character.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt(
    { name: encryption.name, iv: bytes.slice(0, 12) },
    key,
    bytes.slice(12),
  );
  return JSON.parse(new TextDecoder().decode(decrypted));
}

function listen(topic: string, onMessage: (message: string) => void) {
  const events = new EventSource(`${topic}/sse`);
  events.onmessage = (event) => onMessage(JSON.parse(event.data).message);

  return new Promise<EventSource>((resolve, reject) => {
    events.onopen = () => resolve(events);
    events.onerror = () => {
      if (events.readyState === EventSource.CLOSED) reject(new Error('The relay is unavailable.'));
    };
  });
}

async function post(topic: string, message: string) {
  const response = await fetch(topic, { method: 'POST', body: message });
  if (!response.ok) throw new Error('The relay rejected the message.');
}

export async function openPhoneScanLink(onLicenseRead: (licenseData: Partial<QuoteData>) => void) {
  const sessionId = crypto.randomUUID();
  const key = await crypto.subtle.generateKey(encryption, true, ['encrypt', 'decrypt']);
  const { k: encodedKey } = await crypto.subtle.exportKey('jwk', key);

  const events = await listen(getLicenseTopic(sessionId), (message) => {
    void decryptLicense(key, message)
      .then(async (licenseData) => {
        onLicenseRead(licenseData);
        await post(getReceivedTopic(sessionId), 'received');
      })
      .catch(() => {
        // The relay is public, so ignore anything not encrypted with this session's key.
      });
  });

  // The key stays in the link's # part, which browsers never send to a server.
  return { sessionPath: `${sessionId}/${encodedKey}`, close: () => events.close() };
}

export async function sendLicenseToLaptop(
  sessionId: string,
  encodedKey: string,
  licenseData: Partial<QuoteData>,
) {
  const key = await crypto.subtle.importKey(
    'jwk',
    { kty: 'oct', k: encodedKey, alg: 'A256GCM', ext: true },
    encryption,
    false,
    ['encrypt'],
  );

  let events: EventSource | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await new Promise<void>((resolve, reject) => {
      timeout = setTimeout(() => reject(new Error('The laptop did not respond.')), sendTimeoutMs);
      listen(getReceivedTopic(sessionId), () => resolve())
        .then(async (openEvents) => {
          events = openEvents;
          await post(getLicenseTopic(sessionId), await encryptLicense(key, licenseData));
        })
        .catch(reject);
    });
  } finally {
    clearTimeout(timeout);
    events?.close();
  }
}
