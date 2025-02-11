'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export default function TelegramAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const response = await fetch('/api/session')
        if (response.ok) {
            setIsAuthenticated(true)
        }
    }

    const authenticateUser = async () => {
        const WebApp = (await import('@twa-dev/sdk')).default
        WebApp.ready()
        const initData = WebApp.initData
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

    return (
        <div className='h-screen mb-10 flex flex-col gap-4 justify-center items-center'>
            <button onClick={authenticateUser} className='bg-primary-600 mt-5 text-white rounded-full w-48 py-3 text-xl'>Авторизоваться</button>
        </div>
    )
}