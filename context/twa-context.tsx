"use client"

import { Telegram } from '@twa-dev/types';
import { createContext, useEffect, useState } from 'react';

declare global {
    interface Window {
      Telegram: Telegram;
    }
}

interface TWAContextProps {
    webApp: Telegram["WebApp"] | undefined;
    geolocation: { lat: number, lng: number} | null | undefined;
}

export const TWAContext = createContext<TWAContextProps | undefined>(undefined)

export const TWAProvider = ({ children }: Readonly<{children: React.ReactNode}>) => {

    const [webApp, setWebApp] = useState<Telegram["WebApp"]>()
    const [geolocation, setGeolocation] = useState<{ lat: number, lng: number} | null>()

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

    const getGeolocation = () => {
        function success(pos: { coords: any; }) {
          const crd = pos.coords;
          
          setGeolocation({ lat: crd.latitude, lng: crd.longitude })
        }
    
        navigator.geolocation.getCurrentPosition(success);
    }

    useEffect(() => {
        getWebApp()
        getGeolocation()
    }, [])

    return (
        <TWAContext.Provider value={{ webApp, geolocation }}>
            {children}
        </TWAContext.Provider>
    )
}