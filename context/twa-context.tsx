"use client"

import { Telegram } from '@twa-dev/types';
import { createContext, useEffect, useState } from 'react';

declare global {
    interface Window {
      Telegram: Telegram;
    }
}

export const TWAContext = createContext<{ webApp: Telegram["WebApp"] | undefined } | undefined>(undefined)

export const TWAProvider = ({ children }: Readonly<{children: React.ReactNode}>) => {

    const [webApp, setWebApp] = useState<Telegram["WebApp"]>()

    const getWebApp = async () => {
        const webApp = await waitForWebApp() as Telegram["WebApp"]
        webApp.ready()
        setWebApp(webApp)
    }

    const waitForWebApp = () => {
        return new Promise((resolve) => {
            if (window.Telegram?.WebApp) {
                resolve(window.Telegram.WebApp);
            } else {
                const interval = setInterval(() => {
                    if (window.Telegram?.WebApp) {
                        clearInterval(interval);
                        resolve(window.Telegram.WebApp);
                    }
                }, 100);
            }
        });
    };

    useEffect(() => {
        getWebApp()
    }, [])

    return (
        <TWAContext.Provider value={{ webApp }}>
            {children}
        </TWAContext.Provider>
    )
}