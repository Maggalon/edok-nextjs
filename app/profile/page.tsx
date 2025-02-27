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
import { useState, useEffect, useContext } from 'react'
import { Telegram } from '@twa-dev/types'
import { TWAContext } from '@/context/twa-context'
import { HistoryCard } from '@/components/history-card'
import { CollectionItem, HistoryItem } from '@/lib/types'
import { ItemDetails } from '@/components/item-details'

export default function Profile() {
    const [isAuthenticated, setIsAuthenticated] = useState(true)
    const router = useRouter()
    const [userName, setUserName] = useState<string>()
    const [history, setHistory] = useState<HistoryItem[]>()
    const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);

    const context = useContext(TWAContext)
    const webApp = context?.webApp

    useEffect(() => {
        //checkAuth()
    }, [])

    useEffect(() => {
        getHistory()
    }, [isAuthenticated])

    const checkAuth = async () => {
        const response = await fetch('/api/session')
        if (response.ok) {
            setIsAuthenticated(true)
            const session = await getSession()
            console.log(JSON.stringify(session, null, 2))
            // const webApp = await waitForWebApp() as Telegram["WebApp"];
            // webApp.ready();
            setUserName(webApp!.initDataUnsafe.user?.first_name)
        }
    }

    const getHistory = async () => {
        if (isAuthenticated) {
            const response = await fetch(`api/history?userId=${972737130}`)
            const { data } = await response.json()
            console.log(data);
            setHistory(data)
        }
    }

    // const waitForWebApp = () => {
    //     return new Promise((resolve) => {
    //         if (window.Telegram?.WebApp) {
    //             resolve(window.Telegram.WebApp);
    //         } else {
    //             const interval = setInterval(() => {
    //                 if (window.Telegram?.WebApp) {
    //                     clearInterval(interval);
    //                     resolve(window.Telegram.WebApp);
    //                 }
    //             }, 100);
    //         }
    //     });
    // };

    const authenticateUser = async () => {
        // const WebApp = (await import('@twa-dev/sdk')).default
        // Add a check to ensure we're in Telegram
        

        // const webApp = await waitForWebApp() as Telegram["WebApp"];
        // webApp.ready();

        console.log('Direct WebApp access:', {
            version: webApp!.version,
            platform: webApp!.platform,
            initData: webApp!.initData,
            initDataUnsafe: webApp!.initDataUnsafe,
            colorScheme: webApp!.colorScheme,
            headerColor: webApp!.headerColor,
        });

        setUserName(webApp!.initDataUnsafe.user?.first_name)

        const initData = webApp!.initData;
        
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

    if (selectedItem) {
        return (
            <ItemDetails selectedItem={selectedItem} setSelectedItem={setSelectedItem} isActive={true} />
        );
    }
  
  return (
    <div className='flex flex-col gap-10 mx-5'>
        <div className='fixed left-2 bg-white font-bold p-3 text-2xl flex gap-3 w-screen shadow-sm items-center justify-start'>
            <Smile size={48} className='text-primary-600 bg-primary-200 rounded-full p-2' />
            {userName}
        </div>    
        {history ?
            <div className='font-semibold text-lg flex flex-col items-center gap-3 border-2 rounded-lg h-96 overflow-auto p-3 mt-24'>
                {history && history.map(item => {
                    return (
                        <HistoryCard key={item.id} item={item} setSelectedItem={setSelectedItem} />
                    )
                })}
            </div> :
            <>
                <ShoppingBag size={48} className='text-primary-600' />
                Здесь будет история заказов
                <Link href="/" className='text-primary-600 font-semibold underline underline-offset-4'>Сделай первый</Link>
            </>
        }   
        <div className='flex flex-col items-start gap-2 p-5 border shadow-lg rounded-lg'>
            <span className='font-semibold text-primary-600'>Пригласи друга</span>
            <span>Экономь деньги и спасай планету вместе с друзьями</span>
            <a href={`https://t.me/share/url?url=${encodeURI("https://t.me/edok_webapp_bot")}`} className='bg-primary-600 px-4 py-2 text-white font-semibold rounded-full'>Расскажи всем!</a>
        </div>
        <div className='flex gap-3 mb-24'>
            <div className='flex-1 flex flex-col gap-3 items-center p-5 border shadow-lg rounded-lg'>
                <div className='text-center text-primary-600 text-xl font-semibold w-24'>Спасено еды</div>
                <Croissant size={48} className='text-primary-600' />
                <div className='font-semibold'>{history?.map(item => item.menu.weight).reduce((acc, n) => acc + n, 0)} КГ</div>
            </div>
            <div className='flex-1 flex flex-col gap-3 items-center p-5 border shadow-lg rounded-lg'>
                <div className='text-center text-primary-600 text-xl font-semibold w-24'>Экономия денег</div>
                <BadgeRussianRuble size={48} className='text-primary-600' />
                <div className='font-semibold'>{history?.map(item => item.menu.initialprice - item.price).reduce((acc, n) => acc + n, 0)} РУБ</div>
            </div>
        </div>
    </div>
  )
}