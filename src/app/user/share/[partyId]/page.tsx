"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function SharePartyPage() {
  const { partyId } = useParams() as { partyId: string }
  const [qr, setQr] = useState<string>("")
  const [link, setLink] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await fetch(`/api/deeplink/generate?partyId=${partyId}`)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data?.error || "Failed to generate QR")
          return
        }
        const data = await res.json()
        setQr(data.qr)
        setLink(data.deepLink)
      } catch (e) {
        setError("Network error")
      }
    }
    if (partyId) fetchLink()
  }, [partyId])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      alert("Link copied")
    } catch {}
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Share your party</h1>
      {error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="space-y-4">
          {qr && <img src={qr} alt="Party QR" className="w-64 h-64 bg-white p-2 rounded" />}
          {link && (
            <div className="space-y-2">
              <p className="text-sm break-all">{link}</p>
              <button onClick={handleCopy} className="px-3 py-2 bg-white text-black rounded">Copy link</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 