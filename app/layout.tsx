import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { clerkTheme } from "@/lib/clerk-theme";

import { Inter, Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Import header components
import { Connector } from "@/components/shared/layout/curvy-rect";
import { HeaderProvider } from "@/components/shared/header/HeaderContext";
import HeaderBrandKit from "@/components/shared/header/BrandKit/BrandKit";
import HeaderWrapper from "@/components/shared/header/Wrapper/Wrapper";
import HeaderDropdownWrapper from "@/components/shared/header/Dropdown/Wrapper/Wrapper";
import ButtonUI from "@/components/ui/shadcn/button";
import ByteAIIcon from "@/components/ByteAIIcon";
import UserSync from "@/components/UserSync";



// === FONT CONFIGURATION ===
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

// === METADATA ===
export const metadata: Metadata = {
  title: "Byte AI - Your Full-Time AI Developer",
  description:
    "Transform ideas into code with intelligent automation. Built by Zehanx Technologies.",
};

// === ROOT LAYOUT ===
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      appearance={clerkTheme}
      signInFallbackRedirectUrl="/generation"
      signUpFallbackRedirectUrl="/generation"
    >
      <html lang="en">
        <body
          className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} ${robotoMono.variable} font-sans antialiased`}
        >
          <HeaderProvider>
            {/* === HEADER DROPDOWN === */}
            <HeaderDropdownWrapper />

            {/* === MAIN HEADER === */}
            <header className="fixed top-0 left-0 w-full z-[101] bg-black border-b border-gray-700">
              <div className="absolute top-0 cmw-container border-x border-border-faint h-full pointer-events-none" />
              <div className="h-1 bg-border-faint w-full left-0 -bottom-1 absolute" />
              <div className="cmw-container absolute h-full pointer-events-none top-0">
                <Connector className="absolute -left-[10.5px] -bottom-11" />
                <Connector className="absolute -right-[10.5px] -bottom-11" />
              </div>

              <HeaderWrapper>
                <div className="max-w-[900px] mx-auto w-full flex justify-between items-center">
                  {/* Left side - Brand */}
                  <div className="flex gap-24 items-center">
                    <HeaderBrandKit />
                  </div>

                  {/* Right side - Auth & Links */}
                  <div className="flex gap-8 items-center">
                    <a
                      className="contents"
                      href="https://zehanxtech.com"
                      target="_blank"
                    >
                      <ButtonUI variant="tertiary">
                        <ByteAIIcon className="w-4 h-4" />
                        Zehanx Technologies
                      </ButtonUI>
                    </a>

                    {/* Auth Buttons */}
                    <SignedOut>
                      <div className="flex items-center gap-3 ml-4">
                        <SignInButton>
                          <button 
                            className="relative inline-flex items-center justify-center bg-transparent text-white border border-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-5 cursor-pointer hover:opacity-90 transition-opacity duration-200 outline-none"
                            style={{ 
                              textShadow: 'none',
                              boxShadow: 'none',
                              WebkitFontSmoothing: 'antialiased',
                              MozOsxFontSmoothing: 'grayscale'
                            }}
                          >
                            Sign In
                          </button>
                        </SignInButton>

                        <SignUpButton>
                          <button 
                            className="relative inline-flex items-center justify-center bg-transparent text-white border border-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-5 cursor-pointer hover:opacity-75 transition-opacity duration-200 outline-none"
                            style={{ 
                              textShadow: 'none',
                              boxShadow: 'none',
                              WebkitFontSmoothing: 'antialiased',
                              MozOsxFontSmoothing: 'grayscale'
                            }}
                          >
                            Sign Up
                          </button>
                        </SignUpButton>
                      </div>
                    </SignedOut>

                    <SignedIn>
                      <div className="ml-4">
                        <UserButton />
                      </div>
                    </SignedIn>
                  </div>
                </div>
              </HeaderWrapper>
            </header>
          </HeaderProvider>

          {/* === USER SYNC === */}
          <UserSync />

          {/* === MAIN CONTENT === */}
          <main className="pt-20">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
