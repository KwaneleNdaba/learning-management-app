import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google"
import Providers from "./providers";
import { ClerkProvider } from "@clerk/nextjs";


const dm_Sans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans"
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <ClerkProvider>
     <html lang="en">
      <body
        className={`${dm_Sans.className}`}
      >
        <Providers>
        <div className="root-layout">
        {children}
        </div>
        </Providers>
      </body>
    </html>
   </ClerkProvider>
  );
}
