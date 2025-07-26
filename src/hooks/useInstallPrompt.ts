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
        const promptEvent = deferredPrompt as any
        if (!promptEvent) return
        await promptEvent.prompt()
        setDeferredPrompt(null)
    }

    return { deferredPrompt, promptInstall }
}
