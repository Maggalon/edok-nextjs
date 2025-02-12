"use client"

// import { redirect } from 'next/navigation'
// import { useAuth } from '@/hooks/useAuth'

// export default function Profile() {
  
//     const { authenticated, user } = useAuth()

//     if (!authenticated) {
//         redirect('/login')
//     } else {
//         console.log(user);
        
//         return (
//             <div>
//                 {user && <p>Привет, {user.name}</p>}
//             </div>
//         )
//     }

//     // return <p>Hello {user.email}</p>
// }

import { redirect, useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { BadgeRussianRuble, Croissant, ShoppingBag, Smile } from 'lucide-react'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import TelegramAuth from '@/components/telegram-auth'
import { useState, useEffect } from 'react'
import { Telegram } from '@twa-dev/types'

declare global {
    interface Window {
      Telegram: Telegram;
    }
  }

export default function Profile() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()
    const [userName, setUserName] = useState<string>()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const response = await fetch('/api/session')
        if (response.ok) {
            setIsAuthenticated(true)
            const session = await getSession()
            console.log(JSON.stringify(session, null, 2))
            const webApp = await waitForWebApp() as Telegram["WebApp"];
            webApp.ready();
            setUserName(webApp.initDataUnsafe.user?.first_name)
        }
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

    const authenticateUser = async () => {
        // const WebApp = (await import('@twa-dev/sdk')).default
        // Add a check to ensure we're in Telegram
        

        const webApp = await waitForWebApp() as Telegram["WebApp"];
        webApp.ready();

        console.log('Direct WebApp access:', {
            version: webApp.version,
            platform: webApp.platform,
            initData: webApp.initData,
            initDataUnsafe: webApp.initDataUnsafe,
            colorScheme: webApp.colorScheme,
            headerColor: webApp.headerColor,
        });

        setUserName(webApp.initDataUnsafe.user?.first_name)

        const initData = webApp.initData;
        
        if (!initData) {
            console.error('No init data available');
            return;
        }
        
        if (initData) {
            try {
                const response = await fetch('/api/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ initData })
                })

                if (response.ok) {
                    setIsAuthenticated(true)
                    router.refresh()
                } else {
                    console.error('Authentication failed');
                    setIsAuthenticated(false)
                }
            } catch (e) {
                console.error('Error during authentication: ', e);
                setIsAuthenticated(false)
            }
        }
    }

    if (!isAuthenticated) {
        return (
            <div className='h-screen mb-10 flex flex-col gap-4 justify-center items-center'>
                <button onClick={authenticateUser} className='bg-primary-600 mt-5 text-white rounded-full w-48 py-3 text-xl'>Авторизоваться</button>
            </div>
        )
    }
  
  return (
    <div className='flex flex-col gap-10 items-center'>
        <div className='font-bold p-3 text-2xl flex gap-3 w-screen items-center justify-start'>
            <Smile size={48} className='text-primary-600 bg-primary-200 rounded-full p-2' />
            {userName}
        </div>       
        <div className='font-semibold text-lg flex flex-col items-center gap-3'>
            <ShoppingBag size={48} className='text-primary-600' />
            Здесь будет история заказов
            <Link href="/" className='text-primary-600 font-semibold underline underline-offset-4'>Сделай первый</Link>
        </div>
        <div className='flex flex-col items-start gap-2 mx-5 p-5 border shadow-lg rounded-lg'>
            <span className='font-semibold text-primary-600'>Пригласи друга</span>
            <span>Экономь деньги и спасай планету вместе с друзьями</span>
            <button type='button' className='bg-primary-600 px-4 py-2 text-white font-semibold rounded-full'>Расскажи всем!</button>
        </div>
        <div className='flex gap-3 mx-5'>
            <div className='flex-1 flex flex-col gap-3 items-center p-5 border shadow-lg rounded-lg'>
                <div className='text-center text-primary-600 text-lg font-semibold'>Экономия отходов еды</div>
                <Croissant size={48} className='text-primary-600' />
                <div className='font-semibold'>0 КГ</div>
            </div>
            <div className='flex-1 flex flex-col gap-3 items-center p-5 border shadow-lg rounded-lg'>
                <div className='text-center text-primary-600 text-lg font-semibold'>Экономия бабла</div>
                <BadgeRussianRuble size={48} className='text-primary-600' />
                <div className='font-semibold'>0 РУБ</div>
            </div>
        </div>
    </div>
  )
}