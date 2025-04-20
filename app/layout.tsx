import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NSW Suburb Livability Explorer",
  description: "Discover the most livable suburbs in New South Wales based on your preferences"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="bottom-center" />
        <ThemeProvider attribute="class" defaultTheme="light">
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-gray-200 bg-white py-6">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>© {new Date().getFullYear()} NSW Suburb Livability Explorer</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'