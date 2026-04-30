import type { Metadata } from 'next';
import { Montserrat, DM_Sans } from 'next/font/google';
import './globals.css';
// import Navbar from '@/components/Navbar';
import QueryProvider from '@/providers/queryProvider';
// import Footer from '@/components/Footer';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css';
import { Toaster } from 'react-hot-toast';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin']
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Sanjeeva Kumar - Software Engineer',
  description: 'Full Stack Web Developer specializing in React, Node.js, and cloud technologies. Passionate about building scalable and performant web applications.',
  authors: [{ name: 'sanjeeva' }],
  creator: 'sanjeeva',
  openGraph: {
    title: 'Sanjeeva Kumar - Software Engineer',
    description: 'Full Stack Web Developer specializing in React, Node.js, and cloud technologies. Passionate about building scalable and performant web applications.',
    url: 'https://sanjeevakumar.com',
    siteName: 'Sanjeeva Kumar Portfolio',
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} ${dmSans.variable} scrollbar antialiased`}
      >
        <Toaster
          toastOptions={{ duration: 4000 }}
          position="top-right"
          reverseOrder={false}
        />
        <QueryProvider>
          {/* <Navbar /> */}
          <div>{children}</div>
          {/* <Footer /> */}
        </QueryProvider>
      </body>
    </html>
  );
}
