"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default function SharePartyDialog({
  partyId,
  partyName,
}: {
  partyId: string;
  partyName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [qr, setQr] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLink = async () => {
      if (!open) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/deeplink/generate?partyId=${partyId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data?.error || "Failed to generate QR");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setQr(data.qr);
        setLink(data.deepLink);
      } catch (e) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
  }, [open, partyId]);

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
    } catch {}
  };

  const handleDownloadPdf = async () => {
    if (!link) return;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const title = partyName || "Party";
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 20);

    const margin = 15;
    const topAfterTitle = 30;
    const footerReserve = 14; // space for footer note
    const maxQrWidth = pageWidth - margin * 2;
    const maxQrHeight = pageHeight - topAfterTitle - margin - footerReserve;
    const qrSize = Math.min(maxQrWidth, maxQrHeight);
    const x = (pageWidth - qrSize) / 2;
    const y = topAfterTitle + (maxQrHeight - qrSize) / 2;

    // Generate high-resolution QR for crisp print
    const hiResQrDataUrl = await QRCode.toDataURL(link, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 2048,
    });
    doc.addImage(
      hiResQrDataUrl,
      "PNG",
      x,
      y,
      qrSize,
      qrSize,
      undefined,
      "FAST"
    );

    // Footer note
    const footerNote = "Scan and Start Voting for the Next Song";
    doc.setFontSize(24);
    doc.setFont("helvetica", "normal");
    const footerWidth = doc.getTextWidth(footerNote);
    doc.text(footerNote, (pageWidth - footerWidth) / 2, pageHeight - margin);
    doc.save(`${title.replace(/\s+/g, "-").toLowerCase()}-qr.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
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
                <p className="text-xs break-all bg-black/30 p-2 rounded">
                  {link}
                </p>
                <div className="flex gap-2">
                  <Button variant={"secondary"} size="sm" onClick={handleCopy}>
                    Copy link
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleDownloadPdf}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
