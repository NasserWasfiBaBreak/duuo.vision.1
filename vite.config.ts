import { networkInterfaces } from 'node:os'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

function getLanAddress() {
  return Object.values(networkInterfaces())
    .flat()
    .find((address) => address?.family === 'IPv4' && !address.internal)?.address
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const lanAddress = command === 'serve' ? getLanAddress() : undefined

  return {
    // Phone browsers only allow the camera over HTTPS, so dev:phone serves a self-signed certificate.
    plugins: [react(), ...(process.env.DEV_HTTPS ? [basicSsl()] : [])],
    base: '/duuo.vision.1/',
    define: {
      // On localhost, the QR code has to point phones at this Mac's dev:phone server.
      'import.meta.env.VITE_DEV_PHONE_ORIGIN': JSON.stringify(
        lanAddress ? `https://${lanAddress}:5174` : '',
      ),
    },
  }
})
