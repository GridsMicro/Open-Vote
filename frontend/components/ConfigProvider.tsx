"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface AppConfig {
    AGGREGATOR_URL: string;
}

const ConfigContext = createContext<AppConfig | undefined>(undefined);

export const ConfigProvider = ({ children, config }: { children: ReactNode; config: AppConfig }) => {
    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useAppConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error("useAppConfig must be used within a ConfigProvider");
    }
    return context;
};
