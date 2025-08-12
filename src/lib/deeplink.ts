export type DeepLinkPayload = {
  partyId: string
  iat: number
  exp: number
  nonce: string
}

function getSecret(): Uint8Array {
  const secret = process.env.DEEPLINK_SECRET
  if (!secret) {
    throw new Error("DEEPLINK_SECRET env var is required")
  }
  return new TextEncoder().encode(secret)
}

async function getKey(): Promise<CryptoKey> {
  const key = await crypto.subtle.importKey(
    "raw",
    getSecret(),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign", "verify"]
  )
  return key
}

function base64urlEncode(input: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array
  if (typeof input === "string") {
    bytes = new TextEncoder().encode(input)
  } else if (input instanceof Uint8Array) {
    bytes = input
  } else {
    bytes = new Uint8Array(input)
  }
  let str = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i])
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64urlDecodeToUint8Array(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4))
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad
  const str = atob(b64)
  const bytes = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i)
  }
  return bytes
}

export async function signPayload(payload: DeepLinkPayload): Promise<string> {
  const key = await getKey()
  const header = { alg: "HS256", typ: "JWT" }
  const headerB64 = base64urlEncode(JSON.stringify(header))
  const payloadB64 = base64urlEncode(JSON.stringify(payload))
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  const sig = await crypto.subtle.sign("HMAC", key, data)
  const sigB64 = base64urlEncode(sig)
  return `${headerB64}.${payloadB64}.${sigB64}`
}

export async function verifyToken(token: string): Promise<DeepLinkPayload | null> {
  try {
    const [headerB64, payloadB64, sigB64] = token.split(".")
    if (!headerB64 || !payloadB64 || !sigB64) return null

    const key = await getKey()
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`)
    const sig = base64urlDecodeToUint8Array(sigB64)
    const ok = await crypto.subtle.verify("HMAC", key, sig, data)
    if (!ok) return null

    const payloadJson = new TextDecoder().decode(base64urlDecodeToUint8Array(payloadB64))
    const payload: DeepLinkPayload = JSON.parse(payloadJson)

    if (typeof payload.partyId !== "string") return null
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null
    if (typeof payload.iat !== "number") return null
    if (typeof payload.nonce !== "string") return null

    return payload
  } catch (_e) {
    return null
  }
}

export function buildDeepLinkUrl(origin: string, partyId: string, token: string): string {
  const url = new URL(`${origin}/visitor/party/${partyId}`)
  url.searchParams.set("t", token)
  return url.toString()
} 