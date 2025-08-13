"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SharePartyDialog({ partyId }: { partyId: string }) {
  const [open, setOpen] = useState(false)
  const [qr, setQr] = useState<string>("")
  const [link, setLink] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLink = async () => {
      if (!open) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/deeplink/generate?partyId=${partyId}`)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data?.error || "Failed to generate QR")
          setLoading(false)
          return
        }
        const data = await res.json()
        setQr(data.qr)
        setLink(data.deepLink)
      } catch (e) {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }
    fetchLink()
  }, [open, partyId])

  const handleCopy = async () => {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} size="sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 mr-1"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98" />
            <path d="M15.41 6.51L8.59 10.49" />
          </svg>
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Share your party</DialogTitle>
          <DialogDescription>
            Guests can scan the QR to join and vote.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="text-sm">Generating link…</div>
        ) : error ? (
          <div className="text-sm text-red-400">{error}</div>
        ) : (
          <div className="space-y-4">
            {qr && (
              <img
                src={qr}
                alt="Party QR"
                className="w-64 h-64 bg-white p-2 rounded mx-auto"
              />
            )}
            {link && (
              <div className="space-y-2">
                <p className="text-xs break-all bg-black/30 p-2 rounded">{link}</p>
                <Button variant={"secondary"} size="sm" onClick={handleCopy}>
                  Copy link
                </Button>
              </div>
            )}
          </div>
        )}
        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
} 