import type { Metadata } from 'next'
import { Darker_Grotesque } from 'next/font/google'
import './globals.css'

const darkerGrotesque = Darker_Grotesque({
  variable: '--font-darker-grotesque',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Claim Portal RWA',
  description: 'Landing page for the RWA claims portal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' type='image/x-icon' />
      </head>
      <body className={`${darkerGrotesque.variable} antialiased bg-[#EFEFEF]`}>
        {children}
      </body>
    </html>
  )
}
