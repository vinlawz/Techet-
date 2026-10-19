"use client";

import { useEffect, useRef, useState } from "react";

type Result = { kind: "success" | "error"; message: string; detail?: string };

// Minimal shape of the browser's native BarcodeDetector API (not yet in lib.dom.d.ts everywhere).
type BarcodeDetectorLike = {
  detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]>;
};
type BarcodeDetectorCtor = new (options: { formats: string[] }) => BarcodeDetectorLike;

export function CheckinScanner() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [cameraSupported, setCameraSupported] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setCameraSupported(
      typeof window !== "undefined" &&
        "BarcodeDetector" in window &&
        !!navigator.mediaDevices?.getUserMedia,
    );
  }, []);

  useEffect(() => {
    if (!cameraOn) return;

    let cancelled = false;
    let raf = 0;

    async function start() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const Detector = (window as unknown as { BarcodeDetector: BarcodeDetectorCtor }).BarcodeDetector;
      const detector = new Detector({ formats: ["qr_code"] });

      const scan = async () => {
        if (cancelled || !videoRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes[0]?.rawValue) {
            setCode(codes[0].rawValue);
            setCameraOn(false);
            return;
          }
        } catch {
          // transient decode errors are expected between frames
        }
        raf = requestAnimationFrame(scan);
      };
      raf = requestAnimationFrame(scan);
    }

    void start().catch(() => setResult({ kind: "error", message: "Couldn't access the camera." }));

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [cameraOn]);

  async function checkIn(e?: React.FormEvent) {
    e?.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/tickets/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ kind: "error", message: data.error ?? "Check-in failed." });
      } else {
        setResult({
          kind: "success",
          message: `Checked in: ${data.ticketTypeName}`,
          detail: data.buyer,
        });
      }
    } catch {
      setResult({ kind: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
      setCode("");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {cameraSupported && (
        <div>
          {!cameraOn ? (
            <button
              type="button"
              onClick={() => setCameraOn(true)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium"
            >
              Scan with camera
            </button>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <video ref={videoRef} className="aspect-video w-full bg-black" muted playsInline />
              <button
                type="button"
                onClick={() => setCameraOn(false)}
                className="w-full border-t border-border py-2 text-xs"
              >
                Stop camera
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={checkIn} className="flex gap-2">
        <input
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste or scan ticket code"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-background disabled:opacity-60"
        >
          {loading ? "Checking…" : "Check in"}
        </button>
      </form>

      {result && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            result.kind === "success"
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-red-400/40 bg-red-400/10 text-red-400"
          }`}
        >
          <div className="font-medium">{result.message}</div>
          {result.detail && <div className="mt-1 text-xs opacity-80">Buyer: {result.detail}</div>}
        </div>
      )}
    </div>
  );
}
