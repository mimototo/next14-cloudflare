'use client'

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignInUrl="/" afterSignUpUrl="/onboarding">
      <html lang="ja">
        <Header />
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
