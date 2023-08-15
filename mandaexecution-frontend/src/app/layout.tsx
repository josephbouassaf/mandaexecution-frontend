import './globals.css'
import Footer from './components/common/Footer'
import { Providers } from './providers'
import Navbar from './components/common/Navbar'

import "@fontsource/space-grotesk";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{fontFamily:'Space Grotesk'}}>
        <Providers>
          <Navbar>
          </Navbar>
          {children}
        </Providers>
      </body>
    </html>
  )
}
