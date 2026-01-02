// src/context/AdminLoadingContext.tsx
import React, { createContext, useContext, useMemo, useRef, useState } from "react";

type AdminLoadingState = {
    isLoading: boolean;
    message?: string;
    startLoading: (message?: string) => void;
    stopLoading: () => void;
};

const AdminLoadingContext = createContext<AdminLoadingState | null>(null);

export function AdminLoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | undefined>(undefined);

    // prevents “stopLoading()” from hiding loader while another request is still running
    const pendingRef = useRef(0);

    // prevents “instant flash” when requests are too fast
    const shownAtRef = useRef<number | null>(null);
    const MIN_MS = 350;

    const value = useMemo(
        () => ({
            isLoading,
            message,
            startLoading: (msg?: string) => {
                pendingRef.current += 1;
                if (!isLoading) shownAtRef.current = Date.now();
                setMessage(msg);
                setIsLoading(true);
            },
            stopLoading: () => {
                pendingRef.current = Math.max(0, pendingRef.current - 1);
                if (pendingRef.current > 0) return;

                const shownAt = shownAtRef.current;
                const elapsed = shownAt ? Date.now() - shownAt : MIN_MS;

                const close = () => {
                    shownAtRef.current = null;
                    setIsLoading(false);
                    setMessage(undefined);
                };

                if (elapsed >= MIN_MS) close();
                else setTimeout(close, MIN_MS - elapsed);
            },
        }),
        [isLoading, message]
    );

    return <AdminLoadingContext.Provider value={value}>{children}</AdminLoadingContext.Provider>;
}

export function useAdminLoading() {
    const ctx = useContext(AdminLoadingContext);
    if (!ctx) throw new Error("useAdminLoading must be used within AdminLoadingProvider");
    return ctx;
}
