import './globals.css'

export const metadata = {
  title: 'Options Trading App',
  description: 'A basic options trading app simulation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
