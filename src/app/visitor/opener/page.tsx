"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function VisitorOpenerPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("Preparing...")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const partyId = params.get("partyId")
    const token = params.get("t")

    if (!partyId || !token) {
      setError("Invalid link: missing parameters.")
      return
    }

    const open = async () => {
      setStatus("Checking link and joining party...")
      try {
        const res = await fetch("/api/deeplink/open", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ partyId, token }),
        })
        if (res.ok) {
          router.replace(`/visitor/party/${partyId}`)
        } else {
          const data = await res.json().catch(() => ({}))
          const msg = data?.error || "Failed to open link"
          setError(msg)
        }
      } catch (e) {
        setError("Network error while opening link")
      }
    }

    open()
  }, [router])

  const handleRetry = () => {
    setError(null)
    if (typeof window !== "undefined") window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="max-w-md w-full p-6 bg-black/30 rounded-lg">
        {!error ? (
          <>
            <h1 className="text-xl font-semibold mb-2">Joining party…</h1>
            <p className="text-sm opacity-80">{status}</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-2">Can’t open link</h1>
            <p className="text-sm opacity-80 mb-4">{error}</p>
            <button onClick={handleRetry} className="px-4 py-2 bg-white text-black rounded">
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  )
} 