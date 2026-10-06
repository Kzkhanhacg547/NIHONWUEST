"use client";

import { SessionProvider } from "next-auth/react";
import { SoundAndThemeProvider } from "./SoundAndThemeContext";
import { UserProgressProvider } from "./UserProgressContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SoundAndThemeProvider>
        <UserProgressProvider>{children}</UserProgressProvider>
      </SoundAndThemeProvider>
    </SessionProvider>
  );
}

