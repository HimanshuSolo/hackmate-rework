import { type Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme-provider'
import { dark } from '@clerk/themes';
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/next';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Hackmate",
  description: "Find the perfect co-founder for your next startup idea.",
  twitter: {
    card: "summary_large_image",
    creator: "@dfordp11",
    title: "Hackmate",
    description: "Find the perfect co-founder for your next startup idea.",
    images: [
      {
        url: "https://hackmate.app/twitter-image.jpg",  // Image URL
        alt: "Hackmate Twitter Card Image"                // (Optional) Alt text
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}
      
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > 
            <Toaster 
              richColors 
              theme='dark' //tweak for light/dark mode
            />

            <div className='mt-11 md:mt-2'>
              {children}
              <Analytics/>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
