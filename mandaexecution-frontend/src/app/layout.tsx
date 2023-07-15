import './globals.css'
import Footer from './components/common/Footer'
import { Providers } from './providers'
import Navbar from './components/common/Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar>
          </Navbar>
          {children}
          <Footer/>
        </Providers>
      </body>
    </html>
  )
}
