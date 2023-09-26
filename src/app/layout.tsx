import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme-provider'
import Provider from '@/components/Provider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatPDF',
  description: 'Chat with all the available pdfs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <Provider>
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            <ThemeProvider 
              attribute="class" 
              defaultTheme="dark"
              enableSystem={false} 
              storageKey='chat-theme'
              >
              {children}
            </ThemeProvider>
          </body>
          <Toaster />
        </html>
      </Provider>
    </ClerkProvider>
  )
}
