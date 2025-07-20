import { useEffect, useState } from 'react'

export function useInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e)
        }

        window.addEventListener('beforeinstallprompt', handler)

        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
        }
    }, [])

    const promptInstall = async () => {
        if (!deferredPrompt) return
        const promptEvent = deferredPrompt as any
        await promptEvent.prompt()
        const choiceResult = await promptEvent.userChoice
        console.log('User response to install prompt:', choiceResult)
        setDeferredPrompt(null)
    }

    return { deferredPrompt, promptInstall }
}
