import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { ErrorBoundary } from './components/ErrorBoundary'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FairRent - Set Fair Rental Prices with Market Insights',
  description: 'Make data-driven decisions with our advanced rental pricing tool. Get market comparisons, compliance checks, and AI-powered insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Providers>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}
