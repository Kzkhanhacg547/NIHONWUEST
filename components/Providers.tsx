"use client";

import { SessionProvider } from "next-auth/react";
import { SoundAndThemeProvider } from "./SoundAndThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SoundAndThemeProvider>{children}</SoundAndThemeProvider>
    </SessionProvider>
  );
}
