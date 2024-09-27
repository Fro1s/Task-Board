"use client";

import "@/styles/globals.css";
import Header from "@/components/header";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SessionProvider>
          <Header />
          <main className="">
            <Toaster />
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
