'use client';

import { SessionProvider } from 'next-auth/react';
import { ConfigProvider } from "./ConfigProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    const config = {
        AGGREGATOR_URL: process.env.NEXT_PUBLIC_AGGREGATOR_URL || "http://localhost:3001"
    };

    return (
        <SessionProvider>
            <ConfigProvider config={config}>
                {children}
            </ConfigProvider>
        </SessionProvider>
    );
}
