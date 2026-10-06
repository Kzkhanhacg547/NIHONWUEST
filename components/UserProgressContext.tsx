"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import type { CanonicalUserProgress } from "@/lib/progress-service";

export type { CanonicalUserProgress };

export const NQ_PROGRESS_EVENT = "nq:progress-updated";

/**
 * Dispatches an event across the window so all components and tabs can re-sync.
 */
export function notifyProgressUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NQ_PROGRESS_EVENT));
  }
}

interface UserProgressContextType {
  progress: CanonicalUserProgress | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<CanonicalUserProgress | null>;
  mutate: (data: Partial<CanonicalUserProgress>) => void;
}

const UserProgressContext = createContext<UserProgressContextType | null>(null);

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [progress, setProgress] = useState<CanonicalUserProgress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const fetchingRef = useRef(false);

  const fetchProgress = useCallback(async (): Promise<CanonicalUserProgress | null> => {
    if (status !== "authenticated" && status !== "loading") {
      setProgress(null);
      return null;
    }
    if (fetchingRef.current) return progress;
    fetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as CanonicalUserProgress;
        setProgress(data);
        return data;
      } else if (res.status === 401) {
        setProgress(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
    return null;
  }, [status, progress]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProgress();
    } else if (status === "unauthenticated") {
      setProgress(null);
    }
  }, [status, fetchProgress]);

  // Listen to global progress updates (after lessons, reviews, achievements, profile edits)
  useEffect(() => {
    const handleEvent = () => {
      fetchProgress();
    };

    window.addEventListener(NQ_PROGRESS_EVENT, handleEvent);
    // Also re-fetch on window focus to catch updates from other tabs
    window.addEventListener("focus", handleEvent);

    return () => {
      window.removeEventListener(NQ_PROGRESS_EVENT, handleEvent);
      window.removeEventListener("focus", handleEvent);
    };
  }, [fetchProgress]);

  const mutate = useCallback((data: Partial<CanonicalUserProgress>) => {
    setProgress((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <UserProgressContext.Provider
      value={{
        progress,
        isLoading,
        error,
        refresh: fetchProgress,
        mutate,
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
}

export function useUserProgress(): UserProgressContextType {
  const ctx = useContext(UserProgressContext);
  if (!ctx) {
    // Return safe fallback if rendered outside provider
    return {
      progress: null,
      isLoading: false,
      error: null,
      refresh: async () => null,
      mutate: () => {},
    };
  }
  return ctx;
}

